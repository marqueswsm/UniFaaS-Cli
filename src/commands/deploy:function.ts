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
  name: 'deploy:function',
  description: 'Deploy a function image',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.virt) {
      print.info('Usage: uni-faas deploy:function --virt [OPTION] --name [OPTION]');
    }

    if (!options.name) {
      print.info('Usage: uni-faas deploy:function --virt [OPTION] --name [OPTION]');
    }

    if (options.virt === 'docker') {
      await sh(`docker run --name ${options.name} -p 8080:80 -d -t ${options.name} `);
    
      print.success('Function Deployed');
      print.info(`http://localhost:8080/api/${options.name}`)
    }  
    
    if (options.virt === 'unik') {
      const response = await sh(`unik run --instanceName ${options.name} --imageName ${options.name} `);
    
      print.success('Function Deployed');
      print.info(response);
    } 
  }
}