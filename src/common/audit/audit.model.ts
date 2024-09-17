import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';

export class Audit {
  @ApiProperty({ example: 'Admin' })
  user: string;

  @ApiProperty({ example: '127.0.0.1' })
  ip: string;

  @ApiProperty({ example: moment().toDate() })
  timestamp: Date;

  constructor(partial: Partial<Audit>) {
    Object.assign(this, partial);
  }
}
