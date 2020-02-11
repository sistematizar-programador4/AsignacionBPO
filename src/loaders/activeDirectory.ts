import Logger from './logger'

const ActiveDirectory = require('activedirectory')
const config = {
  url: 'ldap://10.150.1.20',
  baseDN: 'dc=cobrando,dc=com,dc=co'
}
const ad = ActiveDirectory(config)

Logger.info('AD Configured ✔︎')

export default ad
