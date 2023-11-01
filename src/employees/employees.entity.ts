import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the employee',
    type: String,
  })
  id: string;

  @Column()
  @ApiProperty({ description: 'The last name of the employee' })
  lastName: string;

  @Column()
  @ApiProperty({ description: 'The first name of the employee' })
  firstName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    description: 'The date and time when the employee record was created',
    type: String,
    format: 'date-time',
  })
  dateCreated: Date;

  @Column()
  @ApiProperty({ description: 'The department where the employee works' })
  department: string;
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the attendance record',
    type: String,
  })
  id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  @ApiProperty({
    description: 'The employee associated with this attendance record',
  })
  employee: Employee;

  @Column()
  @ApiProperty({
    description: 'The date and time when the employee checked in',
    type: String,
    format: 'date-time',
  })
  checkIn: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'The date and time when the employee checked out',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  checkOut: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Optional comment about the attendance record',
    nullable: true,
  })
  comment: string;

  @Column('bigint', { nullable: true })
  @ApiProperty({
    description:
      'The duration of the time between check-in and check-out in milliseconds',
    type: Number,
    nullable: true,
  })
  duration: number;
}
