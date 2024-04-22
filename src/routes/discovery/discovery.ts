import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { GETvalidationSchema } from './utils/requestValidationSchema';
import {
  BadRequestResponse,
  DiscoveryResponse,
  DiscoveryRoute,
  ResponseCodeText,
} from '../../types';
import { BusinessDTO } from '../../database/DTOs';
import { BusinessesRepository } from '../../repositories';
import { Logger, paramsErrorsParser } from '../../utils';

export const discoveryRoute = express.Router();

discoveryRoute.get(
  DiscoveryRoute.Main, // -> <HOST>/discovery
  checkSchema(GETvalidationSchema),
  async (req: express.Request, res: express.Response) => {
    try {
      // Validating and sanitizing the query params input
      // All params not expected will be discarded
      // Nice to have to avoid sneaky XSS attempts
      const paramsValidationErrors = validationResult(req);
      const params = matchedData(req, { includeOptionals: true });

      if (!paramsValidationErrors.isEmpty()) {
        // Returning a list of query params errors with fieldName and error code
        // useful in scenarios where the client uses an i18n library
        // so the query param error code can be mapped to a i18n key
        // and be easily displayed in the target language.
        // { "message": "BAD_REQUEST", "errors": [{ "fieldName": "lat", "error": "invalid_value" }] }
        const response: BadRequestResponse = {
          message: `${ResponseCodeText.BadRequest}`,
          errors: paramsErrorsParser(paramsValidationErrors),
        };

        return res.status(400).json(response);
      }

      // Getting the data from the DB
      // All the sorting by distance magic happens within the repository
      const data: BusinessDTO[] =
        await BusinessesRepository.getBusinessesSortedByDistance({
          lat: +params.lat,
          long: +params.long,
          limit: params.limit ? +params.limit : undefined,
          type: params.type,
          unit: params.unit,
        });

      // I prefer to always keep the type of the response body as an object
      // so the response body type will always be consistent across different
      // scenario, i.e. if we need to send down an error Vs we are returning the data.
      // Plus, it is a structure easily extendable if needed.
      const response: DiscoveryResponse = {
        data,
        total: data.length,
      };

      return res.status(200).json(response);
    } catch (e) {
      Logger.error(e);
      return res.status(500).json(ResponseCodeText.InternalServerError);
    }
  },
);
