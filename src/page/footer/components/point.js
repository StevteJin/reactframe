import React,{PureComponent} from 'react';
import {actionCreators} from "../store";
import {connect} from "react-redux";
import '../../../style/common.css';
import {Common} from "../../Cesium/method";
import $ from "jquery";

class Point extends PureComponent{
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
            <li onClick={() => {clickIcon(5);this.changeStatus()}} className={activeBtn  && index === 5  ? 'active' :''} >
                <i className="icon5"></i>指北
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
    clickIcon(item) {
        dispatch(actionCreators.click_Icon(item));
       // console.log(111,$("#core_content").html(),global.GuangUrl+'?number='+new Date().getTime())
        //$("#core_content").src='http://www.baidu.com';
        Common.onNorth();//指北
        //关闭地下
        //Common.BuildingShow({show : true});
        //关闭楼层
        $("#liu").css({'display':'none'});
    }
});
export default connect(mapState,mapDispatch)(Point);

