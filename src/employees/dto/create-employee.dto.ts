import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'The last name of the employee' })
  lastName: string;

  @ApiProperty({ description: 'The first name of the employee' })
  firstName: string;

  @ApiProperty({ description: 'The department where the employee works' })
  department: string;
}
