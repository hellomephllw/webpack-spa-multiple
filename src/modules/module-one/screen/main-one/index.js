/**
 * Created by liliwen on 2017/1/8.
 */
import './index.scss';
import header from '../../tile/header/index';
import nav from '../../tile/nav/index';
import footer from '../../tile/footer/index';

let template = require('./index.hbs');

const entry = {
    init() {
        this.initPage();
        this.initEvent();
        this.initComponent();
    },
    initPage() {
        console.log('init screen!!!!');
        let divEle = document.createElement('div');
        divEle.innerHTML = template();
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