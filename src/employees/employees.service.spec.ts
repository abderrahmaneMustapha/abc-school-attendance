import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';

import { Employee } from './employees.entity';
import { Attendance } from './employees.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CheckInOutDto } from './dto/check-in-out.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

const employeeArray: Employee[] = [
  {
    id: 'uuid1',
    lastName: 'Doe',
    firstName: 'John',
    dateCreated: new Date('2023-01-01T00:00:00Z'),
    department: 'Engineering',
  },
  {
    id: 'uuid2',
    lastName: 'Smith',
    firstName: 'Jane',
    dateCreated: new Date('2023-01-02T00:00:00Z'),
    department: 'Marketing',
  },
];

const employee: Employee = {
  id: 'uuid3',
  lastName: 'Roe',
  firstName: 'Richard',
  dateCreated: new Date('2023-01-03T00:00:00Z'),
  department: 'Human Resources',
};

const attendance: Attendance = {
  id: 'attendance-uuid1',
  employee: employee,
  checkIn: new Date('2023-01-04T08:00:00Z'),
  checkOut: null,
  comment: 'On time',
  duration: null,
};

const createEmployeeDto: CreateEmployeeDto = {
  lastName: 'New',
  firstName: 'Employee',
  department: 'Sales',
};

const checkInOutDto: CheckInOutDto = {
  employeeId: 'uuid3',
  comment: 'Checking in for the day',
};

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeeRepository: Repository<Employee>;
  let attendanceRepository: Repository<Attendance>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: {
            create: jest.fn().mockReturnValue(employee),
            save: jest.fn().mockResolvedValue(employee),
            find: jest.fn().mockResolvedValue(employeeArray),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Attendance),
          useValue: {
            create: jest.fn().mockReturnValue(attendance),
            save: jest.fn().mockResolvedValue(attendance),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    employeeRepository = module.get<Repository<Employee>>(
      getRepositoryToken(Employee),
    );
    attendanceRepository = module.get<Repository<Attendance>>(
      getRepositoryToken(Attendance),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an employee', async () => {
      expect(await service.create(createEmployeeDto)).toEqual(employee);
      expect(employeeRepository.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(employeeRepository.save).toHaveBeenCalledWith(employee);
    });

    it('should throw an error if save fails', () => {
      jest
        .spyOn(employeeRepository, 'save')
        .mockRejectedValue(new Error('Failed to save'));
      expect(service.create(createEmployeeDto)).rejects.toThrowError(
        'Failed to save',
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of employees', async () => {
      expect(await service.findAll()).toEqual(employeeArray);
      expect(employeeRepository.find).toHaveBeenCalled();
    });

    it('should return a list of employees created on a specific date', async () => {
      const specificDate = new Date('2023-01-01T00:00:00Z');
      const startDate = new Date(specificDate.setHours(0, 0, 0, 0));
      const endDate = new Date(specificDate);
      endDate.setHours(23, 59, 59, 999);

      const employeeRepositoryFindSpy = jest
        .spyOn(service['employeeRepository'], 'find')
        .mockResolvedValue(
          employeeArray.filter(
            (e) => e.dateCreated >= startDate && e.dateCreated <= endDate,
          ),
        );

      const employees = await service.findAll(specificDate);

      expect(employeeRepositoryFindSpy).toHaveBeenCalledWith({
        where: {
          dateCreated: Between(startDate, endDate),
        },
      });

      expect(employees).toEqual(
        employeeArray.filter(
          (e) => e.dateCreated >= startDate && e.dateCreated <= endDate,
        ),
      );
    });

    it('should throw an error if find throws an exception', () => {
      jest
        .spyOn(employeeRepository, 'find')
        .mockRejectedValueOnce(new Error('Find method failed'));
      expect(service.findAll()).rejects.toThrowError('Find method failed');
    });
  });

  describe('checkIn', () => {
    it('should successfully check in an employee', async () => {
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employee);
      expect(await service.checkIn(checkInOutDto)).toEqual(attendance);
    });

    it('should throw NotFoundException if employee is not found', async () => {
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      expect(service.checkIn(checkInOutDto)).rejects.toThrowError(
        'Employee not found',
      );
    });
  });

  describe('checkOut', () => {
    it('should successfully check out an employee', async () => {
      const checkInOutDto: CheckInOutDto = {
        employeeId: 'some-employee-id',
        comment: 'Checked out at the end of the day',
      };

      const mockAttendance: Partial<Attendance> = {
        ...attendance,
        checkIn: new Date('2023-01-01T08:00:00Z'),
        checkOut: null,
        duration: null,
      };

      jest
        .spyOn(attendanceRepository, 'findOne')
        .mockResolvedValueOnce(mockAttendance as Attendance);
      jest
        .spyOn(attendanceRepository, 'save')
        .mockImplementation(async (attendance) => attendance as Attendance);

      const checkedOutAttendance = await service.checkOut(checkInOutDto);

      expect(checkedOutAttendance.checkOut).toBeDefined();
      expect(checkedOutAttendance.duration).toBeDefined();

      expect(checkedOutAttendance.duration).toBeGreaterThan(0);
    });
    it('should throw NotFoundException if there is no check-in record', async () => {
      jest
        .spyOn(attendanceRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      expect(service.checkOut(checkInOutDto)).rejects.toThrowError(
        'No check-in record found or already checked out',
      );
    });

    it('should throw NotFoundException if the employee has already checked out', async () => {
      jest
        .spyOn(attendanceRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      expect(service.checkOut(checkInOutDto)).rejects.toThrowError(
        'No check-in record found or already checked out',
      );
    });
  });
});
