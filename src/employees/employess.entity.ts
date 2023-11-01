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
  id: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  dateCreated: Date;

  @Column()
  department: string;
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  checkIn: Date;

  @Column({ nullable: true })
  checkOut: Date;

  @Column({ nullable: true })
  comment: string;

  @Column('bigint', { nullable: true })
  duration: number;
}
