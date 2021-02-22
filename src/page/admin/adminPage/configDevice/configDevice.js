import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import ConfigDevice1 from './configDevice1';
import ConfigDevice2 from './configDevice2';
import ConfigDevice3 from './configDevice3';
import ConfigDevice4 from './configDevice4';
import {Common} from "../../../Cesium/method";

class ConfigDevice extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            nav:true,//下拉导航显示问题，为true显示为false隐藏
            navItem:0, //下拉菜单id,id为1是类别管理，id为,2是设备上图
        };
        this.navItemClick=this.navItemClick.bind(this);
        ConfigDevice.this=this;
    }
    //点击导航下拉菜单事件
    navItemClick(item){
        this.setState({
            nav:false,
            navItem:item,
        })
    }
    render(){
        const{nav,navItem} = this.state;
        const{adminItem,navClick,adminIndex} = this.props;
        return(
            <Fragment>
                <li key="4" className={adminItem === 4 ? 'cur' : ''} onClick={ () => navClick(4,1)}>设备配置</li>
                <div>
                    {adminItem === 4 && nav
                        ?
                        <div className="navItem">
                            <li className={navItem === 1 ? 'cur' : ''} onClick={() => this.navItemClick(1)}>类别管理</li>
                            <li className={navItem === 2 ? 'cur' : ''} onClick={() => this.navItemClick(2)}>设备上图</li>
                            <li className={navItem === 3 ? 'cur' : ''} onClick={() => this.navItemClick(3)}>定位上图</li>
                            <li className={navItem === 4 ? 'cur' : ''} onClick={() => this.navItemClick(4)}>监区上图</li>
                        </div>
                        :''
                    }
                    {adminIndex ===1 && navItem === 1 ? <ConfigDevice1/> :''}
                    {adminIndex ===1 && navItem === 2 ? <ConfigDevice2/> :''}
                    {adminIndex ===1 && navItem === 3 ? <ConfigDevice3/> :''}
                    {adminIndex ===1 && navItem === 4 ? <ConfigDevice4/> :''}
                </div>

            </Fragment>
        )
    }
}
const mapState = (state) => {
    return{
        adminItem:state.admin.get('adminItem'),
        adminIndex:state.admin.get('adminIndex')
    }
};
const mapDispatch = (dispatch) => ({
    navClick(id,item) {
        Common.Close();
        dispatch(actionCreators.nav_click(id,item));
        ConfigDevice.this.setState({
            navItem:0
        })
        if(id===4){
            ConfigDevice.this.setState({
                nav:true
            })
        }
    },
});

export default connect(mapState,mapDispatch)(ConfigDevice);