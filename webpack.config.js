let HTMLWebpackPlugin = require('html-webpack-plugin');
let HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body',
});

module.exports = {
    entry: __dirname +'/app/index.tsx',
    module:{
        rules:[
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },            
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        { 
            test: /\.scss$/, 
            use: [ "style-loader", "css-loader", "sass-loader" ] 
        },
        {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        }
    ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js",".jsx"]
    },
    output:{
        filename: 'transformed.js',
        path: __dirname + '/build'
    },
    plugins:[HTMLWebpackPluginConfig]
}