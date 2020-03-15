const HtmlWebPackPlugin = require("html-webpack-plugin");
const JavaScriptObfuscator = require('webpack-obfuscator');
module.exports = (env, argv) => {
    return {
        context: __dirname,
        entry: './src/index.js',
        output:
        {
            path: __dirname + "/public",
            filename: "app.bundle.js"
        },
        watch: true,
        mode: argv.mode,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: __dirname+ "minSrc",
                    enforce: 'post',
                    use: { loader: 'obfuscator-loader', options: {/* options here */} }
                  },
                    {
                        test: /\.jsx?$/,
                        exclude: /(node_modules)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/preset-env', '@babel/preset-react'
                                ],
                                plugins: [
                                    "@babel/plugin-proposal-class-properties"
                                ]
                            }
                        }
                    },
                {
                    test: /\.css$/,
                    loaders: [
                        'style-loader',
                        'css-loader'
                    ]
                },    
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader"
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'react-svg-loader',
                            options: {
                                jsx: true
                            }
                        }]
                }
            ]
        },
        devServer: {
            contentBase: __dirname + "/public",
            hot: true,
           // port:7557
        },
        resolve: {
            extensions: ['.js', '.jsx', '.scss']
        },
        plugins: [
            new HtmlWebPackPlugin(
                {
                    template: "./src/index.html",
                    //     // filename: "./index.html",
                    //     // inject: 'body'
                }),
                new JavaScriptObfuscator({
                    rotateUnicodeArray: true
                }, ['./src/index.js'])
        ]
    }
}