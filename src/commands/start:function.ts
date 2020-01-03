import { exec } from 'child_process';
import * as R from 'ramda';

async function sh(cmd): Promise<any> {
  return new Promise(function (resolve, reject) {
    exec(cmd, (_err, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
}

module.exports = {
  name: 'start:function',
  description: 'Start a deployed function',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.name) {
      print.info('Usage: uni-faas start:function --name [OPTION]');
    }

    await sh(`docker start ${options.name}`);
    
    print.success('Function started');
    print.info(`http://localhost:8080/api/${options.name}`)
  }
}