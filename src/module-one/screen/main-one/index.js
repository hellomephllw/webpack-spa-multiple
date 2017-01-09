/**
 * Created by liliwen on 2017/1/8.
 */
import './index.scss';
import header from '../../../common/components/header/index';

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
    }
};

entry.init();