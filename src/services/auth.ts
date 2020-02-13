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
    private error: any
  ) {}
  public async SignIn (username: string, password: string, client: string) {
    let userRecord = (await this.db.query(`SELECT * FROM usuario WHERE usuariowin = '${username}'`)).rows
    let unitsRecord = (await this.db.query(`SELECT * FROM unidad WHERE idcliente = '${client}'`)).rows
    this.logger.silly('Checking username')
    if (userRecord.length === 0) {
      throw new Error('User not registered')
    }
    this.logger.silly('checking authenticate')
    await this.ad.loginUser((username), password)
    .then((res: any) => {
      if (res.success) {
        this.logger.silly('authenticated!')
      } else {
        throw new Error()
      }
    })
    .catch((err: any) => {
      this.logger.debug(err)
      throw new Error('Problema al intentar loguearse con el directorio activo y/o usuario y contraseño incorrectos')
    })
    let user = userRecord[0]
    let token = await this.generateToken(userRecord[0])
    return { user, token, unitsRecord }

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
    return jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        name: user.nombre,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    )
  }
}
