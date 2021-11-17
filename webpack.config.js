const path = require('path')

module.exports={
    devtool: 'eval-source-map',
    mode: 'development',
    entry: '/js/db.js',
    output:{
        path : path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true
}