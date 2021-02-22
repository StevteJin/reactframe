import React, { Component, Fragment } from 'react';
import "../../style/home.css"
import $ from "jquery";
import {Common} from '../Cesium/method'
// import axios from "axios";


class Public extends Component {
    constructor(props) {
        super(props);
        Public.this = this;
        this.state = {
            name:'',//楼层名称
            FloorList:{},//列表
            center_position:{},
            History:null,//缓存数据，id
            FloorId:''
        }
        this.Close = this.Close.bind(this);//关闭弹框
    }
    AssignedModelID(ID,Floors){
        $(".Floor"+ID).addClass('active')
        $(".FloorListNav").find("li").removeClass("active");

        var modelId;
        var list = [];
        var reg = new RegExp("/","g");//g,表示全部替换。
        Floors.forEach(element => {
            if(element.model_url != null){
                //console.log(element.model_url.replace(reg,"_"))
                list.push ({
                    modelId : element.model_url.replace(reg,"_"),
                    order_num : element.order_num,
                    more: element
                })
            }
        });
        for (let i = 0; i <  Floors.length; i++) {
            if(Floors[i].id === ID){
                modelId=Floors[i].model_url.replace(reg,"_");
                if(Floors[i].model_url == null){return;}
                //Common.CoordinateModel(modelId);
                if(Floors[i].center_position == null){
                    if(modelId != null){
                        if(modelId.indexOf("DXS") !== -1){
                            Common.onMenuClickedV3(modelId,list);
                            Common.removefloorOther();
                        }else{
                           Common.onMenuClickedV2(modelId,list);
                        }
                    }
                }else{
                     var xyz = Floors[i].center_position;
                     var xyzhpr = {y: xyz.y, x: xyz.x, z: xyz.z, h: xyz.heading, p: xyz.pitch,r: xyz.roll}
                    Common.onMenuClickedV2(modelId,list);
                    Common.CoordinateLocation(xyzhpr);
                    console.log("Floors",Floors[i].center_position);
                }
                break;
            }
        }

        // var mianData = JSON.parse(sessionStorage.getItem('MianList'))
        // console.log(mianData,'mianData')
        // if(mianData.length>0){
        //     for(var i= 0;i<mianData.length;i++){
        //         var build_id1 = mianData[i].LayerItems.build_id
        //         var floor_id1 = mianData[i].LayerItems.floor_id
        //         if(ID === floor_id1 && build_id1 === Floors[0].build_id){
        //             mianData[i].LayerLists.forEach(element =>{
        //                 Common.PrisonView2(element);
        //             })
        //             break;
        //         }else{
        //             mianData[i].LayerLists.forEach(element =>{
        //                 Common.Emptyentities({id:element.id})
        //                 Common.deleteSv4(element.id)
        //             })
        //         }
        //     }
        // }
    }
    Close(Floors){
        $(".FloorListNav").find("li").removeClass("active");
        $("#liu").css({'display':'none'});
        var reg = new RegExp("/","g");//g,表示全部替换。
        console.log(Floors)
        var list = [];
        for (let i = 0; i <  Floors.length; i++) {
            if(Floors[i].model_url != null){
                list.push ({
                    modelId : Floors[i].model_url.replace(reg,"_"),
                    order_num : Floors[i].order_num,
                })
            }
        }
        if(list.length>0){
            if(!(list[0].modelId.indexOf('DXS') !== -1)){
                Common.ShowSpecifiedModel(list);
                Common.Close()
            }
        }
        Common.BuildingShow({show : true});
    }
    componentDidMount(){
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch(e.data.switchName){
                    case 'returnData':
                        console.log(e.data);
                        Public.this.setState({
                            FloorId:e.data.floor_id
                        })
                        $(".FloorListNav").find("li").removeClass("active");
                        $(".Floor"+e.data.floor_id).addClass('active');
                        if(e.data.number===1){
                            Public.this.setState({
                                FloorList:e.data.result
                            })
                        }
                        break;
                    case 'TabClick':
                        console.log(e.data);
                        if(JSON.stringify(Public.this.state.FloorList) !== "{}" && Public.this.state.History !== e.data.tabid && Public.this.state.History != null){
                            var FloorList = Public.this.state.FloorList;
                            Public.this.Close(FloorList);
                        }
                        if(e.data.indoor){
                            var Floors = JSON.parse(sessionStorage.getItem('Floor'));
                            $("#liu").css({'display':'block'});
                            for (let index = 0; index <Floors.length; index++) {
                                if(Floors[index].FloorItems.id === e.data.tabid){
                                    Public.this.setState({
                                        name :  Floors[index].FloorItems.build_name,
                                        FloorList : Floors[index].Floorlists,
                                        center_position: Floors[index].FloorItems.center_position,
                                        build_id:e.data.tabid
                                    });
                                    Public.this.state.History = Floors[index].FloorItems.id;
                                    break;
                                }
                            }
                        }else{
                             Floors = JSON.parse(sessionStorage.getItem('Floor'));
                            for (let index = 0; index <Floors.length; index++) {
                                if(Floors[index].FloorItems.id === Public.this.state.build_id){
                                    Floors = Floors[index].Floorlists;
                                    $("#liu").css({'display':'none'});
                                    var reg = new RegExp("/","g");//g,表示全部替换。
                                    var list = [];
                                    for (let i = 0; i <  Floors.length; i++) {
                                        if(Floors[i].model_url != null){
                                            list.push ({
                                                modelId : Floors[i].model_url.replace(reg,"_"),
                                                order_num : Floors[i].order_num,
                                            })
                                        }
                                    }
                                    Common.ShowSpecifiedModel(list);
                                    break;
                                }
                            }
                        }

                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    render() {
        const {name,FloorList} = this.state;
        global.floooList = FloorList;

        return (
            <Fragment>
                <div content={FloorList} className="configShow" id='liu' style={{'position':'fixed','marginTop':'35px','width':'350px','marginLeft':'-380px','zIndex':'5','left':'100%','display':'none','height':'auto','maxHeight':'700px',}}>
                    <div className="configShowNav"><span style={{'width':'80%','float':'left','overflow':'hidden','textOverflow':'ellipsis','whiteSpace':'nowrap'}}>{name}</span><i id="LiuClose" onClick={()=>this.Close(FloorList)}></i></div>
                    <div className="configShowConent">
                        <div className="configShowConent_cont AlarmCont">
                            <ul className="FloorListNav">
                                {
                                    FloorList.length > 0 && FloorList.map(
                                        (item,index) => {
                                            return  <li onClick={()=>this.AssignedModelID(item.id,FloorList)} className={"Floor"+item.id} key={index} id={item.id}>{item.floor_name}</li>
                                        }
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Public;