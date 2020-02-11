import { Service, Inject } from 'typedi'
import jwt from 'jsonwebtoken'
import config from '../config'
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher'
import xlsx from 'node-xlsx'

@Service()
export default class UploadFileService {
  constructor(
    @Inject('logger') private logger,
    @Inject('activeDirectory') private ad,
    @Inject('database') private db,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}
  public async upload (file: File, path: string) {
    let name = file.name
    let route = './' + path + '/' + name
    await file.mv(route)
    let vdata = await this.validation(route)
    return { vdata }
  }
  private async validation (route: string) {
    try {
      let data = []
      let workSheetsFromFile = xlsx.parse(route)
      let headers = workSheetsFromFile[0].data[0]
      let columns = await this.db.query('SELECT * FROM shema_generico."camposEstructura"')
      console.log(columns.rows)
      headers.forEach((it: any, index: any) => {
        let validation = columns.rows.find((it2: any) => it2.cabeceraArchivo === it)
        data.push({
          id: index + 1,
          cabeceraArchivo: it,
          validation: (validation) ? validation : false
        })
      })
      return data
    } catch (e) {
      console.log(e)
    }
  }
  public async process (data: Array<[]>) {
    console.log(data.filter(item => item.validation))
  }
}
