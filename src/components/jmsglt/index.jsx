import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jmsglt() {
  const [] = useState();
  const numData = [
    {
      pic: "num1",
      name: "人均收入/月",
      value: "5000",
      unit: "¥",
      note: "同比10%",
      kind: "jia",
      line: "num_1_line",
    },
    {
      pic: "num2",
      name: "田地数量/亩",
      value: "4029",
      unit: "亩",
      note: "同比10%",
      kind: "jian",
      line: "num_2_line",
    },
  ];
  const { pathname } = useLocation(); //存储当前路由地址`
  //农产品类别占比
  let initChart2 = () => {
    let element = document.getElementById("main2");
    let myChart = echarts.init(element);
    let datas = [
      ////////////////////////////////////////
      [
        { name: "瓜果类", value: 25 },
        { name: "水产类", value: 25 },
        { name: "粮油类", value: 25 },
        { name: "药材类", value: 25 },
      ],
    ];
    let option = {
      color: ["#FFBC75", "#FF7723", "#FFE6A6", "#FFFBE8"],
      series: datas.map(function (data, idx) {
        return {
          type: "pie",
          radius: [35, 50],
          top: "0",
          left: "center",
          width: 600,
          itemStyle: {
            borderColor: "#FFBD75",
            borderWidth: 1,
          },
          label: {
            alignTo: "edge",
            formatter: "{name|{b}}\n{time|{c} %}",
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 12,
              },
            },
          },
          labelLine: {
            length: 30,
            length2: 120,
            maxSurfaceAngle: 80,
          },
          labelLayout: function (params) {
            var isLeft = params.labelRect.x < myChart.getWidth() / 2;
            var points = params.labelLinePoints;
            // Update the end point.
            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width;

            return {
              labelLinePoints: points,
            };
          },
          data: data,
        };
      }),
    };
    myChart.setOption(option);
  };
  //农产品收入统计
  let initChart3 = () => {
    let element = document.getElementById("main3");
    let myChart = echarts.init(element);
    let option = {
      xAxis: {
        type: "category",
        data: ["稻谷", "大豆", "荞麦", "柑橘", "桃子", "牛蛙", "核桃"],
        splitLine: {
          //网格线
          show: true,
          lineStyle: {
            type: "dashed", //网格线样式
            width: 0.2,
            color: ["#fff", "#fff"],
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#fff",
            fontSize: 10,
          },
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          //网格线
          show: true,
          lineStyle: {
            type: "dashed", //网格线样式
            width: 0.2,
            color: ["#fff", "#fff"],
          },
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#fff",
            fontSize: 10,
          },
        },
      },
      grid: {
        top: "10%",

        left: "10%",

        right: "10%",

        bottom: "10%",
      },
      series: [
        {
          data: [67, 20, 40, 77, 86, 81, 75],
          type: "bar",
          barWidth: 20,
          showBackground: false,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#F5AD5C" },
              { offset: 0.5, color: "#FF7723" },
              { offset: 1, color: "transparent" },
            ]),
          },
        },
      ],
    };
    myChart.setOption(option);
  };
  useEffect(() => {
    initChart2();
    initChart3();
  }, []);

  return (
    <div className="jmsg_lt_box">
      <div className="jmsg_lt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>今日数字</span>
      </div>
      <div className="jmsg_num_box">
        {numData.map((item, index) => {
          return (
            <div key={index} className="jmsg_num">
              <img
                className="jmsg_num_img"
                src={require("../../images/Jhome/" + item.pic + ".png")}
                alt=""
              />
              <div className="jmsg_num_right">
                <img
                  className="jmsg_line"
                  src={require("../../images/Jhome/" + item.line + ".png")}
                  alt=""
                />
                <div className="jmsg_num_name">{item.name}</div>
                <div className="jmsg_num_vu">
                  <div className="jmsg_num_vu_left">
                    <span className="jmsg_vu_value">{item.value}</span>
                    <span className="jmsg_vu_unit">{item.unit}</span>
                  </div>
                  <div className="jmsg_num_vu_right">
                    <span>{item.note}</span>
                    {item.kind == "jia" ? (
                      <img
                        src={require("../../images/Jhome/arr_top.png")}
                        alt=""
                      />
                    ) : (
                      <img
                        src={require("../../images/Jhome/arr_bottom.png")}
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <img
                  className="jmsg_line"
                  src={require("../../images/Jhome/" + item.line + ".png")}
                  alt=""
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="jmsg_lt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>农产品统计</span>
      </div>
      <div className="jmsg_category">
        <div className="jmsg_category_title">
          <img src={require("../../images/Jhome/nong.png")} alt="" />
          <span>农产品类别占比</span>
        </div>
        <div className="jmsg_echarts_bg">
          <div id={"main2"} style={{ height: 200 }}></div>
        </div>
      </div>
      <div className="jmsg_category">
        <div className="jmsg_category_title">
          <img src={require("../../images/Jhome/nong.png")} alt="" />
          <span>农产品收入统计</span>
        </div>
        <div>
          <div id={"main3"} style={{ height: 200 }}></div>
        </div>
      </div>
    </div>
  );
}
export default Jmsglt;
