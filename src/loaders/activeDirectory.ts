import Logger from './logger'

const { ActiveDirectory } = require('node-ad-tools')
const config = {
  url: 'ldap://10.150.1.20',
  base: 'dc=cobrando,dc=com,dc=co'
}
const ad = new ActiveDirectory(config)

Logger.info('AD Configured ✔︎')

export default ad
