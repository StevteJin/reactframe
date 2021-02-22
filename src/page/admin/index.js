import React, {Component, Fragment} from 'react';
import "../../style/common.css";
import Header from './indexBank';
import CesiumConent from '../Cesium/index';
import DocumentTitle from "react-document-title";
import {Redirect} from 'react-router-dom';
import Footer from "../footer";
import {actionCreators} from "./store";
import {connect} from "react-redux";
class Index extends Component{
    componentDidMount() {
        this.props.navClick(0);
        console.log(this.props.list);
    }
    render(){
        const User = sessionStorage.getItem('user'); //获取缓存用户名admin用于判断页面有没有登录
        const adminId = sessionStorage.getItem('typeId'); //获取缓存typeId用于判断页面是前台还是后台
        //console.log(adminId);
        if(User !== null && adminId === "1"){
            return(
                <DocumentTitle title="图为视智慧安防三维平台-后台管理">
                    <Fragment>
                        <div className="header"><Header></Header></div>
                        <div className="IndexHome">
                            <div className="left"></div>
                            <div className="right"></div>
                            <div className="conent">
                                <CesiumConent></CesiumConent>
                            </div>
                        </div>
                        <Footer></Footer>
                        <div className="PageShow">
                            <div className="PageShowCont">
                                <h1>保存成功！</h1>
                            </div>
                        </div>
                        <div className="PageShow1 PageShowOne">
                            <div className="PageShowCont">
                                <h1>111</h1>
                                <h2><button onClick={()=>global.Server()}>下载</button><button onClick={()=>global.PageHide()}>关闭</button></h2>
                            </div>
                        </div>
                    </Fragment>
                </DocumentTitle>
            )
        }else{
            return <Redirect to="/login" />
        }
    }
}
const mapState = (state) => {
    return{
        list:state.admin.get('list')
    }
};
const mapDispatch = (dispatch) => ({
    navClick() {
        dispatch(actionCreators.nav_click(30));
    },
});

export default  connect(mapState,mapDispatch)(Index);
