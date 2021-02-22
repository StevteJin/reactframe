import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import AddPic from "../../../../images/admin/adminAdd.png";
import {Common} from "../../../Cesium/method";
import $ from "jquery";
import axios from "axios";

//调色板
import reactCSS from "reactcss";
import {ChromePicker} from "react-color";

class ConfigData3 extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            pid:'',
            parensId:'',
            isLoad:true,//关闭显示
            oneLayer:true,//一级菜单对应的右边内容
            twoLayer:false,//二级菜单对应的右边内容
            oneChange:false,//是否修改保存
            oneId:'',//一级菜单修改Id;
            layerList:{},//图层列表
            groupName:'',//一层分组名称
            twoName:'',//二级图层名称
            modeASelect:'label',//上图方式默认值
            Pic:AddPic,//一级默认图片
            twoPic:AddPic,//二级默认图片
            labelId:'',//修改二级菜单id
            options:{},//传值参数
            ChangeSave:false,//修改保存
            label_style:{  //文本参数
                isLining:false,//是否需要衬色
                labelName:'',//标注文本
                fontColor:'#ff0000',//标注颜色
                fontSize:'1',//文本字体大小
                borderColor:'#ffffff',//衬色颜色
                borderWitch:'1',//衬色边框宽度
            },
            Polyline_style:{  //折线参数
                PolylineWitch:'1',//线条宽度
                PolylineColor:'#ff0000',
                borderWitchPolyline:'1',//边框宽度
                borderColor:'#ffffff',//边框衬色颜色
                borderTransparencyPolyline:'50'
            },
            Polygon_style:{   //多边形参数
                shapeColor:'#ff0000',//多边形颜色
                shapeTransparency:'50',//形状透明度
                borderWitchPolygon:'1',//边框宽度
                borderColor:'#ffffff',//多边形边框颜色
                borderTransparency:'50'//边框透明度
            },
            deletedName:'一级',//删除几级菜单
            deletedOneId:'',//一级id
            deletedTwoId:'',//二级id
            polygonPicker:false,//调色板显示隐藏(多边形)
            borderPicker:false,//调色板显示隐藏(边框)
            polylinePicker:false,//调色板显示隐藏(折线)
            contrastPicker:false,//调色板显示隐藏(衬色)
            labelPicker:false,//调色板显示隐藏(标注)
            addContrastPicker:false//调色板显示隐藏(文本添加衬色)

        }
        ConfigData3.this = this;
        this.Close = this.Close.bind(this);//关闭
        this.oneClick = this.oneClick.bind(this);//一级菜单点击
        this.twoClick = this.twoClick.bind(this);//二级菜单点击
        this.fileInputEl = React.createRef();//一级上传图片所需属性
        this.saveTag = this.saveTag.bind(this);//一级保存按钮
        this.saveTwoTag = this.saveTwoTag.bind(this);//二级保存按钮
        this.changeSaveTwoTag = this.changeSaveTwoTag.bind(this);//二级修改保存按钮
        this.changeSaveTag = this.changeSaveTag.bind(this);//一级修改保存
        this.onContextMenu = this.onContextMenu.bind(this);//一级右击事件
        this.onContextMenu1 = this.onContextMenu1.bind(this);//二级右击事件
        this.deleteOne = this.deleteOne.bind(this);//删除一级菜单
        this.deleteTwo = this.deleteTwo.bind(this);//删除二级菜单
        this.setTag = this.setTag.bind(this);//绘制图层
        this.PageDeletedData4 = this.PageDeletedData4.bind(this);
    }
    //文本监听方法
    onChangeData(){
        setTimeout(function(){
            var that = ConfigData3.this.state;
            var data = {
                id:that.labelId,
                labeltxt:that.label_style.labelName,
                label_style:that.label_style,
            }
            Common.ModifyLabel(data)
        },10);
    }
    //绘制图层
    setTag(key){
        //debugger
        const {labelId,twoName,label_style,twoPic,Polyline_style,Polygon_style} = this.state;
        if(!label_style.isLining){
            ConfigData3.this.state.label_style.borderWitch=0;
            ConfigData3.this.state.label_style.borderColor='#ffffff';
        }
        if(!twoName){
            //alert("图层名称不能为空！")
            $(".PageShow").show().find('h1').html("图层名称不能为空!");
            global.Time();
        }else{
            var data={};
            switch (key) {
                case 'label':
                    if(!label_style.labelName){
                        //alert("标注文本不能为空！")
                        $(".PageShow").show().find('h1').html("标注文本不能为空!");
                        global.Time();
                    }else{
                        data={
                            id:labelId,
                            label_name:label_style.labelName,
                            label_style:label_style
                        };
                        console.log(data);
                        Common.GeoaddlabelV3(data);
                    }
                    break;
                case 'polygon'://画面
                    data={
                        id:labelId,
                        Polygon_style:Polygon_style
                    };
                    console.log(data);
                    Common.drawPolygon(data);
                    break;
                case 'polyline'://画线
                    data={
                        id:labelId,
                        Polyline_style:Polyline_style
                    };
                    console.log(data);
                    Common.drawPolyline(data);
                    break;
                case 'billboard'://图片标签
                    if(twoPic === AddPic){
                        //alert("请选择图片！")
                        $(".PageShow").show().find('h1').html("请选择图片!");
                        global.Time();
                    }else{
                        data={
                            id:labelId,
                            image:twoPic,
                        };
                        console.log(data);
                        Common.AddPictureLabel(data);
                    }
                    break;
                default:
                    break;
            }
        }

    }
    componentDidMount() {
        this.onLayer();
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                switch(e.data.switchName){
                    case 'GeoaddlabelV3':
                        console.log(e.data);
                        var Parameter=e.data.parameter;
                        ConfigData3.this.setState({
                            options:Parameter,
                            pid:Parameter.label_id,
                            labelId:Parameter.label_id,
                        })
                        break;
                    case 'AddPictureLabel':
                        console.log(e.data);
                        var DATA=e.data.parameter;
                        ConfigData3.this.setState({
                            options:DATA,
                            twoPic:DATA.style.image,
                            pid:e.data.id
                        })
                        break;
                    case 'drawPolyline':
                        console.log(e.data);
                        ConfigData3.this.setState({
                            options:e.data.parameter,
                            pid:e.data.id
                        })
                        break;
                    case 'drawPolygon':
                        console.log(e.data);
                        ConfigData3.this.setState({
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
    //加载图层管理
    onLayer(){
        var Layers = [];
        axios.get(global.Url+'map/group/list',{}).then((res) => {
            const result = res.data.data;
            console.log(result);
            if(result && res.data.msg === 'success') {
                if(result.length>0){
                    for (let i = 0; i < result.length; i++) {
                        axios.post(global.Url+'map/layer/list',{group_id:result[i].id}).then((res) => {
                            const results = res.data.data;
                            if(results && res.data.msg === 'success') {
                                Layers.push(
                                    {
                                        LayerItems:result[i],
                                        LayerLists:results
                                    }
                                )
                                if(i === result.length - 1){
                                    setTimeout(function(){
                                        ConfigData3.this.setState({
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
                    ConfigData3.this.setState({
                        layerList:{}
                    })
                }

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
    //一级菜单点击
    oneClick(num,name){
        Common.ClearHandler();
        ConfigData3.this.setState({
            oneLayer:true,
            twoLayer:false,
        })
        if(num === 1){
            ConfigData3.this.setState({
                groupName:'',
                Pic:AddPic,
                oneChange:false,
                oneId:'',
            })
            $(".layer").find("span").css({'color':'#fff'});
            $(".layer_t").find('span').css({'color':'#fff'});
        }else if(num === 2){
            console.log(name);
            Common.ClearCustomView(ConfigData3.this.state.parensId);
            ConfigData3.this.setState({
                oneChange:true,
                groupName:name.LayerItems.group_name,
                Pic:name.LayerItems.group_icon,
                oneId:name.LayerItems.id,
                parensId:name.LayerItems.id,
            })
            $("#layer"+name.LayerItems.id).find('span').css({'color':'#54b2df'});
            $("#layer"+name.LayerItems.id).find('ul').css('display',"block");
            $("#layer"+name.LayerItems.id).siblings().find('span').css({'color':'#fff'});
            $("#layer"+name.LayerItems.id).siblings().find('ul').css('display',"none");
            $(".layer_t").find('span').css({'color':'#fff'});
            $(".layer").find(".Alert_tk").css('display',"none");
            //Common.CustomView(name.LayerItems.id);
        }
    }
    //一级二级上传图片
    handlePhoto = async (event,item) => {
        var imgFile;
        let reader = new FileReader();     //html5读文件
        reader.readAsDataURL(event.target.files[0]);
        var that=this;
        reader.onload=function(event) {        //读取完毕后调用接口
            imgFile = event.target.result;
            if(item === 1){
                console.log(1);
                that.setState({
                    Pic:imgFile
                })
            }else if(item === 2){
                console.log(2);
                that.setState({
                    twoPic:imgFile
                })
                var data1={
                    id:that.state.labelId,
                    image:that.state.twoPic,
                };
                console.log(data1)
                Common.Modifybillboard(data1);
            }

        }
    };
    //清空一级菜单对应的内容
    emptyOne(){
        var that=this;
        that.setState({
            groupName:'',
            Pic:AddPic
        })
    }
    //一级保存按钮
    saveTag(){
        const {groupName,Pic} =this.state;
        if(!groupName){
            //alert("请输入分组名称！")
            $(".PageShow").show().find('h1').html("请输入分组名称!");
            global.Time();
        }else if(Pic === AddPic){
            //alert('请选择图片')
            $(".PageShow").show().find('h1').html("请选择图片!");
            global.Time();
        }else{
            axios.post(global.Url+'map/group/add',{
                group_name:groupName,
                group_icon:Pic,
                remark:''
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    //alert("添加成功！");
                    $(".PageShow").show().find('h1').html("添加成功!");
                    global.Time();
                    this.onLayer();
                    ConfigData3.this.setState({
                        groupName:'',
                        Pic:AddPic
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //一级修改保存
    changeSaveTag(){
        const {groupName,Pic,oneId} =this.state;
        if(!groupName){
            //alert("请输入分组名称！")
            $(".PageShow").show().find('h1').html("请输入分组名称!");
            global.Time();
        }else if(Pic === AddPic){
            //alert('请选择图片')
            $(".PageShow").show().find('h1').html("请选择图片!");
            global.Time();
        }else{
            axios.post(global.Url+'map/group/update',{
                id:oneId,
                group_name:groupName,
                group_icon:Pic,
                remark:''
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    //alert("修改成功！");
                    $(".PageShow").show().find('h1').html("修改成功!");
                    global.Time();
                    this.onLayer();
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }


            })
        }
    }
    //删除一级菜单
    deleteOne(e,id){
        e.stopPropagation();
        this.setState({
            deletedName:'一级',
            deletedOneId:id,//一级id
        })
        $(".data3Show").show();
    }
    //删除二级菜单
    deleteTwo(e,id){
        e.stopPropagation();
        this.setState({
            deletedName:'二级',
            deletedTwoId:id,//二级id
        })
        $(".data3Show").show();
    }
    PageDeletedData4(){
        $(".data3Show").hide();
        const {deletedName,deletedOneId,deletedTwoId} = this.state;
        console.log(deletedName,deletedOneId,deletedTwoId);
        debugger
        if(deletedName==="一级"){
            axios.post(global.Url+'map/group/delete',{id:deletedOneId}).then((res) => {
                const results = res.data.data;
                if(results && res.data.msg === 'success') {
                    //alert("删除成功！");
                    $(".PageShow").show().find('h1').html("删除成功!");
                    global.Time();
                    ConfigData3.this.onLayer();
                    $(".layer").find(".Alert_tk").css('display',"none");//找到它下自己显示
                }else{
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }else{
            axios.post(global.Url+'map/layer/delete',{id:deletedTwoId}).then((res) => {
                const results = res.data.data;
                if(results && res.data.msg === 'success') {
                    //alert("删除成功！");
                    $(".PageShow").show().find('h1').html("删除成功!");
                    global.Time();
                    ConfigData3.this.onLayer();
                    if(!ConfigData3.this.state.oneLayer){
                        ConfigData3.this.setState({
                            oneLayer:true,
                            twoLayer:false,
                            groupName:'',
                            Pic:AddPic,
                            oneChange:false,
                            oneId:'',
                        })
                    }
                    var data1={id:deletedTwoId};
                    Common.Emptyentities(data1);
                    $(".layer").find(".Alert_tk").css('display',"none");//找到它下自己显示
                }else{
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //二级菜单点击
    twoClick(e,name,num){
        e.stopPropagation();
        ConfigData3.this.setState({
            oneLayer:false,
            twoLayer:true,
        })
        $("#layer_t"+ name.id).parents().find('span').css({'color':'#fff'});
        $("#layer_t"+ name.id).find('span').css({'color':'#54b2df'});
        $("#layer_t"+ name.id).siblings().find('span').css({'color':'#fff'});
        $(".layer").find(".Alert_tk").css('display',"none");//找到它下自己显示
        Common.ClearHandler();
        if(num === 1){ //添加
            sessionStorage.setItem('numId',name.LayerItems.id);
            ConfigData3.this.setState({
                twoName:'',//二级图层名称
                modeASelect:'label',//上图方式默认值
                labelId:'',
                ChangeSave:false,
                label_style:{  //文本参数
                    isLining:false,//是否需要衬色
                    labelName:'',//标注文本
                    fontColor:'#ff0000',//标注颜色
                    fontSize:'1',//文本字体大小
                    borderColor:'#ffffff',//衬色颜色
                    borderWitch:'1',//衬色边框宽度
                },
                Polyline_style:{  //折线参数
                    PolylineWitch:'1',//线条宽度
                    PolylineColor:'#ff0000',
                    borderWitchPolyline:'1',//边框宽度
                    borderColor:'#ffffff',//边框衬色颜色
                    borderTransparencyPolyline:'50'
                },
                Polygon_style:{   //多边形参数
                    shapeColor:'#ff0000',//多边形颜色
                    shapeTransparency:'50',//形状透明度
                    borderWitchPolygon:'1',//边框宽度
                    borderColor:'#ffffff',//多边形边框颜色
                    borderTransparency:'50'//边框透明度
                },
                twoPic:AddPic,
            });
        }else if(num === 2){ //修改
            sessionStorage.setItem('numId',name.group_id);
            var data1 = {
                id:ConfigData3.this.state.pid
            }
            console.log(data1,name);
            Common.Emptyentities(data1);//清空子级菜单
            ConfigData3.this.setState({
                twoName:name.layer_name,//二级图层名称
                modeASelect:name.layer_type,//上图方式默认值
                labelId:name.id,
                ChangeSave:true,
                options:name.options,
                pid:name.id
            });
            var data = {
                id:name.group_id,
                pid:name.id
            }
            console.log(data);
            if(name.layer_type==='label'){
                ConfigData3.this.setState({label_style:name.options.label_style});
            }else if(name.layer_type==='billboard'){
                ConfigData3.this.setState({twoPic:name.options.style.image});
            }else if(name.layer_type==='polyline'){
                ConfigData3.this.setState({Polyline_style:name.options.style});
            }else if(name.layer_type==='polygon'){
                ConfigData3.this.setState({Polygon_style:name.options.style});
            }
            Common.ClickDisplayLayer(data); //显示当前子级
        }
    }
    //上传方式修改
    ChangeSelect(e){
        e.preventDefault();
        ConfigData3.this.setState({
            modeASelect:e.target.value,
            options:{},
            label_style:{  //文本参数
                isLining:false,//是否需要衬色
                labelName:'',//标注文本
                fontColor:'#ff0000',//标注颜色
                fontSize:'1',//文本字体大小
                borderColor:'#ffffff',//衬色颜色
                borderWitch:'1',//衬色边框宽度
            },
            Polyline_style:{  //折线参数
                PolylineWitch:'1',//线条宽度
                PolylineColor:'#ff0000',
                borderWitchPolyline:'1',//边框宽度
                borderColor:'#ffffff',//边框衬色颜色
                borderTransparencyPolyline:'50'
            },
            Polygon_style:{   //多边形参数
                shapeColor:'#ff0000',//多边形颜色
                shapeTransparency:'50',//形状透明度
                borderWitchPolygon:'1',//边框宽度
                borderColor:'#ffffff',//多边形边框颜色
                borderTransparency:'50'//边框透明度
            },
            twoPic:AddPic,
        })
        var data1 = {
            id:ConfigData3.this.state.pid
        }
        console.log(data1);
        Common.Emptyentities(data1);
    }
    //二级右击事件
    onContextMenu(e,id){
        e.stopPropagation();
        $("#layer"+ id).find('span').css({'color':'#54b2df'});
        $("#layer"+ id).siblings().find('span').css({'color':'#fff'});
        $(".layer_t").find('span').css({'color':'#fff'});
        $(".layer").find(".Alert_tk").css('display',"none");
        $("#layer"+id).find('#Alert'+id).css('display',"block");//找到它下自己显示
    }
    //二级右击事件
    onContextMenu1(e,id){
        e.stopPropagation();
        $(".layer").find("span").css({'color':'#fff'});
        $("#layer_t"+ id).find('span').css({'color':'#54b2df'});
        $("#layer_t"+ id).siblings().find('span').css({'color':'#fff'});
        $(".layer").find(".Alert_tk").css('display',"none");
        $("#layer_t"+id).find('#Alert'+id).css('display',"block");//找到它下自己显示
    }
    //二级保存添加按钮
    saveTwoTag(){
        const {twoName,modeASelect,options,twoPic} =this.state;
        if(!twoName){
            //alert("请输入图层名称！")
            $(".PageShow").show().find('h1').html("请输入图层名称!");
            global.Time();
        }else if(JSON.stringify(options) === "{}"){
            //alert("请先绘制图层！");
            $(".PageShow").show().find('h1').html("请先绘制图层!");
            global.Time();
        }else{
            switch (modeASelect) {
                case 'label':
                    ADD();
                    break;
                case 'billboard':
                    if(twoPic === AddPic){
                        //alert("请选择图片！")
                        $(".PageShow").show().find('h1').html("请选择图片!");
                        global.Time();
                    }else{
                        ADD();
                    }
                    break;
                case 'polyline':
                    ADD();
                    break;
                case 'polygon':
                    ADD();
                    break;
                default:
                    break;
            }
            function ADD(){
                axios.post(global.Url+'map/layer/add',{
                    layer_name:twoName,
                    layer_type:modeASelect,
                    group_id:sessionStorage.getItem('numId'),
                    options:options,
                    remark:''
                }).then((res) => {
                    const result = res.data.data;
                    console.log(res,result);
                    if(result) {
                        //alert("添加成功！");
                        $(".PageShow").show().find('h1').html("添加成功!");
                        global.Time();
                        ConfigData3.this.onLayer();
                        ConfigData3.this.setState({
                            twoName:'',//二级图层名称
                            modeASelect:'label',//上图方式默认值
                            labelId:'',
                            ChangeSave:false,
                            label_style:{  //文本参数
                                isLining:false,//是否需要衬色
                                labelName:'',//标注文本
                                fontColor:'#ff0000',//标注颜色
                                fontSize:'1',//文本字体大小
                                borderColor:'#ffffff',//衬色颜色
                                borderWitch:'1',//衬色边框宽度
                            },
                            Polyline_style:{  //折线参数
                                PolylineWitch:'1',//线条宽度
                                PolylineColor:'#ff0000',
                                borderWitchPolyline:'1',//边框宽度
                                borderColor:'#ffffff',//边框衬色颜色
                                borderTransparencyPolyline:'50'
                            },
                            Polygon_style:{   //多边形参数
                                shapeColor:'#ff0000',//多边形颜色
                                shapeTransparency:'50',//形状透明度
                                borderWitchPolygon:'1',//边框宽度
                                borderColor:'#ffffff',//多边形边框颜色
                                borderTransparency:'50'//边框透明度
                            },
                            twoPic:AddPic,
                        });
                    }else{
                        //alert(res.data.msg)
                        $(".PageShow").show().find('h1').html(res.data.msg);
                        global.Time();
                    }
                })
            }
        }
    }
    //二级保存修改按钮
    changeSaveTwoTag(){
        Common.ClearHandler(); //清空拖拽事件
        const {twoName,modeASelect,options,twoPic,labelId} =this.state;
        //console.log(labelId,options);
        if(!twoName){
            //alert("请输入图层名称！")
            $(".PageShow").show().find('h1').html("请输入图层名称!");
            global.Time();
        }else if(JSON.stringify(options) === "{}"){
            //alert("请先绘制图层！");
            $(".PageShow").show().find('h1').html("请先绘制图层!");
            global.Time();
        }else{
            switch (modeASelect) {
                case 'label':
                    ConfigData3.this.setState({
                        options:ConfigData3.this.state.label_style
                    });
                    ADD();
                    break;
                case 'billboard':
                    if(twoPic === AddPic){
                        //alert("请选择图片！")
                        $(".PageShow").show().find('h1').html("请选择图片!");
                        global.Time();
                    }else{
                        ADD();
                    }
                    break;
                case 'polyline':
                    ConfigData3.this.setState({
                        options:ConfigData3.this.state.Polyline_style
                    });
                    ADD();
                    break;
                case 'polygon':
                    ConfigData3.this.setState({
                        options:ConfigData3.this.state.Polygon_style
                    });
                    ADD();
                    break;
                default:
                    break;
            }
            function ADD(){
                var list ={
                    layer_name:twoName,
                    layer_type:modeASelect,
                    group_id:sessionStorage.getItem('numId'),
                    id:labelId,
                    options:options.label_name = ConfigData3.this.state.label_style.labelName
                };
                console.log(list);
                axios.post(global.Url+'map/layer/update',{
                    id:labelId,
                    layer_name:twoName,
                    layer_type:modeASelect,
                    group_id:sessionStorage.getItem('numId'),
                    options:options,
                    remark:''
                }).then((res) => {
                    const result = res.data.data;
                    console.log(res,result);
                    if(result) {
                        //alert("修改成功！");
                        $(".PageShow").show().find('h1').html("修改成功!");
                        global.Time();
                        ConfigData3.this.onLayer();
                    }else{
                        alert(res.data.msg)
                    }
                })
            }
        }
    }
    //一级分层菜单名称修改
    changeName(e){
        this.setState({
            groupName:e.target.value
        })
    }
    //二级图层名称修改
    changeTwoName(e){
        this.setState({
            twoName:e.target.value
        })
    }
    //二级标注文本名称修改
    changeLabelName(e){
        ConfigData3.this.state.label_style.labelName = e.target.value;
        this.onChangeData();
    }
    //是否需要衬色
    handleIsLining(e) {
        var a= ConfigData3.this.state.label_style;
        a.isLining = !ConfigData3.this.state.label_style.isLining;
        ConfigData3.this.setState(prevState => (a));
        // console.log( ConfigData3.this.state.label_style.isLining);
        this.onChangeData();
    }
    //标注文本颜色修改
    ChangeColor(e){
        ConfigData3.this.state.label_style.fontColor = e.target.value;
        this.onChangeData();
    }
    //修改文本字体大小
    changeLabelFontSize(e){
        ConfigData3.this.state.label_style.fontSize = e.target.value;
        this.onChangeData();
    }
    //修改衬色颜色
    changeLiningColor(e){
        ConfigData3.this.state.label_style.borderColor = e.target.value;
        this.onChangeData();
    }
    //修改衬色边框宽度
    changeLiningBorderWitch(e){
        ConfigData3.this.state.label_style.borderWitch = e.target.value;
        this.onChangeData();
    }
    //修改折线衬色宽度
    changePolylineWitch(e){
        ConfigData3.this.state.Polyline_style.PolylineWitch = e.target.value;
        var data={
            id:ConfigData3.this.state.labelId,
            Polyline_style:ConfigData3.this.state.Polyline_style
        };
        //  console.log(data);
        Common.ModifyPolyline(data);
    }
    //修改折线颜色
    ChangePolylineColor(e){
        ConfigData3.this.state.Polyline_style.PolylineColor = e.target.value;
        var data={
            id:ConfigData3.this.state.labelId,
            Polyline_style:ConfigData3.this.state.Polyline_style
        };
        //console.log(data);
        Common.ModifyPolyline(data);
    }
    //修改折线衬色颜色
    ChangePolylineBorderColor(e){
        ConfigData3.this.state.Polyline_style.borderColor = e.target.value;
        var data={
            id:ConfigData3.this.state.labelId,
            Polyline_style:ConfigData3.this.state.Polyline_style
        };
        // console.log(data);
        Common.ModifyPolyline(data);
    }
    //修改折线衬色宽度
    changePolylineBorderWitch(e){
        ConfigData3.this.state.Polyline_style.borderWitchPolyline = e.target.value;
        var data={
            id:ConfigData3.this.state.labelId,
            Polyline_style:ConfigData3.this.state.Polyline_style
        };
        // console.log(data);
        Common.ModifyPolyline(data);
    }
    //修改折线边框透明度
    changeBorderTransparency(e){
        var tarns1 = ConfigData3.this.state.Polyline_style;
        tarns1.borderTransparencyPolyline = e.target.value;
        ConfigData3.this.setState(tarns1);
        var data={
            id:ConfigData3.this.state.labelId,
            Polyline_style:ConfigData3.this.state.Polyline_style
        };
        // console.log(data);
        Common.ModifyPolyline(data);
    }
    //修改多边形颜色
    ChangeShapeColor(e){
        ConfigData3.this.state.Polygon_style.shapeColor = e.target.value;
        var data={
            id:ConfigData3.this.state.labelId,
            Polygon_style:ConfigData3.this.state.Polygon_style
        };
        // console.log(data);
        Common.ModifyPolygon(data);
    }
    //修改多边形透明度
    changeShapeTransparency(e){
        var tarns2 = ConfigData3.this.state.Polygon_style;
        tarns2.shapeTransparency = e.target.value;
        ConfigData3.this.setState(tarns2);
        var data={
            id:ConfigData3.this.state.labelId,
            Polygon_style:ConfigData3.this.state.Polygon_style
        };
        //  console.log(data);
        Common.ModifyPolygon(data);
    }
    //修改多边形边框宽度
    ChangeBorderWitchPolygon(e){
        ConfigData3.this.state.Polygon_style.borderWitchPolygon = e.target.value;
        var data={
            id:ConfigData3.this.state.labelId,
            Polygon_style:ConfigData3.this.state.Polygon_style
        };
        //  console.log(data);
        Common.ModifyPolygon(data);
    }
    //修改多边形边框颜色
    ChangePolygonBorderColor(e){
        ConfigData3.this.state.Polygon_style.borderColor = e.target.value;
        var data={
            id:ConfigData3.this.state.labelId,
            Polygon_style:ConfigData3.this.state.Polygon_style
        };
        //   console.log(data);
        Common.ModifyPolygon(data);
    }
    //修改多边形边框透明度
    changeBorderTransparencyPolygon(e){
        var tarns3 = ConfigData3.this.state.Polygon_style;
        tarns3.borderTransparency = e.target.value;
        ConfigData3.this.setState(tarns3);
        var data={
            id:ConfigData3.this.state.labelId,
            Polygon_style:ConfigData3.this.state.Polygon_style
        };
        // console.log(data);
        Common.ModifyPolygon(data);
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
        var data;
        this.setState({[btype]:{...this.state[btype],[stype]:color.hex}})
        if(btype === 'Polygon_style'){
            data={id:ConfigData3.this.state.labelId,Polygon_style:ConfigData3.this.state.Polygon_style};
            Common.ModifyPolygon(data);
        }else if(btype === 'Polyline_style'){
            data={id:ConfigData3.this.state.labelId,Polyline_style:ConfigData3.this.state.Polyline_style};
            Common.ModifyPolyline(data);
        }else if(btype === 'label_style'){
            this.onChangeData();
        }
    }
    render(){
        const {isLoad,oneLayer,twoLayer,layerList,groupName,modeASelect,Pic,label_style,oneChange,twoName,twoPic,Polygon_style,Polyline_style,ChangeSave,
            polygonPicker,borderPicker,polylinePicker,contrastPicker,labelPicker,addContrastPicker} = this.state;
        const colorStyles = reactCSS({
            'default': {
                outer:{
                    position:'relative',
                    marginLeft:'100px',
                    marginTop:'3px'
                },
                color: {
                    width: '50px',
                    height: '25px',
                    borderRadius: '2px',
                    background:'',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                    top: '30px',
                    right: '30px',
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
        return (
            <Fragment>
                {isLoad ?
                    <div className="configShow Map" style={{'width':'500px','height':'520px'}}>
                        <div className="configShowNav">图层管理 <i onClick={()=>this.Close()}></i></div>
                        <div className="configData" style={{'height':'360px'}}>
                            <div className="LayerLeft">
                                <h1><button onClick={()=>this.oneClick(1)}>添加</button></h1>
                                <ul>
                                    {
                                        layerList.length > 0 && layerList.map(
                                            (item,index) => {
                                                return  <li key={index} className='layer' id={'layer'+ item.LayerItems.id} onClick={()=>this.oneClick(2,item)} onContextMenu={(e)=>this.onContextMenu(e,item.LayerItems.id)}>
                                                    <span>{item.LayerItems.group_name}</span>
                                                    <div className="Alert_tk" id={'Alert'+ item.LayerItems.id} style={{'display':'none'}}>
                                                        <button onClick={(e)=>this.twoClick(e,item,1)}>添加</button>
                                                        {item.LayerLists.length === 0 ? <button onClick={(e)=>this.deleteOne(e,item.LayerItems.id)}>删除</button>:''}
                                                    </div>
                                                    <ul style={{'display':'none'}}>
                                                        {
                                                            item.LayerLists.length > 0 && item.LayerLists.map(
                                                                (name,i) => {
                                                                    return  <li key={i} className='layer_t' id={'layer_t'+name.id} onClick={(e)=>this.twoClick(e,name,2)}  onContextMenu={(e)=>this.onContextMenu1(e,name.id)}>
                                                                        <span>{name.layer_name}</span>
                                                                        <div className="Alert_tk" id={'Alert'+ name.id} style={{'display':'none'}}>
                                                                            <button onClick={(e)=>this.deleteTwo(e,name.id)}>删除</button>
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
                            {oneLayer
                                ?
                                <div className="configDataRight LayerRight">
                                    <li><span>分组名称：</span><input type="text" value={groupName} onChange={(event) => this.changeName(event)}/></li>
                                    <li><span>分组图标：</span>
                                        <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png" hidden onChange={(event) => this.handlePhoto(event,1)} />
                                        <em onClick={() => {this.fileInputEl.current.click()}}><img src={Pic} alt=""/></em>
                                    </li>
                                    <li><span>分组备注：</span>
                                        <textarea className='AddTextarea' style={{'height':'30px'}} defaultValue='' onChange={this.handleInfo}></textarea>
                                    </li>
                                    <div className="configBut" >{oneChange?<button onClick={()=>this.changeSaveTag()}>修改保存</button>:<button onClick={()=>this.saveTag()}>保存</button>}</div>
                                </div>
                                :''
                            }
                            {twoLayer
                                ?
                                <div className="configDataRight">
                                    <li><span>图层名称：</span><input type="text" value={twoName} onChange={(event) => this.changeTwoName(event)}/></li>
                                    <li><span>上图方式：</span>
                                        <select
                                            className='AddSelect'
                                            onChange={(e)=>this.ChangeSelect(e)}
                                            value = {modeASelect}>
                                            <option value='label'>文本</option>
                                            <option value='billboard'>图片</option>
                                            <option value='polyline'>折线</option>
                                            <option value='polygon'>多边形</option>
                                        </select>
                                    </li>
                                    {(() => {
                                        switch (modeASelect) {
                                            case 'label':
                                                return <div>
                                                    <li><span>标注文本：</span><input type="text" defaultValue={label_style.labelName} onChange={(event) => this.changeLabelName(event)}/></li>
                                                    <li><span>标注颜色：</span>
                                                        {/* <select
                                                            className='AddSelect'
                                                            onChange={(e)=>this.ChangeColor(e)}
                                                            defaultValue = {label_style.fontColor}>
                                                            <option value='#ff0000'>红</option>
                                                            <option value='#ffd700'>黄</option>
                                                            <option value='#436eee'>蓝</option>
                                                            <option value='#228b22'>绿</option>
                                                            <option value='#ffffff'>白</option>
                                                        </select> */}
                                                        <div style={colorStyles.outer}>
                                                            <div style={{...colorStyles.color,background:label_style.fontColor}} onClick={ this.handlePalette.bind(this,'labelPicker')} />
                                                            {
                                                                labelPicker&&
                                                                <div style={colorStyles.popover}>
                                                                    <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'labelPicker')}/>
                                                                    <ChromePicker color={label_style.fontColor} onChange={this.handleChoosePalette.bind(this,'fontColor','label_style')} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </li>
                                                    <li><span>字体大小：</span><input type="text" defaultValue={label_style.fontSize} onChange={(event) => this.changeLabelFontSize(event)}/></li>
                                                    <li><span>是否衬色：</span><input type="checkbox" checked={label_style.isLining} onChange={(e) => this.handleIsLining(e)}/></li>
                                                    <li className={label_style.isLining?'':'Grayscale'}><span>衬色颜色：</span>
                                                        {/* <select
                                                            className='AddSelect'
                                                            disabled={label_style.isLining?'':'disabled'}
                                                            onChange={(e)=>this.changeLiningColor(e)}
                                                            defaultValue = {label_style.borderColor}>
                                                            <option value='#ff0000'>红</option>
                                                            <option value='#ffd700'>黄</option>
                                                            <option value='#436eee'>蓝</option>
                                                            <option value='#228b22'>绿</option>
                                                            <option value='#ffffff'>白</option>
                                                        </select> */}
                                                        <div style={colorStyles.outer}>
                                                            <div style={{...colorStyles.color,background:label_style.borderColor}} onClick={ label_style.isLining?this.handlePalette.bind(this,'addContrastPicker'):null} />
                                                            {
                                                                addContrastPicker&&
                                                                <div style={colorStyles.popover}>
                                                                    <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'addContrastPicker')}/>
                                                                    <ChromePicker color={label_style.borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor','label_style')} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </li>
                                                    <li className={label_style.isLining?'':'Grayscale'}><span>衬色宽度：</span><input type="text" defaultValue={label_style.borderWitch} disabled={label_style.isLining?'':'disabled'} onChange={(event) => this.changeLiningBorderWitch(event)}/></li>
                                                </div>;
                                            case 'billboard':
                                                return <div className='LayerRight'>
                                                    <li><span>上传图标：</span>
                                                        <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,2)} />
                                                        <em onClick={() => {this.fileInputEl.current.click()}}><img src={twoPic} alt=""/></em>
                                                    </li>
                                                </div>;
                                            case 'polyline':
                                                return <div>
                                                    <li><span>折线颜色：</span>
                                                        {/* <select
                                                            className='AddSelect'
                                                            onChange={(e)=>this.ChangePolylineColor(e)}
                                                            defaultValue= {Polyline_style.PolylineColor}>
                                                            <option value='#ff0000'>红</option>
                                                            <option value='#ffd700'>黄</option>
                                                            <option value='#436eee'>蓝</option>
                                                            <option value='#228b22'>绿</option>
                                                            <option value='#ffffff'>白</option>
                                                        </select> */}
                                                        <div style={colorStyles.outer}>
                                                            <div style={{...colorStyles.color,background:Polyline_style.PolylineColor}} onClick={ this.handlePalette.bind(this,'polylinePicker')} />
                                                            {
                                                                polylinePicker&&
                                                                <div style={ colorStyles.popover}>
                                                                    <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'polylinePicker')}/>
                                                                    <ChromePicker color={Polyline_style.PolylineColor} onChange={this.handleChoosePalette.bind(this,'PolylineColor','Polyline_style')} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </li>
                                                    <li><span>折线宽度：</span><input type="text" defaultValue={Polyline_style.PolylineWitch} onChange={(event) => this.changePolylineWitch(event)}/></li>
                                                    <li><span>衬色颜色：</span>
                                                        {/* <select
                                                            className='AddSelect'
                                                            onChange={(e)=>this.ChangePolylineBorderColor(e)}
                                                            defaultValue = {Polyline_style.borderColor}>
                                                            <option value='#ff0000'>红</option>
                                                            <option value='#ffd700'>黄</option>
                                                            <option value='#436eee'>蓝</option>
                                                            <option value='#228b22'>绿</option>
                                                            <option value='#ffffff'>白</option>
                                                        </select> */}
                                                        <div style={colorStyles.outer}>
                                                            <div style={{...colorStyles.color,background:Polyline_style.borderColor}} onClick={ this.handlePalette.bind(this,'contrastPicker')} />
                                                            {
                                                                contrastPicker&&
                                                                <div style={colorStyles.popover}>
                                                                    <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'contrastPicker')}/>
                                                                    <ChromePicker color={Polyline_style.borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor','Polyline_style')} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </li>
                                                    <li><span>衬色宽度：</span><input type="text" defaultValue={Polyline_style.borderWitchPolyline} onChange={(e) => this.changePolylineBorderWitch(e)}/></li>
                                                    <li><span>边框透明度：</span>
                                                        <input type="range" max='100' min='0' defaultValue={Polyline_style.borderTransparencyPolyline} onInput={(event) => this.changeBorderTransparency(event)} onChange={(event) => this.changeBorderTransparency(event)}/>
                                                        <i>{Polyline_style.borderTransparencyPolyline}%</i>
                                                    </li>
                                                </div>;
                                            case 'polygon':
                                                return <div>
                                                    <li><span>多边形颜色：</span>
                                                        {/* <select
                                                            className='AddSelect'
                                                            onChange={(e)=>this.ChangeShapeColor(e)}
                                                            defaultValue = {Polygon_style.shapeColor}>
                                                            <option value='#ff0000'>红2</option>
                                                            <option value='#ffd700'>黄2</option>
                                                            <option value='#436eee'>蓝2</option>
                                                            <option value='#228b22'>绿2</option>
                                                            <option value='#ffffff'>白2</option>
                                                        </select> */}
                                                        <div style={{...colorStyles.outer,marginLeft:'115px'}}>
                                                            <div style={{...colorStyles.color,background:Polygon_style.shapeColor}} onClick={ this.handlePalette.bind(this,'polygonPicker')} />
                                                            {
                                                                polygonPicker&&
                                                                <div style={ colorStyles.popover}>
                                                                    <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'polygonPicker')}/>
                                                                    <ChromePicker color={Polygon_style.shapeColor} onChange={this.handleChoosePalette.bind(this,'shapeColor','Polygon_style')} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </li>
                                                    <li><span>透明度：</span><input type="range" defaultValue={Polygon_style.shapeTransparency} onChange={(event) => this.changeShapeTransparency(event)}/><i>{Polygon_style.shapeTransparency}%</i></li>
                                                    <li><span>边框宽度：</span><input type="text" defaultValue={Polygon_style.borderWitchPolygon} onChange={(event) => this.ChangeBorderWitchPolygon(event)}/></li>
                                                    <li><span>边框颜色：</span>
                                                        {/* <select
                                                            className='AddSelect'
                                                            onChange={(e)=>this.ChangePolygonBorderColor(e)}
                                                            defaultValue = {Polygon_style.borderColor}>
                                                            <option value='#ff0000'>红1</option>
                                                            <option value='#ffd700'>黄1</option>
                                                            <option value='#436eee'>蓝1</option>
                                                            <option value='#228b22'>绿1</option>
                                                            <option value='#ffffff'>白1</option>
                                                        </select> */}
                                                        <div style={colorStyles.outer}>
                                                            <div style={{...colorStyles.color,background:Polygon_style.borderColor}} onClick={ this.handlePalette.bind(this,'borderPicker')}></div>
                                                            {
                                                                borderPicker&&
                                                                <div style={{...colorStyles.popover}} >
                                                                    <div style={ colorStyles.cover} onClick={this.handlePaletteClose.bind(this,'borderPicker')}/>
                                                                    <ChromePicker color={Polygon_style.borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor','Polygon_style')} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </li>
                                                    <li><span>边框透明度：</span><input type="range" defaultValue={Polygon_style.borderTransparency} onChange={(event) => this.changeBorderTransparencyPolygon(event)}/><i>{Polygon_style.borderTransparency}%</i></li>
                                                </div>;
                                            default:
                                                return null;
                                        }
                                    })()}
                                    <div className="configBut" >{ChangeSave?<button onClick={()=>this.changeSaveTwoTag()}>修改保存</button>:<button onClick={()=>this.saveTwoTag()}>保存</button>}<button onClick={()=>this.setTag(modeASelect)}>绘制图层</button></div>
                                </div>
                                :''
                            }

                        </div>
                    </div>
                    :''
                }
                <div className="PageShow1 data3Show">
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
        adminItem:state.admin.get('adminItem'),
        adminIndex:state.admin.get('adminIndex'),
    }
};
const mapDispatch = (dispatch) => ({
    navClick(id,item) {
        dispatch(actionCreators.nav_click(id,item));
    },
});

export default connect(mapState,mapDispatch)(ConfigData3);