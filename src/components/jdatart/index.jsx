import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jhomert() {
  const [activeIndex] = useState(0);

  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {}, [activeIndex]);

  return (
    <div className="jdata_rt_box">
      <div className="jdata_rt_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>气候展示</span>
      </div>
    </div>
  );
}
export default Jhomert;
