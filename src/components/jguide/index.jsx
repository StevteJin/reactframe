import React, { useState, useEffect } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";

function Jguide() {
  const [] = useState();
  const guideData = [
    {
      index: 1,
      name: "文化中心广场",
    },
    {
      index: 2,
      name: "农贸市场",
    },
    {
      index: 3,
      name: "振中小学",
    },
    {
      index: 4,
      name: "卫生所",
    },
    {
      index: 5,
      name: "大脚超市",
    },
    {
      index: 6,
      name: "小萌豆制品有限公司",
    },
    {
      index: 7,
      name: "广坤山货",
    },
    {
      index: 8,
      name: "永强果园",
    },
    {
      index: 9,
      name: "刘能家",
    },
    {
      index: 10,
      name: "赵四家",
    },
    {
      index: 11,
      name: "龙广码头",
    },
    {
      index: 12,
      name: "文体中心广场",
    },
    {
      index: 13,
      name: "文体中心广场",
    },
  ];
  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {}, []);

  return (
    <div className="guide_box">
      <div className="guide_title">
        <img src={require("../../images/Jhome/icon-1.png")} alt="" />
        <span>路径列表</span>
      </div>
      <div className="g_list_box">
        {guideData.map((item, index) => {
          return (
            <div key={index} className="g_list">
              <div className="list_index">{item.index}</div>
              <div className="list_right">
                <div className="list_name">{item.name}</div>
                <div className="list_arr">
                  <span>到这里去</span>
                  <img src={require("../../images/Jhome/g_arr.png")} alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Jguide;
