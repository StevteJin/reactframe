import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { Progress } from "antd";

function Jmsgrt() {
  const rankingData = [
    {
      name: "景区景点",
      value: 75,
      pic: "on1",
    },
    {
      name: "美食探店",
      value: 62,
      pic: "on2",
    },
    {
      name: "旅游购物",
      value: 58,
      pic: "on3",
    },
    {
      name: "游乐项目",
      value: 52,
      pic: "",
    },
    {
      name: "旅游文化",
      value: 46,
      pic: "",
    },
    {
      name: "旅游交通",
      value: 32,
      pic: "",
    },
  ];

  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {}, []);

  return (
    <div className="jmsg_rt_box">
      <div className="jmsg_rt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>综合评分</span>
      </div>
      <div className="jmsg_rt_score_box">
        <div className="score score1">经济方面</div>
        <div className="score score2">人文方面</div>
        <div className="score score3">生态方面</div>
        <div className="score score4">政治方面</div>
        <div className="score_num">
          <img src={require("../../images/Jhome/score_num.png")} alt="" />
          <div>90.82</div>
        </div>
      </div>
      <div className="jmsg_rt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>旅游项目排行</span>
      </div>
      <div className="jmsg_rt_rank_box">
        {rankingData.map((item, index) => {
          return (
            <div key={index} className="jmsg_rt_rank">
              <img
                className="rank_img"
                src={require("../../images/Jhome/color" + (index + 1) + ".png")}
                alt=""
              />
              <span className="rank_name">{item.name}</span>
              {/* 进度条 */}
              <div className="rank_pro">
                <Progress
                  percent={item.value}
                  // steps={20}
                  strokeWidth={26}
                  strokeColor={{
                    "0%": "#FFBD75",
                    "100%": "#FF7723",
                  }}
                  trailColor="rgba(48, 47, 47, 0.5)"
                />
              </div>
              <div className="rank_right">
                {item.pic ? (
                  <img
                    src={require("../../images/Jhome/" + item.pic + ".png")}
                    alt=""
                  />
                ) : (
                  <span>{index}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="jmsg_rt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>特色景区宣传</span>
      </div>
      <img
        className="jmsg_rt_xc"
        src={require("../../images/Jhome/xc.png")}
        alt=""
      />
    </div>
  );
}
export default Jmsgrt;
