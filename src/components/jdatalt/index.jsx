import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jdatalt() {
  const [] = useState();
  const tjData = [
    {
      name: "人口数",
      value: "5892",
      note: "人",
      pic: "tj1",
    },
    {
      name: "房屋数",
      value: "4920",
      note: "户",
      pic: "tj2",
    },
  ];
  const iconData = [
    {
      name: "怪石林",
    },
    {
      name: "陶瓷博物馆",
    },
    { name: "浮梁古县衙" },
    { name: "瑶里古镇" },
    {
      name: "古窑民俗博览区",
    },
  ];
  const { pathname } = useLocation(); //存储当前路由地址`
  let initChart4 = () => {
    let element = document.getElementById("main4");
    let myChart = echarts.init(element);
    let option = {
      title: {
        subtext: "近十年全村的财政 收入/支出",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["收入", "支出"],
        textStyle: {
          color: "#fff",
          fontSize: 12,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#fff",
            fontSize: 12,
          },
        },
        splitLine: {
          //网格线
          show: false,
        },
      },
      yAxis: {
        type: "category",
        data: [
          "2010",
          "2011",
          "2012",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
        ],
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#fff",
            fontSize: 10,
          },
        },
        splitLine: {
          //网格线
          show: false,
        },
      },
      series: [
        {
          name: "收入",
          type: "bar",
          data: [85, 72, 77, 79, 84, 78, 75, 77, 84, 55],
          barWidth: 6,
          showBackground: false,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "transparent" },
              { offset: 0.5, color: "#FF7723" },
              { offset: 1, color: "#FF7723" },
            ]),
          },
        },
        {
          name: "支出",
          type: "bar",
          data: [40, 50, 65, 68, 75, 83, 90, 95, 98, 92],
          barWidth: 6,
          showBackground: false,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "transparent" },
              { offset: 0.5, color: "#FFAE44" },
              { offset: 1, color: "#FFAE44" },
            ]),
          },
        },
      ],
    };
    myChart.setOption(option);
  };
  let initChart5 = () => {
    let element = document.getElementById("main5");
    let myChart = echarts.init(element);
    let option = {
      radar: {
        indicator: [
          { name: "古民谣博物馆", max: 6500 },
          { name: "怪石林", max: 16000 },
          { name: "陶瓷博物馆", max: 30000 },
          { name: "浮梁古县衙", max: 38000 },
          { name: "瑶里古镇", max: 52000 },
        ],
        center: ["50%", "60%"],
      },
      series: [
        {
          type: "radar",
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
                  color: "#FF7824", // 0% 处的颜色
                },
                {
                  offset: 0.5,
                  color: "#FF7824", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#FF7824", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(255,120,36, 0.8)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(255,120,36, 0.8)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
            },
          ],
        },
      ],
    };
    myChart.setOption(option);
  };
  useEffect(() => {
    initChart4();
    initChart5();
  }, []);

  return (
    <div className="jdata_lt_box">
      <div className="jdata_lt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>人口统计</span>
      </div>
      <div className="jdata_lt_tj">
        {tjData.map((item, index) => {
          return (
            <div key={index} className="tj_box">
              <img
                src={require("../../images/Jhome/" + item.pic + ".png")}
                alt=""
              />
              <div className="tj_rt">
                <div className="tj_rt_name">{item.name}</div>
                <div className="tj_rt_vn">
                  <span className="tj_rt_value">{item.value}</span>
                  <span className="tj_rt_note">{item.note}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="jdata_lt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>财政统计</span>
      </div>
      <div>
        <div id={"main4"} style={{ height: 400 }}></div>
      </div>
      <div className="jdata_lt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>景点收入统计</span>
      </div>
      <div className="jdata_lt_income">
        <div className="income_left">
          <div id={"main5"} style={{ height: 150 }}></div>
        </div>
        <div className="income_right">
          {iconData.map((item, index) => {
            return (
              <div key={index} className="income_icon">
                <img src={require("../../images/Jhome/tj_icon.png")} alt="" />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Jdatalt;
