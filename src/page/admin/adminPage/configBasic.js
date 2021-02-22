import React,{Fragment,PureComponent} from "react";
import '../../../style/admin.css';
import axios from 'axios';
import {Common} from "../../Cesium/method";
import {connect} from 'react-redux';
import {actionCreators} from "../store";
import $ from "jquery";


class ConfiBasic extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            isToggleOn: false,
            mapSysName:'',
            modelId:'',
            tabNav:0,
            coordinate:[]
        };
        ConfiBasic.this = this;
        this.syaName = this.syaName.bind(this); //地图地址取值
        this.Tab = this.Tab.bind(this); //切换坐标
        this.configSave = this.configSave.bind(this);//保存
    }
    componentDidMount(){
        let self = this;    //为了避免作用域及缓存
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch (e.data.switchName) {
                    //监听视角坐标
                    case 'getCameraView':
                        sessionStorage.setItem('dataZB',this.JSON.stringify(e.data.cv,null,4));
                        sessionStorage.setItem('dataZB1',e.data.cv);
                        console.log(sessionStorage.getItem('dataZB'));
                        self.setState({
                            coordinate:sessionStorage.getItem('dataZB')   //2.给变量赋值
                        })
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    };
    //系统名称
    syaName = (event) => {
        this.setState({
            mapSysName: event.target.value
        });
    }
    Tab(id){
        this.setState({
            tabNav:id
        })
        switch (id) {
            case 0:
                Common.onRetrospectiveCameraView();
                this.setState({
                    coordinate:sessionStorage.getItem('dataZB')
                })
                break;
            case 1:
                Common.onCoordinate();
                this.setState({
                    coordinate:sessionStorage.getItem('dataZB')
                })
                break;
            default:
                return null;
        }
    }
    //保存
    configSave = (mapSysName,coordinate) => {
        axios.post(global.Url+'sys/config/updateBase',{
            sys_name:mapSysName,
            center_location:JSON.parse(coordinate)
        })
            .then(function (res) {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    $(".PageShow").show();
                    global.Time();
                    this.setState({
                        mapSysName:result.sys_name,
                        coordinate:result.center_location
                    });
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            this.props.navClick(100);
    }
    render(){
        const {mapSysName,tabNav,coordinate} = this.state;
        const{adminItem,navClick} = this.props;
        return(
            <Fragment>
                <li key="2" className={adminItem === 2 ? 'cur' : ''} onClick={() => navClick(2)}>基础配置</li>
                {adminItem === 2
                    ?
                    <div className="configShow Basic">
                        <div className="configShowNav">基础配置 <i onClick={() => navClick(100)}></i></div>
                        <div className="configShowConent">
                            <div className="configShowConent_cont">
                                <ul>
                                    <li><span>系统名称：</span><input type="text" value={mapSysName} onChange={(event) => this.syaName(event)} /></li>
                                    <li>
                                        <span>初始位置：</span>
                                        <div className='newNav'>
                                            <ul>
                                                <li key="nav1" className={tabNav===0?'cur':''} onClick={() => this.Tab(0)}>坐标定位</li><li key="nav2" className={tabNav===1?'cur':''} onClick={() => this.Tab(1)}>当前位置</li>
                                            </ul>
                                            <div className="liCont">{coordinate}</div>
                                         </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="configBut"><button onClick={() => this.configSave(mapSysName,coordinate)}>保存</button></div>
                        </div>
                    </div>
                    :''
                }
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
    navClick(item) {
        Common.Close();
        dispatch(actionCreators.nav_click(item));
        axios.get(global.Url+'sys/config').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                sessionStorage.setItem('mapSysName',result.sys_name);
                sessionStorage.setItem('dataZB',JSON.stringify(result.center_location));
                ConfiBasic.this.setState({
                    mapSysName:sessionStorage.getItem('mapSysName'),
                    coordinate:JSON.stringify(result.center_location),
                })

            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    },
});
export default connect(mapState,mapDispatch)(ConfiBasic);