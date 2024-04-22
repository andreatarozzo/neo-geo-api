import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { GETvalidationSchema } from './utils/requestValidationSchema';
import { DiscoveryRoute, Logger, paramsErrorsParser } from '../../utils';
import { BadRequestResponse, ResponseCodeText } from '../../types';

export const discoveryRoute = express.Router();

discoveryRoute.get(
  DiscoveryRoute.Main, // -> <HOST>/discovery
  checkSchema(GETvalidationSchema),
  async (req: express.Request, res: express.Response) => {
    try {
      // Validating and sanitizing the query params input
      // All params not expected will be discarded
      const paramsValidationErrors = validationResult(req);
      const params = matchedData(req, { includeOptionals: true });

      if (!paramsValidationErrors.isEmpty()) {
        // Returning a list of query params errors with fieldName and error code
        // useful in scenarios where the client uses an i18n library
        // so the query param error code can be mapped to a i18n key
        // and be easily displayed in the target language.
        const response: BadRequestResponse = {
          message: `${ResponseCodeText.BadRequest}`,
          errors: paramsErrorsParser(paramsValidationErrors),
        };

        return res.status(400).json(response);
      }

      return res.status(200).json(params);
    } catch (e) {
      Logger.error(e);
      return res.status(500).json(ResponseCodeText.InternalServerError);
    }
  },
);
