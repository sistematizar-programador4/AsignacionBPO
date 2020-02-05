const { Pool } = require('pg')
import config from '../config'
import Logger from './logger'

const client = new Pool({
  host: config.databaseHost || 'localhost',
  port: config.databasePort || 5432,
  user: config.databaseUsername || 'postgres',
  password: config.databasePassword || 'postgres',
  database: config.database || 'BIWOLKVOX'
})

Logger.info('DB Configured ✔︎')

export default client
