import Logger from './logger'

const ActiveDirectory = require('activedirectory')
const config = {
  url: 'ldap://10.150.1.95',
  baseDN: 'dc=cobrandobpo,dc=com,dc=co'
}
const ad = ActiveDirectory(config)

Logger.info('AD Configured ✔︎')

export default ad
