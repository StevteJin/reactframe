import $ from "jquery";
import {Common} from './page/Cesium/method';

global.Database = 'dxcyy';
global.AlarmNumber= 0;
global.WebList=[];
global.floooList = [];
global.AlarmShow=false;
global.GridTree=[];
global.Time=()=>{
    setTimeout(function () {
        $(".PageShow,.PageShow1").hide();
    },3000)
};
global.PageHide=()=>{
    $(".PageShow1").hide();
}
global.Server=()=>{
    $(".PageShow1").hide();
    let url=global.Url.split("api")[0];
    window.location=url+"Plug-inUnit/output.zip";
}
global.videoAlart=()=>{
    $(".videoAlart").hide();
}
//显示视频
global.videoAlartNB=()=>{
    $(".videoAlart").show();
}
global.suspend = () =>{
    var a=$("#iframeBut").html();
    console.log(a);
    if(a==="暂停"){
        Common.multiplier(0);
        $("#iframeBut").html("继续");
    }else if(a==="继续"){
        Common.multiplier(1);
        $("#iframeBut").html("暂停");
    }
}
global.sigin= () =>{
    Common.endVod();
    Common.deleteRoamingRoute();
    $(".iframeBut").hide();
    Common.onMap();
    Common.endVod();
    Common.removeBubbleBombbox();//e.data.parameter.id,null,null,e.data.parameter.type   //先通过websocket获取到数据在进行传参处理
}