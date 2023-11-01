import { Injectable, NotFoundException } from '@nestjs/common';
import { Attendance, Employee } from './employess.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CheckInOutDto } from './dto/check-in-out.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll(dateCreated?: Date): Promise<Employee[]> {
    if (dateCreated) {
      const date = new Date(dateCreated);
      const startDate = new Date(date.setHours(0, 0, 0, 0));
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      return await this.employeeRepository.find({
        where: {
          dateCreated: Between(startDate, endDate),
        },
      });
    }
    return await this.employeeRepository.find();
  }

  async checkIn(checkInOutDto: CheckInOutDto): Promise<Attendance> {
    const employee = await this.employeeRepository.findOne({
      where: { id: checkInOutDto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const attendance = this.attendanceRepository.create({
      employee: employee,
      checkIn: new Date(),
      comment: checkInOutDto.comment,
    });

    await this.attendanceRepository.save(attendance);

    return attendance;
  }

  async checkOut(checkInOutDto: CheckInOutDto): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        employee: { id: checkInOutDto.employeeId },
        checkOut: null,
      },
      order: {
        checkIn: 'DESC',
      },
    });

    if (!attendance) {
      throw new NotFoundException(
        'No check-in record found or already checked out',
      );
    }

    attendance.checkOut = new Date();
    attendance.comment = checkInOutDto.comment;
    const duration =
      attendance.checkOut.getTime() - attendance.checkIn.getTime();
    attendance.duration = duration;

    await this.attendanceRepository.save(attendance);

    return attendance;
  }
}
