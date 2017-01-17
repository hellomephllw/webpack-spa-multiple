global.rootPath = __dirname;
const
    webpack = require('webpack'),
    webpackConfigUtil = require(`${rootPath}/src/common/lib/webpackConfigUtil`);

var HtmlWebpackPlugin = require('html-webpack-plugin');

//初始化properties配置
webpackConfigUtil.init(webpack);

//webpack配置
module.exports = {
    //入口文件路径配置
    entry: webpackConfigUtil.getWebpackEntry(),
    //输出文件路径配置
    output: {
        path: `${rootPath}/htdocs`,
        publicPath: "/htdocs/",
        filename: '[name].js'
    },
    //模块加载器配置
    module: {
        loaders: [
            //template加载器
            {
                test: /\.(ejs|hbs|vm|jsp|php|blade)/,
                loader: 'ejs-loader'
            },
            //script加载器
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            //image加载器
            {
                test: /\.(png|jp[e]?g|gif)$/,
                loader: 'url-loader?limit=10240&name=images/[name].[hash:5].[ext]'
            },
            //font加载器
            {
                test: /\.(woff|svg|eot|ttf)$/,
                loader: 'url-loader?limit=10240&name=fonts/[name].[hash:5].[ext]'
            },
            //css加载器
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            //sass加载器
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader?sourceMap'
            }
        ]
    },
    //插件配置
    plugins: [
        new HtmlWebpackPlugin({
            filename: `${rootPath}/templates/module-one/screen/main-one/entry.html`,
            template: `${rootPath}/src/modules/module-one/screen/main-one/entry.js`, // 指定为一个js文件而非普通的模板文件
            chunks: ['module-one/js/main-one/index'], // 自动加载上index/login的入口文件以及公共chunk
        })
    ]
};