import { sequelize } from './database';
import app from './app';
import { env } from './utils/';

// Start the server
app.listen(env.PORT, async () => {
  try {
    // Test the DB connection and sync up the repositories models
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(`Server is running at http://localhost:${env.PORT}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});
