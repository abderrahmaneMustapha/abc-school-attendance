import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';
import { CheckInOutDto } from './dto/check-in-out.dto';

@Controller('')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('/employees')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    console.log(createEmployeeDto);
    return this.employeesService.create(createEmployeeDto);
  }

  @Get('/employees')
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
