import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';
import { CheckInOutDto } from './dto/check-in-out.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Attendance, Employee } from './employess.entity';

@Controller('')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({
    type: Employee,
    status: 201,
    description: 'The employee has been successfully created.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        lastName: 'Doe',
        firstName: 'John',
        dateCreated: '2023-11-01T12:00:00Z',
        department: 'Development',
      },
    },
  })
  @ApiBody({ type: CreateEmployeeDto })
  @Post('/employees')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    type: [Employee],
    status: 200,
    description: 'List of employees retrieved successfully.',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          lastName: 'Doe',
          firstName: 'John',
          dateCreated: '2023-11-01T12:00:00Z',
          department: 'Development',
        },
      ],
    },
  })
  @ApiQuery({
    name: 'dateCreated',
    required: false,
    type: Date,
    description:
      'Optional date to filter the employees created on a specific date',
  })
  @Get('/employees')
  findAll(@Query('dateCreated') dateCreated?: Date) {
    return this.employeesService.findAll(dateCreated);
  }

  @ApiOperation({ summary: 'Check-in an employee' })
  @ApiResponse({
    type: Attendance,
    status: 200,
    description: 'Employee check-in recorded successfully.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        employee: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          lastName: 'Doe',
          firstName: 'John',
          dateCreated: '2023-11-01T12:00:00Z',
          department: 'Development',
        },
        checkIn: '2023-11-01T08:00:00Z',
        checkOut: null,
        comment: 'Checked in early.',
        duration: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Employee not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBody({ type: CheckInOutDto })
  @Post('/check-in')
  async checkIn(@Body() checkInOutDto: CheckInOutDto) {
    return await this.employeesService.checkIn(checkInOutDto);
  }

  @ApiOperation({ summary: 'Check-out an employee' })
  @ApiResponse({
    type: Attendance,
    status: 200,
    description: 'Employee check-out recorded successfully.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        checkIn: '2023-11-01T08:00:00Z',
        checkOut: '2023-11-01T17:00:00Z',
        comment: 'Checked out on time.',
        duration: 32400000,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No check-in record found or already checked out',
    schema: {
      example: {
        statusCode: 404,
        message: 'No check-in record found or already checked out',
        error: 'Not Found',
      },
    },
  })
  @ApiBody({ type: CheckInOutDto })
  @Put('/check-out')
  async checkOut(@Body() checkInOutDto: CheckInOutDto) {
    return await this.employeesService.checkOut(checkInOutDto);
  }
}
