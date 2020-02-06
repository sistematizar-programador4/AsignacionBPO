import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi';
import UploadFileService from '../../services/uploadFile'
import middlewares from '../middlewares'
import { celebrate, Joi } from 'celebrate'
const route = Router()

export default (app: Router) => {
  app.use('/asignacion', route)

  route.post(
    '/upload',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger')
      logger.debug('Calling UploadFile endpoint with body: %o', req.body)
      try {
        console.log(req.files)
        if (req.files) {
          const file = (req.files.temp)
          const uploadServiceInstance = Container.get(UploadFileService)
          const data = await uploadServiceInstance.upload(file,'uploads')
          return res.json({ 'data': data }).status(200)
        }
      } catch (e) {
        logger.error('🔥 error: %o', e)
        return next(e)
      }
    },
  )
}
