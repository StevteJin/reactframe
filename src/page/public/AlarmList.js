import React,{Fragment,Component} from 'react';
import '../../style/base.css';
import Pic from '../../images/Alarm/moreIcon.png'
import $ from 'jquery';
import axios from "axios";
import moment from "moment";
import {Common} from "../Cesium/method";


class AlarmList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: global.AlarmNumber, //今日报警最外边的数字
            device: {}, //设备类别
            detailsList: {}, //详情
            TatolNum: 0, //总数据
            listData: {}, //websocket数据
            WebList: [], //数组
            webCode: '',//绝对ID
            webTime: '',//绝对时间
        }
        AlarmList.this = this;
        this.onAlarm = this.onAlarm.bind(this); //点击展开
        this.Total = this.Total.bind(this); //点击到全部
        this.onReturn = this.onReturn.bind(this); //点击返回
        this.onTable = this.onTable.bind(this); //点击到详情
    }

    //获取设备类别
    onDevice() {
        this.onObject();
        //const {list, newList} =this.state;
        setTimeout(function () {
            //var object = $.extend(list, newList)
            //console.log(object);
        }, 1000)

    }

    //整合数组
    onObject() {
        var list = [];
        var newList = [];
        axios.post(global.Url + 'device/category/list', {
            enable: true
        }).then((res) => {
            const result = res.data.data;
            if (result && res.data.msg === 'success') {
                list = result;
                //console.log(list);
                axios.get(global.Url + 'event/info/countTodayForCategory',).then((res) => {
                    const results = res.data.data;
                    if (results && res.data.msg === 'success') {
                        newList = results;
                        $.extend(true, list, newList,);
                        //console.log(list,newList);
                        this.setState({
                            device: list
                        })
                        var Num = 0;
                        for (var i = 0; i < results.length; i++) {
                            Num += parseInt(results[i].count)
                        }
                        this.setState({
                            TatolNum: Num
                        })
                    } else {
                        //alert(res.msg)
                        $(".PageShow").show().find('h1').html(res.data.msg);
                        global.Time();
                    }
                })
            } else {
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })


    }

    webfunction(e) {
        // alert(e.data)
        var WebList = AlarmList.this.state.WebList;
        if (e.data === 'subscribe success') {
            return
        } else {
            //console.log(1,JSON.parse(e.data));
            let WebListLength = WebList.length;
            const code = JSON.parse(e.data).event_info.device_code
            const time = JSON.parse(e.data).event_info.start_time
            const webCode = AlarmList.this.state.webCode
            const webTime = AlarmList.this.state.webTime
            switch (WebListLength) {
                case 0:
                    console.log(1, WebList)
                    global.AlarmNumber++;
                    AlarmList.this.state.TatolNum++;
                    AlarmList.this.state.listData = e.data;

                    $("#Num" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#Num" + JSON.parse(e.data).event_info.device_category).html()) + 1);
                    $("#NumList" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#NumList" + JSON.parse(e.data).event_info.device_category).html()) + 1).show();
                    $("#NumOne" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#NumOne" + JSON.parse(e.data).event_info.device_category).html()) + 1);
                    $("#NumOneList" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#NumOneList" + JSON.parse(e.data).event_info.device_category).html()) + 1).show();
                    $("#NumList" + e.data.category_id).css({
                        'display': 'block'
                    });
                    $("#NumOneList" + e.data.category_id).css({
                        'display': 'block'
                    });
                    $(".OneAlarm").find("span").css({
                        'display': 'block'
                    });

                    WebList.push(JSON.parse(e.data));
                    // WebList.push(JSON.parse(e.data));
                    //Common.AlarmBox(JSON.parse(e.data));
                    Common.AlarmBox(JSON.parse(e.data));
                    // Common.ModelClickEvent(e.data.device_info.device_code);   //锟皆讹拷锟斤拷锟斤拷
                    let data = {
                        id: JSON.parse(e.data).device_info.id,
                    }
                    Common.CoordinateModelID(data); //锟缴癸拷去
                    Common.returnData(JSON.parse(e.data).device_info)
                    console.log(WebList);
                    AlarmList.this.setState({webCode: code, webTime: time})
                    break;
                default:
                    if (webCode === code && webTime === time) {
                        break;
                    } else {
                        global.AlarmNumber++;
                        AlarmList.this.state.TatolNum++;
                        AlarmList.this.state.listData = e.data;
                        console.log(WebList, "WebListWebListWebListWebListWebListWebListWebList")
                        // for (var i = 0; i < WebList.length; i++) {
                        //     if ((JSON.parse(e.data).event_info.device_code === WebList[i].event_info.device_code) && (JSON.parse(e.data).event_info.start_time === WebList[i].event_info.start_time)) {
                        //         console.log(JSON.parse(e.data).event_info.device_code, WebList[i].event_info.device_code, '锟斤拷同');
                        //         console.log(JSON.parse(e.data).event_info.start_time, WebList[i].event_info.start_time, '锟斤拷同');
                        //         break;
                        //         return null;
                        //     } else {
                        //         console.log('锟斤拷同');

                        //     }
                        // }
                        $("#Num" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#Num" + JSON.parse(e.data).event_info.device_category).html()) + 1);
                        $("#NumList" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#NumList" + JSON.parse(e.data).event_info.device_category).html()) + 1).show();
                        $("#NumOne" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#NumOne" + JSON.parse(e.data).event_info.device_category).html()) + 1);
                        $("#NumOneList" + JSON.parse(e.data).event_info.device_category).html(parseInt($("#NumOneList" + JSON.parse(e.data).event_info.device_category).html()) + 1).show();
                        $("#NumList" + e.data.category_id).css({
                            'display': 'block'
                        });
                        $("#NumOneList" + e.data.category_id).css({
                            'display': 'block'
                        });
                        $(".OneAlarm").find("span").css({
                            'display': 'block'
                        });

                        WebList.push(JSON.parse(e.data));
                        let dataC = {
                            id: JSON.parse(e.data).device_info.id,
                        }
                        Common.CoordinateModelID(dataC); //锟缴癸拷去
                        Common.returnData(JSON.parse(e.data).device_info)
                        Common.AlarmBox(JSON.parse(e.data));
                        console.log(2, WebList)
                        AlarmList.this.setState({webCode: code, webTime: time})
                        break;
                    }
            }
            $("#UnmCount").html(global.AlarmNumber);
            console.log(AlarmList.this.state.info, global.AlarmNumber)
        }
    }

    componentDidMount() {
        const {
            WebList
        } = this.state;
        console.log(this.props.router)
        let baseUrl = global.WebSocketUrl;
        let webSocket = new WebSocket(baseUrl)
        webSocket.onopen = function (e) {
            console.log('webSocket is open');
            webSocket.send('subscribe')
        }
        if (webSocket.onmessage === null) {

            webSocket.onmessage = this.webfunction;
        }

        window.receiveMessageFromIndex = function (e) {
            if (e !== undefined) {
                switch (e.data.switchName) {
                    case 'removeBubbleBombbox':
                        console.log(e.data)
                        global.AlarmNumber = global.AlarmNumber - 1;
                        console.log($("#NumList" + e.data.category_id).html());
                        if (parseInt($("#NumList" + e.data.category_id).html()) === 0 || parseInt($("#NumList" + e.data.category_id).html()) < 0) {
                            $("#NumList" + e.data.category_id).css({
                                'display': 'none'
                            });
                            $("#NumOneList" + e.data.category_id).css({
                                'display': 'none'
                            });
                            $(".OneAlarm").find("span").css({
                                'display': 'none'
                            });
                        } else {
                            $(".OneAlarm").find("span").css({
                                'display': 'block'
                            });
                            $("#NumList" + e.data.category_id).html(parseInt($("#NumList" + e.data.category_id).html()) - 1);
                            $("#NumOneList" + e.data.category_id).html(parseInt($("#NumOneList" + e.data.category_id).html()) - 1);
                            if ($("#NumList" + e.data.category_id).html() === "0" || $("#NumList" + e.data.category_id).html() < "0") {
                                $("#NumList" + e.data.category_id).css({
                                    'display': 'none'
                                });
                                $("#NumOneList" + e.data.category_id).css({
                                    'display': 'none'
                                });
                                $(".OneAlarm").find("span").css({
                                    'display': 'none'
                                });
                            }

                        }
                        for (let n = 0; n < WebList.length; n++) {
                            if (WebList[n].event_info.event_type_name === "重点人员识别") {
                                if (e.data.id === WebList[n].face.faceName) {
                                    console.log(e.data.id, 'oo+' + WebList[n].event_info.id)
                                    WebList.splice(n, 1);
                                }
                            } else {
                                if (e.data.id === WebList[n].event_info.id) {
                                    console.log(e.data.id, 'oo+' + WebList[n].event_info.id)
                                    WebList.splice(n, 1);
                                }
                            }

                        }
                        AlarmList.this.setState({
                            info: global.AlarmNumber,
                        })
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
        //获取设备类别
        this.onDevice() //


    }

    //点击展开
    onAlarm() {
        $(".One").toggle();
        $(".alrmSelf").toggle();
    }
    //点击到全部
    Total() {
        $(".One .AlarmContent").hide();
        $(".One .AlarmTotal").show();
    }

    //点击返回
    onReturn(id) {
        if (id === 1) {
            $(".AlarmContent").show();
            $(".AlarmTotal").hide();
        } else if (id === 2) {
            $(".AlarmContent,.AlarmTotal").show();
            $(".AlarmList").hide();
            $(".One h1 span").html("今日报警统计");
        }
    }
    //点击到详情
    onTable(id) {
        $(".One .AlarmContent,.One .AlarmTotal").hide();
        $(".One .AlarmList").show();
        $(".One h1 span").html("视频报警");
        var time = moment().format("YYYY-MM-DD");
        time = time + ' 00:00:00';
        //console.log(id,time);
        axios.post(global.Url + 'event/info/list', {
            device_category: id,
            start_time: time
        }).then((res) => {
            const results = res.data.data;
            if (results && res.data.msg === 'success') {
                //console.log(results);
                this.setState({
                    detailsList: results
                })
            } else {
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        }).catch(() => {

        })
    }

    //时间转换
    GMTToStr(time) {
        let date = new Date(time)
        let Str = date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds()
        return Str
    }

    render(){
        const {device,detailsList,TatolNum,info} = this.state;
        return(
            <Fragment>
                <div className="AlarmButton OneAlarm alrmSelf" onClick={()=>this.onAlarm()}>今日报警 <span id="UnmCount">{info}</span></div>
                <div className="AlarmShow One" style={{'display':'none'}}>
                    <h1><span>今日报警统计</span></h1>
                    <div className="AlarmContent">
                        <div className="Total"><h2>总报警</h2><span>{TatolNum}<em>次</em></span></div>
                        <ul>
                            {
                                device.length > 0 && device.map((ele,index)=>{
                                    if(index > 2){
                                        return null
                                    }
                                    return(
                                        <li key={index} onClick={()=>this.onTable(ele.id)}>
                                            <img src={ele.category_icon} alt=""/><span>{ele.category_name}<br/><h3 id={"Num"+ ele.category_id}>{ele.count}</h3><em style={{"display":"none"}} id={"NumList"+ ele.category_id}>{0}</em></span>
                                        </li>
                                    )
                                })
                            }
                            <li onClick={()=>this.Total()}><img src={Pic} alt=""/><span>其他报警</span></li>
                        </ul>
                    </div>
                    <div className="AlarmTotal">
                        <ul>
                            {
                                device.length > 0 && device.map((ele,index)=>{
                                    return(
                                        <li id={ele.id} key={index} onClick={()=>this.onTable(ele.id)}><img src={ele.category_icon} alt=""/><span>{ele.category_name}<br/><h3 id={"NumOne"+ ele.category_id}>{ele.count}</h3><em style={{"display":"none"}} id={"NumOneList"+ ele.category_id}>{0}</em></span></li>
                                    )
                                })
                            }
                        </ul>
                        <i onClick={()=>this.onReturn(1)}></i>
                    </div>
                    <div className="AlarmList">
                        <div className="AlarmListTable">
                            <table>
                                <thead>
                                <tr>
                                    <th>类型</th>
                                    <th>名称</th>
                                    <th>时间</th>
                                    <th>处理</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    detailsList.length > 0 && detailsList.map((item,index)=>{
                                        return(
                                            <tr key={index}>
                                                <td title={item.event_type_name}>{item.event_type_name}</td>
                                                <td title={item.device_name}>{item.device_name}</td>
                                                <td title={item.start_time}>{item.start_time}</td>
                                                <td>{item.handle?<span className='green'>已处理</span>:<span className='red'>待处理</span>}</td>
                                            </tr>
                                        )
                                    })
                                }

                                </tbody>
                            </table>
                        </div>
                        <i onClick={()=>this.onReturn(2)}></i>
                    </div>
                    <div className="But" onClick={()=>this.onAlarm()}></div>
                </div>
            </Fragment>
        )
    }
}
export default AlarmList;