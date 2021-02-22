import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import {Common} from "../../../Cesium/method";
import axios from "axios";
import $ from 'jquery';
//调色板
import reactCSS from "reactcss";
import {ChromePicker} from "react-color";

class ConfigData1 extends PureComponent{
    constructor(props){
        super(props);
        ConfigData1.this = this;
        this.state = {
            navItemShow:false,
            Nav:true,//下拉导航显示
            navItem:0, //下拉菜单id,id为1是类别管理，id为,2是设备上图
            X:'',//输入框的x
            Y:'',//输入框的y
            Z:'',//输入框的z
            labelname:'',//标签名称
            labelid:'',//标签id
            Floor : JSON.parse(sessionStorage.getItem('Floor')),//楼层缓存信息
            CameraViewOne : '',//视角
            CameraViewState : false,
            ShowPublic:false,
            OneHtml:true,
            TwoHtml:false,
            fontSize:1,//标注颜色
            fontColorPicker: false,//调色板显示隐藏(颜色)
            borderColorPicker:false,//调色板显示隐藏(边框)
            fontColor:'#fff300',//字体颜色
            borderColor:'#ff0000',//边框颜色
            borderWitch:1,//边框尺寸
        }
        this.CameraView = this.CameraView.bind(this);//点击当前视角
        this.AssignedLabelID = this.AssignedLabelID.bind(this);//一级菜单点击
        this.NavClickOne = this.NavClickOne.bind(this);//二级菜单点击
        this.SaveNav = this.SaveNav.bind(this);//保存二级菜单修改
    }
    componentDidMount(){
        console.log(ConfigData1.this.Floor);
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                console.log( '我是react,我接受到了来自iframe的模型ID：', e.data);
                switch(e.data.switchName){
                    case 'GeoaddlabelV3':
                        console.log(e.data) //parameter.label_position
                        ConfigData1.this.setState({
                            X:e.data.parameter.label_position.x,
                            Y:e.data.parameter.label_position.y,
                            Z:e.data.parameter.label_position.z,
                            borderColor:e.data.parameter.label_style.borderColor,
                            borderWitch:e.data.parameter.label_style.borderWitch,
                            fontColor:e.data.parameter.label_style.fontColor,
                            fontSize:e.data.parameter.label_style.fontSize
                        })
                        break;
                    case 'GeoaddlabelV2':
                        sessionStorage.setItem('labelData',this.JSON.stringify(e.data));
                        var datas =  JSON.parse(sessionStorage.getItem('labelData')).style.position;
                        ConfigData1.this.setState({
                            X:datas.x,
                            Y:datas.y,
                            Z:datas.z
                        })
                        break;
                    case 'getCameraView':
                        ConfigData1.this.setState({
                            CameraViewOne : this.JSON.stringify(e.data.cv)
                        })
                        console.log('数据已刷新',ConfigData1.this.state.CameraViewOne);
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);

        this.initData();//初始化数据
    };
    //初始化 输入框值
    initData(){
        var Floors=ConfigData1.this.state.Floor;
        console.log(Floors);
        if(Floors[0].FloorItems.center_position == null){
            ConfigData1.this.setState({
                labelname:Floors[0].FloorItems.build_name,//标签名称
                labelid:Floors[0].FloorItems.id,//标签id
            })
        }else{
            var list=JSON.stringify({x:Floors[0].FloorItems.center_position.x,y:Floors[0].FloorItems.center_position.y,z:Floors[0].FloorItems.center_position.z,h:Floors[0].FloorItems.center_position.heading,p:Floors[0].FloorItems.center_position.pitch,r:Floors[0].FloorItems.center_position.roll});
            console.log(list);
            ConfigData1.this.setState({
                X:Floors[0].FloorItems.label_position.x,//输入框的x
                Y:Floors[0].FloorItems.label_position.y,//输入框的y
                Z:Floors[0].FloorItems.label_position.z,//输入框的z
                labelname:Floors[0].FloorItems.build_name,//标签名称
                labelid:Floors[0].FloorItems.id,//标签id
                CameraViewOne : JSON.stringify({x:Floors[0].FloorItems.center_position.x,y:Floors[0].FloorItems.center_position.y,z:Floors[0].FloorItems.center_position.z,h:Floors[0].FloorItems.center_position.heading,p:Floors[0].FloorItems.center_position.pitch,r:Floors[0].FloorItems.center_position.roll}),//视角
            })
        }

    }
    //定位标签
    GeoaddlabelV2(){
        console.log(this.state.labelid)
        const {labelname,labelid,fontSize,fontColor,borderColor,borderWitch} =this.state;
        /*        var data={
                    labeltxt:labelname,
                    labelid:labelid,
                    fontSize:fontSize,//标注大小
                    labelcolor:fontColor,//字体颜色
                    labelbordercolor:borderColor,//边框颜色

                }*/
        var data={
            id:labelid,
            label_name:labelname,
            label_style:{
                fontSize:fontSize,
                fontColor:fontColor,
                borderWitch:borderWitch,
                borderColor:borderColor
            }
        };
        console.log(data);
        Common.GeoaddlabelV3(data);//labelname
    }
    //更新点击的楼id及名称
    AssignedLabelID(e,item){
        //先清除之前的
        Common.CancelTilesHighlight();
        console.log(item,'i dont care');
        var Position=item.FloorItems.center_position;
        if(Position === null){
            console.log()
            console.log(item.FloorItems.id)
            ConfigData1.this.setState({
                labelid:item.FloorItems.id,
                labelname:item.FloorItems.build_name,
                X:'',//输入框的x
                Y:'',//输入框的y
                Z:'',//输入框的z
                CameraViewOne : '',//视角
                OneHtml:true,
                TwoHtml:false,
            })
        }else{
            if(!item.FloorItems.center_position){
                ConfigData1.this.setState({
                    labelname:item.FloorItems.build_name,
                    fontSize:2.5,
                    borderWitch:5,
                    fontColor:'#fff300',
                    borderColor:'#ff0000',
                })
            }else if(item.FloorItems.label_style){
                ConfigData1.this.setState({
                    labelid:item.FloorItems.id,
                    labelname:item.FloorItems.build_name,
                    X:item.FloorItems.label_position.x,//输入框的x
                    Y:item.FloorItems.label_position.y,//输入框的y
                    Z:item.FloorItems.label_position.z,//输入框的z
                    CameraViewOne : JSON.stringify({x:Position.x,y:Position.y,z:Position.z,h:Position.heading,p:Position.pitch,r:Position.roll}),//视角
                    OneHtml:true,
                    TwoHtml:false,
                    fontSize:item.FloorItems.label_style.fontSize,
                    borderWitch:item.FloorItems.label_style.borderWitch,
                    fontColor:item.FloorItems.label_style.fontColor,
                    borderColor:item.FloorItems.label_style.borderColor,
                })
            }else if(item.FloorItems.label_style=== null){
                ConfigData1.this.setState({
                    labelid:item.FloorItems.id,
                    labelname:item.FloorItems.build_name,
                    X:item.FloorItems.label_position.x,//输入框的x
                    Y:item.FloorItems.label_position.y,//输入框的y
                    Z:item.FloorItems.label_position.z,//输入框的z
                    CameraViewOne : JSON.stringify({x:Position.x,y:Position.y,z:Position.z,h:Position.heading,p:Position.pitch,r:Position.roll}),//视角
                    OneHtml:true,
                    TwoHtml:false,
                    fontSize:2.5,
                    borderWitch:5,
                    fontColor:'#fff300',
                    borderColor:'#ff0000',
                })
            }
        }
        e.stopPropagation();
        // 被点击的<h1>
        let node = $(e.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.children();

        // 显示/隐藏这个列表
        subMenu.css("display", subMenu.css('display') === "none" ? "block" : "none");
        $(".DataConfigTreeDiv").find("ul").find("li").css({"color":'#fff'});
        $(".Data1"+item.FloorItems.id).css({"color":'#50a4f4'});
        var order_num=0;
        var reg = new RegExp("/","g");//g,表示全部替换。
        if(item.Floorlists.length>0){
            for(var i=0;i<item.Floorlists.length; i++){
                if(order_num<item.Floorlists[i].order_num){
                    order_num=item.Floorlists[i].order_num;
                }
            }
            for(var n=0; n<item.Floorlists.length; n++){
                if(item.Floorlists[n].order_num===order_num){
                    var list = {
                        show:true,
                        id: item.Floorlists[n].model_url.replace(reg,"_")
                    }
                    Common.TilesHighlight(list)
                    break;
                }
            }
        }


    }
    /**
     * 刷新标签
     */
    RefreshLabel(){
        var that = this;
        setTimeout(function(){
            Common.ModifyLabel({
                id:that.state.labelid,
                labeltxt : that.state.labelname,
                x:Number(that.state.X),
                y:Number(that.state.Y),
                z:Number(that.state.Z),
                label_style:{
                    fontSize:that.state.fontSize,
                    fontColor:that.state.fontColor,
                    borderWitch:that.state.borderWitch,//边框宽度
                    borderColor:that.state.borderColor
                }
            });
        },0)
    }
    ChangeStyle(){
        setTimeout(function(){
            var that = ConfigData1.this.state;
            var data = {
                id:that.labelid,
                labeltxt:that.labelname,
                label_style:{
                    fontSize:that.fontSize,
                    fontColor:that.fontColor,
                    borderWitch:that.borderWitch,//边框宽度
                    borderColor:that.borderColor
                }

            }
            Common.GeoaddlabelV3(data);
        },10);
    }
    //保存刷新数据
    Push(){
        var Floors = [];
        axios.get(global.Url+'map/build/list',{}).then((res) => {
            const result = res.data.data;
            if(result) {
                for (let index = 0; index < result.length; index++) {
                    axios.post(global.Url+'map/floor/list',{build_id:result[index].id}).then((res) => {
                        const results = res.data.data;
                        if(results) {
                            Floors.push(
                                {
                                    FloorItems:result[index],
                                    Floorlists:results
                                }
                            )
                            if(index === result.length - 1)
                            {
                                var FloorsList=JSON.stringify(Floors);
                                console.log(FloorsList);
                                sessionStorage.setItem('Floor',FloorsList);
                                console.log(Floors)
                                ConfigData1.this.setState({
                                    Floor:Floors
                                })
                            }
                        }else{
                            //alert(res.data.msg)
                            $(".PageShow").show().find('h1').html(res.data.msg);
                            global.Time();
                        }
                    })
                }
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }

        })
    }
    //保存当前栋数据
    SubmitBuildingInformation(){
        console.log(this.state.CameraViewOne)
        if(!this.state.CameraViewOne){
            //alert("请先设置坐标位置！")
            $(".PageShow").show().find('h1').html("请先设置坐标位置！");
            global.Time();
        }else if(this.state.X === '' || this.state.labelid === ''){
            //alert("请先设置标注位置！")
            $(".PageShow").show().find('h1').html("请先设置标注位置！");
            global.Time();
        }else{
            var  CameraView =  JSON.parse(this.state.CameraViewOne);
            const {labelid,labelname,fontSize,fontColor,borderColor,borderWitch}=this.state;
            var data =
                {
                    id: labelid,
                    build_name: labelname,
                    center_position: {
                        y: CameraView.y,
                        x: CameraView.x,
                        z: CameraView.z,
                        heading: CameraView.h,
                        pitch: CameraView.p,
                        roll: CameraView.r
                    },
                    label_position: {
                        x:Number(this.state.X),y:Number(this.state.Y),z:Number(this.state.Z),
                        heading: 0,
                        itch: 0,
                        roll: 0
                    },
                    label_style:{
                        borderColor:borderColor,
                        borderWitch:borderWitch,
                        fontColor:fontColor,
                        fontSize:fontSize
                    },
                    remark: 1
                }
            console.log(data);
            axios.post(global.Url+'map/build/update',data).then((res) => {
                const result = res.data.data;
                if(result) {
                    $(".PageShow").show().find('h1').html('保存成功');
                    global.Time();
                    //alert("保存成功");
                    this.Push();
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
            //console.log(data)
        }


    }
    //修改X坐标
    changeX(event){
        ConfigData1.this.setState({
            X: event.target.value
        });
        ConfigData1.this.RefreshLabel();
        console.log(event.target.value)
    }
    //修改Y坐标
    changeY(event){
        ConfigData1.this.setState({
            Y: event.target.value
        });
        ConfigData1.this.RefreshLabel();
        console.log(event.target.value)
    }
    //修改Z坐标
    changeZ(event){
        ConfigData1.this.setState({
            Z: event.target.value
        });
        ConfigData1.this.RefreshLabel();
        console.log(event.target.value)
    }
    //修改名称
    Modifylabelname(event){
        ConfigData1.this.setState({
            labelname: event.target.value
        });
        this.RefreshLabel();
        console.log(event.target.value)
    }
    //修改坐标定位
    CameraView(){
        var Dates= JSON.parse(ConfigData1.this.state.CameraViewOne);
        if(Dates===null){
            //alert("请先进行定位！");
            $(".PageShow").show().find('h1').html("请先进行定位！");
            global.Time();
        }else{
            console.log(Dates);
            var cv = {
                x:Dates.x,
                y:Dates.y,
                z:Dates.z,
                h: Dates.h,
                p: Dates.p,
                r: Dates.r,
            };
            var frame=document.getElementById("core_content");
            var sendData={
                Event : '',
                ModName : "RetrospectiveCameraView",
                parameter :cv
            };
            frame.contentWindow.postMessage(sendData,"*");
        }

    }
    //点击二级菜单
    NavClickOne(e,name){
        e.stopPropagation();
        Common.CancelTilesHighlight();
        var centerPosition=name.center_position;
        console.log(name);
        if(centerPosition===null){
            ConfigData1.this.setState({
                labelname:name.floor_name,
                CameraViewOne : JSON.stringify(centerPosition),//视角
                OneHtml:false,
                TwoHtml:true
            })
        }else{
            ConfigData1.this.setState({
                labelname:name.floor_name,
                CameraViewOne : JSON.stringify({x:centerPosition.x,y:centerPosition.y,z:centerPosition.z,h:centerPosition.heading,p:centerPosition.pitch,r:centerPosition.roll}),//视角
                OneHtml:false,
                TwoHtml:true
            })
        }
        sessionStorage.setItem('navId',name.id);
        $(".DataConfigTreeDiv").find("ul").find("li").css({"color":'#fff'});
        $(".Data2"+name.id).css({"color":'#50a4f4'})
    }
    //保存二级菜单修改
    SaveNav(){
        var Id=sessionStorage.getItem('navId');
        var center=JSON.parse(ConfigData1.this.state.CameraViewOne);
        if(center===null){
            //alert("请先进行定位!");
            $(".PageShow").show().find('h1').html("请先进行定位！");
            global.Time();
        }else{
            var data={
                "id": Id,
                "floor_name": ConfigData1.this.state.labelname,
                "center_position": {
                    "y": center.y,
                    "x": center.x,
                    "z": center.z,
                    "heading": center.h,
                    "pitch": center.p,
                    "roll": center.r
                },
                "is_underground": true,
                "rise_height": 10,
                "remark": ""
            }
            console.log(data)
            axios.post(global.Url+'map/floor/update',data).then((res) => {
                const results = res.data.data;
                if(results) {
                    //alert("保存成功");
                    $(".PageShow").show().find('h1').html('保存成功');
                    global.Time();
                    this.Push();
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }

    }
    //修改标注大小
    changefontSize(event){
        ConfigData1.this.setState({
            fontSize:event.target.value
        })
        ConfigData1.this.RefreshLabel();
    }
    //修改边框大小
    changeBorderWitch(event){
        ConfigData1.this.setState({
            borderWitch:event.target.value
        })
        ConfigData1.this.RefreshLabel();
    }
    //显示/隐藏调色板
    handlePalette(type){
        if(type === "fontColor"){
            ConfigData1.this.setState({ fontColorPicker: !ConfigData1.this.state.fontColorPicker });
        }else if(type === "borderColor"){
            ConfigData1.this.setState({ borderColorPicker: !ConfigData1.this.state.borderColorPicker })
        }
    };
    //关闭调色板
    handlePaletteClose(type){
        if(type === "fontColor"){
            ConfigData1.this.setState({ fontColorPicker: false })
        }else if(type === "borderColor"){
            ConfigData1.this.setState({ borderColorPicker: false })
        }
    }
    //选中调色板字体颜色
    handleChoosePalette(type,color){
        if(type === "fontColor"){
            ConfigData1.this.setState({fontColor:color.hex});
            ConfigData1.this.RefreshLabel();

        }else if(type === "borderColor"){
            ConfigData1.this.setState({borderColor:color.hex});
            ConfigData1.this.RefreshLabel();
            // ConfigData1.this.ChangeStyle();
        }
        //ConfigData1.this.onChangeData()
    }

    render(){
        const {Floor,X,Y,Z,labelname,CameraViewOne,OneHtml,TwoHtml,fontSize,fontColor,fontColorPicker,borderColor,borderColorPicker,borderWitch} = this.state;
        const colorStyles = reactCSS({
            'default': {
                color: {
                    width: '50px',
                    height: '25px',
                    borderRadius: '2px',
                    background:fontColor,
                    marginLeft:'100px',
                    marginTop:'3px'
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                    top: '165px',
                    right: '30px',
                    color:'red'
                },
                cover: {
                    position: 'fixed',
                    bottom: '0px',
                    left: '0px',
                    right: '0px',
                    top: '0px'
                },
            },
        });
        const {navClick} = this.props;
        return(
            <Fragment>
                <div className="configShow" style={{'width':'653px','height': '700px'}}>
                    <div className="configShowNav">建筑配置 <i onClick={() => navClick(100)}></i></div>
                    <div className="NavigationButtonBorder">
                        <div className="configBut" style={{'marginTop': '0px'}}><button style={{'position':'absolute','marginLeft':'20px'}}>标注配置</button><button style={{'marginRight': '380px'}}>操作配置</button></div>
                    </div>
                    <div className="DataConfigTreeDiv" style={{'height':'575px'}}>
                        <ul>
                            {
                                Floor.length > 0 && Floor.map(
                                    (item,index) => {
                                        return  <li key={index} className={"Data1"+item.FloorItems.id} onClick={(e)=>this.AssignedLabelID(e,item)}>{item.FloorItems.build_name}
                                            <ul className='navItemList'>
                                                {
                                                    item.Floorlists.length >= 0 && item.Floorlists.map(
                                                        (name,i) => {
                                                            return  <li key={i} className={"Data2"+name.id} onClick={(e)=>this.NavClickOne(e,name)}>{name.floor_name}</li>
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
                    {OneHtml
                        ?
                        <div className="DataOne">
                            <h1>建筑</h1>
                            <li><span>建筑名称：</span><input type="text" value={labelname} onChange={(event) => this.Modifylabelname(event)}/></li>
                            <li><span>标注颜色：</span>
                                <div style={ colorStyles.color } onClick={ this.handlePalette.bind(this,'fontColor')} />
                                {
                                    fontColorPicker&&
                                    <div style={ colorStyles.popover }>
                                        <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'fontColor')}/>
                                        <ChromePicker color={fontColor} onChange={this.handleChoosePalette.bind(this,'fontColor')} />
                                    </div>
                                }
                            </li>
                            <li><span>标注大小：</span><input type="text" value={fontSize} onChange={(event) => this.changefontSize(event)}/></li>
                            <li><span>边框颜色：</span>
                                <div style={{...colorStyles.color,background:borderColor}} onClick={ this.handlePalette.bind(this,'borderColor') } />
                                {
                                    borderColorPicker&&
                                    <div style={{...colorStyles.popover,top:"245px"}}>
                                        <div style={ colorStyles.cover} onClick={this.handlePaletteClose.bind(this,'borderColor')}/>
                                        <ChromePicker color={borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor')} />
                                    </div>
                                }
                            </li>
                            <li><span>边框大小：</span><input type="text" value={borderWitch} onChange={(event) => this.changeBorderWitch(event)}/></li>
                            <li><span>建筑标注：</span><button onClick={()=>this.GeoaddlabelV2()}>设置标注</button></li>
                            <li>
                                <span>标注位置：</span>
                                <div className="DataRight">
                                    <span><label>X：</label><input type="text" defaultValue={X} onChange={(event) => this.changeX(event)}/></span>
                                    <span><label>Y：</label><input type="text" defaultValue={Y} onChange={(event) => this.changeY(event)}/></span>
                                    <span><label>Z：</label><input type="text" defaultValue={Z} onChange={(event) => this.changeZ(event)}/></span>
                                </div>
                            </li>
                            <li><span>定位坐标：</span>
                                <span className='newNav'>
                                    <ul>
                                        <li  onClick={() => this.CameraView()}>坐标定位</li><li className='next' onClick={() => Common.onCoordinate()}>当前位置</li>
                                    </ul>
                                    <div className="liCont">{CameraViewOne}</div>
                                </span>
                            </li>
                            <div className="configBut" style={{'marginTop':'5px'}} onClick={() => this.SubmitBuildingInformation()}><button>保存</button></div>
                        </div>
                        :''
                    }
                    {TwoHtml
                        ?
                        <div className="DataOne">
                            <h1>楼层</h1>
                            <li><span>楼层名称：</span><input type="text" defaultValue={labelname} onChange={(event) => this.Modifylabelname(event)}/></li>
                            <li><span>定位坐标：</span>
                                <span className='newNav'>
                                    <ul>
                                        <li  onClick={() => this.CameraView()}>坐标定位</li><li className='next' onClick={() => Common.onCoordinate()}>当前位置</li>

                                    </ul>
                                    <div className="liCont">{CameraViewOne}</div>
                                </span>
                            </li>
                            <div className="configBut" onClick={() => this.SaveNav()}><button>保存</button></div>
                        </div>
                        :''
                    }
                </div>
            </Fragment>
        )
    }
}

const mapDispatch = (dispatch) => ({
    navClick(id,item) {
        Common.CancelTilesHighlight();
        dispatch(actionCreators.nav_click(id,item));
    },
});

export default connect(null,mapDispatch)(ConfigData1);