import React,{Fragment,Component} from 'react';
import '../../../style/base.css';
import $ from 'jquery';
// 引入 ECharts 主模块
import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import axios from "axios";
import {Common} from "../../Cesium/method";
import avatorUrl from "../../../images/RenIcon.png";
import moment from "moment";



class Surveillance extends Component{
    constructor(props) {
        super(props);
        this.state={
            Date:[],
            Number:[],
            alarmNumber:[],
            startTime:'',//开始时间
            endTime:'',//结束时间
            renFaceImg:avatorUrl,//人脸照片
            RenType:0,//人脸图片类型
            RenName:'',//人脸库名称
            RenID:'',//人脸库证件
            RenList:[],//人脸库数据
            RouteTable:[],//轨迹表格
            RouteTable1:[],//轨迹生成数据
            Similarity:90,//相似度
        }
        Surveillance.this= this;
        this.fileInputEl = React.createRef();//上传图片所需属性
        this.onAlarm = this.onAlarm.bind(this); //点击展开
        this.RenButClick = this.RenButClick.bind(this);//点击人脸轨迹
        this.TimeSerch = this.TimeSerch.bind(this);//搜索
        this.RenClose = this.RenClose.bind(this);//关闭人脸历史轨迹
        this.faceDatabase = this.faceDatabase.bind(this);//人脸库
        this.RenIdSearch = this.RenIdSearch.bind(this);//搜索人脸库
        this.onTable = this.onTable.bind(this);//点击人脸库更换图片
        this.RenVideo = this.RenVideo.bind(this);//人脸回放
        this.PDF = this.PDF.bind(this); //生成报表
    }
    time(){
        var D=moment().format("YYYY.MM.DD HH:mm:ss");
        var SD=moment().format("YYYY.MM.DD");
        Surveillance.this.setState({startTime:SD+' 00:00:00',endTime:D})
    }
    //点击展开
    onAlarm(){
        $(".Two").toggle();
        $(".TwoAlarm").toggle();
        if($(".Two").is(':visible')){　　//如果node是隐藏的则显示node元素，否则隐藏
            axios.post(global.Url+'event/info/statisticsForDay',{day:30}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    var A=[];
                    var B=[];
                    for(var i=0;i<result.length;i++){
                        A.push(result[i].date);
                        B.push(result[i].count);
                    }
                    this.setState({
                        Date:A,
                        Number:B
                    })
                }else{
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }else{


        }

    }
    //点击人脸轨迹
    RenButClick(){
        $(".RenButBut").hide();
        $(".RenSearch").show();
    }
    componentDidMount() {
        this.time();
        //roamingDisplay
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                //  console.log( '我是react,我接受到了来自iframe的模型ID：', e.data);
                switch(e.data.switchName){
                    case 'TrackTracking':
                        console.log(e.data);
                        if(e.data.Personnel.state===true){
                            $(".IndexHome").css({'width':'100%','top':'0','zIndex':'100'});
                        }else{
                            $(".IndexHome").css({'width':'100%','top':'100px','zIndex':'0'});
                        }

                        break;
                    default:
                        return null;
                }

            }
        }
/*        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
        let baseUrl = global.WebSocketUrl;
        let webSocket = new WebSocket(baseUrl);
        webSocket.onopen = function (e) {
            //console.log('webSocket is open');
            webSocket.send('subscribe')
        }
        webSocket.onmessage = function (e) {
          //  var Data=JSON.parse(e.data);
          //  console.log(e.data,Data);
            if(e.data === 'subscribe success'){
                return
            }else{
                var listNumber=[];
                listNumber.push(JSON.parse(e.data));

                Surveillance.this.setState({
                    alarmNumber:listNumber
                })
                //global.WebList.push(JSON.parse(e.data));
                console.log(Surveillance.this.state.alarmNumber);
                Common.AlarmBox(JSON.parse(e.data));
                //let arr=global.WebList;
/!*                for (let i = 0; i < arr.length; i++) {
                    for (let j =i+1; j <arr.length; ) {
                        if (arr[i].event_info.id === arr[j].event_info.id) {
                            arr.splice(j, 1);
                        }
                        else j++;
                    }
                }
                if(global.AlarmShow){
                    console.log(arr);
                    for(let i=0; i<arr.length; i++){
                        Common.AlarmBox(arr[i]);
                    }
                }*!/
            }
        }*/
    }

    getOption =()=> {
        const {Date,Number} =this.state;
        let option = {
            tooltip:{
                trigger:'axis',
            },
            xAxis:{
                data:Date, //['周一','周二']
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
            },
            yAxis:{
                type:'value',
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
            },
            series:[
                {
                    name:'告警数量',
                    type:'line',   //这块要定义type类型，柱形图是bar,饼图是pie
                    data:Number,
                    areaStyle: {
                        normal: {
                            color: '#8cd5c2' //改变区域颜色
                        }
                    },
                }
            ]
        }
        return option
    }
    //改变开始时间
    inputStartChange(e){
        Surveillance.this.setState({
            startTime:e.target.value
        })
    }
    //改变结束时间
    inputEndChange(e){
        Surveillance.this.setState({
            endTime:e.target.value
        })
    }
    //改变相似度
    SimilarityChange(e){
        Surveillance.this.setState({
            Similarity:e.target.value
        })
    }
    //替换图片
    handlePhoto = async (event) => {
        var imgFile;
        let reader = new FileReader();     //html5读文件
        reader.readAsDataURL(event.target.files[0]);
        var that=this;
        reader.onload=function(event) {        //读取完毕后调用接口
            imgFile = event.target.result;
            that.setState({
                renFaceImg:imgFile,
                RenType:1
            })

        }
    }
    //关闭人脸历史轨迹
    RenClose(item){
        if(item===1){
            $(".RenButBut").show();
            $(".RenSearch").hide();
            $(".faceDatabase").hide();
            Common.closeHistoricalTrack();
        }else{
            $(".faceDatabase").hide();
        }

    }
    //打开人脸库
    faceDatabase(){
        $(".faceDatabase").show();
        axios.post(global.Url+'business/selectFacebank',{name:'',certificateNum:'',pageNo:1,pageSize:1000}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                setTimeout(function(){
                    Surveillance.this.setState({
                        RenList:result
                    })
                },0)

            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //改变人脸库名称
    renNameChange(e){
        Surveillance.this.setState({
            RenName:e.target.value
        })
    }
    //改变人脸库证件
    renIDChange(e){
        Surveillance.this.setState({
            RenID:e.target.value
        })
    }
    //搜索人脸库
    RenIdSearch(item){
        var data;
        if(item===1){
            const {RenName,RenID}= this.state;
            data={
                name:RenName,
                certificateNum:RenID,
                pageNo:1,pageSize:1000
            }
        }else{
            data={
                name:'',
                certificateNum:'',
                pageNo:1,pageSize:1000
            }
        }
        axios.post(global.Url+'business/selectFacebank',data).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                setTimeout(function(){
                    Surveillance.this.setState({
                        RenList:result
                    })
                },0)
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //更换图片
    onTable(ImgUrl){
        setTimeout(function(){
            Surveillance.this.setState({
                renFaceImg:ImgUrl,
                RenType:2,
            })
        },0)
        $(".faceDatabase").hide();
    }
    //搜索
    TimeSerch(){
        const {renFaceImg,startTime,endTime,RenType,Similarity} = this.state;
        if(startTime>endTime){
            $(".PageShow").show().find('h1').html('开始时间不能超过结束时间！');
            global.Time();
        }else{
            var data;
            if(RenType===0){
                $(".PageShow").show().find('h1').html('请选择照片');
                global.Time();
                return
            }else if(RenType===1){
              console.info("startTime",startTime)
                console.info("endTime",endTime)
                data={
                    minSimilarity:Similarity, //图片最小尺寸，最小传1
                    startTime:startTime,  //开始时间
                    endTime:endTime, // 结束时间  开始时间和结束时间要满足 2020-06-08T16:37:26.264Z。我做处理也行
                    facePicUrl:'', // 图片地址。以http开头的
                    facePicBinaryData:renFaceImg//  图片地址以base64开头的
                }
            }else if(RenType===2){
                data={
                    minSimilarity:Similarity, //图片最小尺寸，最小传1
                    startTime:startTime,  //开始时间
                    endTime:endTime, // 结束时间  开始时间和结束时间要满足 2020-06-08T16:37:26.264Z。我做处理也行
                    facePicUrl:renFaceImg, // 图片地址。以http开头的
                    facePicBinaryData:''//  图片地址以base64开头的
                }
            }
            console.log(data);
            axios.post(global.Url+'business/SearchImg',data).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    setTimeout(function(){
                        Surveillance.this.setState({
                            RouteTable:result.exist,
                            RouteTable1:result
                        })
                        Common.historicalTrack(result);
                    },0);
                    $(".faceButton1").show();
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //生成报表
    PDF(){
        Common.downloadPDFV2(Surveillance.this.state.RouteTable1);
    }
    //人脸回放
    RenVideo(code,time){
        //传参给刘其涛
        var data={
            camera:[
                {
                    code:code,
                    time:time
                }
            ],
        }
        Common.playback(data)
    }
    render(){
        const {renFaceImg,startTime,endTime,RenName,RenID,RenList,RouteTable,Similarity} = this.state;
        return(
            <Fragment>
                <div className="AlarmButton TwoAlarm" onClick={()=>this.onAlarm()}>报警趋势</div>
                <div className="AlarmShow Two" style={{'display':'none'}}>
                    <h1><span>报警趋势(7天)</span></h1>
                    <div className="AlarmContent">
                        <ReactEcharts option={this.getOption()} style={{height: '300px','marginTop':'-20px'}} className='react_for_echarts' />
                    </div>
                    <div className="But" onClick={()=>this.onAlarm()}></div>
                </div>
                <div className="RenBut">
                    <div className="RenButBut"><button onClick={()=>this.RenButClick()}>人脸轨迹查询</button></div>
                    <div className="RenSearch">
                        <div className="RenTop">
                            <h1>人脸历史轨迹查询 <i onClick={()=>this.RenClose(1)}></i></h1>
                            <div className="RenImg">
                                <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event)}/>
                                <img src={renFaceImg} alt=""/>
                            </div>
                            <div className="faceButtonArea">
                                <button className="faceUpload" onClick={() => {this.fileInputEl.current.click()}}>上传图片</button>
                                <button className="faceStore" onClick={()=>this.faceDatabase()}>人脸库</button>
                            </div>
                            <div className="faceTimeStamp">
                                <li><span>相似度</span><input type="text" onChange={(e)=>this.SimilarityChange(e)} defaultValue={Similarity} />%</li>
                                <li><span>起始时间</span><input type="data" onChange={(e)=>this.inputStartChange(e)} defaultValue={startTime}/></li>
                                <li><span>结束时间</span><input type="data" onChange={(e)=>this.inputEndChange(e)} defaultValue={endTime}/></li>
                            </div>
                            <div className="faceButton" onClick={()=>this.TimeSerch()}>搜索</div>
                            <div className="faceButton1" onClick={()=>this.PDF()}>生成报表</div>
                        </div>
                        <div className="RenTable">
                            <table>
                                <thead>
                                   <tr>
                                       <td>序号</td>
                                       <td>相机名称</td>
                                       {/*<td>操作</td>*/}
                                   </tr>
                                </thead>
                                <tbody>
                                    {
                                        RouteTable.length > 0 && RouteTable.map((ele,index)=>{
                                            return(
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{ele.cameraName}</td>
                                                   {/* <td><button onClick={()=>this.RenVideo(ele.device_code,ele.captureTime)}>回放</button></td>*/}
                                                </tr>
                                            )
                                        })
                                    }
                                    {RouteTable.length < 0?<div style={{'text-align':'center'}}>暂无数据</div>:null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="faceDatabase">
                        <h1>人脸库 <i onClick={()=>this.RenClose(2)}></i></h1>
                        <div className="faceDatabaseCont">
                            <div className="ContTitle">
                                <div className="ContTitleLeft">
                                    <span>姓名：</span><input type="text" onChange={(e)=>this.renNameChange(e)} defaultValue={RenName}/>
                                    <span>证件号：</span><input type="text" onChange={(e)=>this.renIDChange(e)} defaultValue={RenID}/>
                                </div>
                                <div className="ContTitleRight">
                                    <span onClick={()=>this.RenIdSearch(1)}><i></i>搜索</span>
                                    <span onClick={()=>this.RenIdSearch(2)}><i></i>重置</span>
                                </div>
                            </div>
                            <div className="ContList">
                                {
                                    RenList.length > 0 && RenList.map((ele,index)=>{
                                        return(
                                            <li key={index} onClick={()=>this.onTable(ele.facePic.faceUrl)}>
                                                <img src={ele.facePic.faceUrl} alt=""/>
                                                <p><span>姓名：</span>{ele.faceInfo.name}</p>
                                                <p><span>性别：</span>{ele.faceInfo.sex==='female'?'女':'男'}</p>
                                                <p><span>证件号：</span></p>
                                                <p>{ele.faceInfo.certificateNum}</p>
                                            </li>
                                        )
                                    })
                                }
                                {RenList.length < 0?<div style={{'text-align':'center','color':'#01a1ff'}}>暂无数据</div>:null}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Surveillance;