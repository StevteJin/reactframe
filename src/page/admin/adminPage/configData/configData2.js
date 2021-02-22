import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import axios from "axios";
import {Common} from "../../../Cesium/method";
import $ from "jquery";

//调色板
import reactCSS from "reactcss";
import {ChromePicker} from "react-color";

class ConfigData2 extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            isLoad:true,//显示隐藏
            mapList:{},//地图列表
            mapName:'',//地图名称
            mapTagName:'',//修改标签名称
            fontSize:'1',//字体大小
            fontColor:'#ffffff',//字体颜色
            borderWitch:'1',//边框宽度
            borderColor:'#ffffff',//边框颜色
            centerPosition:{},//当前视角坐标
            labelPosition:{},//当前标注坐标
            labelStyle:{},//当前标注样式
            labelId:'',//标注Id
            oneMap:true,//添加内容显示隐藏
            twoMap:false,//修改内容显示隐藏
            deletedId:'',//删除ID
            fontColorPicker: false,//调色板显示隐藏(颜色)
            borderColorPicker:false,//调色板显示隐藏(边框)
        }
        ConfigData2.this = this;
        this.Close = this.Close.bind(this);//关闭
        this.setTag = this.setTag.bind(this);//设置标注
        this.saveTag = this.saveTag.bind(this);//保存添加的标注
        this.AddList = this.AddList.bind(this);//保存添加按钮
        this.changeTag = this.changeTag.bind(this);//修改保存添加的标注
        this.ChangeList = this.ChangeList.bind(this);//修改地图标注
        this.onContextMenu = this.onContextMenu.bind(this);//鼠标右击事件
        this.DeletedTag = this.DeletedTag.bind(this);//删除标注
        this.PageDeletedData2 =this.PageDeletedData2.bind(this);

    }
    componentDidMount() {
        this.onLoad();//获取地图列表
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch(e.data.switchName){
                    case 'GeoaddlabelV3':
                        console.log(e.data);
                        var Parameter=e.data.parameter
                        ConfigData2.this.setState({
                            labelId:Parameter.label_id,
                            labelStyle:Parameter.label_style,
                            labelPosition:Parameter.label_position,
                            mapName:Parameter.label_name,
                        })
                        break;
                    case 'getCameraView':
                        var cv=e.data.cv;
                        ConfigData2.this.setState({
                            centerPosition:{
                                y: cv.y,
                                x: cv.x,
                                z: cv.z,
                                heading: cv.h,
                                pitch: cv.p,
                                roll: cv.r
                            }
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
    //获取地图列表
    onLoad(){
        axios.get(global.Url+'map/label/list').then((res) => {
            const results = res.data.data;
            if(results) {
                this.setState({
                    mapList:results
                })
            }else{
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //关闭
    Close(){
        this.setState({
            isLoad:false
        })
    }
    //标注名称
    changeName(event){
        this.setState({
            mapName: event.target.value
        });
        ConfigData2.this.onChangeData()
    }
    //字体大小
    changFont(event){
        this.setState({
            fontSize: event.target.value
        });
        ConfigData2.this.onChangeData()
    }
    //字体颜色
    ChangeColor(e){
        ConfigData2.this.setState({
            fontColor:e.target.value
        })
        ConfigData2.this.onChangeData()
    }
    //边框大小
    changeBorder(event){
        this.setState({
            borderWitch: event.target.value
        });
        ConfigData2.this.onChangeData()
    }
    //边框颜色
    ChangeBorderColor(e){
        ConfigData2.this.setState({
            borderColor:e.target.value
        })
        ConfigData2.this.onChangeData()
    }
    //设置标注
    setTag(){
        const {labelId,mapName,fontSize,fontColor,borderWitch,borderColor} = this.state;
        if(!mapName){
            //alert("请先输入标注名称！");
            $(".PageShow").show().find('h1').html("请先输入标注名称!");
            global.Time();
        }else{
            var data={
                id:labelId,
                label_name:mapName,
                label_style:{
                    fontSize:fontSize,
                    fontColor:fontColor,
                    borderWitch:borderWitch,
                    borderColor:borderColor
                }
            };
            console.log(data);
            Common.GeoaddlabelV3(data);
        }
    }
    //保存设置
    saveTag(){
        var list=ConfigData2.this.state;
        if(!list.mapName){
            //alert("请先输入标注名称！");
            $(".PageShow").show().find('h1').html("请先输入标注名称!");
            global.Time();
        }else if(JSON.stringify(list.labelPosition) === "{}"){
            //alert("请先输入设置标注！");
            $(".PageShow").show().find('h1').html("请先绘制标注!");
            setTimeout(function () {
                $(".PageShow").hide();
            },1000)
        }else{
            Common.onCoordinate();
            setTimeout(function () {
                var list=ConfigData2.this.state;
                var data={
                    label_name: list.mapName,
                    center_position: list.centerPosition,
                    label_position: list.labelPosition,
                    label_style: list.labelStyle,
                    remark: "1"
                }
                console.log("data",list.centerPosition);
                if(JSON.stringify(list.centerPosition) === "{}"){
                    //alert("Cesium内部出错了，请刷新页面或更换浏览器！");
                    $(".PageShow").show().find('h1').html('Cesium内部出错了，请刷新页面或更换浏览器');
                    global.Time();
                }else{
                    axios.post(global.Url+'map/label/add',data).then((res) => {
                        const results = res.data.data;
                        if(results && res.data.msg === 'success') {
                            console.log(res,results);
                            $(".PageShow").show().find('h1').html("保存成功!");
                            global.Time();
                            Common.ResetLabel();
                            ConfigData2.this.onLoad();
                            ConfigData2.this.setState({
                                oneMap:false,
                            })
                            ConfigData2.this.setEmty();

                        }else{
                            // alert(res.data.msg)
                            $(".PageShow").show().find('h1').html(res.data.msg);
                            global.Time();
                        }
                    })
                }


            },10)
        }
    }
    //还原默认值
    setEmty(){
        ConfigData2.this.setState({
            oneMap:true,
            mapName:'',
            centerPosition:{},
            labelPosition:{},
            labelStyle:{},
            fontSize:'1',//字体大小
            fontColor:'#ffffff',//字体颜色
            borderWitch:'1',//边框宽度
            borderColor:'#ffffff',//边框颜色
            labelId:'',//标注Id
        })
    }
    //点击添加按钮
    AddList(){
        this.setState({
            oneMap:true,
            twoMap:false,
        })
        ConfigData2.this.setEmty();
        $(".RightDelete").css({'display':'none'})
    }
    //修改列表标注
    ChangeList(id){
        this.setState({
            oneMap:false,
            twoMap:true,
        })
        $("#Right"+id).css({'color':'#54b2df','fontWeight':'bold'});
        $("#Right"+id).siblings().css({'color':'#fff','fontWeight':'100'});
        $("#Right"+id).find('.RightDelete').css({'display':'none'});
        $("#Right"+id).siblings().find('.RightDelete').css({'display':'none'});
        axios.post(global.Url+'map/label',{id:id}).then((res) => {
            const results = res.data.data;
            if(results) {
                console.log(results,results.label_style.fontSize);
                ConfigData2.this.setState({
                    mapName:results.label_name,//地图名称
                    mapTagName:results.label_name,//地图名称
                    fontSize:results.label_style.fontSize,//字体大小
                    fontColor:results.label_style.fontColor,//字体颜色
                    borderWitch:results.label_style.borderWitch,//边框宽度
                    borderColor:results.label_style.borderColor,//边框颜色
                    centerPosition:results.center_position,//当前视角坐标
                    labelPosition:results.label_position,//当前标注坐标
                    labelId:results.id,//标注Id
                    labelStyle:{
                        borderColor: results.label_style.borderColor,
                        borderWitch: results.label_style.borderWitch,
                        fontColor: results.label_style.fontColor,
                        fontSize: results.label_style.fontSize
                    }

                })
            }else{
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //修改保存
    changeTag(){
        var list=ConfigData2.this.state;
        if(!list.mapName){
            //alert("请先输入标注名称！");
            $(".PageShow").show().find('h1').html("请先输入标注名称!");
            global.Time();
        }else if(JSON.stringify(list.labelPosition) === "{}"){
            //alert("请先输入设置标注！");
            $(".PageShow").show().find('h1').html("请先绘制设置标注!");
            global.Time();
        }else{
            Common.onCoordinate();
            setTimeout(function () {
                var list=ConfigData2.this.state;
                var data={
                    id:list.labelId,
                    label_name: list.mapName,
                    center_position: list.centerPosition,
                    label_position: list.labelPosition,
                    label_style: {
                        fontSize:list.fontSize,
                        fontColor:list.fontColor,
                        borderWitch:list.borderWitch,
                        borderColor:list.borderColor
                    },
                    remark: "1"
                }
                console.log(data,list.centerPosition);
                if(JSON.stringify(list.centerPosition) === "{}"){
                    //alert("Cesium内部出错了，请刷新页面或更换浏览器！");
                    $(".PageShow").show().find('h1').html('Cesium内部出错了，请刷新页面或更换浏览器');
                    global.Time();
                }else{
                    axios.post(global.Url+'map/label/update',data).then((res) => {
                        const results = res.data.data;
                        if(results && res.data.msg === 'success') {
                            console.log(res,results);
                            //alert("！");
                            $(".PageShow").show().find('h1').html("修改成功!");
                            global.Time();
                            ConfigData2.this.onLoad();
                        }else{
                            //alert(res.data.msg)
                            $(".PageShow").show().find('h1').html(res.data.msg);
                            global.Time();
                        }
                    })
                }


            },10)


        }
    }
    //鼠标右击事件
    onContextMenu(e,id){
        e.stopPropagation(); //顺序不能换
        $("#Right"+id).find('.RightDelete').css({'display':'block'});
        $("#Right"+id).siblings().find('.RightDelete').css({'display':'none'});
        $("#Right"+id).css({'color':'#54b2df','fontWeight':'bold'});
        $("#Right"+id).siblings().css({'color':'#fff','fontWeight':'100'});
    }
    //输入框下拉框监听方法
    onChangeData(){
        setTimeout(function(){
            var that = ConfigData2.this.state;
            var data = {
                id:that.labelId,
                labeltxt:that.mapName,
                label_style:{
                    fontSize:that.fontSize,
                    fontColor:that.fontColor,
                    borderWitch:that.borderWitch,//边框宽度
                    borderColor:that.borderColor
                }

            }
            Common.ModifyLabel(data)
        },10);
    }
    //删除标注
    DeletedTag(e,id){
        e.stopPropagation();
        $(".data2Show").show();
        this.setState({
            deletedId:id
        })
    }
    PageDeletedData2(){
        $(".data2Show").hide();
        axios.post(global.Url+'map/label/delete',{id:this.state.deletedId}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.onLoad();
                $("#Right"+this.state.deletedId).find('.RightDelete').css({'display':'none'});
                Common.ResetLabel();
                //alert("删除成功！");
                $(".PageShow").show().find('h1').html("删除成功!");
                global.Time();
                ConfigData2.this.AddList();
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //显示/隐藏调色板
    handlePalette(type){
        if(type === "fontColor"){
            this.setState({ fontColorPicker: !this.state.fontColorPicker })
        }else if(type === "borderColor"){
            this.setState({ borderColorPicker: !this.state.borderColorPicker })
        }
    };
    //关闭调色板
    handlePaletteClose(type){
        if(type === "fontColor"){
            this.setState({ fontColorPicker: false })
        }else if(type === "borderColor"){
            this.setState({ borderColorPicker: false })
        }
    }
    //选中调色板字体颜色
    handleChoosePalette(type,color){
        if(type === "fontColor"){
            this.setState({fontColor:color.hex})

        }else if(type === "borderColor"){
            this.setState({borderColor:color.hex})
        }
        ConfigData2.this.onChangeData()
    }
    render(){
        const {isLoad,mapList,oneMap,twoMap,mapName,fontSize,fontColor,borderWitch,borderColor,mapTagName,fontColorPicker,borderColorPicker} = this.state;
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
        return(
            <Fragment>
                {isLoad
                    ?
                    <div className="configShow Map" style={{'width':'460px','height': '400px'}}>
                        <div className="configShowNav">地图标注 <i onClick={()=>this.Close()}></i></div>
                        <div className="configData">
                            <div className="configDataLeft">
                                <h1><button onClick={()=>this.AddList()}>添加</button></h1>
                                <ul>
                                    {
                                        mapList.length > 0 && mapList.map(
                                            (item,index) => {
                                                return <li key={index} className='RightDeleted' id={'Right'+item.id} onClick={()=>this.ChangeList(item.id)} onContextMenu={(e)=>this.onContextMenu(e,item.id)}>
                                                    {item.label_name}
                                                    <div className="RightDelete" style={{'display':'none'}}>
                                                        <button onClick={(e)=>this.DeletedTag(e,item.id)}>删除</button>
                                                    </div>
                                                </li>
                                            }
                                        )
                                    }
                                </ul>
                            </div>
                            {oneMap
                                ?
                                <div className="configDataRight">
                                    <h1>设置地图标注</h1>
                                    <li><span>标注名称：</span><input type="text" defaultValue={mapName} onChange={(event) => this.changeName(event)}/></li>
                                    <li><span>字体大小：</span><input type="text" defaultValue={fontSize} onChange={(event) => this.changFont(event)}/></li>
                                    <li><span>字体颜色：</span>
                                        {/* <select
                                            className='AddSelect'
                                            onChange={this.ChangeColor}
                                            defaultValue = {fontColor}>
                                            <option value='#17aaab'>墨绿</option>
                                            <option value='#fff300'>黄</option>
                                            <option value='#f7f8d0'>淡紫</option>
                                            <option value='#8ea399'>淡绿</option>
                                            <option value='#968df3'>深紫</option>
                                            <option value='#96c99e'>深绿</option>
                                            <option value='#1c48b2'>蓝</option>
                                            <option value='#dc6348'>橘黄</option>
                                            <option value='#228b22'>绿</option>
                                            <option value='#ffffff'>白</option>
                                        </select> */}
                                        <div style={ colorStyles.color } onClick={ this.handlePalette.bind(this,'fontColor')} />
                                        {
                                            fontColorPicker&&
                                            <div style={ colorStyles.popover }>
                                                <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'fontColor')}/>
                                                <ChromePicker color={fontColor} onChange={this.handleChoosePalette.bind(this,'fontColor')} />
                                            </div>
                                        }
                                    </li>
                                    <li><span>边框宽度：</span><input type="text" defaultValue={borderWitch} onChange={(event) => this.changeBorder(event)}/></li>
                                    <li><span>边框颜色：</span>
                                        {/* <select
                                            className='AddSelect'
                                            onChange={this.ChangeBorderColor}
                                            value = {borderColor}>
                                            <option value='#ffffff'>白</option>
                                            <option value='#000000'>黑</option>
                                            <option value='#17aaab'>墨绿</option>
                                            <option value='#fdf150'>黄</option>
                                            <option value='#1c48b2'>蓝</option>
                                            <option value='#228b22'>绿</option>
                                        </select> */}
                                        <div style={{...colorStyles.color,background:borderColor}} onClick={ this.handlePalette.bind(this,'borderColor') } />
                                        {
                                            borderColorPicker&&
                                            <div style={{...colorStyles.popover,top:"245px"}}>
                                                <div style={ colorStyles.cover} onClick={this.handlePaletteClose.bind(this,'borderColor')}/>
                                                <ChromePicker color={borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor')} />
                                            </div>
                                        }
                                    </li>
                                    <div className="configBut" ><button onClick={()=>this.saveTag()}>保存</button><button onClick={()=>this.setTag()}>设置标注</button></div>
                                </div>
                                :''
                            }
                            {twoMap
                                ?
                                <div className="configDataRight">
                                    <h1>修改{mapTagName}标注</h1>
                                    <li><span>标注名称：</span><input type="text" value={mapName} onChange={(event) => this.changeName(event)}/></li>
                                    <li><span>字体大小：</span><input type="text" value={fontSize} onChange={(event) => this.changFont(event)}/></li>
                                    <li><span>字体颜色：</span>
                                        {/* <select
                                            className='AddSelect'
                                            onChange={this.ChangeColor}
                                            value={fontColor}>
                                            <option value='#17aaab'>墨绿</option>
                                            <option value='#fff300'>黄</option>
                                            <option value='#f7f8d0'>淡紫</option>
                                            <option value='#8ea399'>淡绿</option>
                                            <option value='#968df3'>深紫</option>
                                            <option value='#96c99e'>深绿</option>
                                            <option value='#1c48b2'>蓝</option>
                                            <option value='#dc6348'>橘黄</option>
                                            <option value='#228b22'>绿</option>
                                            <option value='#ffffff'>白</option>
                                        </select> */}

                                        <div style={ colorStyles.color } onClick={ this.handlePalette.bind(this,'fontColor')} />
                                        {
                                            fontColorPicker&&
                                            <div style={ colorStyles.popover }>
                                                <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'fontColor')}/>
                                                <ChromePicker color={fontColor} onChange={this.handleChoosePalette.bind(this,'fontColor')} />
                                            </div>
                                        }
                                    </li>
                                    <li><span>边框宽度：</span><input type="text" value={borderWitch} onChange={(event) => this.changeBorder(event)}/></li>
                                    <li><span>边框颜色：</span>
                                        {/* <select
                                            className='AddSelect'
                                            onChange={this.ChangeBorderColor}
                                            value = {borderColor}>
                                            <option value='#ffffff'>白</option>
                                            <option value='#17aaab'>墨绿</option>
                                            <option value='#fdf150'>黄</option>
                                            <option value='#1c48b2'>蓝</option>
                                            <option value='#228b22'>绿</option>
                                            <option value='#000000'>黑</option>
                                        </select> */}
                                        <div style={{...colorStyles.color,background:borderColor}} onClick={ this.handlePalette.bind(this,'borderColor') } />
                                        {
                                            borderColorPicker&&
                                            <div style={{...colorStyles.popover,top:"245px"}}>
                                                <div style={ colorStyles.cover} onClick={this.handlePaletteClose.bind(this,'borderColor')}/>
                                                <ChromePicker color={borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor')} />
                                            </div>
                                        }

                                    </li>
                                    <div className="configBut" ><button onClick={()=>this.changeTag()}>修改保存</button><button onClick={()=>this.setTag()}>重置标注</button></div>
                                </div>
                                :''
                            }

                        </div>
                    </div>
                    :''
                }
                <div className="PageShow1 data2Show">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeletedData2()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
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
    },
});

export default connect(mapState,mapDispatch)(ConfigData2);