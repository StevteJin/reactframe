let frame;
//let Url = "http://192.168.0.211:8080/MapApi/API/PostData/API/GetFiles";
export const CommonV = {
    ListV(){
        setTimeout(function(){
            frame=document.getElementById("core_content2");
        },10)
    },
    //视频key
    preview(a,b){
        var sendData={ //播放视频
            Event : '',
            ModName : "preview",
            parameter : {code:a,type:b}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    setSize(a,b){ //控件窗口大小
        var sendData={
            Event : '',
            ModName : "setSize",
            parameter : {width:a,height:b}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    initialization(a){ //初始化窗口
        var sendData={
            Event : '',
            ModName : "initialization",
            parameter : {chushiCode:a}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    deInitialization(){ //反初始化
        var sendData={
            Event : '',
            ModName : "deInitialization",
            parameter : {}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    playback(a){ //视频回放
        var sendData={
            Event : '',
            ModName : "playback",
            parameter :{code:a}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    playbackls(a,b,c){ //视频回放
        var sendData={
            Event : '',
            ModName : "playback",
            parameter :{code:a,stime:b,etime:c}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    hideVideo(){ //隐藏视频
        var sendData={
            Event : '',
            ModName : "hideVideo",
            parameter :{}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    },
    showVideo(){ //显示视频
        var sendData={
            Event : '',
            ModName : "showVideo",
            parameter :{}
        };
        if(frame == null){return};frame.contentWindow.postMessage(sendData,"*")
    }
}