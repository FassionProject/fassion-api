import { applyDecorators, SetMetadata, Type } from '@nestjs/common';

import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { JsonResponse } from './json-response';
import { ListModel } from '../model/list-model.model';
import * as moment from 'moment';
import { randomUUID } from 'crypto';

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

export const ApiListJsonResponse = <GenericType extends Type<unknown>>(
  data: GenericType,
) =>
  applyDecorators(
    ApiExtraModels(JsonResponse, ListModel, data),
    ApiOkResponse({
      description: `Data successfully retrieved`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(JsonResponse) },
          {
            properties: {
              data: {
                type: 'object',
                allOf: [
                  { $ref: getSchemaPath(ListModel) },
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(data) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
export const ApiGetJsonResponse = <GenericType extends Type<unknown>>(
  data: GenericType,
) =>
  applyDecorators(
    ApiExtraModels(JsonResponse, ListModel, data),
    ApiOkResponse({
      description: `Data successfully retrieved`,
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

export const ApiUpdatedJsonResponse = <GenericType extends Type<unknown>>(
  data: GenericType,
) =>
  applyDecorators(
    ApiExtraModels(JsonResponse, data),
    ApiOkResponse({
      description: `Data successfully updated`,
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

export const ApiDeletedJsonResponse = <GenericType extends Type<unknown>>(
  data: GenericType,
) =>
  applyDecorators(
    ApiExtraModels(JsonResponse, data),
    ApiOkResponse({
      description: `Data successfully deleted`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(JsonResponse) },
          {
            properties: {
              data: {
                type: 'object',
                allOf: [
                  { $ref: getSchemaPath(data) },
                  {
                    properties: {
                      deletedAt: {
                        type: 'string',
                        format: 'date-time',
                        example: moment(),
                      },
                      deletedBy: {
                        type: 'string',
                        example: randomUUID(),
                      },
                      deletedIp: {
                        type: 'string',
                        example: '127.0.0.1',
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
