import { Router } from 'express'
import auth from './routes/auth'
import upload from './routes/uploadFile'
import utils from './routes/utils'
// guaranteed to get dependencies
export default () => {
  const app = Router()
  auth(app)
  upload(app)
  utils(app)
  return app
}