import React,{PureComponent,Fragment} from 'react';
import '../../../style/common.css';
import {actionCreators} from "../store";
import {connect} from "react-redux";
import {Common} from "../../Cesium/method";
import $ from "jquery";
import axios from "axios";
import time from "../../../images/time.png";

//`import Trace from "../childComponents/Trace";


let RelationalLock = {
    RainwaterSystem : true, //控制雨
    snowSystem : true, //控制雪
    Fogging : true, //控制雾
    enableLighting : true, //控制光照
    MeasurementHeight: true,//测高
    measureLineSpace:true,//测直线
    measureAreaSpace:true,//测面积
    onSurveillance:true,//虚拟化
    WeiShiDu: true,//温湿度
    ZhuiTi:false,//椎体展示
    UnderList:true,//地下展示
    VideoTracking:true,//视频追查
};

class More extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            activeBtn:false,
            kxList:{},//框选列表
            layerList:{},//人员定位列表
            guangboList:[],//广播模型
            checkGb:[],//被选中的设备
            songList:[],//歌单
            isSadian:false,
            isdianbo:false,
            DianData:{},//点的数据
            modelId:[],//绘制id
            XianData:{},//线的数据
            DataList:{},//相机列表
            lx_name:"",//线路名称
            lx_startTime:"",//开始时间
            lx_endTime:"",//结束时间
            stime:'',
            etime:'',
            xgList:[
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
                {name:"路线俺是",startTime:'2020-12-09 11:27:88',endTime:'2020-12-09 11:27:88'},
            ],
            allxgList:[],
            pageSize:0,
            allpageNum:0,
            xuhao:1
            
        }
        More.this = this;
        this.changeStatus = this.changeStatus.bind(this);
        this.JianKong = this.JianKong.bind(this);//点击监控点
        this.JianClose = this.JianClose.bind(this);//关闭监控点
        this.Flay = this.Flay.bind(this);//定位飞过去
        this.dianbo = this.dianbo.bind(this)//去点播
        this.Demand = this.Demand.bind(this)//点播
        this.selectItem = this.selectItem.bind(this)//多选
        this.Dian = this.Dian.bind(this)//点
        this.Xain = this.Xian.bind(this)//线
        this.CloseTrace = this.CloseTrace.bind(this)//线
        this.VideoSee = this.VideoSee.bind(this)//查看视频
    }
    componentDidMount() {
        this.getxgList();
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                //  console.log( '我是react,我接受到了来自iframe的模型ID：', e.data);
                switch(e.data.switchName){
                    case 'initBubble':
                        console.log(e.data);
                        sessionStorage.setItem('TadId',e.data.tabid);
                        break;
                    case 'SelectCameras':
                        console.log(e.data);
                        More.this.setState({
                            kxList:e.data.cameras.data
                        });
                        $(".JianKongList").show();
                        break;
                    case 'fage':
                        var ggg = e.data.songData
                        var songJects = [];
                        for(var i = 0;i<ggg.MP3.length;i++){
                            songJects.push(ggg.MP3[i].split('_'))
                        }
                        More.this.setState({songList:songJects});
                        break;
                    case 'drawPoint':
                        var pimd = More.this.state.modelId;
                        pimd.push(e.data.id);
                        console.log('点',e.data)
                        More.this.setState({
                            DianData:e.data.position,
                            modelId:pimd
                        })
                        var paramer = {
                            type:"point",
                            positions:[e.data.position]
                        }
                        console.log(paramer,'paramer')
                        axios.post('http://192.168.0.111:8090/33010403001/watch/drag/list',paramer).then((res) => {
                            console.log(res,'aaaaaaaaaa')
                            const result = res.data.data;
                            if(result && res.data.msg === 'success') {
                                console.log(result,'results')
                                More.this.setState({
                                    DataList:result
                                })
                                $(".Videist").show()
                                $(".TraceCT").css({'height':'500px'})
                            }else{
                                $(".PageShow").show().find('h1').html(res.data.msg);
                                global.Time();
                            }
                        })
                        //1.调取接口获取相机列表信息
                        // $(".Videist").show()
                        // $(".TraceCT").css({'height':'500px'})
                        break;
                    case 'drawPolyline':
                     	var pimd2 = More.this.state.modelId;
                        pimd2.push(e.data.id);
                        More.this.setState({
                            XianData:e.data.parameter,
                            modelId:pimd2
                        })
                        var paramerlist = {
                            type:"linestring",
                            positions:[e.data.parameter.position]
                        }
                        console.log(paramerlist,'paramerlist');
                        axios.post('http://192.168.0.111:8090/33010403001/watch/drag/list',paramerlist).then((res) => {
                            console.log(res,'bbbbbb')
                            const result = res.data.data;
                            if(result && res.data.msg === 'success') {
                                console.log(result,'results')
                                More.this.setState({
                                    DataList:result
                                })
                                $(".Videist").show()
                                $(".TraceCT").css({'height':'500px'})
                            }else{
                                $(".PageShow").show().find('h1').html(res.data.msg);
                                global.Time();
                            }
                        })
                        //1.调取接口获取相机列表信息

                        break;
                    
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    changeStatus(){
        this.setState({
            activeBtn:!this.state.activeBtn
        })
    }
    //定位飞过去
    Flay(e,item){
        e.stopPropagation();
        $("#layer"+ item.id).find('span').css({'color':'#54b2df'});
        $("#layer"+ item.id).siblings().find('span').css({'color':'#fff'});
        $(".layer_t").find('span').css({'color':'#fff'});
        console.log(item);
        //Common.CoordinateModelID(data);//飞过去
        //Common.returnData(item);
        Common.InitialPositioning(item);//飞过去
        var reg = new RegExp("/","g");//g,表示全部替换。
        var list = [];
        var modelId;
        var Floors= [];

        var FL = JSON.parse(sessionStorage.getItem('Floor'));
        FL.forEach(element => {
            element.Floorlists.forEach(FLIT => {
                Floors.push(FLIT)
            });

        });
        console.log(Floors);
        //FloorLists
        Floors.forEach(element => {
            if(element.model_url != null){
                //console.log(element.model_url.replace(reg,"_"))
                list.push ({
                    modelId : element.model_url.replace(reg,"_"),
                    order_num : element.order_num,
                    more: element
                })
            }
        });
        for (let i = 0; i <  Floors.length; i++) {
            if(Floors[i].id === item.floor_id){
                modelId=Floors[i].model_url.replace(reg,"_");
                if(Floors[i].model_url == null){return;}
                //Common.CoordinateModel(modelId);
                if(Floors[i].center_position == null){
                    if(modelId != null){
                        if(modelId.indexOf("DXS") !== -1){
                            Common.onMenuClickedV3(modelId,list);
                            Common.removefloorOther();
                        }else{
                            Common.onMenuClickedV2(modelId,list);
                        }
                        //Common.onMenuClickedV2(modelId,list);
                    }
                }else{
                    var xyz = Floors[i].center_position;
                    var xyzhpr = {y: xyz.y, x: xyz.x, z: xyz.z, h: xyz.heading, p: xyz.pitch,r: xyz.roll}
                    Common.onMenuClickedV2(modelId,list);
                    Common.CoordinateLocation(xyzhpr);
                    console.log("Floors",Floors[i].center_position);
                }
                break;
            }

        }
        Common.SadianUp()
    }
    //椎体的双击事件
    Vertebral(){
        if(RelationalLock.ZhuiTi){
            RelationalLock.ZhuiTi = false;
            Common.drawViewCentrum();
        }else{
            RelationalLock.ZhuiTi = true;
            Common.ViewShedclearModel();
        }
    }
    //测高的双击事件
    MeasurementHeight(){
        if(RelationalLock.MeasurementHeight){
            RelationalLock.MeasurementHeight = false;
            Common.MeasurementHeight();
        }else{
            RelationalLock.MeasurementHeight = true;
            Common.RemoveHeight();
        }
    }
    //测直线的双击事件
    measureLineSpace(){
        if(RelationalLock.measureLineSpace){
            RelationalLock.measureLineSpace = false;
            Common.measureLineSpace();
        }else{
            RelationalLock.measureLineSpace = true;
            Common.RemoveLine();
        }
    }
    //测面积的双击事件
    measureAreaSpace(){
        if(RelationalLock.measureAreaSpace){
            RelationalLock.measureAreaSpace = false;
            Common.measureAreaSpace();
        }else{
            RelationalLock.measureAreaSpace = true;
            Common.RemoveArea();
        }
    }
    //雪的双击事件
    snowSystem(){
        if(RelationalLock.snowSystem){
            RelationalLock.snowSystem = false;
            Common.snowSystemV2();
        }else{
            RelationalLock.snowSystem = true;
            Common.snowDelete();
        }
    }
    //雨的双击事件
    RainwaterSystem(){
        if(RelationalLock.RainwaterSystem){
            RelationalLock.RainwaterSystem = false;
            Common.RainwaterSystemV2();
        }else{
            RelationalLock.RainwaterSystem = true;
            Common.RainDelete();
        }
        //alert('a');
    }
    //雾的双击事件
    Fogging(){
        if(RelationalLock.Fogging){
            RelationalLock.Fogging = false;
            Common.Fogging();
        }else{
            RelationalLock.Fogging = true;
            Common.fogDelete();
        }
    }
    //光照的双击事件
    enableLighting(){
        if(RelationalLock.enableLighting){
            RelationalLock.enableLighting = false;
            Common.enableLightingV2();
        }else{
            RelationalLock.enableLighting = true;
            Common.lightDelete();
        }
    }
    //虚拟化事件
   Surveillance(){
        if(RelationalLock.onSurveillance){
            RelationalLock.onSurveillance = false;
            Common.onSurveillance();
        }else{
            RelationalLock.onSurveillance = true;
            Common.onMap();
        }
    }
    //视频追查
    SPZC(){
        if(RelationalLock.VideoTracking){
            RelationalLock.VideoTracking = false;
            $(".TraceCT").show();
        }else{
            RelationalLock.VideoTracking = true;
            $(".TraceCT").hide();
            $(".Videist").hide()
            $(".TraceCT").css({'height':'200px'})
            const {modelId}=this.state;
            if(modelId.length>0){
                modelId.forEach((element)=>{
                    Common.RemoveDX(element)
                })
            }
        }
    }
    UnderList(){

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

        if(RelationalLock.UnderList){
            console.log('打开')
            RelationalLock.UnderList = false;
            Common.BuildingShow({show : false});
            More.this.Under();
        }else{
            console.log('关闭')
            RelationalLock.UnderList = true;
            Common.BuildingShow({show : true});
        }
    }
    //显示地下内容
    Under(){
        axios.get(global.Url+'map/under/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                Common.UndergroundInspection({buildList:result})//显示地下模型
                $("#liu").css({'display':'block'});
                $("#liu").find(".configShowNav").find("span").html('地下室');
                var data={
                    result,
                    number:1
                }
                Common.returnData(data)
            }
        })
/*        axios.get(global.Url+'map/modify/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                if(result.length>0){
                    for(var i=0;i<result.length;i++){
                        Common.ExhibitionPit(result[i].options.position);//展示挖好的模型
                    }
                }

            }
        })*/
    }
    //可视区域
    See(){
        More.this.Vertebral();
        // axios.get(global.Url+'map/area/AllList').then((res) => {
        //     const results = res.data.data;
        //     //console.log(results);
        //     if(results.length>0 && res.data.msg === 'success'){
        //         for(let i=0; i<results.length; i++){
        //             console.log(results[i]);
        //             Common.VisibleArea(results[i]);//点线面展示
        //         }
        //     }else{
        //        return null;
        //     }
        // })
    }
    //温湿度的双击事件
    WeiShiDu(){
        if(RelationalLock.WeiShiDu){
            RelationalLock.WeiShiDu = false;
            Common.initBubble();
        }else{
            RelationalLock.WeiShiDu = true;
            var data={
                id:sessionStorage.getItem('TadId'),
                type:0
            }
            Common.removeBubbleBombbox(data);  //e.data.parameter.id,null,null,e.data.parameter.type
        }
    }
    //点击监控点
    JianKong(name){
        console.log(name)
        let data={
            id:name.id,
        }
       // console.log(name);
        Common.CoordinateModelID(data);//飞过去
        Common.returnData(name)

    }
    //关闭监控点
    JianClose(){
        More.this.setState({
            kxList:{}
        })
        $("#liu,.JianKongList").hide();
        Common.onResetCoordinates();
    }
    RenClose(){
        More.this.setState({
            layerList:{}
        })
        $("#liu,.renList").hide();
        var type='_2DPositioningBox';
        Common.deletePositioning(type)
        var reg = new RegExp("/","g");//g,表示全部替换。
        var list = [];
        var Floors=JSON.parse(sessionStorage.getItem('Floor'));;
        for (let i = 0; i <  Floors.length; i++) {
            if(Floors[i].model_url != null){
                list.push ({
                    modelId : Floors[i].model_url.replace(reg,"_"),
                    order_num : Floors[i].order_num,
                })
            }
        }
        console.log(JSON.parse(sessionStorage.getItem('Floor')),list);
        if(list.length>0){
            if(!(list[0].modelId.indexOf('DXS') !== -1)){
                Common.ShowSpecifiedModel(list);
            }
        }
        Common.BuildingShow({show : true});
        //关闭楼层
        $("#liu").css({'display':'none'});
    }
    gbClose(){
        $("#liu,.gbList").hide();
        $("#liu,.gdList").hide();
    }
    gdClose(){
        $("#liu,.gdList").hide();
    }
    dianbo(){
        let gbArr = [];
        $("#gblb input:checkbox[name='song']:checked").each(function(i){
            gbArr.push($(this).val());
        });

        More.this.setState({
            checkGb:gbArr,
        });
        $(".gdList").show();
        $(".gbList").hide();

        console.log(gbArr,'gbArr')
    }
    Demand(mp3,type){
        const {checkGb} = this.state
        Common.moreDemand(mp3,checkGb,type)

        // checkGb.shift()
        // for(var i = 0; i < checkGb.length; i++) {
        //     if(checkGb[i] === "") {
        //         checkGb.splice(i,1);
        //         i = i - 1;
        //         console.log(checkGb);
        //         Common.moreDemand(mp3,checkGb,type)
        //     }
        // }
    }
    selectItem(e,item){
        if(item.device_name ===  "全选"){
            $("#gblb input:checkbox[name='song']").each(function(i){
                $(this).get(0).checked = e.target.checked
            });
        }else{
            if(!e.target.checked){
                $("#gblb input:checkbox[name='song']").each(function(i){
                    if($(this).get(0).value === '00'){
                        $(this).get(0).checked = false
                    }
                });
            }
        }



        var arr = [];
        $("#gblb input:checkbox[name='song']").each(function(i){
            arr.push({
                blena:$(this).get(0).checked
            })
        })
    }
    //点
    Dian(){
        const {modelId} =this.state;
        if(modelId.length>0){
            modelId.forEach((element)=>{
                Common.RemoveDX(element)
            })
        }
        Common.drawPoint();
        More.this.setState({
            DataList:{}
        })
        $(".Videist").hide()
        $(".TraceCT").css({'height':'200px'})
    }
    //线
    Xian(){
        const {modelId} =this.state;
        if(modelId.length>0){
            modelId.forEach((element)=>{
                Common.RemoveDX(element)
            })
        }
      var  Polyline_style={  //折线参数
            PolylineWitch:'10',//线条宽度
            PolylineColor:'yellow',
            borderWitchPolyline:'5',//边框宽度
            borderColor:'#ff0000',//边框衬色颜色
            borderTransparencyPolyline:'100'
        }
       var data={
            Polyline_style:Polyline_style
        };
        Common.drawPolyline(data)
        More.this.setState({
            DataList:{}
        })
        $(".Videist").hide()
        $(".TraceCT").css({'height':'200px'})
    }
    //清除
    CloseTrace(){
        const {modelId}=this.state;
        if(modelId.length>0){
            modelId.forEach((element)=>{
                Common.RemoveDX(element)
            })
        }
        $(".Videist").hide()
        $(".TraceCT").css({'height':'200px'})
    }
    //查看视频
    VideoSee(e,ID){
        console.log(e,ID);
        Common.spzcsp(ID)
    }
    //关闭巡更统计
    closeXG(){
        $('.xgtj').hide();
    }
    //路线名
    lx_name(e){
        this.setState({
            lx_name:e.target.value
        })
    }
    //巡更时间
    timeChange(showTime,time,e){
        var date = new Date(e.target.value)
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        var strDate = Y+M+D+h+m+s;
        console.log(strDate,e.target.value)
        this.setState({
            [showTime]:e.target.value,
            [time]:strDate
        })
    }
    //获取巡更统计数据
    getxgList(){
        const {pageSize} = this.state
        axios.get(global.Url+'patrol/statistics/list').then((res) => {
            const result = res.data.data;
            if(result) {
                this.setState({xgList:result[pageSize],allxgList:result,allpageNum:res.data.count})
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //搜索巡更记录
    handleSearch(){
        const {lx_name,stime,etime} = this.state;
        axios.post(global.Url+'patrol/statistics/list',{patrol_name:lx_name,start_time:stime,end_time:etime}).then((res) => {
            const result = res.data.data;
            if(result) {
                this.setState({xgList:result[0],pageSize:0,allxgList:result,allpageNum:res.data.count})
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //重置巡更搜索
    handleRest(){
        this.setState({lx_name:"",stime:"",etime:"",lx_startTime:"",lx_endTime:""})
    }
    //巡逻上下一页
    pageButoon(name){
        const {allxgList,pageSize} = this.state;
        let count = pageSize;
        var xuhao2;
        if(name === 'pre'){
            if(count === 0){
                $(".PageShow").show().find('h1').html('没有数据辣！');
                global.Time();
                return;
            }else{
                count--;
                xuhao2 = count*7+1
            }
        }else{
            if(count === allxgList.length-1){
                $(".PageShow").show().find('h1').html('没有数据辣！');
                global.Time();
                return;
            }else{
                count++;
                xuhao2 = count*7+1
            }
        }
        this.setState({
            pageSize:count,
            xgList:allxgList[count],
            xuhao:xuhao2
        })
    }
    render(){
        const {index,clickIcon,moreIndex,clickIconItem,clickIconItemNav} = this.props;
        const {activeBtn,kxList,layerList,guangboList,songList,DataList,lx_name,lx_startTime,lx_endTime,xgList,allpageNum,pageSize,xuhao} = this.state;
        return(
            <Fragment>
                <li onClick={() => {clickIcon(3);this.changeStatus()}} className={activeBtn && index === 3  ? 'active' :''}>
                    <i className="icon3"></i><span>更多</span>
                </li>
                {index === 3 && activeBtn ?
                    <div className="MoreShow">
                        {/*<div className="MoreItem" id="MoreItem1" onClick ={(even) => clickIconItem(even,1)} ><i className="more11"></i>温湿度</div>*/}
                        <div className="MoreItem" id="MoreItem1" onClick ={(even) => clickIconItem(even,1)} ><i className="more12"></i>相机视野</div>
                   {/*     <div className="MoreItem" id="MoreItem1" onClick ={(even) => clickIconItem(even,1)} ><i className="more1"></i>图层</div>*/}
                        <div className="MoreItem" id="MoreItem2" onClick ={(even) => clickIconItem(even,2)} ><i className="more2"></i>漫游</div>
                        <div className="MoreItem" id="MoreItem3" onClick ={(even) => clickIconItem(even,3)}  >
                            <i className="more3"></i>量测
                            {
                                moreIndex === 3 ?
                                    <div className="LcShow">
                                        <div className="LcItem" id="LcItem1" onClick ={(even) => clickIconItemNav(even,1)}>测高</div>
                                        <div className="LcItem" id="LcItem2" onClick ={(even) => clickIconItemNav(even,2)}>测距</div>
                                        <div className="LcItem" id="LcItem3" onClick ={(even) => clickIconItemNav(even,3)}>测面积</div>
                                    </div>
                                    : " "
                            }
                        </div>
                        <div className="MoreItem" id="MoreItem4" onClick ={(even) => clickIconItem(even,4)}>
                            <i className="more4"></i>特效
                            {
                                moreIndex === 4 ?
                                    <div className="LcShow">
                                        <div className="LcItem" id="LcItem4" onClick ={(even) => clickIconItemNav(even,4)}><span>雨</span> <i className="LcIcon1"></i></div>
                                        <div className="LcItem" id="LcItem5" onClick ={(even) => clickIconItemNav(even,5)}><span>雪</span> <i className="LcIcon2"></i></div>
                                        <div className="LcItem" id="LcItem6" onClick ={(even) => clickIconItemNav(even,6)}><span>雾</span> <i className="LcIcon3"></i></div>
                                        <div className="LcItem" id="LcItem7" onClick ={(even) => clickIconItemNav(even,7)}><span>光照</span> <i className="LcIcon4"></i></div>
                                    </div>
                                    : " "
                            }
                        </div>
                        <div className="MoreItem" id="MoreItem5" onClick ={(even) => clickIconItem(even,5)}><i className="more5"></i>地下</div>
                        <div className="MoreItem" id="MoreItem6" onClick ={(even) => clickIconItem(even,6)}><i className="more6"></i>虚拟化</div>
                        {/* <div className="MoreItem" id="MoreItem14" onClick ={(even) => clickIconItem(even,14)}><i className="more14"></i>视频追查</div> */}
                        {/* <div className="MoreItem" id="MoreItem7" onClick ={(even) => clickIconItem(even,7)}><i className="more7"></i>地图信息</div> */}
                        <div className="MoreItem" id="MoreItem8" onClick ={(even) => clickIconItem(even,8)}><i className="more13"></i>框选</div>
                         {/* <div className="MoreItem" id="MoreItem9" onClick ={(even) => clickIconItem(even,9)}><i className="more7"></i>人员定位</div> */}
                         {/* <div className="MoreItem" id="MoreItem10" onClick ={(even) => clickIconItem(even,10)}><i className="more8"></i>点播</div> */}
                         {/* <div className="MoreItem" id="MoreItem10" onClick ={(even) => clickIconItem(even,15)}><i className="more8"></i>巡更统计</div> */}

                    </div>
                    : ''}
                <div className="JianKongList">
                    <h1>监控点列表 <i onClick={()=>this.JianClose()}></i></h1>
                    <ul>
                        {
                            kxList.length >0 && kxList.map(
                                (name,i) => {
                                    return  <li key={i} className={"Data2"+name.id} onClick={()=>this.JianKong(name)}><i></i>{name.device_name}</li>
                                }
                            )
                        }
                    </ul>
                </div>
                <div className="renList">
                    <h1>人员定位列表 <i onClick={()=>this.RenClose()}></i></h1>
                    <ul>
                        {
                            layerList.length > 0 && layerList.map(
                                (item,index) => {
                                    return  <li key={index} className='layer' id={'layer'+ item.id} onClick={(e)=>this.Flay(e,item)}><span title={item.name}>{item.name}</span>

                                    </li>
                                }
                            )
                        }
                    </ul>
                </div>

                <div className="gbList">
                    <h1>广播设备列表<i onClick={()=>this.gbClose()}></i></h1>
                    <div className="contentg">
                        <ul id="gblb">
                            {
                                guangboList.length > 0 && guangboList.map(
                                    (item,index) => {
                                        return  <li key={index} className={'gbli'+ item.id}>
                                                    <label><input type="checkbox" name="song" value={item.device_code} onChange={(e)=>this.selectItem(e,item)} />{item.device_name}</label>
                                                </li>
                                    }
                                )
                            }
                        </ul>
                    </div>
                    <div className="gbutton" onClick={()=>this.dianbo()}>点播</div>
                </div>

                <div className="gdList">
                    <h1>歌单列表<i onClick={()=>this.gdClose()}></i></h1>
                    <div className="contentg">
                        <ul id="gblb">
                            {
                                songList.length > 0 && songList.map(
                                    (item,index) => {
                                        return  <li key={index} className='gdli'>
                                                    <span title={item.type_name}>{item[0]}</span>
                                                    <div className="caozuo">
                                                        <div className="dianbo"  onClick={()=>this.Demand(item[1],'0')}>点播</div>
                                                        <div className="guaduan" onClick={()=>this.Demand(item[1],'1')}>挂断</div>
                                                    </div>

                                                </li>
                                    }
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className='TraceCT'>
                    <h2 className="Trace_tit"> <span>相机追查</span></h2>
                    <div className="Trace">
                        <span onClick={()=>this.Dian()}>点</span><span onClick={()=>this.Xian()}>线</span><span onClick={()=>this.CloseTrace()}>清除</span>
                    </div>
                    <div className="Videist">
                        {
                            DataList.length>0&& DataList.map(
                                (item,index) => {
                                    return  <div className="Videospotlist" key={index}><i>{item.device_name}</i><span onClick={(e)=>this.VideoSee(e,item.device_code)}>查看视频</span></div>

                                }
                            )
                        }
                    </div>
                </div>
                <div className="xgtj">
                    <div className="xgtj_title">
                        <h1>巡更统计查询<i onClick={()=>this.closeXG()}></i></h1>
                    </div>
                    <div className="xgtj_search">
                        <ul>
                            <li>
                                <p>线路名称：</p>
                                <input type="text" value={lx_name} onChange={this.lx_name.bind(this)}/>
                            </li>
                            <li>
                                <p>起始时间：</p>
                                <input type="datetime-local" step="01" id="myLocalDate" value={lx_startTime} onChange={this.timeChange.bind(this,'lx_startTime','stime')}/>
                                <img src={time} alt="" style={{width:"25px",height:"25px",position:"absolute",left: "469px",top: "38px",zIndex:"-1"}}/>
                              </li>
                            <li>
                                <p>结束时间：</p>
                                <input type="datetime-local" step="01" id="myLocalDate" value={lx_endTime} onChange={this.timeChange.bind(this,'lx_endTime','etime')}/>
                                <img src={time} alt="" style={{width:"25px",height:"25px",position:"absolute",left: "750px",top: "38px",zIndex:"-1"}}/>
                            </li>
                        </ul>
                        <div className="xgtj_button">
                            <button onClick={this.handleSearch.bind(this)}>搜索</button>
                            <button onClick={this.handleRest.bind(this)}>重置</button>
                        </div>
                    </div>
                    <div className="xgtj_table">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width:"97px"}}>序号</th>
                                    <th style={{width:"230px"}}>线路名称</th>
                                    <th style={{width:"290px"}}>开始时间</th>
                                    <th style={{width:"290px"}}>结束时间</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    xgList.length <=0 ?
                                        <tr>
                                            <td style={{width:"97px"}}>暂无数据</td>
                                            <td style={{width:"230px"}}>暂无数据</td>
                                            <td style={{width:"290px"}}>暂无数据</td>
                                            <td style={{width:"290px"}}>暂无数据</td>
                                        </tr>
                                    :
                                    xgList.map((item,index)=>{
                                        return(
                                            <tr key={index}>
                                                <td style={{width:"97px"}}>{index+xuhao}</td>
                                                <td style={{width:"230px"}}>{item.patrol_name}</td>
                                                <td style={{width:"290px"}}>{item.start_time}</td>
                                                <td style={{width:"290px"}}>{item.end_time}</td>
                                            </tr>
                                        )
                                    })
                                }              
                            </tbody>
                        </table>
                    </div>
                    <div className="xgtj_page">
                        <div className="pageData">
                            <p>共计：{allpageNum} 条巡逻记录！ 当前为第 {pageSize+1} 页！</p>
                        </div>
                        <div className="pageButton">
                            <div className="prePage" onClick={this.pageButoon.bind(this,'pre')}>上一页</div>
                            <div className="nextPage"onClick={this.pageButoon.bind(this,'next')}>下一页</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapState = (state) => {
    return{
        index:state.footer.get('index'),
        moreIndex:state.footer.get('moreIndex'),
        moreIndexItem:state.footer.get('moreIndexItem'),
    }
};

const mapDispatch = (dispatch) => ({
    clickIcon(item) {
        //关闭地下
        Common.BuildingShow({show : true});
        //关闭楼层
        $("#liu").css({'display':'none'});
        dispatch(actionCreators.click_Icon(item));
    },
    clickIconItem(e,item) {
        //关闭地下
        //Common.BuildingShow({show : true});
        //关闭楼层
        $("#liu").css({'display':'none'});
        e.stopPropagation(); //阻止上级事件 或者e.preventDefault();
        dispatch(actionCreators.click_Icon_Item(item));
        $(".MoreShow").children(".MoreItem").removeClass('active');
        $("#MoreItem"+item).addClass('active');
        $(".TraceCT").hide();
        switch (item) {
            case 1:
                //alert('图层事件');
                //More.this.WeiShiDu();  //温湿度
                More.this.See();
                break;
            case 2:
                //alert('漫游事件');
                // Common.FlightRoaming();
                Common.manyouhh();
                More.this.setState({activeBtn:!More.this.state.activeBtn})
                break;
            case 5:
                //alert('地下事件');
                //Common.FlightRoaming();
                //Common.BuildingShow({show : false});
                More.this.UnderList();//展示地下挖好的模型
                break;
            case 6:
                //alert('虚拟化事件');
                More.this.Surveillance();
                break;
            case 7:
                //alert('地图信息事件');
                break;
            case 8:
                //alert('框选');
                Common.SelectCameras();
                break;
            case 9:
                axios.get(global.Url+'base/station/list',{}).then((res) => {
                    const result = res.data.data;
                    if(result && res.data.msg === 'success') {
                        console.log(res);
                        More.this.setState({
                            layerList:result
                        })
                        $(".renList").show();
                    }else{
                        alert(res.msg)
                    }

                })
               /* if(More.this.state.isSadian){
                    Common.SadianDown()
                    More.this.setState({isSadian:false})
                }else{
                    Common.SadianUp()
                    More.this.setState({isSadian:true})
                }*/
                break;
            case 10:
                $(".PageShow").show().find('h1').html('加载广播列表中...');
                axios.post(global.Url+'device/info/list',{}).then((res) => {
                    var modelData = res.data.data
                    if(modelData){
                        var guangboData = [];
                        for(var i=0;i<modelData.length;i++){
                            //5C4F5A04A7B49043C15962B40936A75B
                            //AC15BF0E7C69C740D288D573A85EDDFC
                            if(modelData[i].category_id === "AC15BF0E7C69C740D288D573A85EDDFC"){
                                guangboData.push(modelData[i])
                            }else{
                                $(".PageShow").show().find('h1').html('暂无广播设备！');
                                setTimeout(()=>{
                                    $(".PageShow").hide();
                                },800)
                            }
                        }
                        var obj = {
                            device_code:'00',
                            device_name:'全选'
                        }
                        guangboData.unshift(obj)
                        console.log(guangboData,'数组')
                        More.this.setState({guangboList:guangboData})
                        if(guangboData.length>0){
                            $(".PageShow").hide();
                        }
                        $(".gbList").show();
                    }else{
                        alert('暂无广播设备')
                    }
                })
                break;
            case 14:
                //return <Trace></Trace>;
                //$(".TraceCT").show();
                 More.this.SPZC()
                 break;
            case 15:
                $('.xgtj').show();
                break;
            default:
                return null;
        }
    },
    clickIconItemNav(even,item) {
        even.stopPropagation(); //阻止合成事件的冒泡
        dispatch(actionCreators.click_Icon_Item_Nav(item));
        $("#LcItem"+item).toggleClass('active');
        switch (item) {
            case 1:
                //alert('测高事件');
                More.this.MeasurementHeight();
                break;
            case 2:
                //alert('测距事件');
                More.this.measureLineSpace();
                break;
            case 3:
                //alert('测面积事件');
                More.this.measureAreaSpace();
                break;
            case 4:
                //雨事件
                //alert('雨事件');
                More.this.RainwaterSystem();
                break;
            case 5:
                //雪事件
                //alert('雪事件');
                More.this.snowSystem();
                break;
            case 6:
                //alert('雾事件');
                More.this.Fogging();
                // Weather.C();
                break;
            case 7: 
                //光照事件
                //alert('光照事件');
                More.this.enableLighting();
                break;
            default:
                return null;
        }
    }
});
export default connect(mapState,mapDispatch)(More);