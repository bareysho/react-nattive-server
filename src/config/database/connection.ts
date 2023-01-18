import * as pg from 'pg';
import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

pg.defaults.ssl = true;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialectModule: pg,
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelizeConnection;
