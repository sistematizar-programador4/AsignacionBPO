import { Service, Inject } from 'typedi'
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
  public async upload (file: File,unit: string,type: string,state: string, dateopen: string, dateclose: string) {
    const fs = require('fs')
    let name = file.name
    let columns = (await this.db.query({ text: `SELECT * FROM campos WHERE idunidad = ${unit} AND tipocargue = ${type}`,rowMode: 'array' })).rows
    console.log(columns)
    let unitname = (await this.db.query(`SELECT * FROM unidad WHERE id = ${unit}`)).rows
    const date = new Date()
    if (unitname.length === 0) {
      throw new Error('Unidad no registrada')
    }
    let month = (date.getMonth() + 1)
    let path = `./uploads/${unitname[0].nombre}/${date.getFullYear()}_${month}_${date.getDate()}`
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    await file.mv(path + '/' + name)
    const workSheetsFromFile = xlsx.parse(path + '/' + name)
    const headers = workSheetsFromFile[0].data[0]
    const tosave = await this.validation(headers,columns)
    console.log(tosave)
    const fileBuffer = await this.process(workSheetsFromFile[0].data,tosave,unit,state,dateopen,dateclose)
    fs.writeFile(path + '/errors.xlsx' , fileBuffer, function (err: any) {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
    })
    let vdata = tosave
    return { vdata }
  }
  private async validation (headers: any,columns: any) {
    let numvalidation = 0
    let savecolumns = []
    for (let index = 0; index < headers.length; index++) {
      for (let index2 = 0; index2 < columns.length; index2++) {
        if (headers[index] === columns[index2][1]) {
          savecolumns.push({
            id: index,
            header: headers[index],
            column: columns[index2][1]
          })
          numvalidation++
        }
      }
    }
    if (numvalidation !== columns.length) {
      throw new Error('Alguna de las columns requeridas no se encuentran en el archivo')
    }
    return savecolumns
  }
  private async process (excelpayload: any, columnstosave: any, unidad: string, state: string,dateopen: string,dateclose: string) {
    await this.db.query(`INSERT INTO asignacion
    (idunidad, nombre, tipoasignacion, fechaapertura, fechacierre)
    VALUES(${unidad}, 'Asignacion unidad ${unidad} -  (${dateopen},${dateclose})', ${state}, '${dateopen}', '${dateclose}')`)
    const asigancionid = (await this.db.query(`SELECT * FROM asignacion
    WHERE idunidad = ${unidad} AND tipoasignacion = ${state} AND fechaapertura = '${dateopen}' AND fechacierre = '${dateclose}'`)).rows[0]
    let errors = []
    excelpayload[0].push('Error')
    errors.push(excelpayload[0])
    for (let index = 1; index < excelpayload.length; index++) {
      let valuesbase = []
      valuesbase.push(asigancionid.id)
      for (let index2 = 0; index2 < columnstosave.length; index2++) {
        let idx = columnstosave[index2]
        valuesbase.push(excelpayload[index][idx.id])
      }
      console.log(valuesbase)
      const query = {
        text: `INSERT INTO baseasignacion 
        (idasignacion, identificacion, obligacion, diasmora, saldocapital, saldomora, saldocobrar)
        VALUES($1, $2, $3, $4, $5, $6, $7)`,
        values: valuesbase,
      }
      try {
        await this.db.query(query.text,query.values)
      } catch (error) {
        excelpayload[index].push(error)
        errors.push(excelpayload[index])
      }
    }
    let buffer = xlsx.build([ { name: 'Errors', data: errors } ]) // Returns a buffer
    return buffer
  }
}
