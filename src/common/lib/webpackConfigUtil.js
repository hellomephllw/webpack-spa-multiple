/**
 * Created by liliwen on 2017/1/9.
 */
'use strict';
const
    fs = require('fs'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

const coreInfo = {
    //properties文件路径配置
    config: {
        basicCore: `${rootPath}/src/config/basic.core.properties`,
        entryScript: `${rootPath}/src/config/entry.script.properties`,
        bindTemplate: `${rootPath}/src/config/bind.template.properties`
    },
    //模版信息配置
    template: {
        commonPath: `${rootPath}/src/common/components`,
        path: `${rootPath}/src/modules`
    },
    //基础信息(默认值)
    basic: {
        static: true,
        ext: 'html',
        compress: false
    }
};

let webpackConfigUtil = {
    /**初始化*/
    init(webpack) {
        this.webpack = webpack;
        this._initCoreInfo();
        this._initEntries();
        this._initPlugins();
    },
    /**初始化基础信息*/
    _initCoreInfo() {
        //读取配置信息
        let properties = this._getProperties(coreInfo.config.basicCore);

        //初始化coreInfo.basic对象
        for (let key in properties) {
            for (let innerKey in coreInfo.basic) {
                if (key == innerKey) {
                    coreInfo.basic[innerKey] = properties[key];
                }
            }
        }
        //保证static为true的时候，ext一定为html
        if (coreInfo.basic.static == 'true') {
            coreInfo.basic.ext = 'html';
        }
    },
    /**webpack*/
    webpack: null,
    /**初始化需要导入页面的js，还包括*/
    _initEntries() {
        //生成properties对象
        let properties = this._getProperties(coreInfo.config.entryScript);
        //为properties的所有value的开头添加rootpath
        properties = this._addRootPathToValue(properties);
        //为key的所有结尾增加文件名称
        properties = this._addScriptFileName(properties);
        //初始化入口js
        this._entry = properties;
    },
    /**插件集合*/
    _plugins: [],
    /**获取插件*/
    getPlugins() {
        return this._plugins;
    },
    /**初始化插件*/
    _initPlugins() {
        let plugins = [];
        this._initHtmlWebpackPlugin();
        if (coreInfo.basic.compress != 'false') this._initUglifyJsPlugin();
        this._initExtractTextPlugin();
        this._plugins = plugins.concat(this._HtmlWebpackPlugins, this._UglifyJsPlugin, this._ExtractTextPlugin);
    },
    /**HtmlWebpackPlugins*/
    _HtmlWebpackPlugins: [],
    /**初始化HtmlWebpackPlugin插件*/
    _initHtmlWebpackPlugin() {
        let options = [],
            tempOptions = [];
        this._moveTemplates(tempOptions);
        this._bindScriptToTemplate(tempOptions);
        this._generateHtmlWebpackPluginOptions(options, tempOptions);
        this._HtmlWebpackPlugins = options.map(option => new HtmlWebpackPlugin(option));
    },
    /**转移template，实际上只是生成了所有template的src和dist的映射关系*/
    _moveTemplates(tempOptions) {
        //模板路径
        let templatePaths = [],
            //模板输出路径
            templateDistPaths = [];
        //递归遍历出所有的文件
        let listDirectory = rootDir => {
            //读取所有文件
            let fileNames = fs.readdirSync(rootDir);
            //遍历获取所有路径
            fileNames.map(name => {
                let coreInfo = `${rootDir}/${name}`,
                    isFile = fs.statSync(coreInfo).isFile();
                if (isFile) templatePaths.push(coreInfo);
                else listDirectory(coreInfo);
            });
        };
        //保留模板
        let reserveTemplate = ext => {
            let newTemplatePaths = [];
            templatePaths.map(templatePath => {
                let lists = templatePath.split('/'),
                    fileName = lists[lists.length - 1];

                if (ext == fileName.split('\.')[1]) {
                    newTemplatePaths.push(templatePath);
                }
            });
            templatePaths = newTemplatePaths;
        };
        //生成输出路径
        let generateDistPath = () => {
            for (let i = 0, len = templatePaths.length; i < len; ++i) {
                let templatePath = templatePaths[i],
                    isModules = /^.+\/src\/modules\/.*$/.test(templatePath),
                    lists = isModules ? templatePath.split('/src/modules/') : templatePath.split('/src/common/'),
                    distPath = isModules ? `${lists[0]}/templates/${lists[1]}` : `${lists[0]}/templates/common/${lists[1]}`;

                //去掉文件夹，把源码文件夹目录的名称替换为文件名称
                lists = distPath.split('/');
                let filePath = lists.splice(0, lists.length - 1).join('/'),
                    ext = lists[lists.length - 1].split('.')[1];
                distPath = `${filePath}.${ext}`;

                templateDistPaths.push(distPath);
            }
        };
        //生成tempOption的key
        let generateTempOptionKeyForModule = srcPath => '/src/modules/' + srcPath.split('src/modules/')[1];
        let generateTempOptionKeyForCommon = srcPath => '/src/common/' + srcPath.split('src/common/')[1];
        //初始化tempOptions
        let generateTempOptions = () => {
            for (let i = 0, len = templatePaths.length; i < len; ++i) {
                let tempOption = {},
                    isModules = /^.+\/src\/modules\/.*$/.test(templatePaths[i]);
                tempOption['template'] = templatePaths[i];
                tempOption['filename'] = templateDistPaths[i];
                tempOption['key'] = isModules ? generateTempOptionKeyForModule(templatePaths[i]) : generateTempOptionKeyForCommon(templatePaths[i]);

                tempOptions.push(tempOption);
            }
        };

        //执行
        listDirectory(coreInfo.template.path);
        // listDirectory(coreInfo.template.commonPath);
        reserveTemplate(coreInfo.basic.ext);
        generateDistPath();
        generateTempOptions();
    },
    /**为template指定相关js*/
    _bindScriptToTemplate(tempOptions) {
        let properties = this._getProperties(coreInfo.config.bindTemplate);

        //添加chunks属性
        tempOptions.map(tempOption => {
            //添加chunks属性
            tempOption['chunks'] = [];

            //为部分template指定js
            for (let key in properties) {
                if (key == tempOption['key']) {

                    tempOption['chunks'].push(`${properties[key]}/index`);
                    break;
                }
            }
        });
    },
    /**生成HtmlWebpackPlugin的参数*/
    _generateHtmlWebpackPluginOptions(options, tempOptions) {
        tempOptions.map(tempOption =>
            options.push({
                template: tempOption['template'],
                filename: tempOption['filename'],
                hash: true,
                chunks: tempOption['chunks']
            })
        );
    },
    /**UglifyJsPlugin*/
    _UglifyJsPlugin: [],
    /**初始化UglifyJsPlugin*/
    _initUglifyJsPlugin() {
        this._UglifyJsPlugin.push(new this.webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$', 'jQuery', 'exports', 'require', 'd3', 'module']
        }));
    },
    /**ExtractTextPlugin*/
    _ExtractTextPlugin: [],
    /**初始化ExtractTextPlugin*/
    _initExtractTextPlugin() {
        this._ExtractTextPlugin.push(new ExtractTextPlugin('[name].css'));
    },
    /**入口js*/
    _entry: {},
    /**获取入口*/
    getWebpackEntry() {
        return this._entry;
    },
    /**读取properties文件的键值对*/
    _getProperties(path) {
        let content = fs.readFileSync(path, 'utf8'),
            lineBreak = '',
            properties = {};

        //因不同操作系统可能在换行上出现差异
        if (content.indexOf('\r\n') !== -1) lineBreak = '\r\n';
        else if (content.indexOf('\n') !== -1) lineBreak = '\n';
        else if (content.indexOf('\r') !== -1) lineBreak = '\r';

        //按换行拆分
        let propertiesContent = content.split(lineBreak);

        //去除注释和空行
        propertiesContent = propertiesContent.filter(str => str.slice(0, 1) !== '#' && str.trim() !== '');

        propertiesContent.map(ele => {
            let props = ele.trim().split('='),
                key = props[0].trim(),
                val = props[1].trim();

            properties[key] = val;
        });

        return properties;
    },
    /**读取properties文件的单行信息*/
    _getSingleLineValues() {
        let content = fs.readFileSync(path, 'utf8'),
            lineBreak = '',
            paths = '';

        //因不同操作系统可能在换行上出现差异
        if (content.indexOf('\r\n') !== -1) lineBreak = '\r\n';
        else if (content.indexOf('\n') !== -1) lineBreak = '\n';
        else if (content.indexOf('\r') !== -1) lineBreak = '\r';

        //按换行拆分
        paths = content.split(lineBreak);

        //去除注释和空行
        paths = paths.filter(str => str.slice(0, 1) !== '#' && str.trim() !== '');

        //去除多余空白
        paths = paths.map(path => path.trim());

        return paths;
    },
    /**为properties对象的所有value的开头添加rootpath*/
    _addRootPathToValue(properties) {
        let newProperties = {};
        for (let key in properties) {
            newProperties[key] = `${rootPath}${properties[key]}`;
        }

        return newProperties;
    },
    /**为properties对象的所有key的结尾添加index，意味着输出为index.js*/
    _addScriptFileName(properties) {
        let newProperties = {};
        for (let key in properties) {
            newProperties[`${key}/index`] = properties[key];
        }

        return newProperties;
    }
};

module.exports = webpackConfigUtil;