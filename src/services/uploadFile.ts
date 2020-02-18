import { Service, Inject } from 'typedi'
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher'
import xlsx from 'node-xlsx'
import { columns } from 'mssql'

@Service()
export default class UploadFileService {
  constructor(
    @Inject('logger') private logger,
    @Inject('activeDirectory') private ad,
    @Inject('database') private db,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    private fs = require('fs')
  ) {}
  public async processFile (file: File,unit: string,type: string,state: string, dateopen: string, dateclose: string) {
    let name = file.name
    let columns = (await this.db.query({ text: `SELECT * FROM campos WHERE idunidad = ${unit} AND tipocargue = ${type}`, rowMode: 'array' })).rows
    let unitname = (await this.db.query(`SELECT * FROM unidad WHERE id = ${unit}`)).rows
    if (unitname.length === 0) {
      throw new Error('Unidad no registrada')
    }
    const path = await this.uploadFile(file,unitname[0].nombre,name)
    const workSheetsFromFile = xlsx.parse(path + '/' + name)
    const headers = workSheetsFromFile[0].data[0]
    const tosave = await this.validation(headers,columns)
    let groupcolumns = tosave.reduce((r: any, a: any) => {
      r[a.column] = [...r[a.column] || [], a]
      return r
    }, {})
    let asigancionid = null
    if (state === '1') {
      asigancionid = (await this.db.query(`SELECT * FROM asignacion
      WHERE idunidad = ${unit} AND estado = true`)).rows[0]
      if (asigancionid) {
        await this.db.query(`UPDATE asignacion SET estado = false WHERE idunidad = ${unit} AND estado = true`)
      }
      await this.db.query(`INSERT INTO asignacion
      (idunidad, nombre, tipoasignacion, fechaapertura, fechacierre)
      VALUES(${unit}, 'Asignacion unidad ${unit} -  (${dateopen},${dateclose})', ${state}, '${dateopen}', '${dateclose}')`)
    }
    asigancionid = (await this.db.query(`SELECT * FROM asignacion
    WHERE idunidad = ${unit} AND estado = true`)).rows[0]
    console.log(asigancionid)
    throw new Error()
    const fileBuffer = await this.processbase(workSheetsFromFile[0].data,tosave,asigancionid)
    if (fileBuffer) {
      this.fs.writeFile(path + '/errors_' + new Date().toISOString().substr(0, 10) + '.xlsx' , fileBuffer, function (err: any) {
        if (err) {
          throw new Error('Error al guardar archivo de errores')
        }
      })
    }
    let vdata = tosave
    return { vdata }
  }

  private async uploadFile (file: File,unitname: string, name: any) {
    const date = new Date()
    const month = (date.getMonth() + 1)
    let path = `./uploads/${unitname}`
    if (!this.fs.existsSync(path)) {
      await this.fs.mkdirSync(path)
      if (!this.fs.existsSync(path + `/${date.getFullYear()}_${month}_${date.getDate()}`)) {
        await this.fs.mkdirSync(path + `/${date.getFullYear()}_${month}_${date.getDate()}`)
      }
    }
    path = `${path}/${date.getFullYear()}_${month}_${date.getDate()}/`
    console.log(`${path}/${name}`)
    await file.mv(`${path}/${name}`)
    return path
  }

  private async validation (headers: any,columns: any) {
    let numvalidation = 0
    let savecolumns = []
    for (let index = 0; index < headers.length; index++) {
      for (let index2 = 0; index2 < columns.length; index2++) {
        if (headers[index] === columns[index2][1]) {
          let obj = {
            id: index,
            header: headers[index],
            column: columns[index2][2],
            concat: null
          }
          for (let index3 = 0; index3 < headers.length; index3++) {
            if (columns[index2][5] && headers[index3] === columns[index2][6]) {
              obj.concat = index3
            }
          }
          savecolumns.push(obj)
          numvalidation++
        }
      }
    }
    if (numvalidation !== columns.length) {
      throw new Error('Alguna de las columns requeridas no se encuentran en el archivo')
    }
    return savecolumns
  }

  private async processbase (excelpayload: any, columnstosave: any, asigancionid: any) {
    let errors = []
    let concat = ''
    excelpayload[0].push('Error')
    errors.push(excelpayload[0])
    for (let index = 1; index < excelpayload.length; index++) {
      let valuesbase = []
      let valuesinsert = '(idasignacion,'
      valuesbase.push(asigancionid.id)
      for (let index2 = 0; index2 < columnstosave.length; index2++) {
        let valuestelefonos = []
        let idx = columnstosave[index2]
        if (idx.column === 'numerotelefono') {
          let identificacion = columnstosave.find((it: any) => it.column === 'identificacion')
          valuestelefonos.push(asigancionid.id)
          valuestelefonos.push(excelpayload[index][identificacion.id])
          valuestelefonos.push(excelpayload[index][idx.id])
          // tslint:disable-next-line: variable-name
          const query_telefonos = {
            text: `INSERT INTO telefono
            (idasignacion,${identificacion.column},${idx.column})
            VALUES($1, $2, $3)`,
            values: valuestelefonos,
          }
          try {
            await this.db.query(query_telefonos.text,query_telefonos.values)
          } catch (error) {
            if (error.detail) {
              excelpayload[index].push(error.detail)
            } else {
              excelpayload[index].push(error)
            }
            errors.push(excelpayload[index])
          }
        } else {
          if (idx.column === 'obligacion') {
            if (idx.concat) {
              concat = excelpayload[index][idx.id] + '-' + excelpayload[index][idx.concat]
            } else {
              concat = excelpayload[index][idx.id]
            }
          }
          valuesbase.push(excelpayload[index][idx.id])
          valuesinsert += `${idx.column},`
        }
      }
      valuesbase.push(concat)
      valuesinsert = valuesinsert.substr(0,valuesinsert.length - 1) + ',concatenacion)'
      console.log(valuesinsert)
      const query = {
        text: `INSERT INTO baseasignacion
        ${valuesinsert}
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        values: valuesbase,
      }
      try {
        await this.db.query(query.text,query.values)
      } catch (error) {
        if (error.detail) {
          excelpayload[index].push(error.detail)
        } else {
          excelpayload[index].push(error)
        }
        errors.push(excelpayload[index])
      }
    }
    let buffer: any
    if (errors.length > 0) {
      buffer = xlsx.build([ { name: 'Errors', data: errors } ]) // Returns a buffer
    } else {
      buffer = false
    }
    return buffer
  }
}
