/**
 * Created by liliwen on 2017/1/8.
 */
import './index.scss';
import header from '../../../../common/components/header/index';
import nav from '../../components/nav/index';
import footer from '../../components/footer/index';

const entry = {
    init() {
        this.initPage();
        this.initEvent();
        this.initComponent();
    },
    initPage() {
        console.log('init screen!!!!');
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