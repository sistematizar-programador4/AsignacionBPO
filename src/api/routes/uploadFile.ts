import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi';
import UploadFileService from '../../services/uploadFile'
import middlewares from '../middlewares'
import { celebrate, Joi } from 'celebrate'
const route = Router()

export default (app: Router) => {
  app.use('/asignacion', route)

  route.post(
    '/subir',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger')
      logger.debug('Calling UploadFile endpoint with body: %o', req.body)
      try {
        console.log(req.body)
        if (req.files) {
          const file = (req.files.file)
          const unit = (req.body.unit)
          const type = (req.body.type)
          const state = (req.body.state)
          const date_open = req.body.date_open
          const date_close = req.body.date_close
          const uploadServiceInstance = Container.get(UploadFileService)
          const vdata = await uploadServiceInstance.processFile(file,unit,type,state,date_open,date_close)
          console.log(vdata)
          return res.json({ 'vdata': vdata }).status(200)
        }
      } catch (e) {
        logger.error('🔥 error: %o', e)
        return next(e)
      }
    },
  )

  route.post(
    '/procesar',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger')
      logger.debug('Llamando endpoint procesar con body: ')
      try {
        const uploadServiceInstance = Container.get(UploadFileService)
        const data = await uploadServiceInstance.process(req.body.data)
      } catch (e) {
        logger.error('🔥 error: %o', e)
        return next(e)
      }
    },
  )
}
