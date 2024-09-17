import { ApiProperty } from '@nestjs/swagger';

export class ListModel<T> {
  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty()
  items: T[];

  constructor(partial: Partial<ListModel<T>>) {
    Object.assign(this, partial);
  }
}
