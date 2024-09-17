import { HttpException, Type } from '@nestjs/common';

export class Utils {
  static convertObject<T, R>(from: T, toType: { new (): R }): R {
    const to = new toType();

    // for (const key in from) {

    for (const key in from) {
      if (from.hasOwnProperty(key) && to.hasOwnProperty(key)) {
        (to as any)[key] = (from as any)[key];
      }
    }
    return to;
  }

  static skipAndTakeAttribute(
    page: number,
    pageSize: number,
  ): { skip?: number; take?: number } {
    page = +page;
    pageSize = +pageSize;

    const paginate = page > 0 && pageSize > 0;
    const skip = paginate ? (page - 1) * pageSize : undefined;
    const take = paginate ? pageSize : undefined;

    if (page <= 0) {
      throw new HttpException('Page must be greater than or equal to 1', 400);
    }

    return { skip, take };
  }
}
