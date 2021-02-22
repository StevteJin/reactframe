import React, { Fragment, Component } from "react";
import "../../style/common.css";
import moment from "moment";
import axios from "axios";
import { Common } from '../Cesium/method'
import {CommonV} from '../Cesium/video';
import { Link } from "react-router-dom";
import ResourceMap from "./homePage/ResourceMap";
import Surveillance from "./homePage/Surveillance";
import $ from 'jquery';
import NormalWork from "./homePage/NormalWork";
// import PrisonArea from "./homePage/PrisonArea";


import { Exception, Details } from "./homePage/ExceptionInformation"

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            success: false,//用户是否登录，false为否，true为是
            homeTitle: '',//sessionStorage.getItem('userTitle')平台标题
            homeUser: '',//用户名
            NavShow: true, //是否独立运行，默认为true，false为应用到其他平台中
            NavNumber: 0,//导航id
            videoId: '',//视频code
            alarmFlag: false,//报警异常处理
            alarmValue: [],//报警异常处理信息
            detailsFlag: false,//报警详情
            details: {},//报警详情信息
            isNB:false,
            playBack:false,
            ren:'',//人员定位名称
            renId:'',//人员id
            startTime:'',//人员定位搜索开始时间
            endTime:'',//人员定位搜索结束时间
            isCatch:false, //是否加载过视频
            cameracode:'',
        });
        Header.this = this;
        this.renSearch = this.renSearch.bind(this);//人员历史轨迹查询功能
        this.RenGJClose = this.RenGJClose.bind(this);//关闭人员定位
        var that = this;
        setInterval(function () {
            that.fn()
        }, 1000)
    }
    componentDidMount() {
        this.time();
        // this.ThirdParty()
        //监听来自视频控件的方法
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch(e.data.switchName){
                    case 'lsgj':
                        console.log(e.data);
                        $(".renGJList").show();
                        Header.this.setState({
                            ren:e.data.name,//人员定位名称
                            renId:e.data.id,//人员id
                        })
                        break;

                    case 'ModelClickNB':
                        // Header.this.setState({
                        //     isNB:true
                        // })
                        // global.videoAlartNB()
                        // CommonV.setSize(1344,780)
                        // setTimeout(function(){
                        //     CommonV.preview(e.data.cameraData.cameracode,1)
                        // },1000)
                        break;
                    case 'openSsgj':
                        console.log('openSsgj6666')
                        if(Header.this.state.isCatch){  //是否第一次加载过
                            if(!(Header.this.state.cameracode === e.data.id)){
                                setTimeout(function(){
                                    CommonV.preview(e.data.id,1)
                                },1000)
                                Header.this.setState({cameracode:e.data.id})
                            }
                        }else{
                            if(Header.this.state.playBack){ // 是否初始化
                                console.log('预览初始化')
                                CommonV.deInitialization()
                                CommonV.initialization(0)
                                Header.this.setState({playBack:false})
                            }
                            CommonV.showVideo()
                            CommonV.setSize(600,400)
                            Header.this.setState({isNB:true})
                            global.videoAlartNB()
                            setTimeout(function(){
                                CommonV.preview(e.data.id,1)
                                Header.this.setState({isCatch:true})
                            },1000)
                            Header.this.setState({cameracode:e.data.id})
                        }
                        break;
                    case 'closeSsgj':
                        console.log('closeSsgj')
                        CommonV.hideVideo()
                        Header.this.setState({isNB:false})
                        global.videoAlart()
                        break;
                    case 'huifang':
                        CommonV.showVideo()
                        CommonV.setSize(600,400)
                        Header.this.setState({isNB:true})
                        global.videoAlartNB()
                        if(!Header.this.state.playBack){
                            console.log('回放初始化')
                            CommonV.deInitialization()
                            CommonV.initialization(1)
                            Header.this.setState({playBack:true})
                        }
                        setTimeout(function(){
                            CommonV.playback(e.data.cameraData.cameracode)
                        },1900)
                        break;
                    case 'yulan':
                        if(Header.this.state.playBack){
                            console.log('预览初始化')
                            CommonV.deInitialization()
                            CommonV.initialization(0)
                            Header.this.setState({playBack:false})
                        }
                        CommonV.showVideo()
                        CommonV.setSize(600,400)
                        Header.this.setState({isNB:true})
                        global.videoAlartNB()
                        setTimeout(function(){
                            CommonV.preview(e.data.cameraData.cameracode,1)
                        },1000)
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);

        this.fn();
        this.HQuser(); //先获取用户信息
        this.HQstate();//获取平台配置状态
        this.HQConfig();//获取平台配置
        this.onLoadStand();//加载是否需要独立运行
        this.RemoveBombox();//清清除警报
        window.receiveMessageFromIndex = function (e) {
            if (e !== undefined) {
                // console.log('我是地图我接收到了message:', e.data)
                //  console.log( '我是react,我接受到了来自iframe的模型ID：', e.data);
                switch (e.data.switchName) {
                    case 'cameraClick':
                        console.log(e.data);
                        Header.this.setState({
                            videoId: e.data.cameraData.cameracode
                        });
                        $(".videoAlart").show();
                        break;
                    case "errorDataU":
                        $('.resourceMap').hide()
                        $('.RenBut').hide()
                        $('.alarmFlag').hide()
                        Header.this.setState({ alarmFlag: false, detailsFlag: true, details: e.data })
                        break;
                    case "passengerFlow":
                        Header.this.setState({
                            KeLi:e.data.switchName.count
                        })
                        break;

                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    time(){
        var D=moment().format("YYYY.MM.DD HH:mm:ss");
        var SD=moment().format("YYYY.MM.DD");
        Header.this.setState({startTime:SD+' 00:00:00',endTime:D})
    }
    //清清除警报
    RemoveBombox() {
        let box = global.WebList;
        for (let l = 0; l < box.length; l++) {
            //Common.removeBubbleBombox(box[l].event_info.id);
            if (box[l].event_info.event_type === "C1F7A2BD34C8A84704D80C4DF6E72D93") {
                console.log(box)
                Common.removeBubbleBombox(box[l].event_info.ext_info.params.events[0].eventDetails[0].data.faceRecognitionResult.faceMatch[0].faceInfoName);

            } else {
                Common.removeBubbleBombox(box[l].event_info.id);
            }

            /*if(1){
                Common.removeBubbleBombox(box[l].event_info.id);
                element.event_info.ext_info.params.events[0].data.faceRecognitionResult.faceMatch[0].faceInfoName
            }else{
                Common.removeBubbleBombox(box[l].event_info.id);
            }*/
        }
    }
    NavChange(id) {
        this.setState({ alarmFlag: false })
        $('.resourceMap').show()
        $('.RenBut').show()
        $(".Search").hide();
        //Common.removeBubbleLabel();//删除气泡标签
        Common.Close();//关闭共用public组件
        // this.RemoveBombox();//清清除警报
        this.setState({
            NavNumber: id,
            detailsFlag: false
        })
        global.AlarmShow = false;
        switch (id) {
            case 0:
                //this.RemoveBombox();//清清除警报
                Common.onMap();
                $(".Search").show();
                break;
            case 1:
                //this.RemoveBombox();//清清除警报
                // Common.onResource();
                break;
            case 2:
                //this.RemoveBombox();//清清除警报
                /*                let list=global.WebList;
                                for (let n = 0; n < list.length; n++) {
                                    console.log(list);
                                    for (let p =n+1; p <list.length; ) {
                                        if (list[n].event_info.id === list[p].event_info.id) {
                                            list.splice(p, 1);
                                            console.log(list);
                                        }
                                        else p++;
                                    }
                                    console.log(global.WebList)
                                }
                                global.AlarmShow=true;
                                if(global.AlarmShow){
                                    for(let l=0; l<list.length; l++){
                                        console.log(list[l]);
                                        Common.AlarmBox(list[l]);
                                    }
                                }*/
                Common.onSurveillance();
                break;
            case 3:
                //Common.onMap();
                //this.RemoveBombox();//清清除警报
                break;
            case 4:
                //Common.onMap();
                //this.RemoveBombox();//清清除警报
                break;
            case 5:
               // Common.onMap();
                //this.RemoveBombox();//清清除警报
                break;
            case 6:

                break;
            default:
                return null;
        }
    }
    fn() {
        //传json
        var D = moment().format("YYYY.MM.DD HH:mm:ss");
        this.setState({ Time: D })
    }
    //获取用户信息
    HQuser() {
        axios.get(global.Url + 'sys/user/defaultUser').then((res) => {
            const result = res.data.data;
            if (result) {
                sessionStorage.setItem('userName', result.full_name); //用户名称admin
                sessionStorage.setItem('role', result.role_id); //用户ID，唯一的
                this.setState({
                    homeUser: result.full_name,
                    success: true  //用户登录
                })

            } else {
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //获取平台配置状态
    HQstate() {
        axios.get(global.Url + 'sys/config/isConfig').then((res) => {
            const result = res.data.data;
            if (result) {
            } else {
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    };
    //获取平台配置
    HQConfig() {
        axios.get(global.Url + 'sys/config').then((res) => {
            const result = res.data.data;
            if (result) {
                sessionStorage.setItem('userTitle', result.sys_name);
                this.setState({
                    homeTitle: result.sys_name,
                    success: true
                });
                sessionStorage.setItem('Serverurl', result.data_server_uri); //平台网址后期修改平台专业及基础配置要用
                sessionStorage.setItem('data_type', result.data_type);//平台默认地图还是虚拟地图 后期修改平台专业配置要用
                //console.log(1);
            } else {
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    };
    //加载是否需要独立运行
    onLoadStand() {
        axios.get(global.Url + 'sys/config/isStand').then((res) => {
            const result = res.data.data;
            if (result) {
                //console.log(result.is_stand,this.state.NavShow);
                this.setState({
                    NavShow: result.is_stand
                })
                var { NavShow } = this.state
                if (NavShow === false) {
                    $(".IndexHome").css({ 'top': '0' });
                    $(".header").css({ "position": 'absolute', 'zIndex': '2', 'background': 'none' });
                    $(".left,.right").css({ 'width': 0 });
                    $(".conent").css({ 'width': '100%' });
                    $(".HeaderContentHomeNav").css({ 'width': '60%', "left": '20%' });
                    $(".HeaderContentHomeNav").find("li").addClass("more")
                }
            } else {
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    // 报警异常处理请求
    alarmBtn = () => {
        const _this = this
        const alarmFlag = this.state.alarmFlag
        if (alarmFlag) {
            $('.resourceMap').show()
            $('.RenBut').show()
            $('.alarmFlag').show()
        } else {
            $('.resourceMap').hide()
            $('.RenBut').hide()
            $('.alarmFlag').hide()
        }
        // const url = 'http://192.168.0.46:8090/33010801001/' //测试接口
        if (!alarmFlag) {
            let fromData = new FormData()
            fromData.append("ex_typeid", 1)
            axios.post(global.Url + 'ex/info/list',fromData).then((res) => {
                console.log(res.data.data)
                _this.setState({ alarmValue: res.data.data, alarmFlag: true, detailsFlag: false })
            }).catch(error => {
                console.log(error)
            })
        } else {
            this.setState({ alarmFlag: !alarmFlag, detailsFlag: false })
        }
    }
    // 报警信息详情关闭
    close = () => {
        $('.resourceMap').show()
        $('.RenBut').show()
        $('.alarmFlag').show()
        this.setState({ detailsFlag: false })
    }
    // 常态 异常切换
    qhChangtai = (result, flag) => {
        this.setState({ alarmFlag: flag, detailsFlag: flag })
    }
    //关闭视频
    removeVideo(){
        CommonV.hideVideo()
        this.setState({isNB:false})
        global.videoAlart()
    }
    //修改人员定位开始时间
    changeStartTime(e){
        Header.this.setState({
            startTime:e.target.value
        })
    }
    //修改人员定位结束时间
    changeEndTime(e){
        Header.this.setState({
            endTime:e.target.value
        })
    }
    //人员定位历史轨迹查询
    renSearch(){
        const {renId,startTime,endTime}=this.state;
        if(!startTime || !endTime){
            $(".PageShow").show().find('h1').html('请输入完整时间!');
            global.Time();
        }else{
            var data={
                id:renId,
                starttime:startTime,
                endtime:endTime
            }
            console.log(data);
            axios.post(global.Url+'base/station/info/list',data).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    Common.LsgjHistory(result);
                }else{
                    //alert('登录失败')
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }

    }
    //关闭人员定位
    RenGJClose(){
        $(".renGJList").hide();
        // Header.this.setState({
        //     ren:'',//人员定位名称
        //     renId:'',//人员id
        //     startTime:'',//人员定位搜索开始时间
        //     endTime:'',//人员定位搜索结束时间
        // })
        Common.ClearHistoryLine();
        Common.SadianUp()
    }
    render() {
        const { homeTitle, homeUser, Time, success, NavShow, NavNumber, alarmFlag, detailsFlag, details, alarmValue,ren,startTime,endTime} = this.state;
        // const show = {
        //     display:'block'
        // }
        // const hide = {
        //     display:'none'
        // }
        return (
            <Fragment>
                {alarmFlag && <div className="Exception">
                    <Exception onClick={this.alarmBtn} alarmValue={alarmValue} title="报警异常信息"></Exception>
                </div>
                }
                {detailsFlag && <div className="Exception" style={{ width: "350px" }}>
                    <Details details={details} onClick={this.close}></Details>
                </div>}
                {
                    NavShow
                        ? <div className="HeaderLeft">{success ? homeTitle : ''}<i></i></div>
                        : ""
                }
                {
                    NavShow
                        ?
                        <div className="HeaderContentHome">
                            <li className={NavNumber === 0 ? "cur" : ''} onClick={() => this.NavChange(0)}>三维地图</li>
                            <li className={NavNumber === 1 ? "cur" : ''} onClick={() => this.NavChange(1)}>资源图谱</li>
                            <li className={NavNumber === 2 ? "cur" : ''} onClick={() => this.NavChange(2)}>布控警戒</li>
                            <li className={NavNumber === 3 ? "cur" : ''} onClick={() => this.NavChange(3)}>常态工作</li>
                            {/* <li className={NavNumber === 6 ? "cur" : ''} onClick={() => this.NavChange(6)}>监区信息</li> */}              
                            {/* <li className={NavNumber === 4 ? "cur" : ''} onClick={() => this.NavChange(4)}>大数据</li> */}
                            {/* <li className={NavNumber === 5 ? "cur" : ''} onClick={() => this.NavChange(5)}>指挥预案</li> */}
                        </div>
                        :
                        <div className="HeaderContentHomeNav">
                            <li className={NavNumber === 0 ? "more1" : 'more'} onClick={() => this.NavChange(0)}>三维地图</li>
                            <li className={NavNumber === 1 ? "more1" : 'more'} onClick={() => this.NavChange(1)}>资源图谱</li>
                            <li className={NavNumber === 2 ? "more1" : 'more'} onClick={() => this.NavChange(2)}>布控警戒</li>
                            <li className={NavNumber === 3 ? "more1" : 'more'} onClick={() => this.NavChange(3)}>常态工作</li>
                            {/* <li className={NavNumber === 6 ? "more1" : 'more'} onClick={() => this.NavChange(6)}>监区信息</li> */}
                            {/* <li className={NavNumber === 4 ? "more1" : 'more'} onClick={() => this.NavChange(4)}>大数据</li> */}
                            {/* <li className={NavNumber === 5 ? "more1" : 'more'} onClick={() => this.NavChange(5)}>指挥预案</li> */}
                        </div>
                    /*""*/
                }
                {
                    NavShow
                        ? <div className="HeaderRightHome">
                            <em></em><span className="HeaderTime">{Time}</span>
                            <Link to='/admin'><span className="HeaderBank" title='后台管理'></span></Link>
                            <span className="HeaderUser">当前用户<i>{success ? homeUser : ''}</i></span>
                        </div>
                        : ""
                }
                {(() => {
                    switch (NavNumber) {
                        case 1:
                            return <ResourceMap></ResourceMap>;
                        case 2:
                            return <Surveillance></Surveillance>;
                        case 3:
                            return <NormalWork parent={this}></NormalWork>
                        // case 6:
                        //     return <PrisonArea></PrisonArea>;
                        default:
                            return null;
                    }
                })()}
                {/* <PrisonArea></PrisonArea> */}
                {/* <div className="videoAlart" style={this.state.isNB?show:hide}>
                    <div className="videoAlartCont">
                        <iframe
                            id="core_content2"
                            name="iframeName2"
                            ref="core_content2"
                            title="core_content2"
                            src={global.VideoUrl}     //"http://192.168.0.64:8099/H5Player_Plugin/index.html?channel=123123"
                            style={{ width: '100%', height: '100%' }}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
                            scrolling="auto"
                            onLoad={CommonV.ListV}
                        />
                        <i onClick={this.removeVideo.bind(this)}></i>
                    </div>
                </div> */}
                {!alarmFlag && <div className="AlarmButton OneAlarm" style={{ bottom: "255px", height: "auto" }} onClick={this.alarmBtn}>报警异常</div>}
                <div className="renGJList">
                    <h1>{ren}历史轨迹 <i onClick={()=>this.RenGJClose()}></i></h1>
                    <div className="renGJcont">
                        <li><span>开始时间:</span><input type="datetime" step='02' value={startTime} onChange={(e)=>this.changeStartTime(e)}/></li>
                        <li><span>结束时间:</span><input type="datetime" step='02' value={endTime} onChange={(e)=>this.changeEndTime(e)}/></li>
                        <button onClick={()=>this.renSearch()}>查询</button>
                    </div>
                </div>
            </Fragment>
        )
    }

    };

export default Header;