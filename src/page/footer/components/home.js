import React,{PureComponent} from 'react';
import '../../../style/common.css';
import {connect} from 'react-redux';
import {actionCreators} from "../store";
import  {Common} from "../../Cesium/method";
import $ from "jquery";

class Home extends PureComponent{
    render(){
        const {clickIcon,index} = this.props;
        return(
            <li type='button' onClick={() => clickIcon(1)}  className={index === 1 ? 'active' :''} >
                <i className="icon1"></i>复位
            </li>

        )
    }
}
const mapState = (state) => {
    return{
        index:state.footer.get('index')
    }
};
const mapDispatch = (dispatch) => ({
    clickIcon(item) {
        //global.sigin()
        dispatch(actionCreators.click_Icon(item));
        Common.onResetCoordinates();
        //关闭地下
        //Common.BuildingShow({show : true});
        //关闭楼层
        $("#liu").css({'display':'none'});
    },

});
export default connect(mapState,mapDispatch)(Home);


