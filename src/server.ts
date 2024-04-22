import { sequelize } from './database';
import app from './app';
import { Logger, env } from './utils/';

// Start the server
app.listen(env.PORT, async () => {
  try {
    Logger.info('Attempting connection to Database');
    // Test the DB connection and sync up the repositories models
    await sequelize.authenticate();
    await sequelize.sync();
    Logger.info('Connection to Database successful, starting server');
    Logger.info(`Server is running at http://localhost:${env.PORT}`);
  } catch (e) {
    Logger.error(e);
    Logger.error('It was not possible to connect to the Database');
    process.exit(1);
  }
});
