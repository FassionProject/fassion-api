import { applyDecorators, SetMetadata, Type } from '@nestjs/common';

import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { JsonResponse } from './json-response';

export const ApiCreatedJsonResponse = <GenericType extends Type<unknown>>(
  data: GenericType,
) =>
  applyDecorators(
    ApiExtraModels(JsonResponse, data),
    ApiOkResponse({
      description: `Data successfully created`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(JsonResponse) },
          {
            properties: {
              data: {
                type: 'object',
                allOf: [{ $ref: getSchemaPath(data) }],
              },
            },
          },
        ],
      },
    }),
  );
