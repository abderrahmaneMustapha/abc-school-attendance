import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateEmployeeDto } from './../src/employees/dto/create-employee.dto';
import { CheckInOutDto } from './../src/employees/dto/check-in-out.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('EmployeesController (e2e)', () => {
  let app: INestApplication;
  let employeeId: string | undefined = undefined;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/employees (POST)', async () => {
    const createEmployeeDto: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      department: 'Development',
    };

    return request(app.getHttpServer())
      .post('/employees')
      .send(createEmployeeDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            ...createEmployeeDto,
            id: expect.any(String),
            dateCreated: expect.any(String),
          }),
        );
      });
  });

  it('/employees (GET)', () => {
    return request(app.getHttpServer())
      .get('/employees')
      .expect(200)
      .expect((res) => {
        employeeId = res.body[0].id;
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  it('/check-in (POST)', async () => {
    const comment = 'Checked in early.';
    const checkInOutDto: CheckInOutDto = {
      employeeId: employeeId,
      comment,
    };

    return request(app.getHttpServer())
      .post('/check-in')
      .send(checkInOutDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            employee: expect.objectContaining({
              dateCreated: expect.any(String),
              id: employeeId,
            }),
            checkIn: expect.any(String),
            duration: null,
            id: expect.any(String),
            comment,
          }),
        );
      });
  });

  it('/check-out (PUT)', async () => {
    const comment = 'Checked out on time.';
    const checkInOutDto: CheckInOutDto = {
      employeeId: employeeId,
      comment,
    };

    return request(app.getHttpServer())
      .put('/check-out')
      .send(checkInOutDto)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            checkIn: expect.any(String),
            duration: expect.any(Number),
            id: expect.any(String),
            comment,
          }),
        );
      });
  });
});
