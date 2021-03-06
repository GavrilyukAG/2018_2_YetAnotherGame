const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin")

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./public/js/main.js",
    output: {
        filename: "build.js",
        path: path.join(__dirname, "public/out")
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }, {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader"
            ]
        }, {
            test: /\.(png|jpg|svg|ttf)$/,
            use: {
               loader: "url-loader",
               options: {
                   name: "[path][name].[ext]",
                   limit: 1500,
               },
            },
            // loader: "url-loader?name=[path][name].[ext]&limit=4096"
        }, {
            test: /\.xml$/,
            use: [{
                // loader: "fest-loader"
                loader: "fest-webpack-loader"
            }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
        new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, "public/sw.js"),
        }),
    ],
    node: {
        fs: "empty"
    }
}
