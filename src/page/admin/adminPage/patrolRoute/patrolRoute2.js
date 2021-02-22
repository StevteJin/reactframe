import React,{Fragment,PureComponent} from "react";
import axios from "axios";
import $ from "jquery";
import {Common} from "../../../Cesium/method";


class PatrolRoute2 extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            isShow:true,
            oneList:{},//左边树结构
            treeList:{},//右边树结构
            list:[],//分组id
            name:'',//保存名称
            deleteId:'',//删除id
        }
        PatrolRoute2.this = this;
        this.Close = this.Close.bind(this); //关闭
        this.Grouping = this.Grouping.bind(this); //分组
        this.Save = this.Save.bind(this); //保存
        this.Save1 = this.Save1.bind(this); //取消
        this.saveClose = this.saveClose.bind(this); //保存关闭
        this.SaveRoute = this.SaveRoute.bind(this);//保存合并路线
        this.TwoRoute = this.TwoRoute.bind(this);//点击巡逻预案路线

    }
    componentDidMount() {
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        this.Loading();
        this.leftLoading();
    }
    //右边树结构生成方式
    Loading(){
        axios.get(global.Url+'patrol/line/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                PatrolRoute2.this.setState({
                    treeList:result
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //左边树结构
    leftLoading(){
        axios.get(global.Url+'patrol/plan/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                PatrolRoute2.this.setState({
                    oneList:result
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //关闭
    Close(){
        PatrolRoute2.this.setState({
            isShow:false
        })
    }
    //获取id
    changeCheck(e,id,item){
        e.stopPropagation();
        console.log(item)
        const {list} = this.state;
        if(list.indexOf(id) > -1){
            list.splice(list.indexOf(id), 1);
            $(".Routeli"+id).find('label').css({'color':'#fff'});
            Common.removeEntitiesV1({id:id});
        }else{
            list.push(id);
            $(".Routeli"+id).find('label').css({'color':'#50a4f4'});
            axios.post(global.Url+'patrol/line/alllist',{id:item.id}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    Common.roamingRouteDisplay(result);
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
        const newList = list;

        console.log(newList)
        PatrolRoute2.this.setState({
            list:newList
        })
        console.log(PatrolRoute2.this.state.list)
    }
    //分组
    Grouping(){
        $('.Route2').find('ul').find('li').find('input').css({'display':'inline-block'});
        $(".shinei").hide();
        $(".baocui").show();
        $('.Route2').find('ul').find('li').find('label').css({'color':'#fff'});
        $('.Route2').find('ul').find('li').find('input').prop("checked",false);
        PatrolRoute2.this.setState({
            list:[]
        })
    }
    //取消
    Save1(){
        $('.Route2').find('ul').find('li').find('input').css({'display':'none'});
        $(".shinei").show();
        $(".baocui").hide();
        $('.Route2').find('ul').find('li').find('label').css({'color':'#fff'});
        const {list}=this.state;
        if(list.length>0){
            for(var i=0;i<list.length;i++){
                Common.removeEntitiesV1({id:list[i]});
            }
        }
    }
    //保存
    Save(){
        const {list}=this.state;
        if(list.length<=0){
            $(".PageShow").show().find('h1').html('请先选择分组路线！');
            global.Time();
            $(".RouteShowAlart").hide();
        }else{
            $('.Route2').find('ul').find('li').find('input').css({'display':'none'});
            $(".shinei").show();
            $(".baocui").hide();
            $(".RouteShowAlart").show();
        }
    }
    //合并保存名称
    changeName = (e) => {
        PatrolRoute2.this.setState({
            name: e.target.value
        });
    }
    //保存路线
    SaveRoute(){
        const {name,list} =this.state;
        if(!name){
            $(".PageShow").show().find('h1').html('请先输入名称！');
            global.Time();
        }else{
          console.log(name,list);
          $(".RouteShowAlart").hide();
          $('.Route2').find('ul').find('li').find('label').css({'color':'#fff'});
          //patrol/plan/add
            axios.post(global.Url+'patrol/plan/add',{
                plan_name:name,
                line_id:list
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    $(".RouteShowAlart").hide();
                    PatrolRoute2.this.leftLoading();
                    const {list}=this.state;
                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            Common.removeEntitiesV1({id:list[i]});
                        }
                    }
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }

    }
    //保存关闭
    saveClose(){
        $(".RouteShowAlart").hide();
        $('.Route2').find('ul').find('li').find('label').css({'color':'#fff'});
        $('.Route2').find('ul').find('li').find('input').prop("checked",false);
        Common.removeEntitiesV1({id:'roamingDrawingLine'});
    }
    //右击事件
    onContextMenu(e,id){
        e.stopPropagation();
        console.log(id);
        $("#RouteliTwo"+ id).parents().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#RouteliTwo"+ id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#RouteliTwo"+ id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#RouteliTwo"+ id).children().find('span').css({'color':'#fff','fontWeight':'100'});
        $(".layer_t").find('span').css({'color':'#fff','fontWeight':'100'});
        $(".Alert_tk").css('display',"none");
        $("#RouteliTwo"+id).find('.Alert_tk').css('display',"block");//找到它下自己显示
    }
    //删除
    deleted(e,id){
        e.stopPropagation();
        $(".routeShowTwo").show();
        PatrolRoute2.this.setState({
            deleteId:id
        })

    }
    //确定删除
    PageDeletedRoute(){
        $(".routeShowTwo").hide();
        const {deleteId} = this.state;
        axios.post(global.Url+'patrol/plan/destroy',{id:deleteId}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                $(".Alert_tk").css('display',"none");
                PatrolRoute2.this.leftLoading()
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //点击巡逻预案列表
    TwoRoute(item){
       console.log(item);
        $(".Route2two ul li").css({"color":'#fff','fontWeight':'300'});
        axios.post(global.Url+'/patrol/plan/list',{plan_id:item.id}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                if(result.length>0){
                    $("#RouteliTwo"+item.id).css({'color':'#268ae4','fontWeight':'bold'});
                    $(".Route2 ul li").css({"color":'#fff','fontWeight':'300'});
                    for(var i=0;i<result.length;i++){
                        $(".Routeli"+result[i].id).css({'color':'#268ae4','fontWeight':'bold'});
                    }
                }else{
                    return null
                }
               /* $(".Alert_tk").css('display',"none");
                PatrolRoute2.this.leftLoading()*/
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })

    }
    render(){
        const{isShow,treeList,name,oneList} = this.state;
        return(
            <Fragment>
                {isShow?
                    <div className="configShow Map" style={{'height':'450px'}}>
                        <div className="configShowNav">巡逻预案<i onClick={()=>this.Close()}></i></div>
                        <div className="configData" style={{'height':'390px'}}>
                            <div className="configDataLeft Route2two"  style={{'height':'390px'}}>
                                <button>预案列表</button>
                                <ul style={{"marginTop":'20px','height':'390px'}}>
                                    {
                                        oneList.length > 0 && oneList.map(
                                            (item,index) => {
                                                return (
                                                    <li key={item.id} id={'RouteliTwo'+item.id} title={item.plan_name} onContextMenu={(e)=>this.onContextMenu(e,item.id)} onClick={()=>this.TwoRoute(item)}>
                                                        <span>{item.plan_name}</span>
                                                        <div className="Alert_tk" style={{'display':'none','marginTop':'10px'}}>
                                                            <button className='undefindList' onClick={(e)=>this.deleted(e,item.id)}>删除</button>
                                                        </div>
                                                    </li>

                                                )
                                            }
                                        )
                                    }
                                    {oneList.length <= 0?<span>暂无数据</span>:null}
                                </ul>
                            </div>
                            <div className="configDataRight Route2" style={{'width':'260px','marginLeft':'10px'}}>
                                <ul>
                                    {
                                        treeList.length>0 && treeList.map(
                                            (item,index) => {
                                                return(
                                                    <li key={item.id} className={'Routeli'+item.id}><input style={{'display':'none'}} type="checkbox" value={item.id} id={item.id} onChange={(e) => this.changeCheck(e,item.id,item)}/><label htmlFor={item.id}>{item.line_name}</label></li>
                                                )
                                            }
                                        )
                                    }
                                </ul>
                                <div className="configBut" style={{marginTop:'15px'}}>
                                    <button className='cur shinei' onClick={() => this.Grouping()}>室内外分组</button>
                                    <button className='none baocui' style={{'display':'none'}} onClick={() => this.Save()}>确定</button>
                                    <button className='none baocui' style={{'display':'none'}} onClick={() => this.Save1()}>取消</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    :""
                }
                <div className="RouteShowAlart">
                    <div className="RouteShowAlartHide">
                        <h1>预案路线名称<i onClick={()=>this.saveClose()}></i></h1>
                        <input type="text" value={name} onChange={(e)=>this.changeName(e)}/>
                        <button onClick={()=>this.SaveRoute()}>保存</button>
                    </div>
                </div>
                <div className="PageShow1 routeShowTwo">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeletedRoute()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default PatrolRoute2;