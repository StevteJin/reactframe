import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jmsgrt() {
  const [activeIndex] = useState(0);

  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {}, [activeIndex]);

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
          <img src={require('../../images/Jhome/score_num.png')} alt="" />
          <div>90.82</div>
        </div>
      </div>
    </div>
  );
}
export default Jmsgrt;
