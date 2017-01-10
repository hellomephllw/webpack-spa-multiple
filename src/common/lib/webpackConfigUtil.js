/**
 * Created by liliwen on 2017/1/9.
 */
const
    fs = require('fs'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

const filePath = {
    config: {
        entryScript: `${rootPath}/src/config/entry.script.properties`,
        bindTemplate: `${rootPath}/src/config/bind.template.properties`
    },
    template: {
        ext: 'hbs',
        commonPath: '',
        path: `${rootPath}/src/modules`
    }
};

let webpackConfigUtil = {
    /**初始化*/
    init(webpack) {
        this.webpack = webpack;
        this._initEntries();
        this._initPlugins();
    },
    /**webpack*/
    webpack: null,
    /**初始化需要导入页面的js，还包括*/
    _initEntries() {
        //生成properties对象
        let properties = this._getProperties(filePath.config.entryScript);
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
        this._plugins = plugins.concat(this._HtmlWebpackPlugins);
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
                let filePath = `${rootDir}/${name}`,
                    isFile = fs.statSync(filePath).isFile();
                if (isFile) templatePaths.push(filePath);
                else listDirectory(filePath);
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
                    lists = templatePath.split('/src/modules/'),
                    distPath = `${lists[0]}/templates/${lists[1]}`;

                templateDistPaths.push(distPath);
            }
        };
        //生成tempOption的key
        let generateTempOptionKey = srcPath => '/src/modules/' + srcPath.split('src/modules/')[1];
        //初始化tempOptions
        let generateTempOptions = () => {
            for (let i = 0, len = templatePaths.length; i < len; ++i) {
                let tempOption = {};
                tempOption['template'] = templatePaths[i];
                tempOption['filename'] = templateDistPaths[i];
                tempOption['key'] = generateTempOptionKey(templatePaths[i]);

                tempOptions.push(tempOption);
            }
        };

        //执行
        listDirectory(filePath.template.path);
        reserveTemplate(filePath.template.ext);
        generateDistPath();
        generateTempOptions();
    },
    /**为template指定相关js*/
    _bindScriptToTemplate(tempOptions) {
        let properties = this._getProperties(filePath.config.bindTemplate);

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
            newProperties[key] = `${rootPath}/${properties[key]}`;
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