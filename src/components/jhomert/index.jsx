import React, { useState, useEffect } from "react";
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

  useEffect(() => {}, [activeIndex]);

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
            <div key={index} className="p_box">
              <div
                className={item.class == "car" ? "p_name p_car_name" : "p_name"}
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
          );
        })}
      </div>
      <div className="e_top_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>应急预案</span>
      </div>
      <div className="e_top_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>防疫情况</span>
      </div>
    </div>
  );
}
export default Jhomert;
