import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import $ from "jquery";
import axios from "axios";
import {Common} from "../../../Cesium/method";
class ConfigDevice3 extends PureComponent{
    constructor(props){
        super(props);
        ConfigDevice3.this = this;
        this.state = {
            isLoading:true, //默认为false，当列表加载以后为true,解决第一次挂载数据为初始值空值
            layerList:JSON.parse(sessionStorage.getItem('Floor')),//楼层列表
            indoor:false,//室内室外
            build:{},//建筑下拉框
            buildId:'',//建筑选取默认ID
            floor:{},//楼层下拉框
            floorId:'',//楼层选取默认ID
            name:'',//基站名称
            deletedId:'',//删除id
            details:[],//绘制回调
        }
        this.handleIsIndoor = this.handleIsIndoor.bind(this);//室内室外选取
        this.oneClick = this.oneClick.bind(this);//点击添加
        this.DingSave = this.DingSave.bind(this);//添加保存
        this.Flay = this.Flay.bind(this);//定位飞过去
        this.deleteOne = this.deleteOne.bind(this);//删除
        this.PageDeleted3 = this.PageDeleted3.bind(this);//删除确定
        this.SaveLiu = this.SaveLiu.bind(this);//绘制
    }
    componentDidMount(){
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch (e.data.switchName) {
                    case 'PersonnelPositioning':
                        console.log(e.data);//LengthWidth长宽  cv当前视角坐标 deviation偏转角 positions定位坐标  zeroPoint零点坐标
                        ConfigDevice3.this.setState({
                            details:e.data
                        })
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
        this.onLayer();
    };
    //二级右击事件
    onContextMenu(e,id){
        e.stopPropagation();
        $("#layer"+ id).find('span').css({'color':'#54b2df'});
        $("#layer"+ id).siblings().find('span').css({'color':'#fff'});
        $(".layer_t").find('span').css({'color':'#fff'});
        $(".layer").find(".Alert_tk").css('display',"none");
        $("#layer"+id).find('#Alert'+id).css('display',"block");//找到它下自己显示
    }
    //定位飞过去
    Flay(e,item){
        e.stopPropagation();
        $("#layer"+ item.id).find('span').css({'color':'#54b2df'});
        $("#layer"+ item.id).siblings().find('span').css({'color':'#fff'});
        $(".layer_t").find('span').css({'color':'#fff'});
       console.log(item);

        //Common.CoordinateModelID(data);//飞过去
        //Common.returnData(item);
        Common.InitialPositioning(item);//飞过去
        var reg = new RegExp("/","g");//g,表示全部替换。
        var list = [];
        var modelId;
        var Floors= [];

        var FL = JSON.parse(sessionStorage.getItem('Floor'));
        FL.forEach(element => {
            element.Floorlists.forEach(FLIT => {
                Floors.push(FLIT)
            });

        });
        console.log(Floors);
        //FloorLists
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
            if(Floors[i].id === item.floor_id){
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
                        //Common.onMenuClickedV2(modelId,list);
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
    }
    //删除
    deleteOne(e,id){
        e.stopPropagation();
        $(".device3Show").show();
        ConfigDevice3.this.setState({
            deletedId:id
        })
    }
    //绘制
    SaveLiu(){
        const {long, wide}=this.state;
        var data={
            long:parseInt(long),
            wide:parseInt(wide)
        }
        Common.PersonnelOrientation(data)
    }
    //删除确定
    PageDeleted3(){
        $(".device3Show").hide();
        const {deletedId} =this.state;
        console.log(deletedId);
        axios.post(global.Url+'base/station/destroy',{id:deletedId}).then((res) => {
            console.log(res);
            const result = res.data.data;
            if(result && res.data.msg === 'success') {
                //alert("删除成功！");
                $(".PageShow").show().find('h1').html("删除成功!");
                global.Time();
                ConfigDevice3.this.onLayer();
                $(".layer").find(".Alert_tk").css('display',"none");//找到它下自己显示
            }else{
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }

    //点击添加
    oneClick(){
        ConfigDevice3.this.setState({
            indoor:false,//室内室外
            build:{},
            buildId:'',//建筑选取默认ID
            floor:{},
            floorId:'',//楼层选取默认ID
            name:'',//基站名称
        })
    }
    //点击室内室外
    handleIsIndoor(e){
        ConfigDevice3.this.setState(prevState => ({
            indoor: !prevState.indoor
        }));
        if(!this.state.indoor){
            //alert("室内")
            axios.get(global.Url+'map/build/list').then((res) =>{
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    ConfigDevice3.this.setState({
                        build:result,
                        //buildValue:result[0].build_name,
                        buildId:result[0].id,
                    })
                    axios.post(global.Url+'map/floor/list',{build_id:result[0].id}).then((res) =>{
                        const result = res.data.data;
                        if(result) {
                            console.log(result);
                            ConfigDevice3.this.setState({
                                floor:result,
                                //floorValue:result[0].floor_name,
                                floorId:result[0].id
                            })
                        }else{
                            $(".PageShow").show().find('h1').html(res.data.msg);
                            global.Time();
                        }
                    })
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })

        }else{
            //alert("室外")
            ConfigDevice3.this.setState({
                build:{},
                buildValue:'',
                buildId:'',
                floor:{},
                floorValue:'',
                floorId:''
            })
        }
    }
    //点击建筑下拉框
    ChangeBuild = e =>{
        e.preventDefault();
        console.log(e.target.value);
        axios.post(global.Url+'map/floor/list',{build_id:e.target.value}).then((res) =>{
            const result = res.data.data;
            if(result) {
                console.log(result);
                ConfigDevice3.this.setState({
                    floor:result,
                    floorId:result[0].id
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
        ConfigDevice3.this.setState({
            buildId:e.target.value
        })
    }
    //点击楼层下拉框
    ChangeFloor = e =>{
        e.preventDefault();
        console.log(e.target.value);
        ConfigDevice3.this.setState({
            floorId:e.target.value
        })
    }
    //加载楼层管理
    onLayer(){
        axios.get(global.Url+'base/station/list',{}).then((res) => {
            const result = res.data.data;
            if(result && res.data.msg === 'success') {
                console.log(res);
                ConfigDevice3.this.setState({
                    layerList:result
                })
            }else{
                alert(res.msg)
            }

        })
    }
    //修改基站名称
    ChangeName(e){
        ConfigDevice3.this.setState({
            name:e.target.value
        })
    }
    //添加保存
    DingSave(){
        const {buildId,floorId,name,details}=this.state;
        if(!name){
            $(".PageShow").show().find('h1').html('请输入完整信息！');
            global.Time();
        }else{
            console.log(details);
            var data={
                name:name,  //LengthWidth长宽  cv当前视角坐标 deviation偏转角 positions定位坐标  zeroPoint零点坐标
                positions:details.positions,
                zeroPoint:details.zeroPoint,
                LengthWidth:details.LengthWidth,
                cv:details.cv,
                deviation:details.deviation,
                build_id:buildId,
                floor_id:floorId
            }
            console.log(data);
            axios.post(global.Url+'base/station/add',data).then((res) =>{
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    $(".PageShow").show().find('h1').html('添加成功！');
                    global.Time();
                    ConfigDevice3.this.onLayer();
                    var type='_2DPositioningBox';
                    Common.deletePositioning(type)
                    ConfigDevice3.this.setState({
                        name:'',
                        indoor:false,
                        build:{},
                        buildId:'',
                        floor:{},
                        floorId:''
                    })
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    render(){
        const {isLoading,layerList,name,indoor,build,buildId,floor,floorId} = this.state;
        const{navClick} = this.props;
        return(
            <Fragment>
                {isLoading
                    ?
                    <div className="configShow" style={{'width':'500px'}}>
                        <div className="configShowNav">定位上图 <i onClick={() => navClick(100)}></i></div>
                        <div className="LayerLeft" style={{'width':'29%'}}>
                            <h1><button onClick={()=>this.oneClick(1)}>添加</button></h1>
                            <ul>
                                {
                                    layerList.length > 0 && layerList.map(
                                        (item,index) => {
                                            return  <li key={index} className='layer' id={'layer'+ item.id} onClick={(e)=>this.Flay(e,item)}  onContextMenu={(e)=>this.onContextMenu(e,item.id)}>
                                                <span title={item.name}>{item.name}</span>
                                                <div className="Alert_tk" id={'Alert'+ item.id} style={{'display':'none'}}>
                                                   {/* <button onClick={(e)=>this.twoClick(e,item,1)}>添加</button>*/}
                                                    <button onClick={(e)=>this.deleteOne(e,item.id)}>删除</button>
                                                </div>
                                            </li>
                                        }
                                    )
                                }
                            </ul>
                        </div>
                        <div className="configDataRight" style={{'width':'68%','color':'#fff','marginLeft':'5px'}}>
                            <div className="PositionName"><span>基站名称</span><input type="text" value={name} onChange={(e)=>this.ChangeName(e)}/></div>
                            <div className="PositionFloor" style={{'marginTop':'10px'}}>
                                <span><label>室内：</label><input type="checkbox" checked={indoor} onChange={(e) => this.handleIsIndoor(e)}/></span>
                                <span><select defaultValue={buildId} onChange={this.ChangeBuild}>
                                    {
                                        build.length > 0 && build.map((ele,index)=>{
                                            return(
                                                <option key={index} value={ele.id}>{ele.build_name}</option>
                                            )
                                        })
                                    }
                                </select></span>
                                <span><select defaultValue={floorId} onChange={this.ChangeFloor}>
                                     {
                                         floor.length > 0 && floor.map((ele,index)=>{
                                             return(
                                                 <option key={index} value={ele.id}>{ele.floor_name}</option>
                                             )
                                         })
                                     }
                                </select></span>
                            </div>
                            <div className="configBut" style={{marginLeft:'10px'}}>
                                <button style={{float:'left'}} onClick={()=>this.SaveLiu()}>绘制</button>
                                <button style={{float:'left'}} onClick={() => this.DingSave()}>保存</button>
                            </div>
                        </div>
                    </div>
                    :''
                }
                <div className="PageShow1 device3Show">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeleted3()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapDispatch = () => ({
    navClick(id) {
        console.log(id);
        ConfigDevice3.this.setState({
            isLoading:false,
        })

    },
});

export default connect(null,mapDispatch)(ConfigDevice3);