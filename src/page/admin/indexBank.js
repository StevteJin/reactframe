import React,{Fragment,Component} from "react";
import "../../style/common.css";
import Configure from '../admin/adminPage/configure';
import ConfigBasic from '../admin/adminPage/configBasic';
import ConfigData from './adminPage/configData/configData';
import axios from "axios";
import ConfigDevice from "./adminPage/configDevice/configDevice";
import PatrolRoute from "./adminPage/patrolRoute/patrolRoute";
import ConfigEffect from "./adminPage/configEffect/configEffect";
import ConfigAlarm from "./adminPage/configAlarm";
import {Link} from "react-router-dom";
import $ from "jquery";

class Header extends Component{
    constructor(props){
        super(props);
        this.state=({
            success:false,
            adminTitle:"",//sessionStorage.getItem('adminTitle')
            adminUser:sessionStorage.getItem('userName')//sessionStorage.getItem('userName')
        });
    }
    componentDidMount(){
        this.HQstate();
        this.HQConfig();
    }
    //获取平台配置状态
    HQstate(){
        axios.get(global.Url+'sys/config/isConfig').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    };
    //获取平台配置
    HQConfig(){
        axios.get(global.Url+'sys/config').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                sessionStorage.setItem('adminTitle',result.sys_name);
                this.setState({
                    adminTitle:result.sys_name,
                    success:true,
                })
                sessionStorage.setItem('Serverurl',result.data_server_uri);//平台网址后期修改平台专业及基础配置要用
                sessionStorage.setItem('data_type',result.data_type);//平台默认地图还是虚拟地图 后期修改平台专业配置要用

            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    };
    render(){
        const {adminUser,adminTitle,success} = this.state;

        return(
            <Fragment>
                <div className="HeaderLeft">{success?adminTitle:''}<i></i></div>
                <div className="HeaderContent">
                    <Configure/>
                    <ConfigBasic/>
                    <ConfigData/>
                    <ConfigDevice/>
                    <PatrolRoute/>
                    <ConfigEffect/>
                    <ConfigAlarm/>
                </div>
                <div className="HeaderRight">
                    <em></em><span className="HeaderTime"></span><Link to='/'><span className="HeaderBank" title='前台管理'></span></Link><span className="HeaderUser">当前用户<i>{adminUser}</i></span>
                </div>
            </Fragment>
        )
    }
};

export default Header;