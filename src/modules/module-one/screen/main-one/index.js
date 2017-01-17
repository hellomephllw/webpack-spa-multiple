/**
 * Created by liliwen on 2017/1/8.
 */
import './index.scss';
import header from '../../../../common/components/header/index';
import nav from '../../components/nav/index';
import footer from '../../components/footer/index';

let page = require('./index.hbs');

const entry = {
    init() {
        this.initPage();
        this.initEvent();
        this.initComponent();
    },
    initPage() {
        console.log('init screen!!');
        let divEle = document.createElement('div');
        divEle.innerHTML = page();
        document.body.appendChild(divEle);
    },
    initEvent() {

    },
    initComponent() {
        header.init();
        nav.init();
        footer.init();
    }
};

entry.init();