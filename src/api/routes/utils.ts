import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
const route = Router()

export default (app: Router) => {
  app.use('/', route)
  route.get('/clients',async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get('logger')
    const psqldb = Container.get('database')
    try{
      const clients = (await psqldb.query(`
      SELECT c.* FROM cliente as c
      INNER JOIN usuario as u ON u.usuariowin = '${req.query.user}'
      INNER JOIN clienteusuario as cu ON cu.idusuario = u.id AND cu.idcliente = c.id`)).rows
      return res.json(clients).status(200)
    } catch(e){
      return next(e)
    }
  })

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
