import winston from 'winston';
import { env } from './envVariables';

class CustomLogger {
  #logger!: winston.Logger | Console;

  constructor(logger: winston.Logger | Console) {
    // Adding a logger param in the constructor so we can dynamically
    // interchange it if needed based on, for example, NODE_ENV as shown below
    this.#logger = logger;
  }

  info(e: any, metadata?: any, allowInTest?: boolean) {
    // Avoiding to pollute the logs with test logs
    if (env.NODE_ENV === 'test' && !allowInTest) return;
    this.#logger.info(JSON.stringify(e), metadata);
  }

  error(e: any, metadata?: any, allowInTest?: boolean) {
    // Avoiding to pollute the logs with test logs
    if (env.NODE_ENV === 'test' && !allowInTest) return;
    this.#logger.error(JSON.stringify(e), metadata);
  }
}

export const Logger = new CustomLogger(
  // Depending on the NODE_ENV we assign a different kind of logger
  // Ideally if we are running tests we don't want to collect/store logs with an actual logger
  env.NODE_ENV !== 'test'
    ? /**
       * Standard Winston logger passing the logs to the console.
       * Ideally in a real life scenario the logs will be moved to a file within the system
       * or to a ad-hoc service to collect and persist them if/when needed.
       */
      winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            ),
          }),
        ],
      })
    : console,
);
