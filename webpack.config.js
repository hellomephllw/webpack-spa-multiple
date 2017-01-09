global.rootPath = __dirname;
const
    webpack = require('webpack'),
    UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    HtmlWebpackPlugin = require('html-webpack-plugin');

//webpack配置
module.exports = {
    //入口文件路径配置
    entry: {
        'module-one/js/main-one/index': `${rootPath}/src/module-one/screen/main-one/index.js`
    },
    //输出文件路径配置
    output: {
        path: `${rootPath}/htdocs`,
        publicPath: "/htdocs/",
        filename: '[name].js'
    },
    //模块加载器配置
    module: {
        loaders: [
            //script加载器
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            //image加载器
            {
                test: /\.(png|jp[e]?g|gif)$/,
                loader: 'url-loader?limit=1&name=images/[name].[hash:5].[ext]'
            },
            //font加载器
            {
                test: /\.(woff|svg|eot|ttf)$/,
                loader: 'url-loader?limit=1&name=fonts/[name].[hash:5].[ext]'
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
        //压缩js
        // new UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     except: ['$', 'exports', 'require']
        // }),
        //编译html
        new HtmlWebpackPlugin({
            template: `${rootPath}/src/module-one/screen/main-one/index.hbs`,//指定视图
            filename: `${rootPath}/templates/module-one/screen/main-one/index.hbs`,//输出路径和文件名
            hash: true,
            chunks: ['module-one/js/main-one/index']//为视图指定js和css，名字在entry中选一个或多个
        }),
        new HtmlWebpackPlugin({
            template: `${rootPath}/src/module-one/layouts/layout-one/index.hbs`,//指定视图
            filename: `${rootPath}/templates/module-one/layouts/layout-one/index.hbs`,//输出路径和文件名
            chunks: []
        }),
        // new HtmlWebpackPlugin({
        //     filename: `${rootPath}/templates/common/header/header.ejs`,//输出路径和文件名
        //     template: `${rootPath}/src/common/components/header/index.hbs`//指定视图
        // })
    ]
};