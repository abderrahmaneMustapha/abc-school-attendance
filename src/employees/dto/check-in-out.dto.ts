import { ApiProperty } from '@nestjs/swagger';

export class CheckInOutDto {
  @ApiProperty({ description: 'The unique identifier of the employee' })
  employeeId: string;

  @ApiProperty({
    description: 'Optional comment about the check-in or check-out',
    required: false,
  })
  comment?: string;
}
