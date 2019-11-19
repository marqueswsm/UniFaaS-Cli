import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'uni-faas',
  run: async toolbox => {
    const { print } = toolbox

    print.info('Welcome to UniFaaS')
  },
}

module.exports = command
