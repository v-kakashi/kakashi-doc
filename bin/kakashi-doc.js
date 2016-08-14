#!/usr/bin/env node

var cp = require('child_process')

function start () {
  const p = cp.fork(__dirname + '/kakashi-doc', process.argv.slice(2))
  p.on('message', function (data) {
    if (data === 'restart') {
      p.kill('SIGINT')
      start()
    }
  })
}

if (!process.send) {
  start()
} else {
  var program = require('commander')
  program
    .command('install [template]')
    .action(function (template) {
      require('../lib/loadDownTemplate')(template)
    })

  program
    .version(require('../package').version, '-v, --version')
    .command('doc')
    .option('--dest <dir>', 'config path of output dir, default __site', '__site')
    .option('--source <dir>', 'config path of demo files dir, default examples', 'examples')
    .option('--asset <dir>', 'config path of static resource, default statics', './tmp/static')
    .option('--tpl <path>', 'config path or name of tpl file', './tmp/tpl/element.ejs')
    .option('--config <path>', 'config path of webpack.config, default webpack.config.js', 'webpack.config.js')
    .option('--port <number>', 'specify server port, default 8002', '7788')
    .option('--build', 'only build')
    .option('-w, --watch', 'using with --build, watch mode')
    .action(function (options) {
      options.cwd = process.cwd()
      require('../lib/doc')(options)
    })

  program.parse(process.argv)
  require('atool-monitor').emit()
}
