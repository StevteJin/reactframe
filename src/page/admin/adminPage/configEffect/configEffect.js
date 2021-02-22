import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import {Common} from "../../../Cesium/method";
import ConfigEffect1 from "./configEffect1";


class ConfigEffect extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            Display:false,//下拉导航显示问题，为true显示为false隐藏
            Item:0,//下拉菜单id,id为1是可视区域
        }
        ConfigEffect.this=this;
        this.navItemClick = this.navItemClick.bind(this);
    }
    navItemClick(item){
        console.log(item);
        ConfigEffect.this.setState({
            Display:false,
            Item:item
        })
    }
    render(){
        const {Display,Item} = this.state;
        const{adminItem,navClick,adminIndex} = this.props;
        return(
            <Fragment>
                <li key="6" className={adminItem === 6 ? 'cur' : ''} onClick={ () => navClick(6,4)}>特效配置</li>
                <div>
                    {adminItem === 6 && Display
                        ?
                        <div className="navItem" style={{'left':'700px'}}>
                            <li className={Item === 1 ? 'cur' : ''} onClick={() => this.navItemClick(1)}>可视区域</li>
                        </div>
                        :''
                    }
                    {adminIndex === 4 && Item === 1 ? <ConfigEffect1/> :''}
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
        dispatch(actionCreators.nav_click(id,item));
        Common.Close();
        ConfigEffect.this.setState({
            Display:true
        })
    },
});

export default connect(mapState,mapDispatch)(ConfigEffect);