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
  name: 'build',
  description: 'Create a function image',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.name || !options.base) {
      print.info('Usage: unifaas build --base [DOCKER | UNIK | OSV] --name [OPTION]');
    }

    if (options.base === 'docker') {
      // await sh(`docker rmi ${options.name}`);
      const response = await sh(`docker build -t ${options.name} .`);
      print.info(response);
    }

    if (options.base === 'unik') {
      console.log(await sh('npm install'));
      const response = await sh(`unik build --name ${options.name} --path ./ --base rump --language nodejs --provider virtualbox --force`);
      print.info(response);
    }
    
    if (options.base === 'osv') {
      console.log(await sh('npm install'));
      const response = await sh(`capstan package compose ${options.name}`);
      print.info(response);
    }
  }
}