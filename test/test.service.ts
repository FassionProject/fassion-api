import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../src/common/database/database.service';
import { randomInt } from 'crypto';
import * as moment from 'moment';

@Injectable()
export class TestService {
  readonly ProductCategory = 'category';
  constructor(private db: DatabaseService) {}
  async deleteProductCategories() {
    return await this.db.productCategory.deleteMany({
      where: {
        OR: [
          {
            description: this.ProductCategory,
          },
          {
            createdBy: 'unknown',
          },
        ],
      },
    });
  }

  async createParentProductCategory(description: string = 'parent') {
    return await this.db.productCategory.create({
      data: {
        description: description,
        parentId: null,
        createdAt: moment().toDate(),
        createdBy: 'unknown',
        createdIp: 'unknown',
        updatedAt: moment().toDate(),
        updatedBy: 'unknown',
        updatedIp: 'unknown',
      },
    });
  }

  async createChildProductCategory(
    description: string = this.ProductCategory,
    parentId?: string,
  ) {
    return await this.db.productCategory.create({
      data: {
        description: description,
        parentId: parentId || (await this.createParentProductCategory()).id,
        createdAt: moment().toDate(),
        createdBy: 'unknown',
        createdIp: 'unknown',
        updatedAt: moment().toDate(),
        updatedBy: 'unknown',
        updatedIp: 'unknown',
      },
    });
  }

  async getParentProductCategory() {
    return await this.db.productCategory.findFirst({
      where: {
        description: 'parent',
      },
    });
  }

  async createProductCategories() {
    const parentCategories = [];

    for (let i = 0; i < 4; i++) {
      parentCategories.push(
        await this.createParentProductCategory(`parent ${i}`),
      );
    }

    parentCategories.forEach((p) => {
      for (let i = 0; i < randomInt(1, 5); i++) {
        this.createChildProductCategory(`child ${i}`, p.id);
      }
    });
  }
}
