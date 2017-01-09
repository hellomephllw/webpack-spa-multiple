/**
 * Created by liliwen on 2017/1/9.
 */
const fs = require('fs');

let webpackConfigUtil = {
    /**初始化*/
    init() {
        this.initEntries();
        this.moveTemplates();
    },
    /**初始化需要导入页面的js，还包括*/
    initEntries() {
        //生成properties对象
        let properties = this._getProperties(`${rootPath}/src/config/entry.script.properties`);
        //为properties的所有value的开头添加rootpath
        properties = this._addRootPathToValue(properties);
        //为key的所有结尾增加文件名称
        properties = this._addScriptFileName(properties);
        //初始化入口js
        this._entry = properties;
    },
    /**转移template*/
    moveTemplates() {

    },
    /**入口js*/
    _entry: {},
    /**获取入口*/
    getWebpackEntry() {
        return this._entry;
    },
    /**读取properties文件*/
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
    /**为properties对象的所有value的开头添加rootpath*/
    _addRootPathToValue(properties) {
        for (let key in properties) {
            properties[key] = `${rootPath}/${properties[key]}`;
        }

        return properties;
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