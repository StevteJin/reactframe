import React, { useState, useEffect } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
function Jheader() {
  const [] = useState();
  const [dayNow, setDay] = useState();
  const [weekNow, setWeek] = useState();
  const [timeNow, setTime] = useState();
  const [resultWeather, setResultWeather] = useState({});
  const [resultPm, setResultPm] = useState({});

  const { pathname } = useLocation(); //存储当前路由地址`

  useEffect(() => {
    // getCityList();
    setTimeout(() => {
      getWeather();
      getPm();
    }, 3000)
    showtime();
  }, []);
  let showtime = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    var time1 =
      day +
      "-" +
      month +
      "-" +
      year
    var time =
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    setDay(time1);
    setWeek(getWeekDate());
    setTime(time);
    setTimeout(showtime, 1000);
  };
  let getWeekDate = () => {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    return week;
  }
  //获取所有城市列表
  let getCityList = () => {
    axios.get('http://api.k780.com/?app=weather.city&areaType=cn&appkey=61632&sign=265a778609dc7b71bfe6d859eb8f7095&format=json').then((res) => {
      let dtList = res.data.result.dtList;
    })
  }
  //获取实时天气
  let getWeather = () => {
    axios.get('http://api.k780.com/?app=weather.today&appkey=61632&sign=265a778609dc7b71bfe6d859eb8f7095&format=json&cityId=101220501').then((res) => {
      let resultWeather = res.data.result;
      setResultWeather(resultWeather);
    })
  }

  //获取PM2.5
  let getPm = () => {
    axios.get('http://api.k780.com/?app=weather.pm25&&cityId=101220501&appkey=61632&sign=265a778609dc7b71bfe6d859eb8f7095&format=json').then((res) => {
      let resultPm = res.data.result;
      setResultPm(resultPm);
    })
  }

  return (
    <div className="j_header">
      <div className="j_header_left_co">
        {timeNow}&nbsp;{weekNow}&nbsp;{dayNow}
        &nbsp;&nbsp;<span>{resultWeather.temperature_curr}</span>
        &nbsp;&nbsp;<span>pm2.5:{resultPm.aqi}</span>
        &nbsp;&nbsp;<span>{resultWeather.weather_curr}</span>
      </div>
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
