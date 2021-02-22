import React, { Fragment, PureComponent } from "react";
import axios from "axios";
import $ from "jquery";
import { Common } from "../../Cesium/method";
import Upload from '../../../images/upload.png';
import { Exception } from "./ExceptionInformation"
class NormalWork extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: true,
            workList: [],
            treeList: [],
            DisplayList: [],
            EndCount: 1,
            speedOne: 5,//无设备速度
            speedTwo: 20,//有设备速度
            UploadImg: Upload,//图片显示
            cameraName: '',//相机名称
            cameraId: '',//相机编码
            problem: '',//常见问题
            problemId: null,//常见问题编号
            problemList: {},//常见问题列表
            problemRemark: '',//备注
            alarmFlag: false,//异常信息显示
            alarmValue: [],//异常信息列表内容
            timezxyN:'',//巡逻名字
            timezxyS:'',//巡逻时间
        }
        NormalWork.this = this;
        this.fileInputEl = React.createRef();//上传图片所需属性
        this.Work = this.Work.bind(this);//点击巡逻
        this.Work1 = this.Work1.bind(this);//点击巡逻预案
        this.Sign = this.Sign.bind(this);//退出
        this.Report = this.Report.bind(this);//异常处理
        this.ReportClose = this.ReportClose.bind(this);//关闭异常处理
        this.SaveBut = this.SaveBut.bind(this); //异常保存
    }
    componentDidMount() {
        NormalWork.this.ClosePic();
        this.onLoad();
        this.ProList();//请求常见问题
        this.onButLoad();
        //roamingDisplay
        window.receiveMessageFromIndex = function (e) {
            if (e !== undefined) {
                //  console.log( '我是react,我接受到了来自iframe的模型ID：', e.data);
                switch (e.data.switchName) {
                    case 'roamingDisplay':
                        console.log(e.data);
                        NormalWork.this.state.EndCount++;
                        if (e.data.msg === 'end') {
                            const {timezxyN,timezxyS} = NormalWork.this.state;
                            axios.post(global.Url+'patrol/statistics/add', {patrol_name:timezxyN,start_time:timezxyS,end_time:NormalWork.this.timeNow()}).then((res) => {
                                if(res.data.msg === "success"){
                                    NormalWork.this.setState({timezxyN:"",timezxyS:""})
                                    console.log(res.data.msg,'巡逻添加成功')
                                }
                            })
                            if (NormalWork.this.state.EndCount >= NormalWork.this.state.DisplayList.length) {
                                Common.endVod();
                                Common.deleteRoamingRoute();
                                $(".IndexHome").css({ 'width': '100%', 'top': '100px', 'zIndex': '0' });
                                $(".iframeBut").hide();
                                return;
                            } else {
                                console.log(NormalWork.this.state.EndCount, NormalWork.this.state.DisplayList)
                                Common.roamingDisplay(NormalWork.this.state.DisplayList[NormalWork.this.state.EndCount])
                            }
                        }
                        break;
                    case 'poamingPlaybackS':
                        var listData = e.data.cameraData;
                        console.log(e.data);
                        NormalWork.this.setState({
                            cameraName: listData.camera_name,//相机名称
                            cameraId: listData.cameraQueueList[0],//相机编码
                        })
                        break;
                    case 'CloseAlarmBox':
                        NormalWork.this.Sign()
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    onLoad() {
        axios.get(global.Url + 'patrol/line/list').then((res) => {
            const result = res.data.data;
            if (result) {
                console.log(result);
                NormalWork.this.setState({
                    workList: result
                })
            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    onButLoad() {
        axios.get(global.Url + 'patrol/plan/list').then((res) => {
            const result = res.data.data;
            if (result) {
                console.log(result);
                NormalWork.this.setState({
                    treeList: result
                })
            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //获取当前时间
    timeNow(){
        var format = "";
        var nTime = new Date();
        format += nTime.getFullYear()+"-";
        format += (nTime.getMonth()+1)<10?"0"+(nTime.getMonth()+1):(nTime.getMonth()+1);
        format += "-";
        format += nTime.getDate()<10?"0"+(nTime.getDate()):(nTime.getDate());
        format += " ";
        format += nTime.getHours()<10?"0"+(nTime.getHours()):(nTime.getHours());
        format += ":";
        format += nTime.getMinutes()<10?"0"+(nTime.getMinutes()):(nTime.getMinutes());
        format += ":00";
        return format;
    }
    //巡逻开始
    Work(e, id,name) {
        NormalWork.this.ClosePic();
        NormalWork.this.setState({
            End: true,
            timezxyN:name,
            timezxyS:this.timeNow()
        })
        axios.post(global.Url + 'patrol/line/alllist', { id: id }).then((res) => {
            const result = res.data.data;
            if (result) {
                console.log(result);
                $(".IndexHome").css({ 'width': '100%', 'top': '0', 'zIndex': '3' });
                $(".iframeBut").show();
                const { speedOne, speedTwo } = this.state;
                console.log(speedOne.toString() * 1000, speedTwo.toString() * 1000)
                result.EmptySegment = speedOne.toString() * 1000;
                result.SinglePhase = speedTwo.toString() * 1000;
                console.log(result);
                Common.roamingDisplay(result);
            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //预案巡逻开始
    Work1(e, id) {
        NormalWork.this.ClosePic();
        axios.post(global.Url + 'patrol/plan/list', { plan_id: id }).then((res) => {
            const result = res.data.data;
            if (result) {
                console.log(result);
                $(".IndexHome").css({ 'width': '100%', 'top': '0', 'zIndex': '3' });
                $(".iframeBut").show();
                if (result.length > 1) {
                    NormalWork.this.state.DisplayList = result;
                    NormalWork.this.state.EndCount = 0;
                    const { speedOne, speedTwo } = this.state;
                    var list = [];
                    for (var i = 0; i < NormalWork.this.state.DisplayList.length; i++) {
                        const res = NormalWork.this.state.DisplayList[i];
                        res.EmptySegment = speedOne.toString() * 1000;
                        res.SinglePhase = speedTwo.toString() * 1000;
                        list.push(res);
                    }
                    NormalWork.this.state.DisplayList = list;
                    console.log(speedOne.toString() * 1000, speedTwo.toString() * 1000)
                    Common.roamingDisplay(NormalWork.this.state.DisplayList[NormalWork.this.state.EndCount])
                    /*for(var i=0;i<result.length;i++){
                        if(End===true){
                            Common.roamingDisplay(result[i])
                        }
                    }*/
                } else {
                    return null
                }

            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //修改无设备速度
    ChangeSpeedOne = (e) => {
        NormalWork.this.setState({
            speedOne: e.target.value
        })
    }
    //修改单个设备速度
    ChangeSpeedTwo = (e) => {
        NormalWork.this.setState({
            speedTwo: e.target.value
        })
    }
    //退出
    Sign() {
        Common.endVod();
        Common.deleteRoamingRoute();
        $(".IndexHome").css({ 'width': '100%', 'top': '100px', 'zIndex': '0' });
        $(".iframeBut").hide();
        $("#iframeBut").html('暂停')
        $(".addReport").hide();
        NormalWork.this.ClosePic();
    }
    //请求常见问题
    ProList() {
        axios.get(global.Url + 'ex/type/list', {}).then((res) => {
            const result = res.data.data;
            if (result && res.data.msg === 'success') {
                //console.log(result)
                NormalWork.this.setState({
                    problemList: result,
                    problem: result[0].type_name,
                    problemId: result[0].id
                })
            } else {
                alert(res.msg)
            }

        })
    }
    //异常处理
    Report() {
        Common.multiplier(0);
        $("#iframeBut").html("继续");
        $(".addReport").show();
    }
    //关闭异常处理
    ReportClose() {
        $(".addReport").hide();
        NormalWork.this.ClosePic();
    }
    //关闭图片
    ClosePic() {
        $(".img2").hide();
        $(".img1,h5").show();
        NormalWork.this.setState({
            UploadImg: Upload,
            cameraName: ''
        })
    }
    //修改场景问题
    changeProblem = e => {
        console.log(e.target.value);
        NormalWork.this.setState({
            problem: e.target.value,
            problemId: e.target.value
        })
    }
    //修改备注
    changeProblemRemark(e) {
        NormalWork.this.setState({
            problemRemark: e.target.value
        })
    }
    //上传图片
    handlePhoto = async (event) => {
        var imgFile;
        let reader = new FileReader();     //html5读文件
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (event) {        //读取完毕后调用接口
            imgFile = event.target.result;
            NormalWork.this.setState({
                UploadImg: imgFile
            })
        }
        const { UploadImg } = this.state;
        console.log(UploadImg, event.target.files[0]);
        $(".img2").show();
        $(".img1,h5").hide();
    }
    //异常保存
    SaveBut() {
        const { cameraName, problem, cameraId,problemRemark, problemId} = this.state;
        //console.log('cameraName：' + cameraName + 'problem:' + problem + 'problemRemark:' + problemRemark + 'UploadImg:' + UploadImg);
        var data;
        let fromData = new FormData()
        fromData.append("detail_info", problemRemark)
        fromData.append("device_code", cameraId)
        fromData.append("ex_name",problem);
        fromData.append("ex_typeid",problemId);
        fromData.append("device_name",cameraName);
        fromData.append("files", $('#optUrl')[0].files[0]);
/*        if (UploadImg === Upload) {
            data = {
                device_name: cameraName,//相机名称
                device_code: cameraId,//相机编号
                detail_info: problemRemark,//详细信息
                pic: '',
                ex_typeid: problemId,
                ex_name:problem
            }
            console.log(data,'1111111111')
        } else {
            data = {
                device_name: cameraName,//相机名称
                device_code: cameraId,//相机编号
                detail_info: problemRemark,//详细信息
                pic: UploadImg,
                ex_typeid: problemId,
                ex_name:problem
            }
            //console.log(data,'222222222222')
        }*/
        console.log(fromData);
        if (!cameraName) {
            $(".PageShow1").show().find('h1').html('暂无异常的摄像头！');
            $(".PageShowCont h2").hide();
            global.Time();
        } else {
            console.log(data);
            axios.post(global.Url + 'ex/info/add', fromData).then((res) => {
                const result = res.data.data;
                console.log(result)
                if (result && res.data.msg === 'success') {
                    $(".PageShow1").show().find('h1').html('异常上报成功！');
                    $(".PageShowCont h2").hide();
                    $(".addReport").hide();
                    global.Time();
                } else {
                    $(".PageShow1").show().find('h1').html(res.data.msg);
                    $(".PageShowCont h2").hide();
                    global.Time();
                    //alert(res.msg)
                }

            })
        }


    }

    // 巡逻异常处理请求
    alarmBtn = () => {
        const _this = this;
        const alarmFlag = this.state.alarmFlag
        const isLoad = this.state.isLoad

        // const url = 'http://192.168.0.46:8090/33010801001/' //测试接口
        if (!alarmFlag) {
            console.log(111);
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            let fromData = new FormData()
            fromData.append("ex_typeid", 0)
            console.log(fromData,config);
            axios.post(global.Url + 'ex/info/list',fromData,config).then((res) => {
                 console.log(res.data.data)
                _this.setState({ alarmValue: res.data.data, alarmFlag: true, isLoad: !isLoad })
            }).catch(error => {
                console.log(error)
            })
        } else {
            console.log(222);
            this.setState({ alarmFlag: !alarmFlag, isLoad: !isLoad })
        }
        this.props.parent.qhChangtai(this, false)
    }
    render() {
        const { alarmValue, alarmFlag, isLoad, workList, treeList, speedOne, speedTwo, cameraName, problem, problemList, problemRemark, UploadImg } = this.state;
        return (
            <Fragment>
                {isLoad ?
                    <div>
                        <div className="AlarmShow resourceMap">
                            <h1><span>巡逻路线</span></h1>
                            <div className="work">
                                <ul>
                                    {
                                        workList.length > 0 && workList.map(
                                            (item, index) => {
                                                return (
                                                    <li key={item.id}><span>{item.line_name}</span><button onClick={(e) => this.Work(e, item.id,item.line_name)}>开始</button></li>
                                                )
                                            }
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="AlarmShow resourceMap" style={{ 'marginTop': '320px' }}>
                            <h1><span>巡逻预案路线</span></h1>
                            <div className="work">
                                <ul>
                                    {
                                        treeList.length > 0 && treeList.map(
                                            (item, index) => {
                                                return (
                                                    <li key={item.id}><span>{item.plan_name}</span><button onClick={(e) => this.Work1(e, item.id)}>开始</button></li>
                                                )
                                            }
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="AlarmShow resourceMap" style={{ 'marginTop': '640px', 'height': '150px' }}>
                            <h1><span>巡逻速度</span></h1>
                            <div className="work">
                                <li><span>无设备路线速度：</span><input type="number" step='0' value={speedOne} onChange={(e) => this.ChangeSpeedOne(e)} />秒</li>
                                <li><span>单个设备速度：</span><input type="number" step='0' value={speedTwo} onChange={(e) => this.ChangeSpeedTwo(e)} />秒</li>
                            </div>
                        </div>
                        <div className="iframeBut">
                            <button id='iframeBut' onClick={() => global.suspend()}>暂停</button>
                            <button onClick={() => this.Sign()}>退出</button>
                            <button onClick={() => this.Report()}>异常上传</button>
                        </div>
                        <div className="addReport">
                            <h1>异常信息 <i onClick={() => this.ReportClose()}></i></h1>
                            <div className="addReportCont">
                                <p><span>相机名称：</span><input type="text" defaultValue={cameraName} /></p>
                                <p><span>常见问题：</span>
                                    <select name="" onChange={(e) => this.changeProblem(e)} value={problem} >
                                        {
                                            problemList.length > 0 && problemList.map((ele, index) => {
                                                return (
                                                    <option key={index} value={ele.id}>{ele.type_name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </p>
                                <p><span>详情信息：</span><textarea className='AddTextarea' style={{ 'height': '90px' }} defaultValue={problemRemark} onChange={(e) => this.changeProblemRemark(e)}></textarea></p>
                                <p>
                                    <span>上传文件：</span>
                                    <div className="upload" style={{ position: 'relative' }}>
                                        <input type="file" id='optUrl' ref={this.fileInputEl} accept=".jpg,.jpeg,.png,.mp4" hidden onChange={(event) => this.handlePhoto(event)} />
                                        <div onClick={() => { this.fileInputEl.current.click() }}>
                                            <img className="img1" src={UploadImg} alt="" />
                                            <img className='img2' src={UploadImg} alt="" style={{ 'display': 'none' }} />
                                            <h5>点击上传</h5>
                                        </div>
                                    </div>
                                </p>
                                <div className="submit" onClick={() => this.SaveBut()}>保存信息</div>
                            </div>
                        </div>
                    </div>
                    : null}
                {alarmFlag && <div className="Exception alarmFlag">
                    <Exception alarmValue={alarmValue} onClick={this.alarmBtn} title="巡逻异常信息"></Exception>
                </div>
                }
                <div className="AlarmButton OneAlarm" style={{ bottom: "400px" }} onClick={this.alarmBtn}>巡逻异常</div>
            </Fragment>
        )
    }
    receiveMessage = (event) => {
        //console.log(event);
        if (event !== undefined && event.data && event.data.name) {
            console.log('接受iframe的数据', event.data);
        }
    };
    handleClick = () => {
        const childFrameObj = document.getElementById('core_content');
        childFrameObj.contentWindow.postMessage(1233, '*');
    };
}

export default NormalWork;