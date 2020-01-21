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
  name: 'call',
  description: 'call a function',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.base || !options.name) {
      print.info('Usage: unifaas call --virt [DOCKER | UNIK | OSV] --name [OPTION]');
    }

    if (options.base === 'docker') {
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
        const response = await axios.get(`http://127.0.0.1:8080/api/${options.name}?name=wagner`);
        print.success(response.data);
      } catch (err) {
        print.error(err);
      }    
    }  

    if (options.base === 'unik') {
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

    if (options.base === 'osv') {
      console.log(await sh(`capstan run -f 3000:3000 &`));

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
        const response = await axios.get(`http://127.0.0.1:3000/?name=wagner`);
        print.success(response.data);
      } catch (err) {
        print.error(err);
      }    
    }
  }
}