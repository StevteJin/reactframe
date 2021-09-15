import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../store";
import {Common} from "../../Cesium/method";
import axios from "axios";
import $ from "jquery";

class PatrolRoute extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            isShow:true,
            RouteName:'',//路线名称
            buffer:5,//缓冲区域
            mapData:[],//地图数据
            treeList:[],//树结构
            AlarmShow:false,//弹框
            indoor:false,//室内室外
            buildId:'',//建筑id
            build:[],//建筑列表
            floorId:'',//楼层id
            floor:[],//楼层列表
            deleteId:'',//删除id
            change:false,//修改的弹框
            changeId:'',//修改id
        }
        PatrolRoute.this = this;
        this.Loading =this.Loading.bind(this); //页面初始加载
        this.Save = this.Save.bind(this); //保存
        this.onContextMenu = this.onContextMenu.bind(this);//右击事件
        this.deleted = this.deleted.bind(this);//删除
        this.PageDeletedRoute = this.PageDeletedRoute.bind(this);//确定删除
        this.NavClick = this.NavClick.bind(this);//点击修改
        this.NewOne = this.NewOne.bind(this);//点击一级弹框
        this.changeSave = this.changeSave.bind(this);//修改保存
    }
    //点击新增路线
    NewOne(){
        Common.removeEntitiesV1();
        $(".poly").show();
        $(".configDataLeft").find(".Alert_tk").css('display',"none");
        $(".configDataLeft").children().find("li").find('span').css({'color':'#fff','fontWeight':'100'});
        $(".Map").css({'width':'500px'});
        $(".configDataRight").css({'width':'319px'});
        PatrolRoute.this.setState({
            change:false,
            RouteName:'',//路线名称
            buffer:5,//缓冲区域
            AlarmShow:false,//弹框
            indoor:false,//室内室外
            buildId:'',//建筑id
            build:[],//建筑列表
            floorId:'',//楼层id
            floor:[],//楼层列表
        })
    }
    //加载摄像头数据
    Map(data){
        const {indoor,buildId,floorId}=this.state;
        var list={
            indoor:indoor,
            build_id:buildId,
            floor_id:floorId
        }
        var listData=Object.assign(data, list);
        console.log(data,listData);
        axios.post(global.Url+'business/selectCamera',listData).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                PatrolRoute.this.setState({
                    AlarmShow:true,
                    mapData:result
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //监听事件
    componentDidMount() {
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
              //  console.log( '我是react,我接受到了来自iframe的模型ID：', e.data);
                switch(e.data.switchName){
                    case 'roamingDrawingLine':
                        console.log(e.data);
                        PatrolRoute.this.Map(e.data)
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }

    //改变路线名称
    ChangeRouteName=(e)=>{
     PatrolRoute.this.setState({
         RouteName:e.target.value
     })
    }
    //右击事件
    onContextMenu(e,id){
        e.stopPropagation();
        console.log(id)
        $("#liTest"+ id).parents().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#liTest"+ id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#liTest"+ id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#liTest"+ id).children().find('span').css({'color':'#fff','fontWeight':'100'});
        $(".layer_t").find('span').css({'color':'#fff','fontWeight':'100'});
        $(".Alert_tk").css('display',"none");
        $("#liTest"+id).find('.Alert_tk').css('display',"block");//找到它下自己显示
        $(".poly").show();
        $(".Map").css({'width':'500px'});
        $(".configDataRight").css({'width':'319px'});
        PatrolRoute.this.setState({
            change:false,
            RouteName:'',//路线名称
            buffer:5,//缓冲区域
            AlarmShow:false,//弹框
            indoor:false,//室内室外
            buildId:'',//建筑id
            build:[],//建筑列表
            floorId:'',//楼层id
            floor:[],//楼层列表
        })
    }
    //页面数据加载
    Loading(){console.log('是不是每次执行这里的')
            axios.get(global.Url+'patrol/line/list').then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    PatrolRoute.this.setState({
                        treeList:result
                    })
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })

    }
    //关闭按钮
    Close(id){
        if(id===101){
            PatrolRoute.this.setState({
                isShow:true,
                AlarmShow:false
            })
        }else{
            PatrolRoute.this.setState({
                isShow:false,
                AlarmShow:false
            })
        }
    }
    //绘制摄像头
    Polygon(){
        Common.removeEntitiesV1();
        const {buffer} =this.state;
        PatrolRoute.this.setState({
            mapData:[],
            AlarmShow:false,
        })
        if(!buffer){
            $(".PageShow").show().find('h1').html('请输入缓冲区域！');
            global.Time();
        }else{
            Common.roamingDrawingLine({distance:parseInt(buffer)})
        }
    }
    //缓冲区域宽度
    changeNumber=(e)=>{
        PatrolRoute.this.setState({
            buffer:e.target.value
        })
    }
    //修改是否启用
    changeIsenable(e,index,camera_code,enable){
        e.stopPropagation();
        console.log(index,camera_code,enable); //navItemList  先改变里面id为传值相等的id的enable的值，List
        setTimeout(function(){
            var Enable = !enable;
            console.log(Enable);
            var List=PatrolRoute.this.state.mapData;
            List=List.map((item,idx)=> index===idx ? {...item,'patrol_camera':(
                    item.patrol_camera.map((name,i)=>name.camera_code===camera_code ? {...name,'enable':Enable} : name)
                )}:item);
            PatrolRoute.this.setState({
                mapData: List
            })
            console.log(List,PatrolRoute.this.state.mapData);
        },0)
    }
    //修改是否重点
    changeIskey(e,index,camera_code,key){
        e.stopPropagation();
        console.log(index,camera_code,key); //navItemList  先改变里面id为传值相等的id的enable的值，List
        setTimeout(function(){
            var Key = !key;
            console.log(Key);
            var List=PatrolRoute.this.state.mapData;
            List=List.map((item, idx) => index===idx ? {...item,'patrol_camera':(
                    item.patrol_camera.map((name, i) => name.camera_code === camera_code  ? {...name,'key':Key}:name)
                )}:item);
            PatrolRoute.this.setState({
                mapData: List
            })
            console.log(List,PatrolRoute.this.state.mapData);
        },0)
    }
    //保存
    Save(){
        const {RouteName,buffer,indoor,buildId,floorId,mapData} = this.state;
        if(!RouteName){
            $(".PageShow").show().find('h1').html('请输入路线名称！');
            global.Time();
        }else if(!buffer){
            $(".PageShow").show().find('h1').html('请输入缓冲区域！');
            global.Time();
        }else{
            console.log(RouteName,buffer,indoor,buildId,floorId,mapData);
            if(mapData.length>0){
                axios.post(global.Url+'patrol/line/add',{
                    line_name:RouteName,
                    indoor:indoor,
                    build_id:buildId,
                    floor_id:floorId,
                    remark:'',
                    patrol_line_subsection:mapData,
                    buffer:buffer
                }).then((res) => {
                    const result = res.data.data;
                    if(result) {
                        console.log(result);
                        $(".PageShow").show().find('h1').html('保存成功！');
                        global.Time();
                        PatrolRoute.this.Loading()
                        PatrolRoute.this.setState({
                            AlarmShow:false,
                            RouteName:'',
                            buffer:5
                        })
                    }else{
                        $(".PageShow").show().find('h1').html(res.data.msg);
                        global.Time();
                    }
                })
            }else{
                $(".PageShow").show().find('h1').html("没有摄像头，请重新绘制");
                global.Time();
            }

        }
    }
    //删除
    deleted(e,id){
        e.stopPropagation();
        $(".routeShow").show();
        PatrolRoute.this.setState({
            deleteId:id
        })

    }
    //确定删除
    PageDeletedRoute(){
        $(".routeShow").hide();
        const {deleteId} = this.state;
        axios.post(global.Url+'patrol/line/destroy',{id:deleteId}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                $(".Alert_tk").css('display',"none");
                PatrolRoute.this.Loading()
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //点击修改
    NavClick(item){
        Common.removeEntitiesV1();
        $(".Map").css({'width':'850px'});
        $(".configDataRight").css({'width':'650px'});
        $(".poly").hide();
        $(".configDataLeft").find(".Alert_tk").css('display',"none");
        $("#liTest"+ item.id).parents().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#liTest"+ item.id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#liTest"+ item.id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#liTest"+ item.id).children().find('span').css({'color':'#fff','fontWeight':'100'});
        $(".layer_t").find('span').css({'color':'#fff','fontWeight':'100'});
        axios.post(global.Url+'patrol/line/alllist',{id:item.id}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                PatrolRoute.this.setState({
                    change:true,
                    mapData:result.patrol_line_subsection,
                    RouteName:result.line_name,//路线名称
                    buffer:result.buffer,//缓冲区域
                    AlarmShow:false,//弹框
                    indoor:result.indoor,//室内室外
                    buildId:result.build_id,//建筑id
                    floorId:result.floor_id,//楼层id
                    changeId:result.id,
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //室内室外
    handleIsIndoor(e){
        PatrolRoute.this.setState(prevState => ({
            indoor: !prevState.indoor
        }));
        if(!PatrolRoute.this.state.Indoor){
            axios.get(global.Url+'map/build/list').then((res) =>{
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    PatrolRoute.this.setState({
                        build:result,
                        buildId:result[0].id,
                    })
                    axios.post(global.Url+'map/floor/list',{build_id:result[0].id}).then((res) =>{
                        const result = res.data.data;
                        if(result) {
                            console.log(result);
                            PatrolRoute.this.setState({
                                floor:result,
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
            PatrolRoute.this.setState({
                build:[],
                buildId:'',
                floor:[],
                floorId:''
            })
        }
    }
    //点击楼下拉框
    ChangeBuild = e =>{
        e.preventDefault();
        console.log(e.target.value);
        axios.post(global.Url+'map/floor/list',{build_id:e.target.value}).then((res) =>{
            const result = res.data.data;
            if(result) {
                console.log(result);
                PatrolRoute.this.setState({
                    floor:result,
                    floorId:result[0].id
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
        PatrolRoute.this.setState({
            buildId:e.target.value
        })
    }
    //点击层下拉框
    ChangeFloor = e =>{
        e.preventDefault();
        console.log(e.target.value);
        PatrolRoute.this.setState({
            floorId:e.target.value
        })
    }
    //修改确定
    changeSave(){
        const {RouteName,buffer,mapData,changeId} = this.state;
        debugger
        axios.post(global.Url+'patrol/line/update',{
            id:changeId,
            line_name:RouteName,
            remark:'',
            patrol_line_subsection:mapData,
            buffer:buffer
        }).then((res) =>{
            debugger
            const result = res.data.data;
            if(result) {
                console.log(result);
                $(".PageShow").show().find('h1').html('修改成功');
                global.Time();
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    render(){
        const{adminItem,navClick} = this.props;
        const{isShow,treeList,RouteName,AlarmShow,buffer,indoor,buildId,build,floorId,floor,mapData,change} = this.state;
        return(
            <Fragment>
                <li key="5" className={adminItem === 5 ? 'cur' : ''} onClick={ () => navClick(5)}>巡逻路线</li>
                {adminItem===5&&isShow
                    ?
                    <div className="configShow Map" style={{'width':'500px','height': '480px'}}>
                        <div className="configShowNav">巡逻路线<i onClick={()=>this.Close()}></i></div>
                        <div className="configData" style={{'height':'420px'}}>
                            <div className="configDataLeft">
                                <button onClick={()=>this.NewOne()}>设置新路线</button>
                                <ul style={{"marginTop":'20px','height':'370px'}}>
                                    {
                                        treeList.length > 0 && treeList.map(
                                            (item,index) => {
                                                return (
                                                    <li key={index} id={"liTest"+item.id} onClick={()=>this.NavClick(item)} onContextMenu={(e)=>this.onContextMenu(e,item.id)}>
                                                        <span>{item.line_name}</span>
                                                        <div className="Alert_tk" style={{'display':'none'}}>
                                                            <button className='undefindList' onClick={(e)=>this.deleted(e,item.id)}>删除</button>
                                                        </div>
                                                    </li>
                                                )
                                            }
                                        )
                                    }
                                    {treeList.length < 0?<span>暂无数据</span>:null}
                                </ul>
                            </div>
                            <div className="configDataRight" style={{'width':'319px'}}>
                                <div className="Underground">
                                    <li><span>路线名称:</span><input type="text" value={RouteName} onChange={(e)=>this.ChangeRouteName(e)}/></li>
                                    <li><span>缓冲区域宽度:</span><input type="number" step='0' value={buffer} onChange={(e)=>this.changeNumber(e)}/><em>(米)</em></li>
                                    <li className="PositionFloor poly">
                                        <span><label>室内：</label><input type="checkbox" checked={indoor} onChange={(e) => this.handleIsIndoor(e)}/></span>
                                        <span>
                                                    <select defaultValue={buildId} onChange={this.ChangeBuild}>
                                                          {
                                                              build.length > 0 && build.map((ele,index)=>{
                                                                  return(
                                                                      <option key={index} value={ele.id}>{ele.build_name}</option>
                                                                  )
                                                              })
                                                          }
                                                    </select>
                                                </span>
                                        <span>
                                                    <select defaultValue={floorId} onChange={this.ChangeFloor}>
                                                          {
                                                              floor.length > 0 && floor.map((ele,index)=>{
                                                                  return(
                                                                      <option key={index} value={ele.id}>{ele.floor_name}</option>
                                                                  )
                                                              })
                                                          }
                                                    </select>
                                                </span>
                                    </li>
                                    <li className='poly'><button onClick={()=>this.Polygon()}>绘制路线</button></li>
                                    {change?
                                        <div className="RouteNav">
                                            <h1><span>段落</span><span style={{'width':'321px'}}>名称</span><span>是否启用</span><span style={{'width':'99px'}}>是否重点</span></h1>
                                            <div className="RouteTable">
                                                {
                                                    mapData.length > 0 && mapData.map(
                                                        (item,index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <h2>第{index+1}段</h2>
                                                                    <ul>
                                                                        {item.patrol_camera.map(
                                                                            (name,i) => {
                                                                                return (
                                                                                    <li key={i} id={"liTest"+name.camera_code}>
                                                                                        <span>{name.camera_name}</span>
                                                                                        <span><input type="checkbox" defaultValue={name.enable} checked={name.enable} onChange={(e)=>this.changeIsenable(e,index,name.camera_code,name.enable)}/></span>
                                                                                        <span><input className="active" type="checkbox" defaultValue={name.key} checked={name.key} onChange={(e)=>this.changeIskey(e,index,name.camera_code,name.key)}/></span>
                                                                                    </li>
                                                                                )
                                                                            }
                                                                        )}
                                                                        {item.patrol_camera.length <= 0?<li><span style={{'width':'100%'}}>暂无数据</span></li>:null}
                                                                    </ul>

                                                                </div>
                                                            )
                                                        }
                                                    )
                                                }
                                                {mapData.length < 0?<span>暂无数据</span>:null}
                                            </div>
                                            <div className="configBut" style={{'marginTop':'2px'}}><button onClick={()=>this.changeSave()}>修改确定</button></div>
                                        </div>
                                    :null}
                                </div>
                            </div>
                        </div>
                    </div>
                    :""
                }
                {adminItem===5&&AlarmShow
                    ?
                    <div className="configShow" style={{'width':'700px','height': '480px','left':'70px'}}>
                        <div className="configShowNav">路线摄像头<i onClick={()=>this.Close(101)}></i></div>
                        <div className="configData">
                            <div className="RouteNav">
                                <h1><span>段落</span><span>名称</span><span>是否启用</span><span>是否重点</span></h1>
                                <div className="RouteTable" style={{'height':'270px'}}>
                                        {
                                            mapData.length > 0 && mapData.map(
                                                (item,index) => {
                                                    return (
                                                        <div key={index}>
                                                            <h2>第{index+1}段</h2>
                                                            <ul>
                                                                {item.patrol_camera.map(
                                                                    (name,i) => {
                                                                        return (
                                                                            <li key={i} id={"liTest"+name.camera_code}>
                                                                                <span>{name.camera_name}</span>
                                                                                <span><input type="checkbox" defaultValue={name.enable} checked={name.enable} onChange={(e)=>this.changeIsenable(e,index,name.camera_code,name.enable)}/></span>
                                                                                <span><input className="active" type="checkbox" defaultValue={name.key} checked={name.key} onChange={(e)=>this.changeIskey(e,index,name.camera_code,name.key)}/></span>
                                                                            </li>
                                                                        )
                                                                    }
                                                                )}
                                                                {item.patrol_camera.length <= 0?<li><span style={{'width':'100%'}}>暂无数据</span></li>:null}
                                                            </ul>


                                                        </div>
                                                    )
                                                }
                                            )
                                        }
                                        {mapData.length <= 0?<div className="noneDate">暂无数据</div>:null}
                                </div>
                                <div className="configBut" style={{'marginTop':'15px'}}><button onClick={()=>this.Save()}>保存</button></div>
                            </div>
                        </div>
                    </div>
                    :''
                }
                <div className="PageShow1 routeShow">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeletedRoute()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapState = (state) => {
    return{
        adminItem:state.admin.get('adminItem')
    }
};
const mapDispatch = (dispatch) => ({
    navClick(id) {
        Common.Close();
        $(".Map").css({'width':'500px'});
        $(".configDataRight").css({'width':'319px'});
        dispatch(actionCreators.nav_click(id));
        PatrolRoute.this.setState({
            isShow:true,
            change:false
        })
        PatrolRoute.this.Loading()
    },
});

export default connect(mapState,mapDispatch)(PatrolRoute);