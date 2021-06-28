import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jhomert() {
  const [activeIndex] = useState(0);
  const sunData = [
    {
      name: "景德镇",
      value: "28­­°",
      pic: "sun",
    },
    {
      name: "温度",
      value: "17~28­­°",
      pic: "wd",
    },
    {
      name: "湿度",
      value: "24­­°",
      pic: "sd",
    },
    {
      name: "风向",
      value: "西北4m/s",
      pic: "fx",
    },
  ];
  const { pathname } = useLocation(); //存储当前路由地址`

  let initCharts = () => {
    let element = document.getElementById("mains");
    let myChart = echarts.init(element);
    let option = {
      xAxis: {
        type: "category",
        data: ["景点", "美食", "游乐", "商品", "交通", "文化"],
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
            color: "#D1CAB5",
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
            color: "#D1CAB5",
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
          data: [35, 60, 75, 35, 78, 72, 100],
          type: "line",
          smooth: true, //圆润
          symbol: "none", //不要圈
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#FF8802", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "transparent", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          lineStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#FF8802 ", // 0% 处的颜色
                },
                {
                  offset: 0.5,
                  color: "#FF8802 ", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#FF8802 ", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          areaStyle: {},
        },
      ],
    };
    myChart.setOption(option);
  };
  let initCharts2 = () => {
    let element = document.getElementById("mains2");
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
          barWidth: 10,
          showBackground: false,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#F5AD5C" },
              { offset: 0.5, color: "#F5AD5C" },
              { offset: 1, color: "#F5AD5C" },
            ]),
          },
        },
      ],
    };
    myChart.setOption(option);
  };
  useEffect(() => {
    initCharts();
    initCharts2();
  }, [activeIndex]);

  return (
    <div className="jdata_rt_box">
      <div className="jdata_rt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>气候展示</span>
      </div>
      <div className="sun_box">
        <div className="sun_date">今天2020-5-16</div>
        <div className="sun_big_con">
          {sunData.map((item, index) => {
            return (
              <div className={index == 0 ? "sun_con sun0" : "sun_con"}>
                <img
                  src={require("../../images/Jhome/" + item.pic + ".png")}
                  alt=""
                />
                <div className="sun_name">{item.name}</div>
                <div className="sun_value">{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="jdata_rt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>旅游收入统计</span>
      </div>
      <div>
        <div id={"mains"} style={{ height: 200 }}></div>
      </div>
      <div className="jdata_rt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>农产品收入</span>
      </div>
      <div>
        <div id={"mains2"} style={{ height: 200 }}></div>
      </div>
    </div>
  );
}
export default Jhomert;
