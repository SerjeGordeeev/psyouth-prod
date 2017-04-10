let webpack = require('webpack')

module.exports = {
    context: __dirname + '/app_client',
    entry: {
        app: './main.js'
    },
    output: {
        path: __dirname + '/app_client',
        filename: 'bundle.js'
    },
    module: {
      loaders: [
          {
              test: /\.js/, loader: 'babel',
              query: {
                  presets: ['es2015'],
                  plugins: ['add-module-exports']
              }
          },
          {test: /\.html/, loader: 'html-loader'},
          {test: /\.css$/, loader: 'style!css'},
          {test: /\.scss$/, loader: 'style!css!sass!sass-resources'}
      ]
    },
    sassResources: __dirname + '/app_client/src/styles/mixins.scss',
    watch: true,
    devServer:{
        host: 'localhost',
        port: 8778,
        //contentBase: __dirname + '/public'
        proxy: {
            '*': 'http://localhost:8228'
        }
    }

}