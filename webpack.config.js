global.rootPath = __dirname;
const
    webpack = require('webpack'),
    webpackConfigUtil = require('./src/common/lib/webpadckConfigUtil');

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
    plugins: webpackConfigUtil.getPlugins()
};