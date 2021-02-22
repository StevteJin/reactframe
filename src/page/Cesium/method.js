import $ from "jquery";

let frame;
//let Url = "http://192.168.0.211:8080/MapApi/API/PostData/API/GetFiles";
export const Common = {
    List(){
        frame=document.getElementById("core_content");
        //初始化需执行点击获取坐标事件
        //初始化加载蓝框
        var sendData={
            Event : '',
            ModName : "initEarth",
            parameter : global.Url
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
        sendData={
            Event : '',
            ModName : "InitializeBase",
            parameter : {
                Serverurl:sessionStorage.getItem('Serverurl'),
                data_type:sessionStorage.getItem('data_type'),
                APIURL:global.Url,
                green:true,
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
        //获取坐标事件
        sendData.Event='ClickCoordinates()';
        sendData.ModName="";
        sendData.parameter={};
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //初始化广州医科大学门禁
    InitializeAccessControl(){
        frame=document.getElementById("core_content");
        //初始化需执行点击获取坐标事件
        //初始化加载蓝框
        var sendData={
            Event : '',
            ModName : "initEarth",
            parameter : global.Url
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
        sendData={
            Event : '',
            ModName : "InitializeAccessControl",
            parameter : {
                Serverurl:sessionStorage.getItem('Serverurl'),
                data_type:sessionStorage.getItem('data_type'),
                APIURL:global.Url,
                green:true,
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
        //获取坐标事件
        sendData.Event='ClickCoordinates()';
        sendData.ModName="";
        sendData.parameter={};
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //三维地图
    onMap(){
        Common.closeHistoricalTrack();
        var sendData={
            Event : '',
            ModName : "InitializeBase",
            parameter : {
                Serverurl:sessionStorage.getItem('Serverurl'),
                data_type:'normal',
                APIURL:global.Url,
                green:true,
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //资源图谱
    onResource(){
        var sendData={
            Event : '',
            ModName : "InitializeBase",
            parameter : {
                Serverurl:sessionStorage.getItem('Serverurl'),
                data_type:'normal',
                green:false,
                APIURL:global.Url
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //布控警戒
    onSurveillance(){
        var sendData={
            Event : '',
            ModName : "InitializeBase",
            parameter : {
                Serverurl:sessionStorage.getItem('Serverurl'),
                data_type:'virtual',
                APIURL:global.Url,
                green:true,
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //点击复位
    onResetCoordinates(){
        var sendData={
            Event : '',
            ModName : "ResetCoordinates",
            parameter : {
                APIURL:global.Url,
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //点击获取坐标位置
    onRetrospectiveCameraView(){
        var sendData={
            Event : 'RetrospectiveCameraView('+ sessionStorage.getItem("dataZB") +')',
            ModName : "",
            parameter : {

            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //点击获取当前位置
    onCoordinate(){
        var sendData={
            Event : '',
            ModName : "getCameraView",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //点击位置获取坐标
    ClickCoordinates(){
        var sendData={
            Event : 'ClickCoordinates()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //点击指北按钮
    onNorth(){
        var sendData={
            Event : '',
            ModName : "FaceNorth",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //漫游飞行
    FlightRoaming(){
        var sendData={
            Event : 'FlightRoaming()',
            ModName : "",
            parameter :{
                data :
                    [
                        { longitude: 121.40564823189915, dimension: 31.21298123666682, height: 0, time: 0 },
                        { longitude: 121.40751023270903, dimension: 31.212981239617275, height: 0, time: 5 },
                        { longitude: 121.40752270803132, dimension: 31.21208752552693, height: 0, time: 10 },
                    ],
                flyTovalue : { x:121.40564823189915,y:31.21298123666682,z:2000}
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    manyouhh(){
        var sendData={
            Event : 'manyouhh()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //测高
    MeasurementHeight(){
        var sendData={
            Event : 'MeasurementHeight()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //清除测高
    RemoveHeight(){
        var sendData={
            Event : 'RemoveHeight()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //测距
    measureLineSpace(){
        var sendData={
            Event : 'measureLineSpace()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //清除测距
    RemoveLine(){
        var sendData={
            Event : 'RemoveLine()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //测面积
    measureAreaSpace(){
        var sendData={
            Event : 'measureAreaSpace()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //清除测面积
    RemoveArea(){
        var sendData={
            Event : 'RemoveArea()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //雨
    RainwaterSystemV2(){
        var sendData={
            Event : 'RainwaterSystemV2()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //清除雨
    RainDelete(){
        var sendData={
            Event : 'RainDelete()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //清除雪
    snowDelete(){
        var sendData={
            Event : 'snowDelete()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //雪
    snowSystemV2(){
        var sendData={
            Event : 'snowSystemV2()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    lightDelete() {
        var sendData={
            Event : 'lightDelete()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //光照
    enableLightingV2(){
        var sendData={
            Event : 'enableLightingV2()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //起雾
    Fogging(){
        var sendData={
            Event : 'Fogging()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //删除雾
    fogDelete(){
        var sendData={
            Event : 'fogDelete()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //光照
    enableLighting(){
        var sendData={
            Event : 'enableLighting()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //定位
    CoordinateLocation(mapPosition){
        var sendData={
            Event : '',
            ModName : "CoordinateLocation",
            parameter : {
                x:mapPosition.x,
                y:mapPosition.y,
                z:mapPosition.z,
                h:mapPosition.h,
                p:mapPosition.p ,
                r:mapPosition.r,
                duration : 3
            }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //截图
    InterceptImg(){
        var sendData={
            Event : 'InterceptImg()',
            ModName : "",
            parameter : {
            }
        }
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //标签跟随鼠标
    GeoaddlabelV2(txt,id){
        var sendData={
            Event : '',
            ModName : "GeoaddlabelV2",
            parameter : {labeltxt : txt,labelid:id}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //修改标签属性
    ModifyLabel(labelparameter){
        var sendData={
            Event : '',
            ModName : "ModifyLabel",
            parameter : labelparameter
        };
        // {labeltxt : ,x:,y:,z:}
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //楼层抬高查看
    onMenuClickedV2(modid,list){
        var sendData={
            Event : '',
            ModName : "onMenuClickedV2",
            parameter : {id:modid,items:list}
        };
        // {labeltxt : ,x:,y:,z:}
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //楼层抬高查看
    onMenuClickedV3(modid,list){
        var sendData={
            Event : '',
            ModName : "onMenuClickedV3",
            parameter : {id:modid,items:list}
        };
        // {labeltxt : ,x:,y:,z:}
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //根据id查询模型进行定位
    CoordinateModel(modid){
        var sendData={
            Event : '',
            ModName : "CoordinateModel",
            parameter : {id:modid}
        };
        // {labeltxt : ,x:,y:,z:}
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //根据id查询模型进行定位
    ShowSpecifiedModel(list){
        var sendData={
            Event : '',
            ModName : "ShowSpecifiedModel",
            parameter : {items:list}
        };
        // {labeltxt : ,x:,y:,z:}
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //设置标注
    GeoaddlabelV3(data){
        var sendData={
            Event : '',
            ModName : "GeoaddlabelV3",
            parameter : data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    //根据ID查询并展示模型
    CustomView(id) {
        var sendData = {
            Event: '',
            ModName: 'CustomView',
            parameter: { id }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },

    //根据ID查询清除模型
    ClearCustomView(id) {
        var sendData = {
            Event: '',
            ModName: 'ClearCustomView',
            parameter: { id }
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //重置标注
    ResetLabel(){
        var sendData = {
            Event: 'ResetLabel()',
            ModName: '',
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //画点
    drawPoint(data){
        var sendData = {
            Event: '',
            ModName: 'drawPoint',
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //画折线
    drawPolyline(data){
        var sendData = {
            Event: '',
            ModName: 'drawPolyline',
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //画多边形
    drawPolygon(data){
        var sendData = {
            Event: '',
            ModName: 'drawPolygon',
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //上图片
    AddPictureLabel(data){
        var sendData = {
            Event: '',
            ModName: 'AddPictureLabel',
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //点线面展示
    ClickDisplayLayer(data){
        var sendData = {
            Event: '',
            ModName: 'ClickDisplayLayer',
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //点线面模型删除
    Emptyentities(data){
        var sendData = {
            Event: '',
            ModName: 'Emptyentities',
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //修改图片联动
    Modifybillboard(data){
        var sendData = {
            Event: '',
            ModName: 'Modifybillboard',
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData, "*");
    },
    //点线面修改保存之前清空拖拽事件模型
    ClearHandler(){
        var sendData={
            Event : 'ClearHandler()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //修改折线,多边形联动
    editEntity(){
        var sendData={
            Event : 'editEntity()',
            ModName : "",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //修改折线
    ModifyPolyline(data){
        var sendData={
            Event : '',
            ModName : "ModifyPolyline",
            parameter : data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //修改多边形
    ModifyPolygon(data){
        var sendData={
            Event : '',
            ModName : "ModifyPolygon",
            parameter : data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //网格接受参数
    PreviewGrid(data){
        var sendData={
            Event : '',
            ModName : "PreviewGrid",
            parameter : data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //修改网格参数
    modifyGrid(data){
        var sendData={
            Event : '',
            ModName : "modifyGrid",
            parameter : data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //单个网格展示
    showGrid(data){
        var sendData={
            Event : '',
            ModName : "showGrid",
            parameter : data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //资源图谱
    AddBubbleLabel(data){
        var sendData= {
            Event: '',
            ModName: "AddBubbleLabel",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //资源图谱子类
    CoordinateModelID(data){
        var sendData= {
            Event: '',
            ModName: "CoordinateModelID",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //飞行到地下室
    dxsFlyTo(data){
        var sendData= {
            Event: '',
            ModName: "dxsFlyTo",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //删除资源图谱气泡
    removeBubbleLabel(data){
        var sendData= {
            Event: '',
            ModName: "removeBubbleLabel",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //报警
    AlarmBox(data){
        var sendData= {
            Event: '',
            ModName: "AlarmBox",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //删除报警
    removeBubbleBombox(data){
        var sendData= {
            Event: '',
            ModName: "removeBubbleBombox",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //修改模型坐标
    ModifyModelCoordinates(data){
        var sendData= {
            Event: '',
            ModName: "ModifyModelCoordinates",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //根据ID移除指定模型
    remove3DTilesV2(data){
        var sendData= {
            Event: '',
            ModName: "remove3DTilesV2",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //删除视角旋转
    DeletePerspectiveFollow(){
        var sendData= {
            Event: '',
            ModName: "DeletePerspectiveFollow",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清空设备模型
    HeavyHaulMod(data){
        var sendData= {
            Event: '',
            ModName: "HeavyHaulMod",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //高亮方法
    TilesHighlight(data){
        var sendData= {
            Event: '',
            ModName: "TilesHighlight",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除全部高亮
    CancelTilesHighlight(){
        var sendData= {
            Event: '',
            ModName: "CancelTilesHighlight",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //删除地板  --- wangHuanHuan
    removefloorOther(){
        var sendData= {
            Event: '',
            ModName: "removefloorOther",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //共用关闭事件
    Close(){
        $("#LiuClose").click(); //关闭楼层弹框
        this.CancelTilesHighlight();//清除高亮
        //关闭网格高亮
        let list = global.GridTree;
        if(global.GridTree.length>0){
            list.forEach(element => {
                Common.Emptyentities({id:element.id})
            });
            global.GridTree=[];
        };
        //关闭地下
        Common.BuildingShow({show : true});
        Common.removePit();
        // Common.removeBubbleLabel()
        // var mianData = JSON.parse(sessionStorage.getItem('MianList'))
        // if(mianData.length>0){
        //     for(var i = 0;i<mianData.length;i++){
        //         Common.Emptyentities({id:mianData[i].LayerItems.id})
        //         if(mianData[i].LayerLists.length>0){
        //             mianData[i].LayerLists.forEach(element => {
        //                 Common.Emptyentities({id:element.id })
        //                 Common.deleteSv4(element.id)
        //             });
        //         }
        //     }
        // }
    },
    //资源图谱飞过去参数
    returnData(data){
        var sendData= {
            Event: '',
            ModName: "returnData",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //隐藏显示地上
    BuildingShow(data){
        var sendData= {
            Event: '',
            ModName: "BuildingShow",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //显示地下
    UndergroundInspection(data){
        var sendData= {
            Event: '',
            ModName: "UndergroundInspection",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //删除地下模型
    removeUnderground(){
        var sendData= {
            Event: '',
            ModName: "removeUnderground",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除挖地
    removePit(){
        var sendData= {
            Event: '',
            ModName: "removePit",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //展示挖地
    ExhibitionPit(data){
        var sendData= {
            Event: '',
            ModName: "ExhibitionPit",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //绘制矩形
    DiggingTerrain(){
        var sendData= {
            Event: '',
            ModName: "DiggingTerrain",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //绘制路线
    roamingDrawingLine(data){
        var sendData= {
            Event: '',
            ModName: "roamingDrawingLine",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除绘制路线
    removeEntitiesV1(data){
        var sendData= {
            Event: '',
            ModName: "removeEntitiesV1",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //展示巡更
    roamingDisplay(data,countIndex){
        var sendData= {
            Event: '',
            ModName: "roamingDisplay",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //暂停  参数 0暂停 1继续
    multiplier(data){
        var sendData= {
            Event: '',
            ModName: "multiplier",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //删除
    deleteRoamingRoute(){
        var sendData= {
            Event: '',
            ModName: "deleteRoamingRoute",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //漫游巡逻路线展示
    roamingRouteDisplay(data){
        var sendData= {
            Event: '',
            ModName: "roamingRouteDisplay",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //退出视频控件
    endVod(){
        var sendData= {
            Event: '',
            ModName: "endVod",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //视频自动播放
    ModelClickEvent(data){
        var sendData= {
            Event: '',
            ModName: "ModelClickEvent",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //天一阁温湿度
    initBubble(){
        var sendData= {
            Event: '',
            ModName: "initBubble",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //关闭气泡
    //removeBubbleBombbox(e.data.parameter.id,null,null,e.data.parameter.type);
    removeBubbleBombbox(data){
        var sendData= {
            Event: '',
            ModName: "removeBubbleBombbox",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //RealTimePainting 实时绘制路线
    RealTimePainting(data){
        var sendData= {
            Event: '',
            ModName: "RealTimePainting",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //historicalTrack  历史轨迹
    historicalTrack(data){
        var sendData= {
            Event: '',
            ModName: "historicalTrack",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //downloadPDF  生成历史轨迹报表
    downloadPDF(data){
        var sendData= {
            Event: '',
            ModName: "downloadPDF",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //downloadPDFV2  生成历史轨迹报表
    downloadPDFV2(data){
        var sendData= {
            Event: '',
            ModName: "downloadPDFV2",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //playback  回放
    playback(data){
        var sendData= {
            Event: '',
            ModName: "playback",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除轨迹
    closeHistoricalTrack(){
        var sendData= {
            Event: 'closeHistoricalTrack()',
            ModName: "",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //VisibleArea  单个可视化区域展示
    VisibleArea(data){
        var sendData= {
            Event: '',
            ModName: "VisibleArea",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //摄像头椎体展示
    drawViewCentrum(){
        var sendData= {
            Event: 'drawViewCentrum()',
            ModName: "",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //摄像头椎体隐藏
    ViewShedclearModel(){
        var sendData= {
            Event: '',
            ModName: "ViewShedclearModel",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //框选
    SelectCameras(){
        var sendData= {
            Event: 'SelectCameras()',
            ModName: "",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //人员定位绘制
    PersonnelOrientation(data){
        var sendData= {
            Event: '',
            ModName: "PersonnelOrientation",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除人员定位
    deletePositioning(data){
        var sendData= {
            Event: '',
            ModName: "deletePositioning",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //人员定位
    InitialPositioning(data){
        var sendData= {
            Event: '',
            ModName: "InitialPositioning",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    // 撒点上图/ON
    SadianUp(){
        var sendData= {
            Event: '',
            ModName: "SadianUp",
            parameter:''
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    // 撒点上图/OFF
    SadianDown(){
        var sendData= {
            Event: '',
            ModName: "SadianDown",
            parameter:''
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //人员定位历史轨迹
    LsgjHistory(data){
        var sendData= {
            Event: '',
            ModName: "LsgjHistory",
            parameter: data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除历史轨迹
    ClearHistoryLine(){
        var sendData= {
            Event: '',
            ModName: "ClearHistoryLine",
            parameter: {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },   
    //多设备点播挂断
    moreDemand(mp3,shebei,type){
        var sendData= {
            Event: '',
            ModName: "moreDemand",
            parameter: {mp3:mp3,shebei:shebei,type:type}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //监区上图
    PrisonView(data,type){
        var sendData= {
            Event: '',
            ModName: "PrisonView",
            parameter: {data:data,type:type}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //监区上图2
    PrisonView2(data){
        var sendData= {
            Event: '',
            ModName: "PrisonView2",
            parameter:data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除点线
    RemoveDX(data){
        var sendData= {
            Event: '',
            ModName: "RemoveDX",
            parameter:data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除点线
    spzcsp(data){
        var sendData= {
            Event: '',
            ModName: "spzcsp",
            parameter:data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //清除监区气泡
    deleteSv4(data){
        var sendData= {
            Event: '',
            ModName: "deleteSv4",
            parameter:data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    },
    //展示线
    GeneratePolyline(data){
        var sendData= {
            Event: '',
            ModName: "GeneratePolyline",
            parameter:data
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
    }
    /*    //巡逻摄像头
        poamingPlaybackS(){
            var sendData= {
                Event: '',
                ModName: "poamingPlaybackS",
                parameter: {}
            };
            if(frame == null){return};frame.contentWindow.postMessage(sendData,"*");
        }*/
}