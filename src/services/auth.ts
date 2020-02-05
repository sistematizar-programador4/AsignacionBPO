import { Service, Inject } from 'typedi'
import jwt from 'jsonwebtoken'
import config from '../config'
import { randomBytes } from 'crypto'
import { IUser, IUserInputDTO } from '../interfaces/IUser'
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher'
import events from '../subscribers/events'

@Service()
export default class AuthService {
  constructor(
    @Inject('logger') private logger,
    @Inject('activeDirectory') private ad,
    @Inject('database') private db,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}
  public async SignIn(username: string, password: string) {
    console.log(this.ad)
    let userRecord = (await this.db.query(`SELECT * FROM "controlAccesoShema".usuario WHERE usuario = '${username}'`)).rows
    console.log(userRecord[0])
    this.logger.silly('Checking username')
    if (userRecord.length === 0) {
      throw new Error('User not registered')
    }
    const thos = this
    try {
      this.ad.authenticate(username, password, function(err: any, auth: any) {
        if (err) {
          console.log('🔥 Error on login with active directory: %o', err)
        }
        if (auth) {
          console.log('Password validated!')
          console.log('Generating JWT')
          const token = thos.generateToken(userRecord[0])
          return { userRecord, token }
        } else {
          throw new Error('Invalid Password')
        }
      })
    } catch(error) {
      console.log(error)
    }
  }

  private generateToken(user: any) {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user.id}`)
    return jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        name: user.nombresCompleto,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    )
  }
}
