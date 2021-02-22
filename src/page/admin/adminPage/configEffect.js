import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../store";
import {Common} from "../../Cesium/method";

class ConfigEffect extends PureComponent{
    render(){
        const{adminItem,navClick} = this.props;
        return(
            <Fragment>
                <li key="6" className={adminItem === 6 ? 'cur' : ''} onClick={ () => navClick(6)}>特效配置</li>
{/*                {adminItem === 6
                    ?
                    <div>特效配置</div>
                    :""
                }*/}
            </Fragment>
        )
    }
}
const mapState = (state) => {
    return{
        adminItem:state.admin.get('adminItem')
    }
};
const mapDispatch = (dispatch) => ({
    navClick(id) {
        dispatch(actionCreators.nav_click(id));
        Common.Close();
    },
});

export default connect(mapState,mapDispatch)(ConfigEffect);