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
  name: 'deploy',
  description: 'Deploy a function image',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.name || !options.base) {
      print.info('Usage: unifaas deploy --base [DOCKER | UNIK | OSV] --name [OPTION]');
    }

    if (options.base === 'docker') {
      await sh(`docker rm ${options.name} --force`);
      await sh(`docker run --name ${options.name} --memory 256m -p 8080:80 -d -t ${options.name} `);
    
      print.success('Function Deployed');
      print.info(`http://localhost:8080/api/${options.name}`)
    }  
    
    if (options.base === 'unik') {
      const response = await sh(`unik run --instanceName ${options.name} --imageName ${options.name} ${ options.memory ? `--instanceMemory ${options.memory}` : ''}`);
    
      print.success('Function Deployed');
      print.info(response);
    }

    if (options.base === 'osv') {
      const response = sh(`capstan run -f 3000:3000`);

      print.success('Function are running!')
      print.info(response);
    }
  }
}