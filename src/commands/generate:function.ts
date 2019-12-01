module.exports = {
    name: 'generate:function',
    description: 'Create a template function inside the current folder',
    run: async toolbox => {
        const {
            parameters,
            template,
            print: { success, error },
        } = toolbox;

        const name = parameters.first;

        if (!name) {
            error('Function name must be specified');
            return
        }

        await template.generate({
            template: 'template.ts.ejs',
            target: `${name}/index.js`,
        });

        await template.generate({
            template: 'conf.json.ejs',
            target: `${name}/function.json`,
        });

        await template.generate({
            template: 'dockerfile.ejs',
            target: `Dockerfile`,
        })

        await template.generate({
            template: 'host.json.ejs',
            target: 'host.json',
        })

        await template.generate({
            template: 'local.settings.json.ejs',
            target: 'local.settings.json',
        })

        await template.generate({
            template: 'package.json.ejs',
            target: 'package.json'
        })

        success(`Generated a function called ${parameters.first}`)
    }
}