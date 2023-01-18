import { EmailToken } from '@models/emailToken';
import { RefreshToken } from '@models/refreshToken';
import { User } from '@models/user';
import { UserCredentials } from '@models/userCredentials';
import dbConnection from './connection';

const synchronize = async (): Promise<void> => {
  try {
    await dbConnection
      // Change alter: true in case DB update is required, run locally and return false again
      .sync({ force: true, alter: true })
      .then(() => console.log('DB Connection established successfully.'))
      .catch((error) => console.error(`DB Sequelize Connection Failed: ${error}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const authenticate = async () => {
  await dbConnection.authenticate();
};

const initModels = async () => {
  User.hasMany(UserCredentials);
  UserCredentials.belongsTo(User);

  User.hasMany(EmailToken);
  EmailToken.belongsTo(User);

  User.hasMany(RefreshToken);
  RefreshToken.belongsTo(User);
};

const dbInitialize = async () => {
  await authenticate();
  await initModels();

  await synchronize();
};

export default dbInitialize;
