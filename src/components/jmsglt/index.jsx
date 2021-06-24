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
  let initChart2 = () => {
    let element = document.getElementById("main2");
    let myChart = echarts.init(element);
    let datas = [
      ////////////////////////////////////////
      [
        { name: "药材类", value: 25 },
        { name: "粮油类", value: 25 },
        { name: "水产类", value: 25 },
        { name: "瓜果类", value: 25 },
      ],
    ];
    let option = {
      title: {
        left: "center",
        textStyle: {
          color: "#999",
          fontWeight: "normal",
          fontSize: 14,
        },
      },
      series: datas.map(function (data, idx) {
        return {
          type: "pie",
          radius: [40, 60],
          top: "100px",
          height: "33.33%",
          left: "center",
          width: 400,
          itemStyle: {
            borderColor: "#fff",
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
                fontSize: 10,
                color: "#999",
              },
            },
          },
          labelLine: {
            length: 15,
            length2: 0,
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
  useEffect(() => {
    initChart2();
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
        <div>
          <div id={"main2"} style={{ height: 200 }}></div>
        </div>
      </div>
    </div>
  );
}
export default Jmsglt;
