import { exec } from 'child_process';
import * as R from 'ramda';
import axios from 'axios';

async function sh(cmd): Promise<any> {
  return new Promise(function (resolve, reject) {
    exec(cmd, (_err, stdout, stderr) => {
      resolve({ stdout, stderr });
    });
  });
}

module.exports = {
  name: 'call:function',
  description: 'call a function',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.name) {
      print.info('Usage: uni-faas stop:function --name [OPTION]');
    }

    await sh(`docker start ${options.name}`);
    
    try {
      const response = await axios.get(`http://127.0.0.1:8080/api/person`, {
        params: {
          name: 'Wagner'
        }
      });
      print.success(response.data);
    } catch (err) {
      print.error(err);
    }    
  }
}