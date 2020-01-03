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
  name: 'stop:function',
  description: 'Stop a running function',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.name) {
      print.info('Usage: uni-faas stop:function --name [OPTION]');
    }

    await sh(`docker stop ${options.name}`);
    
    print.success('Function Stopped');
  }
}