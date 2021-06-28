import React, { useState, useEffect } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jfooter(param) {
  const [activeValue, setActive] = useState("home");
  const { pathname } = useLocation(); //存储当前路由地址`
  const navData = [
    {
      name: "首页",
      pic: "home",
      active: "home_active",
      value: "home",
    },
    {
      name: "智慧导游",
      pic: "guide",
      active: "guide_active",
      value: "guide",
    },
    {
      name: "村情信息",
      pic: "vmsg",
      active: "vmsg_active",
      value: "vmsg",
    },
    {
      name: "数据中心",
      pic: "data",
      active: "data_active",
      value: "data",
    },
  ];
  // console.log('父传的',param.getInfo)
  const handle_top = (item, index) => {
    setActive(item.value);
    param.getInfo(item.value)
  };
    
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
            <li key={index} onClick={() => handle_top(item, index)}>
              {activeValue == item.value ? (
                <img
                  src={require("../../images/Jhome/" + item.active + ".png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../images/Jhome/" + item.pic + ".png")}
                  alt=""
                />
              )}

              <span className={activeValue == item.value ? "activeValue" : ""}>
                {item.name}
              </span>
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
