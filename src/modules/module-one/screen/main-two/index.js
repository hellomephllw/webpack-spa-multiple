/**
 * Created by liliwen on 2017/1/17.
 */
import header from '../../tile/header/index';
import nav from '../../tile/nav/index';
import table from '../components/table/index';
import footer from '../../tile/footer/index';

import './index.scss';

const mainTwo = {
    init() {
        this.initPage();
        this.initEvent();
        this.initComponent();
    },
    initPage() {
        console.log('main two!!!');
    },
    initEvent() {
    },
    initComponent() {
        header.init();
        nav.init();
        table.init();
        footer.init();
    }
};

mainTwo.init();