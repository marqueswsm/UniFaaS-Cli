import * as R from 'ramda';

const unik = async (toolbox) => {
  const {
    template,
    print: { success },
  } = toolbox;

  await template.generate({
    template: 'unik/server.ts.ejs',
    target: 'server.js',
  });

  await template.generate({
    template: 'unik/function.ts.ejs',
    target: 'function.js',
  });

  await template.generate({
    template: 'unik/manifest.yaml.ejs',
    target: 'manifest.yaml',
  });

  await template.generate({
    template: 'unik/package.json.ejs',
    target: 'package.json',
  });

  success(`Generated the function template`)
};

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

const osv = async (toolbox) => {
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
    template: 'osv/package.yaml',
    target: 'meta/package.yaml',
  });

  await template.generate({
    template: 'osv/run.yaml',
    target: 'meta/run.yaml',
  });

  await template.generate({
    template: 'osv/function.js',
    target: 'function.js',
  });

  await template.generate({
    template: 'osv/start.js',
    target: 'start.js'
  });

  await template.generate({
    template: 'osv/package.json',
    target: 'package.json'
  })

  success('A function template was generated');
}

module.exports = {
  name: 'generate',
  description: 'Create a function template',
  run: async toolbox => {
    const options = R.path(['parameters', 'options'], toolbox);
    const print   = R.prop('print', toolbox); 

    if (!options.base || !options.name) {
      print.info('Usage: unifaas generate --base [DOCKER | UNIK | OSV] --name [OPTION]');
    }

    if (options.base === 'docker') {
      await docker(toolbox);
    }

    if (options.base === 'unik') {
      await unik(toolbox);
    }

    if (options.base === 'osv') {
      await osv(toolbox);
    }
  }
}