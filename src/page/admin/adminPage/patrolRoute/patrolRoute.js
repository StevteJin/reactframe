import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import {Common} from "../../../Cesium/method";
import PatrolRoute1 from '../patrolRoute/patrolRoute1';
import PatrolRoute2 from '../patrolRoute/patrolRoute2';
import PatrolRoute3 from '../patrolRoute/patrolRoute3';


class PatrolRoute extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            isShow:true,
            navItem:0, //下拉菜单id,id为1是巡逻路线，id为,2是巡逻预案

        }
        PatrolRoute.this = this;

    }
    //点击导航下拉菜单事件
    navItemClick(item){
        this.setState({
            isShow:false,
            navItem:item,
        })
    }

    render(){
        const{adminItem,adminIndex,navClick} = this.props;
        const{isShow,navItem} = this.state;
        return(
            <Fragment>
                <li key="5" className={adminItem === 5 ? 'cur' : ''} onClick={ () => navClick(5,3)}>巡逻路线</li>
                <div>
                    {adminItem === 5 && isShow
                        ?
                        <div className="navItem" style={{'left':'562px'}}>
                            <li className={navItem === 1 ? 'cur' : ''} onClick={() => this.navItemClick(1)}>巡逻路线</li>
                            <li className={navItem === 2 ? 'cur' : ''} onClick={() => this.navItemClick(2)}>巡逻预案</li>
                            <li className={navItem === 3 ? 'cur' : ''} onClick={() => this.navItemClick(3)}>漫游路线</li>

                        </div>
                        :''
                    }
                    {adminIndex === 3 && navItem === 1 ? <PatrolRoute1/> :''}
                    {adminIndex === 3 && navItem === 2 ? <PatrolRoute2/> :''}
                    {adminIndex === 3 && navItem === 3 ? <PatrolRoute3/> :''}
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
        PatrolRoute.this.setState({
            navItem:0
        })
        if(id===5){
            PatrolRoute.this.setState({
                isShow:true
            })
        }
    },
});

export default connect(mapState,mapDispatch)(PatrolRoute);