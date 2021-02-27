import React,{PureComponent} from 'react';
import {actionCreators} from "../store";
import {connect} from "react-redux";
import '../../../style/common.css';
import {Common} from "../../Cesium/method";
import $ from "jquery";

class Dimension extends PureComponent{
    constructor(){
        super()
        this.state ={
            activeBtn:false
        }
        this.changeStatus = this.changeStatus.bind(this)
    }
    changeStatus(){
        this.setState({
            activeBtn:!this.state.activeBtn
        })
    }
    render(){
        const {clickIcon,index} = this.props;
        const {activeBtn} = this.state;
        return(
            <li onClick={() => {clickIcon(6,activeBtn);this.changeStatus()}} className={activeBtn && index === 6  ? 'active' :''} >
                <i className="icon6"></i>
                <span>{activeBtn?'二维':"三维"}</span>
            </li>
        )
    }
}
const mapState = (state) => {
    return{
        index:state.footer.get('index'),
    }
};
const mapDispatch = (dispatch) => ({
    clickIcon(item,activeBtn) {
        Common.dimension(activeBtn);
        dispatch(actionCreators.click_Icon(item));
        $("#liu").css({'display':'none'});
    }
});
export default connect(mapState,mapDispatch)(Dimension);

