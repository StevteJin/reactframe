import React, { Component, Fragment } from "react";
import { Common } from "./method";
import Public from "../public/public";
import axios from "axios";
import $ from "jquery";

class CesiumConent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addOption: false,
      modelId: "",
    };
    CesiumConent.this = this;
  }
  componentDidMount() {
    console.log("这里??");
    this.Build(); //加载建筑楼层数据
    this.ThirdParty();
    console.log(global.IframeUrl + "?number=" + new Date().getTime());

    window.receiveMessageFromIndex = function (e) {
      if (e !== undefined) {
        switch (e.data.switchName) {
          case "MessageBox":
            console.log(e.data);
            $(".PageShowOne")
              .show()
              .find("h1")
              .html(e.data.text.Title + e.data.text.txt);
            //global.Time();
            break;
          default:
            return null;
        }
      }
    };
    //监听message事件
    window.addEventListener("message", window.receiveMessageFromIndex, false);
  }

  //加载建筑楼层数据
  Build() {
    var Floors = [];
    axios.get(global.Url + "map/build/list", {}).then((res) => {
      const result = res.data.data;
      if (result && res.data.msg === "success") {
        for (let i = 0; i < result.length; i++) {
          axios
            .post(global.Url + "map/floor/list", { build_id: result[i].id })
            .then((res) => {
              const results = res.data.data;
              if (results && res.data.msg === "success") {
                Floors.push({
                  FloorItems: result[i],
                  Floorlists: results,
                });
                var FloorsList = JSON.stringify(Floors);
                //console.log("FloorsList",FloorsList,Floors);
                sessionStorage.setItem("Floor", FloorsList);
              } else {
                //alert(res.msg)
                $(".PageShow").show().find("h1").html(res.data.msg);
                global.Time();
              }
            });
        }
      } else {
        alert(res.msg);
      }
    });
  }
  //提供给第三方平台对接接口
  ThirdParty() {
    let baseUrl = "ws://localhost:1017";
    let webSocket = new WebSocket(baseUrl);
    webSocket.onopen = function (e) {
      console.log("webSocket is open");
      webSocket.send("subscribe");
    };
    webSocket.onmessage = function (e) {
      console.log(e.data);
      var serverJson = JSON.parse(e.data);
      if (e.data === "subscribe success") {
        return;
      } else {
        switch (serverJson.Event) {
          case "onResetCoordinates":
            Common.onResetCoordinates();
            webSocket.send(JSON.stringify({ msg: "复位方法调用成功" }));
            break;
          default:
            return null;
        }
      }
    };

    window.addEventListener(
      "message",
      function (e) {
        // 我们能信任信息来源吗？
        // if (event.origin !== "http://example.com:8080")
        //     return;
        //  console.log('我是地图我接收到了message:',e.data)
        console.log(7777, new Date().getTime());
        switch (e.data.Event) {
          case "bubbleElimination":
            console.log(e.data.parameter.id, "bubbleElimination的返回值");
            var data = {
              id: e.data.parameter.id,
              type: 1,
            };
            Common.removeBubbleBombbox(data);
            Common.endVod();
            Common.deleteRoamingRoute();
            $(".iframeBut").hide();
            Common.onMap();
            Common.endVod();
            break;
          default:
            return null;
        }
        //var okHandler = e.data.Event + '(' + JSON.stringify(e.data.parameter) + ')';
        //eval(okHandler);
      },
      false
    );
  }

  handleImageChange(e) {
    const file = e.target.files[0];
    const windowURL = window.URL || window.webkitURL; //实现预览
    const imgUrl = windowURL.createObjectURL(file);
    CesiumConent.this.setState({
      uploadData: {
        ...this.state.uploadData,
        img: imgUrl,
        imgShow: true,
      },
    });
  }

  render() {
    return (
      <Fragment>
        <iframe
          id="core_content"
          name="iframeName"
          ref="core_content"
          title="core_content"
          src={global.IframeUrl + "?number=" + new Date().getTime()} //192.168.0.64?number=Math.random()  +'?number='+Math.random()
          style={{ width: "100%", height: "100%" }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
          scrolling="auto"
          // 该处导致点击导航一直刷新的
          onLoad={Common.List}
        />
        <Public />
      </Fragment>
    );
  }

  componentWillUnmount() {
    //window.removeEventListener("message",this.receiveMessage)
  }
  receiveMessage = (event) => {
    //console.log(event);
    if (event !== undefined && event.data && event.data.name) {
      console.log("接受iframe的数据", event.data);
    }
  };
  handleClick = () => {
    const childFrameObj = document.getElementById("core_content");
    childFrameObj.contentWindow.postMessage(1233, "*");
  };
}

export default React.memo(CesiumConent);
