import React, { Component, Fragment } from "react";
import upPicture from "../../../images/upload.png"
import axios from "axios";
import $ from "jquery";

// 异常信息组件
class Exception extends Component {
    constructor(props) {
        super(props)
        this.state = {
            maskFlag: false,//查看图片显示
            imgUrl: '',//查看图片路径
            list: [],  // 异常信息列表
        }
        Exception.this =this;
    }
    componentDidMount() {
        // 获取报警点/报警类型，赋值
        const _this = this
        const obj = this.props.alarmValue
        let list = []
        obj.forEach(item => {
            let json = {
                number: item.device_code,
                Uptime: item.ex_time,
                name: item.device_name,
                question: item.ex_typequ,
                detailed: item.detail_info,
                pic: item.pic
            }
            list.push(json)
        })
        this.setState({ list: list })
        // esc关闭查看图片
        $(document).keyup(function (event) {
            if (event.keyCode === 27) {
                _this.setState({ maskFlag: false });
            }
        });
    }
    // 查看图片
    chakanPicture = (url) => {
        const maskFlag = this.state.maskFlag
        this.setState({ maskFlag: !maskFlag, imgUrl: url })
        // $('.chakanTp').slideToggle()
    }
    render() {
        const { list, maskFlag, imgUrl } = this.state
        const { title } = this.props
        return (
            <Fragment>
                {maskFlag && <div className="mask" onClick={() => this.chakanPicture()}></div>}
                {maskFlag && <img src={imgUrl} className="chakanTp" alt="" />}
                <div className="exceptionBox">
                    <div className="exceptionTop">
                        <h2>{title}</h2>
                        <span onClick={this.props.onClick}>×</span>
                    </div>
                    <div className="exceptionTable">
                        <table>
                            <tbody>
                            <tr>
                                {/*<td>编号</td>*/}
                                <td>相机名称</td>
                                <td>上传时间</td>
                                <td>报警类型</td>
                                <td>详细</td>
                                <td>操作</td>
                            </tr>
                            {list.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {/*<td>{item.number}</td>*/}
                                        <td>{item.name}</td>
                                        <td>{item.Uptime}</td>
                                        <td>{item.question}</td>
                                        <td>{item.detailed}</td>
                                        <td onClick={() => this.chakanPicture(item.pic)}>查看图片</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Fragment>
        )
    }
}
// 报警详情组件
class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alarmPoint: '厕所', //报警点
            alarmType: '黑名单报警',//报警类型
            upImage: "",//上传图片
            device_code: "",//摄像头device_code
        }
        Details.this=this;
    }
    componentDidMount() {
        // 获取报警点/报警类型，赋值
        const obj = this.props.details
        this.setState({ alarmPoint: obj.name, alarmType: obj.type, device_code: obj.code })
    }
    // 触发上传图片
    upFile = () => {
        document.getElementById('upFile').click()
    }
    // 创建图片
    createImage = () => {
        const oFile = document.getElementById("upFile")
        const files = oFile.files[0]
        const _this = this
        var reader = null;
        if (files !== undefined) {
            reader = new window.FileReader();
            reader.readAsDataURL(files);
            reader.onload = function (e) {
                _this.setState({ upImage: e.target.result })
            };
        }

    }
    // 保存信息提交
    btnPost = () => {
        const _this = this
        // const url = 'http://192.168.0.111:8090/33010801001/' //测试接口
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const detail_info = $('#detailInfo').val()
        // const file = $('#upFile')[0].files[0]

        let fromData = new FormData()
        fromData.append("detail_info", detail_info);
        fromData.append("device_code", Details.this.state.device_code);
        fromData.append("pic", this.state.upImage);
        fromData.append("ex_name",this.state.alarmType);
        fromData.append("device_name",this.state.alarmPoint);
        fromData.append("files", $('#upFile')[0].files[0]);

        console.log(fromData, config)
        axios.post(global.Url + 'ex/info/add', fromData, config).then((res) => {
            console.log(res)
            if (res.data.data && res.data.msg === 'success') {
                $(".PageShow").show().find('h1').html('保存成功');
                global.Time();
                _this.props.onClick()
            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                $(".PageShowCont h2").hide();
                global.Time();
                //alert(res.msg)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    render() {
        const { alarmPoint, alarmType, upImage } = this.state
        return (
            <div className="exceptionBox">
                <div className="exceptionTop">
                    <h2>报警详情</h2>
                    <span onClick={this.props.onClick}>×</span>
                </div>
                <div className="exceptionValue">
                    <div className="exceptionHang">
                        <label>报警点：</label>
                        <p>{alarmPoint}</p>
                    </div>
                    <div className="exceptionHang">
                        <label>报警类型：</label>
                        <p>{alarmType}</p>
                    </div>
                    <div className="exceptionHang" style={{ alignItems: "flex-start" }}>
                        <label style={{ marginTop: "5px" }}>报警信息：</label>
                        <textarea name="" id="detailInfo" placeholder="报警信息"></textarea>
                    </div>
                    <div className="exceptionHang" style={{ alignItems: "flex-start" }}>
                        <label style={{ marginTop: "5px" }}>上传图片：</label>
                        <div className="upPicture" onClick={this.upFile}>
                            {upImage !== "" && <img className="upTupian" src={upImage} alt="" />}
                            {upImage === "" && <img src={upPicture} alt="" />}
                            {upImage === "" && <span>点击上传</span>}
                            <input type="file" id="upFile" onChange={this.createImage} />
                        </div>
                    </div>
                    <div className="exceptionHang" style={{ justifyContent: "flex-end" }}>
                        <button onClick={this.btnPost}>保存信息</button>
                    </div>
                </div>
            </div>
        )
    }
}
export { Exception, Details };