import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi';
import AuthService from '../../services/auth'
import { IUserInputDTO } from '../../interfaces/IUser'
import { celebrate, Joi } from 'celebrate'

const route = Router()

export default (app: Router) => {
  app.use('/auth', route)

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger')
      logger.debug('Calling Sign-In endpoint with body: %o', req.body)
      try {
        const { username, password } = req.body
        const authServiceInstance = Container.get(AuthService)
        await authServiceInstance.SignIn(username, password)
        return res.json().status(200)
      } catch (e) {
        logger.error('🔥 error: %o', e)
        return next(e)
      }
    },
  )
}
