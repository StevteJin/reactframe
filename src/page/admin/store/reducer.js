import * as actionTypes from './actionTypes';
import { fromJS } from "immutable";

const defaultState = fromJS({
    adminItem:0, //一级菜单
    adminIndex:0, //二级菜单 为1为设备配置的二级菜单,为2为数据配置的二级菜单
    adminIndexItem:0,
});
export default (state = defaultState, action) => {
    switch(action.type){
        case actionTypes.CLICK_NAV:
            return state.merge({
                adminItem:action.id,
                adminIndex:action.item,
                adminIndexItem:0
            });
        default:
            return state;
    }
}