const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "/"),
        filename: "index.js",
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            },
            {
                test: /\.tsx?$/,
                //loader: ["ts-loader"]
                loader: ["babel-loader"]
            },
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [
            "node_modules"
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            Promise: 'es6-promise-promise',
        }),
        new CopyPlugin([
            { from: './src/images', to: './images' },
        ]),
    ],
};
