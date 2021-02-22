import React,{Fragment,PureComponent} from "react";
import '../../../style/admin.css';
import axios from 'axios';
import {connect} from 'react-redux';
import {actionCreators} from "../store";
import $ from 'jquery';
import moment from "moment";
import {Common} from "../../Cesium/method";

class Configure extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            isToggleOn: false,
            mapAddress:'',
            mapName:'normal',
            isStand:false,
            isLogin:false,
            alarmTest:false,//报警检测弹框
            device: {},//设备类别
            deviceId:'',//设备类别默认
            alarmDevice:{},//报警类型
            alarmDeviceId:'',//报警类型id
            deviceList:{},//设备列表
        };
        Configure.this = this;
        this.onConfig = this.onConfig.bind(this); //弹框样式显示隐藏
        this.addressChange = this.addressChange.bind(this); //地图地址取值
        this.handleChange = this.handleChange.bind(this); //地图单选取值
        this.handleIsStand = this.handleIsStand.bind(this);//是否独立运行
        this.handleIsLogin = this.handleIsLogin.bind(this); //是否验证
        this.configSave = this.configSave.bind(this);//保存
        this.AlarmTest = this.AlarmTest.bind(this);//报警检测弹框
        this.Test = this.Test.bind(this);//测试报警
    }
    componentDidMount() {
        this.onConfig();
    }

    //专业配置
    onConfig(){
        var that =this;
        axios.get(global.Url+'sys/config').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                sessionStorage.setItem('adminTitle',result.sys_name);
                that.state=({
                    homeTitle:result.sys_name
                });
                sessionStorage.setItem('Serverurl',result.data_server_uri);
                sessionStorage.setItem('data_type',result.data_type);
                this.setState({
                    mapAddress:result.data_server_uri,
                    mapName:result.data_type,
                    isStand:result.is_stand,
                    isLogin:result.is_login,
                })
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })

        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
            Display: prevState.isToggleOn ? 'none': 'block'
        }));
    }
    //填写地图地址
    addressChange = (event) => {
        this.setState({
            mapAddress: event.target.value
        });
    }
    //选取地图
    handleChange=(event)=>{
        //获取单选框选中的值
        this.setState({
            mapName:event.target.value
        })
    }
    //选取独立运行
    handleIsStand=(event)=>{
        //获取单选框选中的值
        this.setState(prevState => ({
            isStand: !prevState.isStand
        }));
    }
    //是否验证
    handleIsLogin = (event) => {
        this.setState(prevState => ({
            isLogin: !prevState.isLogin
        }));
    }
    //保存
    configSave = (mapAddress,mapName,isStand,isLogin) => {
        this.setState({
            alarmTest:false
        })
        console.log(mapAddress,mapName,isStand,isLogin,global.Database);
        axios.post(global.Url+'sys/config/updatePro',{
            data_server_uri:mapAddress,
            data_type:mapName,
            is_stand:isStand,
            is_login:isLogin,
            })
             .then(function (res) {
                const result = res.data.data;
                console.log(result);
                 if(result) {
                     sessionStorage.setItem('Serverurl',result.data_server_uri);
                     sessionStorage.setItem('data_type',result.data_type);
                     var frame=document.getElementById("core_content");
                     var sendData={
                         Event : 'RefreshPage()',
                         ModName : "",
                         parameter : {}
                     };
                     frame.contentWindow.postMessage(sendData,"*");
                     $(".PageShow").show();
                     global.Time();
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
    //报警检测
    AlarmTest(){
        $(".Basic").css({'display':'block'})
        axios.post(global.Url+'device/category/list',{enable:true}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    device:result,
                    alarmTest:true,
                    deviceId:result[0].id
                })
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //设备类别选取
    deviceChange(e){
        e.preventDefault();
        this.setState({
            deviceId:e.target.value
        })
        axios.post(global.Url+'event/type/list',{enable:true,category_id:e.target.value}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    alarmDevice:result,
                })
                if(result.length>0){
                    this.setState({
                        alarmDeviceId:result[0].id
                    })
                }else{
                    this.setState({
                        alarmDeviceId:''
                    })
                }


            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
        axios.post(global.Url+'device/info/list',{on_map:true,category_id:e.target.value}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    deviceList:result
                })
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //报警类型选取
    alarmDeviceChange(e){
        e.preventDefault();
        this.setState({
            alarmDeviceId:e.target.value
        })
    }

    //测试报警
    Test(id,name){
        console.log(id,name);
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        function guid() {
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }
        const {alarmDeviceId} = this.state;
        var D=moment().format("YYYY-MM-DD HH:mm:ss");
        var data;
        if(alarmDeviceId==='C1F7A2BD34C8A84704D80C4DF6E72D93'){
            data= {
                event_id: guid(),
                event_type: alarmDeviceId,
                status: 0,
                start_time: D,
                stop_time: D,
                event_name: name+'_'+$('#Two').find("option:selected").text(),
                device_code: id,
                device_name: name,
                "ext_info": {
                    "method": "OnEventNotify",
                    "params": {
                      "ability": "",
                      "events": [
                        {
                          "eventDetails": [
                            {
                              "ability": "event_frs",
                              "data": {
                                "faceRecognitionResult": {
                                  "faceMatch": [
                                    {
                                      "certificate": "1516",
                                      "certificateType": "111",
                                      "faceGroupCode": "9cb324d352ec4472a401febd184c2965",
                                      "faceGroupName": "盗窃嫌疑人",
                                      "faceInfoCode": "11d636217f964ccb90cfb181ab2955dd",
                                      "faceInfoName": "门诊盗窃手机2",
                                      "faceInfoSex": "male",
                                      "facePicUrl": "https://192.168.100.237:6113/pic?=d14i0d80i5e5=o89-ap3e1bs1i7995*0870859=21i5m*ep=t3p6i=d1s*i6d3d*=*1b5i7b56d40ec7zdb--=2de60*l10fod3-94453fd9&AccessKeyId=V+TncZ3Vn2kPp7gP&Expires=1594437920&Signature=hfcxI67asA/NIDlVHlOLVFmLWno=",
                                      "similarity": 0.82
                                    }
                                  ],
                                  "snap": {
                                    "ageGroup": "middle",
                                    "bkgUrl": "http://192.168.100.237:6120/pic?=d47i0d01i5e5=o29-ap9=1bi8z69*9s4578414135m9ep=t1i7d*=*1pdi=*1s1i5i3d5=*4b5c7bd6d-0ed7e5b-147oe6-*l80ffd08944d3&AccessKeyId=V TncZ3Vn2kPp7gP&Expires=1594436819&Signature=PVZ5w9uYSIASuMlGWL hUHZUHXc=",
                                    "faceTime": "2020-07-11T10:50:20+08:00",
                                    "faceUrl": "http://192.168.100.237:6120/pic?=d47i0d01i5e5=o09-ap9z1b*=s497831493559e4=t1i6m*=p1p1i=d1s*i5d3d*=*1b5i7b56d40ec7idb--e2de66*l10fod0-94834fd8&AccessKeyId=V+TncZ3Vn2kPp7gP&Expires=1594436819&Signature=usYAq0Http4i7V5SqP/vcvMSr4Y=",
                                    "gender": "male",
                                    "glass": "no"
                                  }
                                },
                                "resInfo": [
                                  {
                                    "cn": "二号岗出入口（入）-人脸识别",
                                    "indexCode": "3e5dccf2bf524f4b8ebc1082c4fff94f",
                                    "resourceType": "camera"
                                  }
                                ],
                                "srcEventId": "3632AC6C-76E7-EA46-9BC5-1E8F91C24938"
                              },
                              "eventOriginalId": "3f823098-7a34-4e41-9a89-bdfa2f6d4b15",
                              "eventType": 1644175361,
                              "locationIndexCode": "",
                              "locationName": "",
                              "regionIndexCode": "b90e81ae-d754-4a1c-905f-c790f43e02c6",
                              "regionName": "中国福利会国际和平妇幼保健院/本院/人脸识别",
                              "srcIndex": "9cb324d352ec4472a401febd184c2965",
                              "srcName": "盗窃嫌疑人",
                              "srcType": "facegroup"
                            }
                          ],
                          "eventId": "C8534A4967BD48A7BFF5449D69353EAE",
                          "eventLvl": 3,
                          "eventName": "盗窃嫌疑人",
                          "eventOldId": "3f823098-7a34-4e41-9a89-bdfa2f6d4b15",
                          "eventType": 0,
                          "happenTime": "2020-07-11T10:49:26+08:00",
                          "linkageAcion": [
                            {
                              "content": "[{\"cameraIndexCode\":\"3e5dccf2bf524f4b8ebc1082c4fff94f\",\"cameraName\":\"二号岗出入口（入）-人脸识别\",\"cameraType\":\"0\",\"cascadeCode\":\"\",\"decodeTag\":\"hikvision\",\"treatyType\":\"1\"}]\n",
                              "linkageType": "popUpLiveViewOnClient"
                            },
                            {
                              "content": "[{\"cameraIndexCode\":\"3e5dccf2bf524f4b8ebc1082c4fff94f\",\"cameraName\":\"二号岗出入口（入）-人脸识别\",\"cameraType\":\"0\",\"cascadeCode\":\"\",\"decodeTag\":\"hikvision\",\"treatyType\":\"1\"}]\n",
                              "linkageType": "popUpPlayBackOnClient"
                            },
                            {
                              "content": "{\"bPopupEventPicture\":true}\n",
                              "linkageType": "popUpPictureOnClient"
                            },
                            {
                              "content": "{\"soundText\":\"中国福利会国际和平妇幼保健院/本院/人脸识别，发现盗窃嫌疑人\"}\n",
                              "linkageType": "alertByEventInfo"
                            }
                          ],
                          "linkageRecord": "true",
                          "linkageResult": [
                            {
                              "content": "[{\"cameraIndexCode\":\"3e5dccf2bf524f4b8ebc1082c4fff94f\",\"cameraName\":\"二号岗出入口（入）-人脸识别\",\"cameraType\":\"0\",\"cascadeCode\":\"\",\"decodeTag\":\"hikvision\",\"recordType\":0,\"streamType\":0,\"treatyType\":\"1\"}]\n",
                              "linkageType": "recordEventVideo"
                            }
                          ],
                          "remark": "",
                          "ruleDescription": "",
                          "srcIndex": "aa051118546c4b928ef585f5c1ddb95f",
                          "srcName": "盗窃嫌疑人",
                          "srcType": "eventRule",
                          "status": 4,
                          "stopTime": "2020-07-11T10:49:26+08:00",
                          "timeout": 0
                        }
                      ],
                      "sendTime": "2020-07-11T10:50:20.785+08:00"
                    }
                  },
                "linkage_info": "[{\"cameraIndexCode\":\"3e5dccf2bf524f4b8ebc1082c4fff94f\",\"cameraName\":\"二号岗出入口（入）-人脸识别\",\"cameraType\":\"0\",\"cascadeCode\":\"\",\"decodeTag\":\"hikvision\",\"treatyType\":\"1\"}]\n"
            };
        }else{
            data= {
                event_id: guid(),
                event_type: alarmDeviceId,
                status: 0,
                start_time: D,
                stop_time: D,
                event_name: name+'_'+$('#Two').find("option:selected").text(),
                device_code: id,
                device_name: name,
                ext_info: {
                    method: "OnEventNotify",
                    params: {
                        ability: "event_face_recognition",
                        events: [
                            {
                                eventId: "80e51ca2-931f-4e97-ac9c-d66e751114d8",
                                eventType: 1644175361,
                                happenTime: "2019-08-14T20:55:09.000+08:00",
                                srcIndex: "8fb82557b587479e8013ab9279319dd6",
                                srcName: "123",
                                srcType: "facegroup",
                                status: 0,
                                timeout: 0,
                                "eventDetails": [
                                              {
                                                "ability": "event_ias",
                                                "data": {
                                                  "extendKey": "simulate",
                                                  "lanId": "zh_CN"
                                                },
                                                "eventOriginalId": "GSZ7ALAYNOIH1F2I0UEEEEOXGK3NJ5XU",
                                                "eventType": 327681,
                                                "locationIndexCode": "",
                                                "locationName": "",
                                                "regionIndexCode": "724da3de-2819-41b7-9630-48df9852fb06",
                                                "regionName": "中国福利会国际和平妇幼保健院/本院/一号楼（综合楼）",
                                                "srcIndex": "cce79ff77a7249b8b1b73ea8ad7d7f98",
                                                "srcName": "地下2层档案室紧急报警",
                                                "srcType": "defence"
                                              }
                                ],
                            }
                        ],
                        sendTime: "2019-08-14T20:55:16.000+08:00"
                    }
                }
            };
        }
        console.log(alarmDeviceId);
        console.log(data);
        axios.post(global.Url+'event/info/accept',data).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    render(){
        const {mapAddress,mapName,isStand,isLogin,alarmTest,device,deviceId,alarmDevice,alarmDeviceId,deviceList} = this.state;
        const{adminItem,navClick} = this.props;
        return(
            <Fragment>
                <li key="1" className={adminItem === 1 ? 'cur' : ''} onClick={() => navClick(1)}>专业配置</li>
                {adminItem === 1
                    ?
                    <div>
                        <div className="configShow">
                                <div className="configShowNav">专业配置 <i onClick={() => navClick(100)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont">
                                        <li><span>地图数据地址：</span><input type="text" value={mapAddress} onChange={(event) => this.addressChange(event)} /></li>
                                        <li><span>默认地图：</span>
                                            <input type="radio" name='' value="normal" checked={mapName === 'normal'} onChange={(e) => this.handleChange(e)}  /><label>三维模型</label>
                                            <input type="radio" name='' value="virtual" checked={mapName === 'virtual'} onChange={(e) => this.handleChange(e)} /><label>虚拟化</label>
                                            <div className="dot">gender: {}</div>
                                        </li>
                                        <li><span>独立运行：</span><input type="checkbox" checked={isStand} onChange={(e) => this.handleIsStand(e)} /></li>

                                        <li><span>免密登录：</span><input type="checkbox" checked={isLogin} onChange={(e) => this.handleIsLogin(e)} /></li>
                                    </div>

                                    <div className="configBut"><button onClick={() => this.configSave(mapAddress,mapName,isStand,isLogin)}>保存</button><button>模型检查</button><button onClick={()=>this.AlarmTest()}>报警检测</button></div>
                                </div>
                            </div>
                        {alarmTest?
                            <div className="configShow Basic" style = { { marginLeft: '520px'} }>
                                <div className="configShowNav">报警测试 <i onClick={() => navClick(101)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont DevicePic">
                                        <li><span>设备类别：</span>
                                            <select
                                                onChange={(e)=>this.deviceChange(e)}
                                                className='AddSelect'
                                                id='One'
                                                value = {deviceId}>
                                                {
                                                    device.length > 0 && device.map((item) => {
                                                        return (
                                                            <option key={item.id} value={item.id}>{item.category_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </li>
                                        <li><span>报警类型：</span>
                                            <select
                                                onChange={(e)=>this.alarmDeviceChange(e)}
                                                className='AddSelect'
                                                id='Two'
                                                value = {alarmDeviceId}>
                                                {
                                                    alarmDevice.length > 0 && alarmDevice.map((item) => {
                                                        return (
                                                            <option key={item.id} value={item.id}>{item.event_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </li>
                                        <div className="GridNavTable" style={{'marginTop':'10px'}}>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>设备名称</th>
                                                    <th>操作</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    deviceList.length > 0 && deviceList.map(
                                                        (item,index) => {
                                                            return  <tr key={index}><td>{item.device_name}</td><td><button onClick={()=>this.Test(item.device_code,item.device_name)}>测试报警</button></td></tr>
                                                        }
                                                    )
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :''
                        }
                    </div>
                    :""
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
        if(item === 100){
            dispatch(actionCreators.nav_click(item));
            Configure.this.setState({
                alarmTest:false
            })
        }else if(item === 101){
            Configure.this.setState({
                alarmTest:false
            })
        }else{
            Common.Close();
            dispatch(actionCreators.nav_click(item));
            axios.get(global.Url+'sys/config').then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    sessionStorage.setItem('adminTitle',result.sys_name);
                    sessionStorage.setItem('Serverurl',result.data_server_uri);
                    sessionStorage.setItem('data_type',result.data_type);
                    Configure.this.setState({
                        mapAddress:result.data_server_uri,
                        mapName:result.data_type,
                        isStand:result.is_stand,
                        isLogin:result.is_login
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }

    },
});

export default connect(mapState,mapDispatch)(Configure);