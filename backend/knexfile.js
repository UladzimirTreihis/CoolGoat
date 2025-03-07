import { dbConfig } from './config/config.js'

export default {
  development: {
    client: 'pg',
    connection: {
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    },
    migrations: {
      directory: './migrations', // Specify the directory for migrations
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    },
    migrations: {
      directory: './migrations', // Specify the directory for migrations
    },
  },
};