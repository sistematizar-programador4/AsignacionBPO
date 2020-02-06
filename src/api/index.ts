import { Router } from 'express'
import auth from './routes/auth'
import upload from './routes/uploadFile'

// guaranteed to get dependencies
export default () => {
  const app = Router()
  auth(app)
  upload(app)
  return app
}