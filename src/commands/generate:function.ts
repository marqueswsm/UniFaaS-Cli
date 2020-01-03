import * as R from 'ramda';

const docker = async (toolbox) =>  {
  const {
    parameters: { options },
    template,
    print: { success, error },
  } = toolbox;

  const name = R.prop('name', options);

  if (!name) {
    error('Function name must be specified');
    return
  }

  await template.generate({
    template: 'docker/template.ts.ejs',
    target: `${name}/index.js`,
  });

  await template.generate({
    template: 'docker/conf.json.ejs',
    target: `${name}/function.json`,
  });

  await template.generate({
    template: 'docker/dockerfile.ejs',
    target: `Dockerfile`,
  });

  await template.generate({
    template: 'docker/host.json.ejs',
    target: 'host.json',
  });

  await template.generate({
    template: 'docker/local.settings.json.ejs',
    target: 'local.settings.json',
  });

  await template.generate({
    template: 'docker/package.json.ejs',
    target: 'package.json'
  });

  success(`Generated a function called ${name}`)
};

module.exports = {
  name: 'generate:function',
  description: 'Create a function template',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.virt || !options.name) {
      print.info('Usage: uni-faas generate:function --virt [DOCKER | UNIK] --name [OPTION]');
    }

    if (options.virt === 'docker') {
      await docker(toolbox);
    }

    if (options.virt === 'unik') {
      console.log('Not yet');
    }
  }
}