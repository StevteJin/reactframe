import React,{Fragment,PureComponent} from "react";
import {Common} from "../../../Cesium/method";
import axios from "axios";
import $ from "jquery";

class PatrolRoute3 extends PureComponent{
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
            autopatrol:false,//自动巡逻
            positions:[]
        }
        PatrolRoute3.this = this;
        this.Loading =this.Loading.bind(this); //页面初始加载
        this.Save = this.Save.bind(this); //保存
        this.onContextMenu = this.onContextMenu.bind(this);//右击事件
        this.deleted = this.deleted.bind(this);//删除
        this.PageDeletedRoute = this.PageDeletedRoute.bind(this);//确定删除
        this.NavClick = this.NavClick.bind(this);//点击修改
        this.NewOne = this.NewOne.bind(this);//点击一级弹框
    }
    //点击新增漫游路线
    NewOne(){
        Common.GeneratePolyline('gb')
        Common.removeEntitiesV1({id:'roamingDrawingLine'});//清除画过的线
        $(".poly").show();//显示设置路线
        $(".configDataLeft").find(".Alert_tk").css('display',"none");//隐藏右键删除
        $(".configDataLeft").children().find("li").find('span').css({'color':'#fff','fontWeight':'100'});
        PatrolRoute3.this.setState({
            RouteName:'',//路线名称
            positions:[]
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
                switch(e.data.switchName){
                    case 'roamingDrawingLine':
                        console.log(e.data.positions_t,'漫游数据');
                        PatrolRoute3.this.setState({positions:e.data.positions_t})
                        break;
                    default:
                        return null;
                }
            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
        this.Loading();
    }
    //改变路线名称
    ChangeRouteName=(e)=>{
     PatrolRoute3.this.setState({
         RouteName:e.target.value
     })
    }
    //右击事件
    onContextMenu(e,id){
        e.stopPropagation();
        $("#liTest"+ id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#liTest"+ id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $(".Alert_tk").css('display',"none");
        $("#liTest"+id).find('.Alert_tk').css('display',"block");//找到它下自己显示
        $(".poly").show();
        PatrolRoute3.this.setState({
            RouteName:'',
            positions:[]
        })
    }
    //页面数据加载
    Loading(){
        axios.get('http://192.168.0.111:8090/33010801001/roam/fly/list').then((res) => {
            const result = res.data.data;
            if(result) {
                PatrolRoute3.this.setState({
                    treeList:result
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //关闭按钮
    Close(){
        PatrolRoute3.this.setState({isShow:false})
        Common.GeneratePolyline('gb')

    }
    //绘制摄像头
    Polygon(){
        const {buffer} =this.state;
        Common.removeEntitiesV1({id:'roamingDrawingLine'});
        PatrolRoute3.this.setState({
            mapData:[],
            AlarmShow:false,
        })
        if(!buffer){
            $(".PageShow").show().find('h1').html('请输入缓冲区域！');
            global.Time();
        }else{
            Common.roamingDrawingLine({distance:parseInt(buffer)})  //EmptySegment, .SinglePhase
        }
    }
    //保存
    Save(){
        const {RouteName,positions} = this.state;
        if(!RouteName){
            $(".PageShow").show().find('h1').html('请输入路线名称！');
            global.Time();
        }else if(positions.length===0){
            $(".PageShow").show().find('h1').html('请绘制路线！');
            global.Time();
        }else{
            console.log(positions,'positions')
            axios.post('http://192.168.0.111:8090/33010801001/roam/fly/add',{
                roam_name:RouteName,
                position:positions,
            }).then((res) => {
                console.log(res,'resresresresresresresresresresres')
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    $(".PageShow").show().find('h1').html('保存成功！');
                    global.Time();
                    PatrolRoute3.this.Loading()
                    PatrolRoute3.this.setState({
                        RouteName:'',
                        positions:[]
                    })
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //删除
    deleted(e,id){
        e.stopPropagation();
        $(".routeShow").show();
        PatrolRoute3.this.setState({
            deleteId:id
        })

    }
    //确定删除
    PageDeletedRoute(){
        $(".routeShow").hide();
        const {deleteId} = this.state;
        axios.post('http://192.168.0.111:8090/33010801001/roam/fly/destroy',{id:deleteId}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                $(".Alert_tk").css('display',"none");
                PatrolRoute3.this.Loading()
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //点击
    NavClick(item){
        //Common.removeEntitiesV1({id:'roamingDrawingLine'});
        $(".configDataLeft").find(".Alert_tk").css('display',"none");

        $("#liTest"+ item.id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#liTest"+ item.id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $('.poly').hide()
        PatrolRoute3.this.setState({
            RouteName:item.roam_name,//路线名称
        })
        Common.GeneratePolyline(item.position)
    }
    render(){
        const{isShow,treeList,RouteName} = this.state;
        return(
            <Fragment>
                {isShow
                    ?
                    <div className="configShow Map" style={{'width':'500px','height': '480px'}}>
                        <div className="configShowNav">漫游路线<i onClick={()=>this.Close()}></i></div>
                        <div className="configData" style={{'height':'420px'}}>
                            <div className="configDataLeft">
                                <button onClick={()=>this.NewOne()}>设置新路线</button>
                                <ul style={{"marginTop":'20px','height':'370px'}}>
                                    {
                                        treeList.length > 0 && treeList.map(
                                            (item,index) => {
                                                return (
                                                    <li key={index} id={"liTest"+item.id} onClick={()=>this.NavClick(item)} onContextMenu={(e)=>this.onContextMenu(e,item.id)}>
                                                        <span>{item.roam_name}</span>
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
                                    <ul>
                                        <li><span>路线名称:</span><input type="text" value={RouteName} onChange={(e)=>this.ChangeRouteName(e)}/></li>
                                        <li className='poly'><button onClick={()=>this.Polygon()} className="caozuo1">绘制路线</button><button  className="caozuo2" style={{'marginLeft':'30px'}} onClick={()=>this.Save()}>确定保存</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    :""
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


export default PatrolRoute3;