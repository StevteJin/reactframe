import React, { useState, useEffect } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jheader() {
  const [] = useState();
  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {}, []);

  return (
    <div className="j_header">
      <div className="j_header_title">智慧乡村治理平台</div>
      <div className="j_header_right_title">
        <div className="j_header_right_co">
          <img src={require("../../images/Jhome/tx.png")} alt="" />
          <span>报警</span>
        </div>
        <div className="j_header_right_co">
          <img src={require("../../images/Jhome/dz.png")} alt="" />
          <span>安徽省店前镇前河村</span>
        </div>
      </div>
    </div>
  );
}
export default Jheader;
