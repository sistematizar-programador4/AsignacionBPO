import dotenv from 'dotenv'
// Toma como NODE_ENV por defecto development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()

if (!envFound) {
  // Salta error al no encontrar el archivo .env

  throw new Error('⚠️  No se puede encontrar el archivo .env  ⚠️')
}

export default {
  /**
   * Set variables
   */
  // set port for the application
  port: process.env.PORT || 3001,
  // set Database config
  databaseHost: process.env.PGHOST,
  databasePort: process.env.PGPORT,
  databaseUsername: process.env.PGUSER,
  databasePassword: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  // secret sauce for JWT
  jwtSecret: process.env.JWT_SECRET,
  // Level for winston
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  // API configs
  api: {
    prefix: '/api',
  },
  sqlUsername: process.env.SQLUSER,
  sqlPassword: process.env.SQLPASSWORD,
  sqlDatabase: process.env.SQLDATABASE,
  sqlServer: process.env.SQLSERVER
}
