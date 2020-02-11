import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from '../api'
import config from '../config'
import fileUpload from 'express-fileupload'
let http = require('http')
let fs = require('fs')
export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (req, res) => {
    res.status(200).json({
      name: 'Asignación',
      provider: 'Cobrando BPO',
      version: 'v1'
    })
  })
  app.head('/status', (req, res) => {
    res.status(200).end()
  })

  app.use(fileUpload())

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy')

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
  })

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  app.use(require('method-override')())

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json())
  // Load API routes
  app.use(config.api.prefix, routes())

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err['status'] = 404
    next(err)
  })

  /**
   * Error handlers
   * Return
   * {
   * 	"message": <string>
   * 	"code": <500:number>,
   * }
   */
  app.use((err: any, req: any, res: any, next: any) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end()
    }
    return next(err)
  })
  app.use((err: any, req: any, res: any, next: any) => {
    let message = err.message
    if (err.status === 404) {
      message = 'El recurso solicitado no ha sido encontrado'
    } else if (err.status === 500) {
      message = 'Tenemos problemas con el servidor. Se ha creado una notificacion al área de soporte sobre este error. Gracias por tu paciencia'
    }
    res.status(err.status || 500)
    res.json({
      message: message,
      code: err.status
    })
  })
}
