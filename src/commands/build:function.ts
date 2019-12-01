import { exec } from 'child_process';

async function sh(cmd): Promise<any> {
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, stdout, stderr) => {
            resolve({ stdout, stderr });
        });
    });
}

module.exports = {
    name: 'build:function',
    description: 'Create a function image',
    run: async toolbox => {
        const { parameters, print: { error, success } } = toolbox;

        const name = parameters.first;

        if (!name) {
            error('Function name must be specified');
            return
        }

        await sh(`docker build -t ${name} .`);
        
        success('Image created')
    }
}