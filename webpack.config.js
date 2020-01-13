let HTMLWebpackPlugin = require('html-webpack-plugin');
let HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body',
});
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {
    // call dotenv and it will return an Object with a parsed key 
    const env = dotenv.config().parsed;
    
    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
    }, {});

    return {
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
    plugins:[
        HTMLWebpackPluginConfig,
        new webpack.DefinePlugin(envKeys)
    ]
    }
}