import { Container } from 'typedi'

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req: any, res: any, next: any) => {
  const Logger = Container.get('logger')
  const db = Container.get('database')
  try {
    let userRecord = (await db.query(`SELECT * FROM "controlAccesoShema".usuario WHERE id = '${req.toke.id}'`)).rows
    if (!userRecord) {
      return res.sendStatus(401)
    }
    const currentUser = userRecord.toObject()
    Reflect.deleteProperty(currentUser, 'password')
    Reflect.deleteProperty(currentUser, 'salt')
    req.currentUser = currentUser
    return next()
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e)
    return next(e)
  }
}

export default attachCurrentUser
