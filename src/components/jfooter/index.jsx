import React, { useState, useEffect } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jfooter() {
  const [] = useState();
  const { pathname } = useLocation(); //存储当前路由地址`
  const navData = [
    {
      name: "首页",
      pic: "home",
      value: "home",
    },
    {
      name: "智慧导游",
      pic: "guide",
      value: "guide",
    },
    {
      name: "村情信息",
      pic: "vmsg",
      value: "vmsg",
    },
    {
      name: "数据中心",
      pic: "data",
      value: "data",
    },
  ];
  useEffect(() => {}, []);

  return (
    <div className="j_footer">
      <div className="j_left">
        <img src={require("../../images/Jhome/user.png")} alt="" />
        <span>徐同志</span>
        <span>村支书</span>
        <span>15736120388</span>
      </div>
      <ul className="j_center">
        {navData.map((item, index) => {
          return (
            <li key={index}>
              <img
                src={require("../../images/Jhome/" + item.pic + ".png")}
                alt=""
              />
              <span>{item.name}</span>
            </li>
          );
        })}
      </ul>
      <div className="j_right">
        <img src={require("../../images/Jhome/gonggao.png")} alt="" />
        <span>境内山青水秀,景色宜人,环境优美，看到水沟有积水的地</span>
      </div>
    </div>
  );
}
export default Jfooter;
