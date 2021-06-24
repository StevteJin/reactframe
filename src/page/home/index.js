import React, { Fragment, Component } from "react";
import "../../style/common.css";
import "../../style/Incentiveps.css";
import Header from "./indexHome";
import CesiumConent from "../Cesium/index";
import DocumentTitle from "react-document-title";
import axios from "axios";
import Footer from "../footer/index";
import Alarm from "../public/AlarmList";
// import VehicleInspection from '../public/VehicleInspection';

//改写
import Jheader from "../../components/jheader/index";
import Jhomelt from "../../components/jhomelt/index";
import Jfooter from "../../components/jfooter/index";

import $ from "jquery";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLogin: "",
      searchName: "", //搜索内容
      searchList: [], //搜索内容列表
      KeLi: 0, //客流
    };
    Index.this = this;
    this.SearchContent = this.SearchContent.bind(this); //搜索功能
  }

  componentDidMount() {
    this.onLoad(); //加载是否需要登录
    /*  setTimeout(function(){
            Index.this.KeLiuData();
        },1000)*/
    if (navigator.userAgent.toLowerCase().indexOf("chrome") === -1) {
      //alert('请使用谷歌浏览器！');
      $(".PageShow").show().find("h1").html("请使用谷歌浏览器!");
      global.Time();
      window.open("http://rj.baidu.com/soft/detail/14744.html?ald", "_blank");
    } else {
    }
  }
  //加载客流
  KeLiuData() {
    var list = {
      klC: [
        "1000226$1$0$0",
        "1000228$1$0$0",
        "1000212$1$0$0",
        "1000221$1$0$0",
        "1000240$1$0$0",
        "1000241$1$0$0",
        "1000242$1$0$0",
        "1000243$1$0$0",
        "1000222$1$0$0",
        "1000225$1$0$0",
        "1000227$1$0$0",
        "1000231$1$0$0",
        "1000232$1$0$0",
        "1000235$1$0$0",
        "1000236$1$0$0",
        "1000238$1$0$0",
        "1000239$1$0$0",
        "1000223$1$0$0",
        "1000261$1$0$0",
        "1000271$1$0$0",
        "1000273$1$0$0",
        "1000211$1$0$0",
        "1000224$1$0$0",
        "1000229$1$0$0",
        "1000230$1$0$0",
        "1000237$1$0$0",
        "1000244$1$0$0",
        "1000245$1$0$0",
        "1000246$1$0$0",
        "1000247$1$0$0",
        "1000248$1$0$0",
        "1000249$1$0$0",
        "1000250$1$0$0",
        "1000251$1$0$0",
        "1000252$1$0$0",
        "1000253$1$0$0",
        "1000269$1$0$0",
        "1000268$1$0$0",
        "1000267$1$0$0",
        "1000266$1$0$0",
        "1000265$1$0$0",
        "1000263$1$0$0",
        "1000262$1$0$0",
        "1000260$1$0$0",
        "1000259$1$0$0",
        "1000258$1$0$0",
        "1000257$1$0$0",
        "1000256$1$0$0",
        "1000255$1$0$0",
        "1000254$1$0$0",
        "1000270$1$0$0",
        "1000272$1$0$0",
      ],
    };
    console.log(list);
    for (var i = 0; i < list.klC.length; i++) {
      axios
        .post("http://192.16.12.5:8082/DH/EGTTotal", {
          cameraId: list.klC[i],
          nBeginStr: "2020-8-15 8:00:00",
          nEndStr: "2020-8-16 8:00:00",
        })
        .then((res) => {
          const result = res.data;
          if (result.msg === "Success") {
            console.log(res, result, result.msg);
            var str = result.MsgTxt;
            var N = str.substr(str.length - 1, 1);
            console.log(str, "1111", N);
            Index.this.setState({
              KeLi: Index.this.state.KeLi + Number(N),
            });
            console.log(Index.this.state.KeLi);
          } else {
            //console.log(res,result,result.msg);
          }
        });
    }
  }
  //加载是否需要登录
  onLoad() {
    axios.get(global.Url + "sys/config/isLogin").then((res) => {
      const result = res.data.data;
      if (result) {
        //console.log(result);
        //判断用户是否需要登录
        sessionStorage.setItem("isLogin", result.is_login);
        const is_user = sessionStorage.getItem("user"); //先判断缓存中有没有'user'，如果有直接显示页面，如果没有跳转到登录页面
        //                debugger
        if (result.is_login === false) {
          //如果为false表示要登录，然后判断浏览器缓存里面有没有用户名的缓存，没有直接跳转login,有显示内容
          if (is_user === null) {
            this.props.history.push("/login");
            this.setState({
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: true,
            });
          }
        } else {
        }
      } else {
        //alert(res.msg)
        $(".PageShow").show().find("h1").html(res.data.msg);
        global.Time();
      }
    });
  }
  //搜索内容改变
  changeSearch = (e) => {
    $(".SearchName").css({ display: "none" });
    this.setState({
      searchName: e.target.value,
    });
  };

  //搜索功能
  SearchContent() {
    $(".SearchName").css({ display: "block" });
    const { searchName } = this.state;
    if (!searchName) {
      $(".PageShow").show().find("h1").html("搜索内容不能为空！");
      global.Time();
    } else {
      axios
        .post(global.Url + "business/globalSearch", { Search_info: searchName })
        .then((res) => {
          const result = res.data.data;
          if (result) {
            console.log(result);
            this.setState({
              searchList: result,
            });
          } else {
            //alert(res.msg)
            $(".PageShow").show().find("h1").html(res.data.msg);
            global.Time();
          }
        });
    }
  }
  //按钮事件
  handleSwitch(e) {
    console.log(e.target.checked, "ee");
  }
  render() {
    const { searchName, searchList, alarmFlag, KeLi } = this.state;
    return (
      <DocumentTitle title="图为视智慧安防三维平台">
        <Fragment>
          <div className="IndexHome">
            <div className="left"></div>
            <div className="right"></div>
            <div className="conent">
              <CesiumConent></CesiumConent>
            </div>
          </div>
          <div>
            <Jheader />
          </div>
          <div>
            <Jhomelt />
          </div>
          <div>
            <Jfooter />
          </div>
          {/* <div className="header">
            <Header alarmFlag={alarmFlag}></Header>
          </div> */}
          {/* <Footer></Footer> */}
          {/* <Alarm></Alarm> */}
          {/* <VehicleInspection></VehicleInspection> */}
          <div className="PageShow1 PageShowOne">
            <div className="PageShowCont">
              <h1>111</h1>
              <h2>
                <button onClick={() => global.Server()}>下载</button>
                <button onClick={() => global.PageHide()}>关闭</button>
              </h2>
            </div>
          </div>
          <div className="KeLiu" style={{ display: "none" }}>
            总客流量：{KeLi}人
          </div>
          {/* <div className="isPositionDoor" style={{'display':'flex'}}>
                        <span>门禁定位</span>
                        <div className="toggle-button-wrapper">
                            <input type="checkbox" id="toggle-button" name="switch" onChange={this.handleSwitch.bind(this)}/>
                            <label htmlFor="toggle-button" className="button-label">
                                <span className="circle"></span>
                            </label>
                        </div>
                    </div> */}
          <div className="Search" style={{ display: "none" }}>
            <button onClick={() => this.SearchContent()}>
              <i></i>
            </button>
            <input
              type="text"
              defaultValue={searchName}
              onChange={(e) => this.changeSearch(e)}
              placeholder="请输入您要搜索的关键词"
            />
            <div className="SearchName">
              <ul>
                {searchList.length > 0 &&
                  searchList.map((item, index) => {
                    return (
                      <li key={index}>
                        {item.type_name}
                        {"根据type_name的名字不同显示的内容不同"}
                      </li>
                    );
                  })}
                {searchList.length < 0 ? <li>暂无数据</li> : null}
                <li>哈哈哈</li>
                <li>哈哈哈</li>
                <li>哈哈哈</li>
              </ul>
            </div>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}
export default Index;
