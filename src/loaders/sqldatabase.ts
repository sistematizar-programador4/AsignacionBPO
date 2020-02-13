const sql = require('mssql')
import config from '../config'
import Logger from './logger'

const sqlConfig = {
  user: config.sqlUsername || 'SA',
  password: config.sqlPassword || 'Bdcobrandosas2019',
  database: config.sqlDatabase || 'cristiandatabase',
  server: config.sqlServer || '172.21.2.49',
}
export default sql.connect(sqlConfig,(err: any) => {
  if (err) {
    Logger.info('SQL DB Connection abort ✖')
    Logger.silly(err)
  } else {
    Logger.info('SQL DB connected ✔︎')
  }
})
