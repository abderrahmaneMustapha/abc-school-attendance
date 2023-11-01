import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';
import { CheckInOutDto } from './dto/check-in-out.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(@Query('dateCreated') dateCreated?: Date) {
    return this.employeesService.findAll(dateCreated);
  }

  @Post('/check-in')
  async checkIn(@Body() checkInOutDto: CheckInOutDto) {
    return await this.employeesService.checkIn(checkInOutDto);
  }

  @Put('/check-out')
  async checkOut(@Body() checkInOutDto: CheckInOutDto) {
    return await this.employeesService.checkOut(checkInOutDto);
  }
}
