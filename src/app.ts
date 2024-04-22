import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { Route } from './utils';
import { discoveryRoute } from './routes';
import { loggingMiddleware } from './middleware';

dotenv.config();
const app = express();

// helmet middleware for basic security
// For example, removes the X-Powered-By header from the response
// because it is good practice to avoid exposing the stack used by the service.
// And also does other manipulation to the headers such as, for example:
// Content-Security-Policy -> to mitigate XSS
// Strict-Transport-Security -> to enforce HTTPS over HTTP
// ect ect...
app.use(helmet());
app.use(loggingMiddleware);

// Assuming that this service will not be directly expose but behind something like an nginx
app.set('trust proxy', true);

app.use(Route.Discovery, discoveryRoute);

// Catch route for all those routes that are not defined
app.use((_, res) => res.sendStatus(404));

export default app;
