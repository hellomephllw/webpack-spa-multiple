/**
 * Created by liliwen on 2017/1/8.
 */
import koa from 'koa';
import serve from 'koa-static';
import koaRouter from 'koa-router';
import render from 'koa-ejs';

/**初始化*/
global.rootPath = __dirname;
const
    app = koa(),
    router = koaRouter();

/**启动服务*/
app.listen(3000);
console.log('web服务器在3000端口启动！');

/**中间件*/
//静态目录
app.use(serve(`${rootPath}/assets/`));
//视图
render(app, {
    root: `${rootPath}/src`,
    layout: false,//false不使用默认ejs页面
    viewExt: 'ejs'//默认扩展名
});
//路由
app.use(router.routes());

/**路由分发*/
router.get('/init', function* () {
    console.log('init');
    this.body = 'heihei';
});

router.get('', function* () {
    yield this.render("demo");
});