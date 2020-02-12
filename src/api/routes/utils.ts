import { Router, Request, Response, NextFunction } from 'express'
import middlewares from '../middlewares'
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
  route.get('/user', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200)
  })
  route.get('/units',async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get('logger')
    const psqldb = Container.get('database')
    try{
      const units = (await psqldb.query(`SELECT * FROM unidad WHERE idcliente = ${req.query.client}`)).rows
      return res.json(units).status(200)
    } catch(e){
      return next(e)
    }
  })
}
