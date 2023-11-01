import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance, Employee } from './employees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Attendance])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
