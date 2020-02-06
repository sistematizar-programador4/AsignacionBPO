import { Service, Inject } from 'typedi'
import jwt from 'jsonwebtoken'
import config from '../config'
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher'

@Service()
export default class AuthService {
  constructor(
    @Inject('logger') private logger,
    @Inject('activeDirectory') private ad,
    @Inject('database') private db,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    protected token: any,
  ) {}
  public async SignIn (username: string, password: string) {
    console.log(this.ad)
    let userRecord = (await this.db.query(`SELECT * FROM "controlAccesoShema".usuario WHERE usuario = '${username}'`)).rows
    console.log(userRecord[0])
    this.logger.silly('Checking username')
    if (userRecord.length === 0) {
      throw new Error('User not registered')
    }
    let auth = await this.authenticate(username, password, userRecord)
    let token = await this.generateToken(userRecord[0])
    console.log(auth)
    console.log(token)
    this.logger.silly(this.token)
  }
  private async authenticate (username: any, password: any, record: any) {
    this.logger.silly('checking authenticate')
    const thos = this
    await this.ad.authenticate((username + '@cobrandobpo.com.co'), password, function (err: any, auth: any) {
      if (err) {
        console.log('🔥 Error on login with active directory: %o', err)
      }
      if (auth) {
        thos.logger.silly('Password validated!')
      } else {
        throw new Error('Invalid Password')
      }
    })
    return true
  }
  private async generateToken (user: any) {
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
    this.token = jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        name: user.nombresCompleto,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    )
    return true
  }
}
