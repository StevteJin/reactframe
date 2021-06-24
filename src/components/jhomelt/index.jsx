import React, { useState, useEffect } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jhomelt() {
  const [] = useState();
  const equipmentState = [
    {
      name: "路灯",
      state1: "正常",
      stateNum1: "243",
      state2: "故障",
      stateNum2: "13",
    },
    {
      name: "停车位",
      state1: "占用",
      stateNum1: "356",
      state2: "空余",
      stateNum2: "103",
    },
    {
      name: "WIFI",
      state1: "总数",
      stateNum1: "103",
    },
  ];

  const jiankong = [
    {
      name: "温度",
      value: "25",
      note: "°C",
    },
    {
      name: "湿度",
      value: "43.8",
      note: "%RH",
    },
    {
      name: "温度",
      value: "47",
      note: "MG/M3",
    },
    {
      name: "水质",
      value: "Ⅱ",
      note: "类",
    },
  ];

  const videoData = [
    { name: "视频监控点1" },
    { name: "视频监控点2" },
    { name: "视频监控点3" },
    { name: "视频监控点4" },
  ];
  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {}, []);

  return (
    <div className="big_e_box">
        <div className="e_top_title">
          <img src={require("../../images/Jhome/icon-1.png")} alt="" />
          <span>设备状态</span>
        </div>
        <div>
          {equipmentState.map((item, index) => {
            return (
              <div key={index} className="e_box">
                <div className="e_name">{item.name}</div>
                <div className="e_state e_state1">
                  <span>{item.state1}</span>
                  <span>{item.stateNum1}</span>个
                </div>
                <div className="e_state e_state2">
                  <span>{item.state2}</span>
                  <span>{item.stateNum2}</span>个
                </div>
              </div>
            );
          })}
        </div>
        <div className="e_top_title e_top_title2">
          <img src={require("../../images/Jhome/icon-1.png")} alt="" />
          <span>环境监控</span>
        </div>
        <div className="pie_box">
          <div className="pie_left">
            <div className="pie_left_top">
              <div className="pie_zhi">污染指数</div>
              <div className="pie_num">121</div>
            </div>
            <div className="pie_left_bottom">轻度污染</div>
          </div>
          <div className="pie_right">
            {jiankong.map((item, index) => {
              return (
                <div key={index} className="pie_right_co">
                  <span className="pie_right_name">{item.name}</span>
                  <span className="pie_right_note">{item.note}</span>
                  <span className="pie_right_value">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="e_top_title e_top_title3">
          <img src={require("../../images/Jhome/icon-1.png")} alt="" />
          <span>视频监控</span>
        </div>
        <div className="video_box"></div>
        <div className="video_btn_box">
          {videoData.map((item, index) => {
            return (
              <div className="video_btn" key={index}>
                <img src={require("../../images/Jhome/dian.png")} alt="" />
                &nbsp;&nbsp;
                {item.name}
              </div>
            );
          })}
        </div>
    </div>
  );
}
export default Jhomelt;
