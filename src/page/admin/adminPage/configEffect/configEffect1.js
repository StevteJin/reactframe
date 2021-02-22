import React,{Fragment,PureComponent} from "react";
import axios from "axios";
import $ from "jquery";
import {Common} from "../../../Cesium/method";

//调色板
import reactCSS from "reactcss";
import {ChromePicker} from "react-color";

class ConfigEffect1 extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            isShow:true,
            TreeList:[],//树结构
            TwoShow:false,
            labelId:'',//相机id
            gridName:'',//摄像头名称
            options:{},//传值参数
            pid:'',//传值id ,用于清除绘制的效果
            deviceCode:'',//相机编码
            twoChangeSure:false,//修改保存
            Polygon_style:{   //多边形参数可视区域信息
                shapeColor:'#ff0000',//区域颜色
                shapeTransparency:'50',//区域透明度
                borderWitchPolygon:'1',//区域边框宽度
                borderColor:'#ffffff',//区域边框颜色
                borderTransparency:'50'//区域边框透明度
            },
            areaPicker:false,////调色板显示隐藏(区域颜色)
            areaBorderPicker:false////调色板显示隐藏(区域边框)
        }
        ConfigEffect1.this = this;
        this.Close = this.Close.bind(this); //关闭
        this.onMenuClicked = this.onMenuClicked.bind(this);//二级菜单点击事件
        this.saveDraw = this.saveDraw.bind(this);//绘制图层
        this.saveSure = this.saveSure.bind(this);//保存
        this.saveSureChange = this.saveSureChange.bind(this);//修改保存
    }
    //关闭
    Close(){
        ConfigEffect1.this.setState({
            isShow:false
        })
    }
    componentDidMount() {
        this.Load();//树结构
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch(e.data.switchName){
                    case 'drawPolygon':
                        console.log(e.data);
                        ConfigEffect1.this.setState({
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
    }
    //树结构
    Load(){
        axios.post(global.Url+'business/resourcesMap',{ category_id: '19242F0F746DDE464239EF7ECE11E63F'}).then((res) => {
            const results = res.data.data;
            console.log(results);
            if(results && res.data.msg === 'success'){
                ConfigEffect1.this.setState({
                    TreeList: results
                })
            }else{
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //生成树结构列表
    generateMenu(menuObj) {
        let vdom = [];
        if (menuObj instanceof Array) {
            let list = [];
            for (var item of menuObj) {
                list.push(this.generateMenu(item));
            }
            vdom.push(
                <ul key="single" style={{'height':'auto'}}>
                    {list}
                </ul>
            );
        } else {
            if(menuObj == null){
                return;
            }
            vdom.push(
                <li key={menuObj} className='newMap' id={'Effect'+menuObj.id} style={{'width':'100%'}}>
                    <span onClick={(e)=>this.onMenuClicked(e,menuObj)} >
                        {(() => {
                            switch (menuObj.node_type) {
                                case 'grid_region':
                                    return <i className='group'></i>;
                                case 'grid_info':
                                    return <i className='grid'></i>;
                                case 'device_info':
                                    return <i className='details'></i>;
                                default:
                                    return null;
                            }
                        })()}
                        {(() => {
                            switch (menuObj.node_type) {
                                case 'grid_region':
                                    return menuObj.region_name;
                                case 'grid_info':
                                    return menuObj.grid_name;
                                case 'device_info':
                                    return menuObj.device_name;
                                default:
                                    return null;
                            }
                        })()}
                        {menuObj.node_type==='device_info'?'':<em>
                            {menuObj.count}
                        </em>}
                    </span>
                    {this.generateMenu(menuObj.children)}
                </li>
            );
        }
        return vdom;
    }
    //点击子类
    onMenuClicked(ev,name) {
        ev.stopPropagation();
        var data1 = {
            id:ConfigEffect1.this.state.pid
        }
        Common.Emptyentities(data1);//清空子级菜单
        // 被点击的<h1>
        let node = $(ev.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.siblings('ul');

        // 显示/隐藏这个列表
        //subMenu.css("display",'none');
        subMenu.css("display", subMenu.css('display') === "none" ? "block" : "none");
        $("#Effect"+ name.id).parents().find('li').find('span').css({'color':'#fff','fontWeight':'100'});
        $("#Effect"+ name.id).parents().find('span').find('i').removeClass('only');
        $("#Effect"+ name.id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#Effect"+ name.id).find('span').find('i').addClass('only');
        $("#Effect"+ name.id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#Effect"+ name.id).siblings().find('span').find('i').removeClass('only');
        $("#Effect"+ name.id).children().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#Effect"+ name.id).children().find('span').find('i').removeClass('only');

        if(name.node_type === 'device_info'){
            let data={
                id:name.id,
            }
            Common.CoordinateModelID(data);//飞过去
            Common.returnData(name);
            console.log(name);
            ConfigEffect1.this.setState({
                TwoShow:true,
                gridName:name.device_name,
                labelId:name.id,
                deviceCode:name.device_code,
            })
            axios.post(global.Url+'map/area/list',{device_id:name.id}).then((res) => {
                const results = res.data.data;
                console.log(results);
                if(results.length>0 && res.data.msg === 'success'){  //表示已经绘制过
                    setTimeout(function(){
                        ConfigEffect1.this.setState({
                            Polygon_style:results[0].style,
                            position:results[0].position,
                            //labelId:results[0].id,
                            twoChangeSure:false
                        })
                    },10)
                    console.log(results[0]);
                    Common.VisibleArea(results[0]);//点线面展示
                }else{
                    //alert(res.msg)
                    setTimeout(function(){
                        ConfigEffect1.this.setState({
                            Polygon_style:{
                                shapeColor:'#ff0000',//区域颜色
                                shapeTransparency:'50',//区域透明度
                                borderWitchPolygon:'1',//区域边框宽度
                                borderColor:'#ffffff',//区域边框颜色
                                borderTransparency:'50'//区域边框透明度
                            },
                            twoChangeSure:true
                        })
                    },10)
                }
            })
        }

    }
    //修改区域颜色
    ChangeColor(e){
        var tarns1 = ConfigEffect1.this.state.Polygon_style;
        tarns1.shapeColor = e.target.value;
        ConfigEffect1.this.setState(tarns1);
        //this.onChangeData();
    }
    //修改区域透明度
    changeColorTransparency(e){
        var tarns1 = ConfigEffect1.this.state.Polygon_style;
        tarns1.shapeTransparency = e.target.value;
        ConfigEffect1.this.setState(tarns1);
        //this.onChangeData();
    }
    //修改区域边框宽度
    ChangeBorderWidth(e){
        var tarns1 = ConfigEffect1.this.state.Polygon_style;
        tarns1.borderWitchPolygon = e.target.value;
        ConfigEffect1.this.setState(tarns1);
        //this.onChangeData();
    }
    //修改区域边框颜色
    changeBorderColor(e){
        var tarns1 = ConfigEffect1.this.state.Polygon_style;
        tarns1.borderColor = e.target.value;
        ConfigEffect1.this.setState(tarns1);
        //this.onChangeData();
    }
    //修改区域边框透明度
    changeBorderTransparency(e){
        var tarns2 = ConfigEffect1.this.state.Polygon_style;
        tarns2.borderTransparency = e.target.value;
        ConfigEffect1.this.setState(tarns2);
        //this.onChangeData();
    }
    //绘制
    saveDraw(){
        Common.ClearHandler();
        var data1 = {
            id:ConfigEffect1.this.state.pid
        }
        Common.Emptyentities(data1);//清空子级菜单
        const {Polygon_style} =this.state;
        var data={
            id:'',
            Polygon_style:Polygon_style
        };
        console.log(data);
        Common.drawPolygon(data);
    }
    //保存
    saveSure(){
        Common.ClearHandler(); //清空拖拽事件
        const {options,labelId,deviceCode,gridName}=this.state;
        if(JSON.stringify(options) === "{}"){
            //alert("请先绘制图层！");
            $(".PageShow").show().find('h1').html("请先绘制图层!");
            global.Time();
        }else{
            var data={
                style:options.style,
                position:options.position,
                device_id:labelId,
                device_code:deviceCode,
                device_name:gridName,
            }
            console.log(data);
            axios.post(global.Url+'map/area/add',data).then((res) => {
                const results = res.data;
                console.log(results);
                if(results && res.data.msg === 'success'){
                    $(".PageShow").show().find('h1').html("保存成功!");
                    global.Time();
                }else{
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //修改保存
    saveSureChange(){
        Common.ClearHandler(); //清空拖拽事件
        const {options,labelId,deviceCode,gridName,}=this.state;
        var data={
            style:options.style,
            position:options.position,
            device_id:labelId,
            device_code:deviceCode,
            device_name:gridName,
        }
        console.log(data);
        axios.post(global.Url+'map/area/update',data).then((res) => {
            const results = res.data;
            console.log(results);
            if(results && res.data.msg === 'success'){
                $(".PageShow").show().find('h1').html("修改成功!");
                global.Time();
            }else{
                //alert(res.msg)
                $(".PageShow").show().find('h1').html("请重新绘制！");
                global.Time();
            }
        })
    }
    //显示/隐藏调色板
    handlePalette(type){
        this.setState({[type]:!this.state[type]})
    };
    //关闭调色板
    handlePaletteClose(type){
        this.setState({[type]:false })
    }
    //选中调色板字体颜色
    handleChoosePalette(stype,btype,color){
        this.setState({[btype]:{...this.state[btype],[stype]:color.hex}})
        //this.onChangeData();
    }
    render(){
        const{isShow,TreeList,TwoShow,gridName,Polygon_style,twoChangeSure,areaPicker,areaBorderPicker} = this.state;
        const colorStyles = reactCSS({
            'default': {
                outer:{
                    position:'relative',
                    marginLeft:'80px',
                    marginTop:'3px'
                },
                color: {
                    width: '50px',
                    height: '25px',
                    borderRadius: '2px',
                    background:'',
                },
                popover: {
                    position:'absolute',
                    zIndex: '2',
                    top: '30px',
                    right: '120px',
                },
                cover: {
                    position: 'fixed',
                    bottom: '0px',
                    left: '0px',
                    right: '0px',
                    top: '0px'
                }
            }
        });
        return(
            <Fragment>
                {isShow?
                    <div className="configShow" style={{'height':'750px','width':'335px'}}>
                        <div className="configShowNav">可视化区域设置<i onClick={()=>this.Close()}></i></div>
                        <div className="configData" style={{'height':'690px'}}>
                            <div className="configDataLeft Route2two"  style={{'height':'680px','width':'280px','border':'0'}}>
                                <div className="ResourceMapTree" style={{'margin':'15px 0 0 -15px'}}>
                                    <h2><span>摄像头列表</span></h2>
                                    <div className='ResourceMapTreeUl' style={{'height':'auto'}}>
                                        {this.generateMenu(TreeList)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :""
                }
                {TwoShow?
                    <div className="configShow Basic"  style = { { marginLeft: '360px'} }>
                        <div className="configShowNav">可视区域绘制 <i></i></div>
                        <div>
                            <div className='EffImport one'>
                                <li><span>摄像头名称：</span><em>{gridName}</em></li>
                                <li><span>区域颜色：</span>
                                    {/* <select
                                        className='AddSelect'
                                        onChange={(e)=>this.ChangeColor(e)}
                                        value = {Polygon_style.shapeColor}>
                                        <option value='#ff0000'>红1</option>
                                        <option value='#ffd700'>黄</option>
                                        <option value='#436eee'>蓝</option>
                                        <option value='#228b22'>绿</option>
                                        <option value='#ffffff'>白</option>
                                    </select> */}
                                    <div style={colorStyles.outer}>
                                        <div style={{...colorStyles.color,background:Polygon_style.shapeColor}} onClick={ this.handlePalette.bind(this,'areaPicker')} />
                                        {
                                            areaPicker&&
                                            <div style={colorStyles.popover}>
                                                <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'areaPicker')}/>
                                                <ChromePicker color={Polygon_style.shapeColor} onChange={this.handleChoosePalette.bind(this,'shapeColor','Polygon_style')} />
                                            </div>
                                        }
                                    </div>
                                </li>
                                <li><span>区域透明度：</span>
                                    <input type="range" max='100' min='0' value={Polygon_style.shapeTransparency}
                                           onChange={(event) => this.changeColorTransparency(event)}/>
                                    <i>{Polygon_style.shapeTransparency}%</i>
                                </li>
                                <li><span>区域边框宽度：</span><input type="text" value={Polygon_style.borderWitchPolygon} onChange={(event) => this.ChangeBorderWidth(event)}/></li>
                                <li><span>区域边框颜色：</span>
                                    {/* <select
                                        className='AddSelect'
                                        onChange={(e)=>this.changeBorderColor(e)}
                                        value = {Polygon_style.borderColor}>
                                        <option value='#ff0000'>红1</option>
                                        <option value='#ffd700'>黄</option>
                                        <option value='#436eee'>蓝</option>
                                        <option value='#228b22'>绿</option>
                                        <option value='#ffffff'>白</option>
                                    </select> */}
                                    <div style={{...colorStyles.outer,marginLeft:'110px',marginTop:'6px'}}>
                                        <div style={{...colorStyles.color,background:Polygon_style.borderColor}} onClick={ this.handlePalette.bind(this,'areaBorderPicker')} />
                                        {
                                            areaBorderPicker&&
                                            <div style={{...colorStyles.popover,right:'90px'}}>
                                                <div style={colorStyles.cover} onClick={this.handlePaletteClose.bind(this,'areaBorderPicker')}/>
                                                <ChromePicker color={Polygon_style.borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor','Polygon_style')} />
                                            </div>
                                        }
                                    </div>
                                </li>
                                <li><span>区域边框透明度：</span>
                                    <input type="range" max='100' min='0' value={Polygon_style.borderTransparency}
                                           onChange={(event) => this.changeBorderTransparency(event)}/>
                                    <i>{Polygon_style.borderTransparency}%</i>
                                </li>
                            </div>
                            <div className="configBut" >{twoChangeSure?<button onClick={()=>this.saveSure()}>保存</button>:<button onClick={()=>this.saveSureChange()}>修改保存</button>}<button onClick={()=>this.saveDraw()}>绘制</button></div>
                        </div>
                    </div>
                    :''}
            </Fragment>
        )
    }
}

export default ConfigEffect1;