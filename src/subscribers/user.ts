import { Container } from 'typedi'
import { EventSubscriber, On } from 'event-dispatch'
import { IUser } from '../interfaces/IUser'
import events from './events'

@EventSubscriber()
export default class UserSubscriber {
  /**
   * A great example of an event that you want to handle
   * save the last time a user signin, your boss will be pleased.
   *
   * Altough it works in this tiny toy API, please don't do this for a production product
   * just spamming insert/update to mongo will kill it eventualy
   *
   * Use another approach like emit events to a queue (rabbitmq/aws sqs),
   * then save the latest in Redis/Memcache or something similar
   */
  @On(events.user.signIn)
  public onUserSignIn({ _id }: Partial<IUser>) {
    const Logger = Container.get('logger')
    try {
      
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.signIn}: %o`, e)
      // Throw the error so the process die (check src/app.ts)
      throw e
    }
  }
}