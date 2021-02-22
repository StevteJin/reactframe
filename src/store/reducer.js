import { combineReducers } from "redux";
import { reducer as adminReducer} from '../page/admin/store';
import { reducer as footerReducer} from '../page/footer/store';

const reducer = combineReducers({
    admin:adminReducer,
    footer:footerReducer,
});
export default reducer;