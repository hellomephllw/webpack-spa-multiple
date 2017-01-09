/**
 * Created by liliwen on 2017/1/8.
 */
import koa from 'koa';
import serve from 'koa-static';
import koaRouter from 'koa-router';
import hbs from 'koa-hbs';

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
app.use(hbs.middleware({
    viewPath: `${rootPath}/templates`,
    partialsPath: `${rootPath}/templates`
}));
//路由
app.use(router.routes());

/**路由分发*/
router.get('/moduleone/layoutone', function* () {

    yield this.render('module-one/layouts/layout-one/index');
});

router.get('/demo', function* () {
    yield this.render("demo");
});