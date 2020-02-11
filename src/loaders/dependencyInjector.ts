import { Container } from 'typedi'
import LoggerInstance from './logger'
import ActiveDirectoryInstance from './activeDirectory'
import DatabaseInstance from './database'
import SQLDatabaseInstance from './sqldatabase'
import config from '../config'

export default () => {
  try {

    Container.set('logger', LoggerInstance)
    Container.set('activeDirectory', ActiveDirectoryInstance)
    Container.set('database', DatabaseInstance)
    Container.set('SQLdatabase', SQLDatabaseInstance)
    LoggerInstance.info('Containers injected ✔︎')

    return { activeDirectory: ActiveDirectoryInstance }
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e)
    throw e
  }
}
