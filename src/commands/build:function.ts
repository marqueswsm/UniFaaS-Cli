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
  name: 'build:function',
  description: 'Create a function image',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.virt) {
      print.info('Usage: uni-faas build:function --virt [OPTION] --name [OPTION]');
    }

    if (!options.name) {
      print.info('Usage: uni-faas build:function --virt [OPTION] --name [OPTION]');
    }

    if (options.virt === 'docker') {
      await sh(`docker build -t ${options.name} .`);    
      print.info('Image created');
    }

    if (options.virt === 'unik') {
      console.log(await sh('npm install'));
      const response = await sh(`unik build --name ${options.name} --path ./ --base rump --language nodejs --provider virtualbox --force`);
      print.info(response);
    }    
  }
}