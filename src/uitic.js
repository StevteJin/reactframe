import $ from "jquery";
import globalData from '../src/config.json';
global.Url =  globalData.Url;
global.IframeUrl = globalData.IframeUrl;
global.WebSocketUrl =globalData.WebSocketUrl;
global.VideoUrl =globalData.VideoUrl;
$.ajaxSettings.async = false;//改成同步请求

$.getJSON("config.json",function(globalData){
    console.log(globalData)
    global.Url =  globalData.Url;
    global.IframeUrl = globalData.IframeUrl;
    global.WebSocketUrl =globalData.WebSocketUrl;
    global.VideoUrl =globalData.VideoUrl;
    $.ajaxSettings.async = true;//改成异步请求
})