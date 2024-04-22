export type ParamError = {
  fieldName: string;
  error: string;
};

export type BadRequestResponse = {
  message: string;
  errors: ParamError[];
};

export enum ResponseCodeText {
  BadRequest = 'BAD_REQUEST',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
}
