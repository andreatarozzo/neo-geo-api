import { ZodError, z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

type EnvVariables = {
  PORT: number;
  DB_CONNECTION_STRING: string;
  NODE_ENV: 'development' | 'test' | 'production';
};

// Adding Schema Validation for env variables
// so in case they don't have the correct shape and/or content type the app won't even start.
const envSchema = z.object({
  PORT: z.coerce.number().gte(3000).lte(3000),
  DB_CONNECTION_STRING: z.string().min(1),
  NODE_ENV: z.string().min(1),
});

let env: EnvVariables;

const envSchemaValidationResult: {
  success: boolean;
  data?: any;
  error?: ZodError;
} = envSchema.safeParse(process.env);

// Using console log here because the Logger, in a real life scenario, would
// mean sending also these logs in some sort of file or db which is not ideal ( opinionated idea )
// if we want to keep logs logically separated by purpose
console.log('');
console.log('*'.repeat(36));
console.log('ENV variables validation started!');

if (envSchemaValidationResult.success) {
  /*
      Prints out the following if successful:
      ************************************
      ENV variables validation started!
      ENV variables validation successful!
      ************************************
   */

  env = envSchemaValidationResult.data;
  console.log('ENV variables validation successful!');
  console.log('*'.repeat(36));
} else {
  /*
      Prints out the following if the validation fails:
      ************************************
      ENV variables validation started!

      NODE_ENV: ["String must contain at least 111 character(s)"]

      ENV variables validation failed!
      ************************************
   */

  console.log('');
  Object.entries(envSchemaValidationResult.error?.flatten().fieldErrors as any).forEach(
    ([envKey, error]) => {
      console.log(`${envKey}: ${JSON.stringify(error)}`);
    },
  );
  console.log('');
  console.log('ENV variables validation failed!');
  console.log('*'.repeat(30));
  process.exit(1);
}

console.log('');

export { env };
