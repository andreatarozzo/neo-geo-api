import { Result, ValidationError } from 'express-validator';
import { ParamError } from '../types';

/**
 * Functions that returns a list of query param errors objects containing fieldName and error code
 * @param errors
 * @returns
 */
export const paramsErrorsParser = (errors: Result<ValidationError>): ParamError[] => {
  return Object.entries(errors.mapped()).map(([fieldName, error]) => ({
    fieldName,
    error: error.msg?.replaceAll(' ', '_')?.toLowerCase() as string,
  }));
};
