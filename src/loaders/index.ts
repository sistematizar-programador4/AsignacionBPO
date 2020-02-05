import Logger from './logger'
import adLoader from './activeDirectory'
import expressLoader from './express'
import databaseLoader from './database'
import dependencyInjectorLoader from './dependencyInjector'

// We have to import at least all the events once so they can be triggered
// import './events'

/**
 * WTF is going on here?
 *
 * We are injecting the mongoose models into the DI container.
 * I know this is controversial but will provide a lot of flexibility at the time
 * of writing unit tests, just go and check how beautiful they are!
 */

export default async ({ expressApp }) => {

  await expressLoader({ app: expressApp })
  Logger.info('Express loaded ✔︎')

  await dependencyInjectorLoader()
  Logger.info('dependency loaded ✔︎')
}
