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

    if (!options.virt) {
      print.info('Usage: uni-faas call:function --virt [OPTION] --name [OPTION]');
    }

    if (!options.name) {
      print.info('Usage: uni-faas call:function --virt [OPTION] --name [OPTION]');
    }

    if (options.virt === 'docker') {
      await sh(`docker start ${options.name}`);

      axios.interceptors.response.use((response) => {
        return response;
      },(error) => {
        if (error.code === 'ECONNRESET') {     
          const requestConfig = error.config;
          return axios(requestConfig);
        }
        return Promise.reject(error);
      });    
      
      try {
        const response = await axios.get(`http://127.0.0.1:8080/api/${options.name}?number=43`);
        print.success(response.data);
      } catch (err) {
        print.error(err);
      }    
    }  

    if (options.virt === 'unik') {
      await sh(`unik start --instance ${options.name}`);

      axios.interceptors.response.use((response) => {
        return response;
      },(error) => {
        if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {     
          const requestConfig = error.config;
          return axios(requestConfig);
        }
        return Promise.reject(error);
      });   

      try {
        const response = await axios.get(`http://192.168.0.104:8080/?number=43`);
        print.success(response.data);
      } catch (err) {
        print.error(err);
      }    
    }  
  }
}