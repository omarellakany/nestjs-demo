import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @ApiProperty()
  body: string;
}
