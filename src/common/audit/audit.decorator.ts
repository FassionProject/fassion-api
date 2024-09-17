import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Audit } from './audit.model';
import * as moment from 'moment';

export const AuditInfo = createParamDecorator<Audit>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auditInfo: Audit = {
      timestamp: moment().toDate(),
      ip: request.ip,
      user: request.user?.id || 'unknown',
    };

    return auditInfo;
  },
);
