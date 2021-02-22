import React,{PureComponent} from 'react';
import '../../../style/common.css';
import axios from "axios"
import $ from "jquery"
import {Common} from "../../Cesium/method";

class AddPosition extends PureComponent{
    constructor(props){
        super(props)
        this.state= {
            currentPosition :{}
        }
        this.back = this.back.bind(this)
        this.addLocation = this.addLocation.bind(this)
    }
    componentDidMount(){
        $('#locationName').focus()
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch (e.data.switchName) {
                    case 'getCameraView':
                        sessionStorage.setItem('currentPosition',this.JSON.stringify(e.data.cv,null,4));
                        break;
                    case 'InterceptImg':
                        sessionStorage.setItem('Img',JSON.stringify(e.data));
                        break;
                    default :
                        return null   
                }
            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    back(e){        
        e.stopPropagation()    
        this.props.changeData()    
    }
    addLocation(){
        if($("#locationName").val() === ""){
            //alert("请选择位置")
            $(".PageShow").show().find('h1').html('请输入名称');
            global.Time();
            return
        }
        //获取相机视角
        Common.onCoordinate();
        //获取截图
        Common.InterceptImg()
        //等待位置更新
        var that= this
        setTimeout(function(){
            that.saveLocation()
        },800)
    } 
    //保存地理位置
    saveLocation(){
        var locationData = {}
        locationData.location_name =$("#locationName").val()
        locationData.position = JSON.parse(sessionStorage.getItem("currentPosition"));
        locationData.pic = JSON.parse(sessionStorage.getItem("Img")).base64Img 
        locationData.user_id = sessionStorage.getItem("role")
        axios.post(global.Url+'map/location/add',locationData).then((res) => {
            const result = res.data.data;
            if(result) {
                this.props.addData(result)
                this.props.changeData()    
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    render(){
        return(
            <div className = "addPositionBox" style={{color:"#fff"}}>
                <div style={{marginTop:"34px"}}> 
                    <span style={{marginLeft:"22px",fontSize:'15px'}}>位置名称</span><input type="text" id="locationName"></input>
                </div>
                <div className="addPositionButtonArea">
                    <div className="addPosBtn" onClick={()=>{this.addLocation()}} style={{marginLeft:"100px",cursor:"pointer"}}>保存</div>
                    <div className="addPosBtn" onClick={(e)=>this.back(e)} style={{marginLeft:"21px",cursor:"pointer"}}>取消</div>
                </div>
            </div>
        )
    }
}
export default AddPosition;

