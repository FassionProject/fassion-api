import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Audit } from './audit.model';

export const AuditInfo = createParamDecorator<Audit>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auditInfo: Audit = {
      timestamp: new Date(),
      ip: request.ip,
      user: request.user?.id || 'unknown',
    };

    return auditInfo;
  },
);
