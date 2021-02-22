import * as actionTypes from './actionTypes';
import { fromJS } from "immutable";

const defaultState = fromJS({
    index:0,
    moreIndex:0,
    moreIndexItem:0
});

export default (state = defaultState, action) => {
    switch(action.type){
        case actionTypes.CLICK_ICON:
            return state.merge({
                index:action.item,
                moreIndex:0,
                moreIndexItem:0,
            });
        case actionTypes.CLICK_ICON_ITEM:
            return state.merge({
                moreIndex:action.item,
                moreIndexItem:0,
            });
        case actionTypes.CLICK_ICON_ITEM_NAV:
            return state.set('moreIndexItem',action.item);
        default:
            return state;
    }
}
