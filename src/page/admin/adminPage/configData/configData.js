import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import ConfigData1 from "../configData/configData1";
import ConfigData2 from "../configData/configData2";
import ConfigData3 from "../configData/configData3";
import ConfigData4 from "../configData/configData4";
import ConfigData5 from "../configData/configData5";
import {Common} from "../../../Cesium/method";

class ConfigData extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            nav:true,//下拉导航显示问题，为true显示为false隐藏
            navItem:0, //下拉菜单id,id为1是建筑分层，id为,2是名称标注,3是自定义图层,4是网格模式,5是地下模式
        };
        this.navItemClick=this.navItemClick.bind(this);
        ConfigData.this=this;
    }
    //点击导航下拉菜单事件
    navItemClick(item){
        this.setState({
            nav:false,
            navItem:item,
        })
        if(item===5){
            let Floors = global.floooList;
            if(Floors.length>0){
                if(!(Floors,Floors[0].model_url.indexOf("DXS")!== -1)){
                    var reg = new RegExp("/","g");
                    var flist = [];
                    for (let i = 0; i <  Floors.length; i++) {
                        if(Floors[i].model_url != null){
                            flist.push ({
                                modelId : Floors[i].model_url.replace(reg,"_"),
                                order_num : Floors[i].order_num,
                            })
                        }
                    }
                    Common.ShowSpecifiedModel(flist);
                }
            }
            Common.BuildingShow({show : false})
        }else{
            Common.BuildingShow({show : true})
        }
    }
    render(){
        const{nav,navItem} = this.state;
        const{adminItem,navClick,adminIndex} = this.props;
        return(
            <Fragment>
                <li key="3" className={adminItem === 3 ? 'cur' : ''} onClick={ () => navClick(3,2)}>数据配置</li>
                {adminItem === 3 && nav
                    ?
                    <div className="navItem" style={{'left':'285px'}}>
                        <li className={navItem === 1 ? 'cur' : ''} onClick={() => this.navItemClick(1)}>建筑分层</li>
                        <li className={navItem === 2 ? 'cur' : ''} onClick={() => this.navItemClick(2)}>地图标注</li>
                        <li className={navItem === 3 ? 'cur' : ''} onClick={() => this.navItemClick(3)}>自定义图层</li>
                        <li className={navItem === 4 ? 'cur' : ''} onClick={() => this.navItemClick(4)}>网格模式</li>
                        <li className={navItem === 5 ? 'cur' : ''} onClick={() => this.navItemClick(5)}>地下模式</li>
                    </div>
                    :""
                }
                {navItem === 1 &&  adminIndex === 2 ? <ConfigData1/> : "" }
                {navItem === 2 &&  adminIndex === 2 ? <ConfigData2/> : "" }
                {navItem === 3 &&  adminIndex === 2 ? <ConfigData3/> : "" }
                {navItem === 4 &&  adminIndex === 2 ? <ConfigData4/> : "" }
                {navItem === 5 &&  adminIndex === 2 ? <ConfigData5/> : "" }
            </Fragment>
        )
    }
}
const mapState = (state) => {
    return{
        adminItem:state.admin.get('adminItem'),
        adminIndex:state.admin.get('adminIndex'),
    }
};
const mapDispatch = (dispatch) => ({
    navClick(id,item) {
        dispatch(actionCreators.nav_click(id,item));
        Common.Close();
        if(id===3){
            ConfigData.this.setState({
                nav:true,
                navItem:0
            })
        }
    },
});

export default connect(mapState,mapDispatch)(ConfigData);