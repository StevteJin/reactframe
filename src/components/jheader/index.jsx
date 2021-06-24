import React, { useState, useEffect } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jheader() {
  const [] = useState();
  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {}, []);

  return <div className="j_header">智慧乡村治理平台</div>;
}
export default Jheader;
