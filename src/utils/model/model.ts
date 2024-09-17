import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class ListModel<T> {
  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty()
  items: T[];

  constructor(partial: Partial<ListModel<T>>) {
    Object.assign(this, partial);
  }
}
