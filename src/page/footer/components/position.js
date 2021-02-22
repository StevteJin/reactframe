import React,{PureComponent,Fragment} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import $ from 'jquery';
import {actionCreators} from "../store";
import '../../../style/common.css';
import '../../../style/home.css';
import AddPosition from'../childComponents/AddPosition'
import { Common } from '../../Cesium/method';

class Position extends PureComponent{
    constructor(){
        super()
        this.state = {
            showAddPosition :false, //是否打开添加位置
            locationList : [], //常用位置列表
            Bscroll:"",
            activeBtn: false,
            RemoverId:"",//删除
            RemoverIndex:'',
            listIndex:0,

        }
        this.handleClick = this.handleClick.bind(this)
        this.closeBtn = this.closeBtn.bind(this)
        this.getLocationList = this.getLocationList.bind(this)
        this.addOver = this.addOver.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.centerAim = this.centerAim.bind(this)
    }

    /*KuaiJieJian(e){
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which;
        // const {locationList}=this.state;
        // if (code === 13) {
        //     this.centerAim(locationList[0].position)
        //     console.log('快捷键')
        // }
        console.log(code)
    }*/

    KuaiJieJian(){
        this.getLocationList()
        document.body.addEventListener("keyup",(e) => {
            if(window.event){e = window.event}
            let code = e.charCode || e.keyCode
            let List = this.state.locationList
            if(code === 106){ //字母C===67  *===106
                let listIndex = this.state.listIndex
                this.centerAim(List[listIndex].position)
                if(List.length-1>listIndex){
                    this.setState({listIndex:listIndex+1})
                }else{
                    this.setState({listIndex:0})
                }
                console.log(List[listIndex].position,'坐标'+listIndex)
            }
        })
    }

    componentWillMount(){
        document.body.removeEventListener('keyup',() => {})
    }

    componentDidMount(){
        this.KuaiJieJian();
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch (e.data.switchName) {
                    case 'getCameraView':
                        sessionStorage.setItem('updatePosition',this.JSON.stringify(e.data.cv,null,4));
                        break;
                    case 'InterceptImg':
                        sessionStorage.setItem('upadteImg',JSON.stringify(e.data));
                        break;
                    default :
                        return null
                }
            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    componentDidUpdate(){
        if($("#PositionList").children().length >= 5){
            $("#PositionList").addClass("PositionList")
            $(".PositionLeft").addClass("PositionLeftChange")
        }else{
            $("#PositionList").removeClass("PositionList")
            $(".PositionLeft").removeClass("PositionLeftChange")
        }
        if($("#PositionList").children().length === 0){
            $(".PositionLeft").css("display","none")
        }else{
            $(".PositionLeft").css("display","block")
        }
    }
    //获取地理位置列表
    getLocationList(){
        this.setState({
            activeBtn: !this.state.activeBtn
        })
        let getListData = new FormData()
        getListData.append("user_id",sessionStorage.getItem("role"))
        axios.post(global.Url+'map/location/list',getListData).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    locationList:result,
                })
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    handleClick(){
        this.setState({
            showAddPosition : !this.state.showAddPosition,
        })
    }
    closeBtn(){
        this.setState({
            showAddPosition : false
        })
    }
    //触发列表更新
    addOver(val){
        this.state.locationList.push(val)
        var newlist = this.state.locationList
        this.setState({
            locationList:newlist
        })
        this.forceUpdate()
    }
    //删除位置
    deleteItem(index,indexid){
        //var flag = window.confirm("确定要删除吗?")
        $(".position").show();
        this.setState({
            RemoverId:indexid,
            RemoverIndex:index
        })
        /*        if(flag){
                    var deleteId = {
                        id:indexid
                    }
                    axios.post(global.Url+'map/location/delete',deleteId).then((res) => {
                        const result = res.data.msg;
                        if(result === "success") {
                            this.state.locationList.splice(index,1)
                            this.setState({locationList:this.state.locationList})
                            this.forceUpdate()
                            //alert("删除成功")
                            $(".PageShow").show().find('h1').html('删除成功');
                            global.Time();
                        }else{
                            alert(res.data.msg)
                        }
                    })
                }*/
    }
    PageDeletedData4(){
        const{RemoverId,RemoverIndex}=this.state;
        axios.post(global.Url+'map/location/delete',{id:RemoverId}).then((res) => {
            const result = res.data.msg;
            if(result === "success") {
                this.state.locationList.splice(RemoverIndex,1)
                this.setState({locationList:this.state.locationList})
                this.forceUpdate()
                //alert("删除成功")
                $(".position").hide();
                $(".PageShow").show().find('h1').html('删除成功');
                global.Time();
            }else{
                alert(res.data.msg)
            }
        })
    }
    //更新位置
    changeItem(index,Id){
        //获取相机视角
        Common.onCoordinate();
        //获取截图
        Common.InterceptImg()
        //等待位置更新
        var that= this
        setTimeout(function(){
            that.saveChange(index,Id)
        },0)
    }
    saveChange(index,item){
        var updateLocationData = {}
        updateLocationData.location_name = item.location_name
        updateLocationData.id = item.id
        updateLocationData.position = JSON.parse(sessionStorage.getItem("updatePosition"));
        updateLocationData.pic = JSON.parse(sessionStorage.getItem("upadteImg")).base64Img
        axios.post(global.Url+'map/location/update',updateLocationData).then((res) => {
            const result = res.data.data;
            console.log(result)
            if(result) {
                this.state.locationList.splice(index,1,updateLocationData)
                this.setState({locationList:this.state.locationList})
                this.forceUpdate()
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //定位
    centerAim(indexP){
        Common.CoordinateLocation(indexP)

    }
    render(){
        const {index,clickIcon } = this.props;
        const {locationList,showAddPosition,activeBtn} = this.state;
        return(
            <Fragment>
                <li onClick={() => {clickIcon(2);this.getLocationList()}} className={activeBtn  && index === 2 ? 'active' :''} >
                    <i className="icon2"></i><span>常用位置</span>
                </li>
                {index === 2 && activeBtn ?
                    <div className="PositionWrapper">
                        <div className="PositionLeft" >
                            <div className="PositionList" id="PositionList" >
                                {locationList.length > 0 ? locationList.map(
                                    (item,index)=>{
                                        return <div className="PositionListItem" key={index} index={index} id={item.id} > 
                                                <span><em>{item.location_name}</em> 
                                                <i className="item1"  style={{cursor:"pointer"}} onClick={()=>this.deleteItem(index,item.id)}></i>
                                                <i className="item2"   style={{cursor:"pointer"}} onClick={()=>this.changeItem(index,item)}></i></span>
                                            <img src={item.pic} style={{cursor:"pointer"}} onClick={()=>{this.centerAim(item.position)}} alt=""/>
                                        </div>
                                    }
                                ):""}
                            </div>
                            {/*    $('.parent').animate({scrollLeft:($('.parent li.active').index()-2)*$width},500);*/}
                        </div>
                        <div className="PositionRight" onClick={()=>this.handleClick()}><i></i>添加位置</div>
                        {
                            showAddPosition ? <AddPosition changeData={this.closeBtn} addData={this.addOver}/> : ""
                        }
                    </div>
                    : ''}
                <div className="PageShow1 position">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeletedData4()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapState = (state) => {
    return{
        index:state.footer.get('index')
    }
};
const mapDispatch = (dispatch) => ({
    clickIcon(item) {
        dispatch(actionCreators.click_Icon(item));
        //关闭地下
        //Common.BuildingShow({show : true});
        //关闭楼层
        $("#liu").css({'display':'none'});
    }
});
export default connect(mapState,mapDispatch)(Position);

