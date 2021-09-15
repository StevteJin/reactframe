import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jhomert() {
  const [activeIndex] = useState(0);
  const menuData = [
    {
      name: "车辆统计",
      value: "car",
    },
    {
      name: "人流量统计",
      value: "people",
    },
  ];
  const peopleData = [
    {
      name: "车流量",
      value: "302",
      class: "car",
    },
    {
      name: "出村",
      value: "189",
      class: "chu",
    },
    {
      name: "进村",
      value: "113",
      class: "ru",
    },
  ];

  const { pathname } = useLocation(); //存储当前路由地址`
  let initChart1 = () => {
    let element = document.getElementById("main1");
    let myChart = echarts.init(element);
    let option = {
      xAxis: {
        type: "category",
        data: ["2.12", "2.13", "2.14", "2.15", "2.16", "2.17", "2.18"],
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
          data: [10, 25, 15, 25, 20, 10, 25],
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
  useEffect(() => {
    initChart1();
  }, [activeIndex]);

  return (
    <div className="statistical">
      <div className="e_top_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>出入村统计</span>
      </div>
      <div className="s_menu">
        <ul>
          {menuData.map((item, index) => {
            return (
              <li key={index} className={activeIndex == index ? "active" : ""}>
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="people_box">
        <img
          className="pic"
          src={require("../../images/Jhome/people.png")}
          alt=""
        />
        {peopleData.map((item, index) => {
          return (
            <div className="p_con_box">
              <div key={index} className="p_box">
                <div
                  className={
                    item.class == "car" ? "p_name p_car_name" : "p_name"
                  }
                >
                  {item.name}
                </div>
                <div
                  className={
                    item.class == "car" ? "p_value p_car_value" : "p_value"
                  }
                >
                  {item.value}
                </div>
              </div>
              {item.class == "car" ? (
                <img
                  className="people_line"
                  src={require("../../images/Jhome/people_line.png")}
                  alt=""
                />
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
      <div className="e_top_title e_top_title2">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>应急预案</span>
      </div>
      <div className="y_box">
        <div className="y_title">
          <span className="y_left">烟感报警</span>
          <span className="y_right">2021.04.25 10:54:02</span>
        </div>
        <div className="y_co y_first">设备位置：设备位置信息6号</div>
        <div className="y_co y_second">设备名称：烟感设备1</div>
        <div className="y_btn_box">
          <div className="y_btn">启动预案</div>
          <div className="y_btn">设为误报</div>
        </div>
      </div>
      <div className="e_top_title e_top_title3">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>防疫情况</span>
      </div>
      <div className="yc_box">
        <div className="yc_title">体温异常趋势图（7天）</div>
        <div>
          <div id={"main1"} style={{ height: 200 }}></div>
        </div>
      </div>
    </div>
  );
}
export default Jhomert;
