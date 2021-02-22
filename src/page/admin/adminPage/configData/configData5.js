import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import axios from "axios";
import $ from "jquery";
import {Common} from "../../../Cesium/method";
class ConfigData5 extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            isLoad:true,//组件显示
            treeList:[],//地下列表
            SurfaceName:'',//地表名称
            positions:[],//开挖地形的列表
            SurfaceNumber:'10',//开挖深度
            removeId:'',//删除id
        }
        ConfigData5.this=this;
        this.underModel =this.underModel();//地下模型
        this.underList = this.underList.bind(this);//列表
        this.Polygon = this.Polygon.bind(this);//绘制矩形
        this.onContextMenu =this.onContextMenu.bind(this);//右击事件
        this.Save = this.Save.bind(this);//保存
        this.deleted = this.deleted.bind(this);//删除
        this.NavClick = this.NavClick.bind(this);//点击展示挖地
        this.Close = this.Close.bind(this);//关闭
    }
    //地下模型
    underModel(){
        axios.get(global.Url+'map/under/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                $("#liu").css({'display':'block'});

                Common.UndergroundInspection({buildList:result})//显示地下模型
                $("#liu").find(".configShowNav").find("span").html('地下室');
                var data={
                    result,
                    number:1
                }
                Common.returnData(data)
            }else{
                $(".PageShow").show().find('h1').html(res.msg);
                global.Time();
            }
        })
    }
    //列表
    underList(){
        axios.get(global.Url+'map/modify/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    treeList:result
                })
                if(result.length>0){
                    for(var i=0;i<result.length;i++){
                        //Common.ExhibitionPit(result[i].options.position);//
                    }
                }

            }else{
                $(".PageShow").show().find('h1').html(res.msg);
                global.Time();
            }
        })
    }
    //绘制矩形
    Polygon(){
        Common.removePit();//清除挖地
        Common.DiggingTerrain();//绘制矩形
    }
    componentDidMount() {
        this.underList();
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
               // console.log(e.data);
                switch(e.data.switchName){
                    case 'DiggingTerrain':
                        console.log(e.data);
                        ConfigData5.this.setState({
                            positions:e.data.positions.positions
                        })
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    //右击事件
    onContextMenu(e,id){
        e.stopPropagation();
        $("#liTest"+id).find('.Alert_tk').css({'display':"block","color":'#50a4f4'});
        $("#liTest"+id).siblings().find('.Alert_tk').css({'display':'none','color':'#fff'});
    }
    //改变地表名称
    changeSurfaceName=(e)=>{
        this.setState({
            SurfaceName:e.target.value
        })
    }
    //改变开挖深度
    changeSurfaceNumber=(e)=>{
        this.setState({
            SurfaceNumber:e.target.value
        })
    }
    //添加保存数据
    Save(){
        const {SurfaceName,positions,SurfaceNumber} =this.state;//SurfaceName地表名称;;;positions开挖地形的列表;;;SurfaceNumber开挖深度
        console.log(positions);
        if(!SurfaceName){
            $(".PageShow").show().find('h1').html('请输入地形名称！');
            global.Time();
        }else if(positions.length<=0){
            $(".PageShow").show().find('h1').html('请先进行绘制！');
            global.Time();
        }else{
            var data={
                modify_name:SurfaceName,
                options: {
                    height: SurfaceNumber,
                    position: positions
                }
            }
            console.log(data);
            axios.post(global.Url+'map/modify/add',data).then((res) => {
                const result = res.data.data;
                if(result) {
                    $(".PageShow").show().find('h1').html('保存成功！');
                    global.Time();
                    console.log(result);
                    ConfigData5.this.underList();
                }else{
                    $(".PageShow").show().find('h1').html(res.msg);
                    global.Time();
                }
            })
        }

    }
    //点击删除
    deleted(id){
        $(".data5Show").show();
        ConfigData5.this.setState({
            removeId:id
        })
    }
    PageDeletedData5(){
        $(".data5Show").hide();
        //console.log(ConfigData5.this.state.removeId)
        axios.post(global.Url+'map/modify/delete',{id:ConfigData5.this.state.removeId}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                $(".PageShow").show().find('h1').html('删除成功！');
                global.Time();
                ConfigData5.this.underList();
                Common.removePit();//清除挖地
                $(".configDataLeft").find("ul").find(".Alert_tk").css({'display':'none',"color":'#fff'})
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //展示挖地
    NavClick(item){
        Common.ExhibitionPit(item.options.position);
        $("#liTest"+item.id).find('.Alert_tk').css({'display':"block","color":'#50a4f4'});
        $("#liTest"+item.id).siblings().find('.Alert_tk').css({'display':'none','color':'#fff'});
    }
    //关闭
    Close(){
        this.setState({
            isLoad:false
        })
        Common.BuildingShow({show : true});
        $("#LiuClose").click();
    }
    render(){
        const {isLoad,treeList,SurfaceName,SurfaceNumber} = this.state;
        return(
            <Fragment>
                {isLoad?
                    <div className="configShow Map" style={{'width':'500px','height': '400px'}} onLoad={()=>this.underModel()}>
                        <div className="configShowNav">地下模式<i onClick={()=>this.Close()}></i></div>
                        <div className="configData">
                            <div className="configDataLeft">
                                <ul style={{"marginTop":'20px'}}>
                                    {
                                        treeList.length > 0 && treeList.map(
                                            (item,index) => {
                                                return (
                                                    <li key={index} id={"liTest"+item.id} onClick={()=>this.NavClick(item)} onContextMenu={(e)=>this.onContextMenu(e,item.id)}>
                                                        {item.modify_name}
                                                        <div className="Alert_tk" style={{'display':'none'}}>
                                                            <button className='undefindList' onClick={()=>this.deleted(item.id)}>删除</button>
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
                                    <li><span>地形名称:</span><input type="text" onChange={(e)=>this.changeSurfaceName(e)} value={SurfaceName}/></li>
                                    <li><span>开挖深度:</span><input type="number" onChange={(e)=>this.changeSurfaceNumber(e)} value={SurfaceNumber}/>(米)</li>
                                    <li><button onClick={()=>this.Polygon()}>绘制多边形</button><button onClick={()=>this.Save()}>保存</button></li>
                                </div>
                            </div>
                        </div>
                    </div>
                    :''}
                <div className="PageShow1 data5Show">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeletedData5()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapState = (state) => {
    return{
        adminItem:state.admin.get('adminItem'),
        adminIndex:state.admin.get('adminIndex'),
    }
};
const mapDispatch = (dispatch) => ({
    navClick(id,item) {
        dispatch(actionCreators.nav_click(id,item));
    }
});

export default connect(mapState,mapDispatch)(ConfigData5);