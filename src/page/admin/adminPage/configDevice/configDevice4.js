import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import $ from "jquery";
import axios from "axios";
import {Common} from "../../../Cesium/method";
class ConfigDevice4 extends PureComponent{
    constructor(props){
        super(props);
        ConfigDevice4.this = this;
        this.state = {
            isLoading:true, //默认为false，当列表加载以后为true,解决第一次挂载数据为初始值空值
            layerList:{},//楼层列表
            indoor:false,//室内室外
            build:{},//建筑下拉框
            buildId:'',//建筑选取默认ID
            floor:{},//楼层下拉框
            floorId:'',//楼层选取默认ID
            name:'',//基站名称
            deletedId:'',//删除id
            Polygon_style:{   //多边形参数
                shapeColor:'#ff0000',//多边形颜色
                shapeTransparency:'90',//形状透明度
                borderWitchPolygon:'1',//边框宽度
                borderColor:'#ffffff',//多边形边框颜色
                borderTransparency:'90'//边框透明度
            },
            Polygon_style_two:{   //多边形参数
                shapeColor:'#6cc6ff',//多边形颜色
                shapeTransparency:'90',//形状透明度
                borderWitchPolygon:'1',//边框宽度
                borderColor:'#ffffff',//多边形边框颜色
                borderTransparency:'90'//边框透明度
            },
            options:{},//绘制回调
            pid:'',//绘制结束id
            oneADD:true,//监区添加框
            twoADD:false,//监室添加框
            addTwoId:'',//添加监室的id
            SCnum:'',//删除数字
        }
        this.handleIsIndoor = this.handleIsIndoor.bind(this);//室内室外选取
        this.oneClick = this.oneClick.bind(this);//点击添加
        this.DingSave = this.DingSave.bind(this);//监区添加保存
        this.DingSaveTwo = this.DingSaveTwo.bind(this);//监视添加保存
        this.Flay = this.Flay.bind(this);//定位飞过去
        this.deleteOne = this.deleteOne.bind(this);//删除监区
        this.PageDeleted3 = this.PageDeleted3.bind(this);//删除确定
        this.SaveLiu = this.SaveLiu.bind(this);//绘制
        this.addTwo = this.addTwo.bind(this);//添加监室
    }
    componentDidMount(){
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch (e.data.switchName) {
                    case 'drawPolygon':
                        console.log(e.data);
                        ConfigDevice4.this.setState({
                            options:e.data.parameter,
                            pid:e.data.id
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
    //右击事件
    onContextMenu1(e,id){
        e.stopPropagation();
        console.log('111')
        $(".layer").find(".Alert_tk").css('display',"none");
        $('#Alert'+id).css('display',"block");//找到它下自己显示
    }
    //定位飞过去
    Flay(e,item){
        e.stopPropagation();
        console.log(item);
        $('.LayerLeft ul li').find('ul').css({'display':'none'});
        $("#layer"+ item.id).find('span').css({'color':'#54b2df'});
        $("#layer"+ item.id).siblings().find('span').css({'color':'#fff'});
        $("#layer"+ item.id).find('ul').css({'display':'block'})
        $(".layer_t").find('span').css({'color':'#fff'});
       //console.log(item);

        //Common.CoordinateModelID(data);//飞过去
        //Common.returnData(item);
        Common.PrisonView(item);//飞过去
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
        //console.log(Floors);
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
    //删除监区
    deleteOne(e,id,num){
        e.stopPropagation();
        $(".device3Show").show();
        ConfigDevice4.this.setState({
            deletedId:id,
            SCnum:num
        })
    }
    //绘制
    SaveLiu(e,item){
        const {name,Polygon_style, Polygon_style_two}=this.state;
        var data;
        if(item===1){
            data={
                id:name,
                Polygon_style:Polygon_style
            }
        }else{
            data={
                id:name,
                Polygon_style: Polygon_style_two
            }
        }
        Common.drawPolygon(data)
    }
    //删除确定
    PageDeleted3(){
        $(".device3Show").hide();
        const {deletedId,SCnum} =this.state;
        console.log(deletedId);
        if(SCnum===1){
            axios.post(global.Url+'watchChildren/destroy',{id:deletedId}).then((res) => {  //global.Url+'base/station/destroy'
                console.log(res);
                const result = res.data.data;
                if(result && res.data.msg === 'success') {
                    //alert("删除成功！");
                    $(".PageShow").show().find('h1').html("删除成功!");
                    global.Time();
                    ConfigDevice4.this.onLayer();
                    $(".layer").find(".Alert_tk").css('display',"none");//找到它下自己显示
                }else{
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }else if(SCnum===2){
            axios.post(global.Url+'watch/destroy',{id:deletedId}).then((res) => {  //global.Url+'base/station/destroy'
                console.log(res);
                const result = res.data.data;
                if(result && res.data.msg === 'success') {
                    //alert("删除成功！");
                    $(".PageShow").show().find('h1').html("删除成功!");
                    global.Time();
                    ConfigDevice4.this.onLayer();
                    $(".layer").find(".Alert_tk").css('display',"none");//找到它下自己显示
                }else{
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
       
    }

    //点击添加
    oneClick(){
        $(".layer").find(".Alert_tk").css('display',"none");
        ConfigDevice4.this.setState({
            indoor:false,//室内室外
            build:{},
            buildId:'',//建筑选取默认ID
            floor:{},
            floorId:'',//楼层选取默认ID
            name:'',//基站名称
            twoADD:false,
            oneADD:true
        })
    }
    //添加监室
    addTwo(e,item){
        debugger
        console.log(item);
        ConfigDevice4.this.setState({
            twoADD:true,
            oneADD:false,
            addTwoId:item
        })
        $(".layer").find(".Alert_tk").css('display',"none");
    }
    //点击室内室外
    handleIsIndoor(e){
        ConfigDevice4.this.setState(prevState => ({
            indoor: !prevState.indoor
        }));
        if(!this.state.indoor){
            //alert("室内")
            axios.get(global.Url+'map/build/list').then((res) =>{
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    ConfigDevice4.this.setState({
                        build:result,
                        //buildValue:result[0].build_name,
                        buildId:result[0].id,
                    })
                    axios.post(global.Url+'map/floor/list',{build_id:result[0].id}).then((res) =>{
                        const result = res.data.data;
                        if(result) {
                            console.log(result);
                            ConfigDevice4.this.setState({
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
            ConfigDevice4.this.setState({
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
                ConfigDevice4.this.setState({
                    floor:result,
                    floorId:result[0].id
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
        ConfigDevice4.this.setState({
            buildId:e.target.value
        })
    }
    //点击楼层下拉框
    ChangeFloor = e =>{
        e.preventDefault();
        console.log(e.target.value);
        ConfigDevice4.this.setState({
            floorId:e.target.value
        })
    }
    //加载监区楼层管理
    onLayer(){
        var Layers = [];
        axios.post(global.Url+'watchChildren/list',).then((res) => {//global.Url+'base/station/list'
            console.log(res)
            const result = res.data.data;
            if(result && res.data.msg === 'success') {
                if(result.length>0){
                    for (let i = 0; i < result.length; i++) {
                        console.log(result[i].id)
                        axios.post(global.Url+'watch/list',{watchchildren_id:result[i].id}).then((res) => {
                            const results = res.data.data;
                            console.log(results)
                            if(results && res.data.msg === 'success') {
                                Layers.push(
                                    {
                                        LayerItems:result[i],
                                        LayerLists:results
                                    }
                                )
                                if(i === result.length - 1){
                                    setTimeout(function(){
                                        ConfigDevice4.this.setState({
                                            layerList:Layers
                                        })
                                    },100)
                                }
                            }else{
                                //alert(res.msg)
                                $(".PageShow").show().find('h1').html(res.data.msg);
                                global.Time();
                            }
                        })
                    }
                }else{
                    ConfigDevice4.this.setState({
                        layerList:{}
                    })
                }
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }

        })
    }
    //修改基站名称
    ChangeName(e){
        ConfigDevice4.this.setState({
            name:e.target.value
        })
    }
    //监区添加保存
    DingSave(){
        const {buildId,floorId,name,options,indoor}=this.state;
        if(!name){
            $(".PageShow").show().find('h1').html('请输入完整信息！');
            global.Time();
        }else{
            console.log(options);
            var data={
                area_name:name,
                area:options,
                build_id:buildId,
                floor_id:floorId,
                indoor:indoor,
            }
            console.log(data);
            axios.post(global.Url+'watchChildren/add',data).then((res) =>{   //global.Url+'base/watch/add'
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    $(".PageShow").show().find('h1').html('添加成功！');
                    global.Time();
                    ConfigDevice4.this.onLayer();
/*                    var type='_2DPositioningBox';
                    Common.deletePositioning(type)*/
                    ConfigDevice4.this.setState({
                        name:'',
                        indoor:false,
                        build:{},
                        buildId:'',
                        floor:{},
                        floorId:'',
                        options:{},
                    })
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //监室添加保存
    DingSaveTwo(){
        const {buildId,floorId,name,options,indoor,addTwoId}=this.state;
        if(!name){
            $(".PageShow").show().find('h1').html('请输入完整信息！');
            global.Time();
        }else{
            console.log(options);
            var data={
                name:name,
                area:options,
                build_id:buildId,
                floor_id:floorId,
                indoor:indoor,
                watchchildren_id:addTwoId
            }
            console.log(data);
            axios.post(global.Url+'watch/add',data).then((res) =>{   //global.Url+'base/watch/add'
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    $(".PageShow").show().find('h1').html('添加成功！');
                    global.Time();
                    ConfigDevice4.this.onLayer();
                    /*                    var type='_2DPositioningBox';
                                        Common.deletePositioning(type)*/
                    ConfigDevice4.this.setState({
                        name:'',
                        indoor:false,
                        build:{},
                        buildId:'',
                        floor:{},
                        floorId:'',
                        options:{},
                    })
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    render(){
        const {isLoading,layerList,name,indoor,build,buildId,floor,floorId,twoADD,oneADD} = this.state;
        const{navClick} = this.props;
        return(
            <Fragment>
                {isLoading
                    ?
                    <div className="configShow" style={{'width':'500px'}}>
                        <div className="configShowNav">监区上图 <i onClick={() => navClick(100)}></i></div>
                        <div className="LayerLeft" style={{'width':'29%'}}>
                            <h1><button onClick={()=>this.oneClick(1)}>添加</button></h1>
                            <ul>
                                {
                                    layerList.length > 0 && layerList.map(
                                        (item,index) => {
                                            console.log(layerList);
                                            return  <li key={index} className='layer' id={'layer'+ item.LayerItems.id} onClick={(e)=>this.Flay(e,item.LayerItems)}  onContextMenu={(e)=>this.onContextMenu(e,item.LayerItems.id)}>
                                                <span title={item.name}>{item.LayerItems.area_name}</span>
                                                <div className="Alert_tk" id={'Alert'+ item.LayerItems.id} style={{'display':'none'}}>
                                                   {/* <button onClick={(e)=>this.twoClick(e,item,1)}>添加</button>*/}
                                                    {item.LayerLists.length === 0 ? <button onClick={(e)=>this.deleteOne(e,item.LayerItems.id,1)}>删除</button>:''}
                                                    <button onClick={(e)=>this.addTwo(e,item.LayerItems.id)}>添加</button>
                                                </div>
                                                <ul style={{'display':'none'}}>
                                                    {
                                                        item.LayerLists.length > 0 && item.LayerLists.map(
                                                            (name,i) => {  //onClick={(e)=>this.twoClick(e,name,2)}
                                                                return  <li key={i} className='layer_t' id={'layer_t'+name.id}   onContextMenu={(e)=>this.onContextMenu1(e,name.id)}>
                                                                    <span>{name.name}</span>
                                                                    <div className="Alert_tk" id={'Alert'+ name.id} style={{'display':'none'}}>
                                                                        <button onClick={(e)=>this.deleteOne(e,name.id,2)}>删除</button>
                                                                    </div>
                                                                </li>
                                                            }
                                                        )
                                                    }
                                                </ul>
                                            </li>
                                        }
                                    )
                                }
                            </ul>
                        </div>
                        {oneADD?
                            <div className="configDataRight" style={{'width':'68%','color':'#fff','marginLeft':'5px'}}>
                                <div className="PositionName"><span>监区名称</span><input type="text" value={name} onChange={(e)=>this.ChangeName(e)}/></div>
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
                                    <button style={{float:'left'}} onClick={(e)=>this.SaveLiu(e,1)}>绘制</button>
                                    <button style={{float:'left'}} onClick={() => this.DingSave()}>保存</button>
                                </div>
                            </div>
                        :''}
                        {twoADD?
                            <div className="configDataRight" style={{'width':'68%','color':'#fff','marginLeft':'5px'}}>
                                <div className="PositionName"><span>监室名称</span><input type="text" value={name} onChange={(e)=>this.ChangeName(e)}/></div>
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
                                    <button style={{float:'left'}} onClick={(e)=>this.SaveLiu(e,2)}>绘制</button>
                                    <button style={{float:'left'}} onClick={() => this.DingSaveTwo()}>保存</button>
                                </div>
                            </div>
                        :''}
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
        ConfigDevice4.this.setState({
            isLoading:false,
        })

    },
});

export default connect(null,mapDispatch)(ConfigDevice4);