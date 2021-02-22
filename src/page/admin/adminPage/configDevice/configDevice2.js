import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import $ from "jquery";
import axios from "axios";
import {Common} from "../../../Cesium/method";

class ConfigDevice2 extends PureComponent{
    constructor(props){
        super(props);
        ConfigDevice2.this = this;
        this.state = {
            isLoading:false, //默认为false，当列表加载以后为true,解决第一次挂载数据为初始值空值
            List:{}, //设备列表一级
            One:true,//一级菜单
            Two:false,//二级菜单
            TwoName:false,//二级菜单导航
            TwoTree:{},//树状图列表展示
            ZZListBtu:true,//组织列表按钮
            SBList:true,//设备列表按钮
            SBTable:false,//设备表格按钮
            changeName:'',//修改的名称
            OneFile:'',//上传的文件
            tableList:{},//右侧表格列表
            ShowPic:false,//设备类型显示
            ShowPosition:false,//设备坐标弹框
            PicList:{},//设备类型列表
            TypeId:'',//设备上图用到的id
            mapStyle:{},//设备上图用到的数据对象
            mapType:'',//设备上图用到的模型
            typeName:'',//设备名称
            X:'',//设备经度
            Y:'',//设备纬度
            Z:'',//设备高度
            H:'',//设备偏转角
            modelId:'',//模型Id
            indoor:false,//室内室外
            build:{},//建筑下拉框
            buildId:'',//建筑选取默认ID
            floor:{},//楼层下拉框
            floorId:'',//楼层选取默认ID
            searchName:'',//搜索设备名称
            searchOn:'',//搜索设备
            geom:{},//新增
            deleteName:'上图',//删除设备上图还是取消设备下图
            deleteId:'',//删除取消ID
            deviceCode:'',//设备下图所需id
            isShow:false,//地下
        }
        this.ListClick = this.ListClick.bind(this);//点击一级菜单列表
        this.onContextMenu = this.onContextMenu.bind(this);//鼠标右击事件
        this.ReturnOne = this.ReturnOne.bind(this); //点击返回一级
        this.onMenuClicked = this.onMenuClicked.bind(this);//右击点击子类
        this.listName = this.listName.bind(this);//修改组织列表内容
        this.changeList = this.changeList.bind(this);//点击修改组织列表按钮
        this.changeSureList = this.changeSureList.bind(this);//点击确定修改组织列表按钮
        this.AddTwoList = this.AddTwoList.bind(this); //点击添加组织机构
        this.DeleteList = this.DeleteList.bind(this); //点击删除组织机构
        this.importFile = this.importFile.bind(this);//上传文件
        this.AddPic = this.AddPic.bind(this);//点击设备上图
        this.Close = this.Close.bind(this);//关闭设备类型弹框
        this.handleChange = this.handleChange.bind(this);//获取设备类型的其中一项
        this.SureLiu= this.SureLiu.bind(this);//确定设备类型上图
        this.ChangeX = this.ChangeX.bind(this);//改变X轴坐标
        this.ChangeY = this.ChangeY.bind(this);//改变y轴坐标
        this.ChangeZ = this.ChangeZ.bind(this);//改变z轴坐标
        this.ChangeH = this.ChangeH.bind(this);//改变h轴坐标
        this.handleIsIndoor = this.handleIsIndoor.bind(this);//室内室外选取
        this.ChangeBuild = this.ChangeBuild.bind(this); //选取建筑
        this.ChangeFloor = this.ChangeFloor.bind(this); //选取楼层
        this.ChangeON = this.ChangeON.bind(this); //搜索下拉框改变
        this.SaveLiu = this.SaveLiu.bind(this);//保存设备
        this.DeletePic = this.DeletePic.bind(this);//设备下图
        this.Delete = this.Delete.bind(this);//删除设备详情信息
        this.ChangeEdit = this.ChangeEdit.bind(this);//修改设备详情
        this.SBName = this.SBName.bind(this);//搜索设备名称
        this.Search = this.Search.bind(this);//点击搜索
        this.PageDeleted1 = this.PageDeleted1.bind(this);
        this.deviceLocation = this.deviceLocation.bind(this);//点击表格设备名称飞至定位处
    }
    componentDidMount() {
        //1.先获取设备类别
        this.onDevice();
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
        //监听浏览器左击事件并返回xyzh坐标
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                console.log(e.data);
                // Common.onCoordinate();
                //debugger
                switch (e.data.switchName) {
                    case 'getCameraView':
                        console.log(e.data.cv);
                        sessionStorage.setItem('center',this.JSON.stringify(e.data.cv,null,4));
                        break;
                    case 'dragModleV2':  //
                        sessionStorage.setItem('Center',this.JSON.stringify(e.data.style));
                        ConfigDevice2.this.setState({
                            ShowPosition:true,
                            X:this.JSON.stringify(e.data.style.position.x),
                            Y:this.JSON.stringify(e.data.style.position.y),
                            Z:this.JSON.stringify(e.data.style.position.z),
                            H:this.JSON.stringify(e.data.style.position.heading),
                            geom:e.data.style.geom,
                        });
                        break;
                    case 'dragModleV2Start':
                        ConfigDevice2.this.setState({
                            ShowPosition:false,
                            X:'',
                            Y:'',
                            Z:'',
                            H:'',
                        });
                        break;
                    case 'dragModleV2Model':
                        ConfigDevice2.this.setState({
                            modelId:e.data.modelid,
                        });
                        break;
                    default:
                        return null;
                }

            }
        }
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    //1.先获取设备类别
    onDevice(){
        axios.post(global.Url+'device/category/list',{enable:true}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                ConfigDevice2.this.setState({
                    isLoading:true,
                    List:result
                })

            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //鼠标右击事件
    onContextMenu(e,id){
        e.stopPropagation(); //顺序不能换
        $("#addAlert"+id).parents().find('.Alert').css('display',"none");//找到它下面所有的父节点隐藏
        $("#addAlert"+id).parents().find('h2').find('input').css('display',"none");//找到它下面所有的父节点的input框隐藏
        $("#addAlert"+id).parents().find('.Alert').find('.cur1').css('display',"none");//找到它下面所有的父节点的确定隐藏

        $("#addAlert"+id).siblings().find('.Alert').css('display',"none");//找到它下面所有的兄弟点隐藏

        $("#addAlert"+id).children().find('.Alert').find('.cur1').css('display',"none");//找到它下面所有的子点的确定隐藏

        $("#addAlert"+id).find('#Alert'+id).css('display',"block");//找到它下自己显示

        $("#addAlert"+id).parents().find('h2').css({'fontWeight':'400','color':'#fff'});
        $("#addAlert"+id).find('h2').css({'fontWeight':'bold','color':'#268ae4'});
        $("#addAlert"+id).children().find('h2').css({'fontWeight':'400','color':'#fff'});
        $("#addAlert"+id).siblings().find('h2').css({'fontWeight':'400','color':'#fff'});


    }
    //点击返回一级列表
    ReturnOne(){
        this.onDevice();
        ConfigDevice2.this.setState({
            One:true,
            Two:false,
            TwoName:''
        })
    }
    //2.点击列表选项
    ListClick(id,name){
        ConfigDevice2.this.setState({
            One:false,
            Two:true,
            TwoName:name,
            TwoTree:{},
            tableList:{},
            SBTable:false,
        })
        sessionStorage.setItem('TwoId',id);
        sessionStorage.removeItem('ReginId');
        axios.post(global.Url+'device/region/list',{category_id:id}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                if(result.length === 0){
                    ConfigDevice2.this.setState({
                        ZZListBtu:true,//组织列表按钮
                        SBList:false,//设备列表按钮
                    })
                }else{
                    ConfigDevice2.this.setState({
                        ZZListBtu:false,//组织列表按钮
                        SBList:true,//设备列表按钮
                        TwoTree:result,
                    })
                    this.RightTableList();
                }
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })

    }
    //点击子类
    onMenuClicked(ev,iditem) {
        ev.stopPropagation();
        // 被点击的<h1>
        let node = $(ev.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.next();

        // 显示/隐藏这个列表
        subMenu.css("display", subMenu.css('display') === "none" ? "block" : "none");
        $("#addAlert"+iditem).parents().find('h2').css({'fontWeight':'400','color':'#fff'});
        $("#addAlert"+iditem).parents().find('input').css({'display':'none'});
        $("#addAlert"+iditem).find('h2').css({'fontWeight':'bold','color':'#268ae4'});
        $("#addAlert"+iditem).children().find('h2').css({'fontWeight':'400','color':'#fff'});
        $("#addAlert"+iditem).siblings().find('h2').css({'fontWeight':'400','color':'#fff'});

        $("#addAlert"+iditem).parents().find('.Alert').css('display',"none");//找到它下面所有的父节点隐藏
        $("#addAlert"+iditem).parents().find('h2').find('input').css('display',"none");//找到它下面所有的父节点的input框隐藏
        $("#addAlert"+iditem).parents().find('.Alert').find('.cur1').css('display',"none");//找到它下面所有的父节点的确定隐藏

        $("#addAlert"+iditem).siblings().find('.Alert').css('display',"none");//找到它下面所有的兄弟点隐藏

        $("#addAlert"+iditem).children().find('.Alert').find('.cur1').css('display',"none");//找到它下面所有的子点的确定隐藏

        $("#addAlert"+iditem).find('#Alert'+iditem).css('display',"none");//找到它下自己显示

        sessionStorage.setItem('ReginId',iditem);
        var data={
            region_id:iditem,category_id:sessionStorage.getItem('TwoId')
        };
        if(data.region_id===""||!data.region_id){
            data={
                category_id:sessionStorage.getItem('TwoId')
            }
        }
        console.log(data);
        axios.post(global.Url+'device/info/list',data).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                ConfigDevice2.this.setState({
                    tableList:result
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //修改组织机构名称的内容
    listName(event){
        event.stopPropagation();
        ConfigDevice2.this.setState({
            changeName: event.target.value
        });
    }
    //点击修改按钮
    changeList(e,id){
        e.stopPropagation();
        $("#addAlert"+id).parents().find('input').css('display',"none");//找到它下面所有的父节点的input框隐藏
        $("#addAlert"+id).find('input').css('display','block');
        $("#addAlert"+id).children().find('li').find('input').css('display',"none");//找到它下面所有的子点的input框隐藏
        $("#addAlert"+id).find('.Alert').find('.cur1').css('display','block');

    }
    //点击确定修改按钮
    changeSureList(e,iditem,name,piditem){
        e.stopPropagation();
        console.log(iditem,name,piditem);
        axios.post(global.Url+'device/region/update',{
            id:iditem,
            region_name:name,
            pid:piditem
        }).then((res) => {
            const result = res.data.data;
            $("#addAlert"+iditem).find('h2').find('input').css('display','none');
            $("#addAlert"+iditem).find('.Alert').find('.cur1').css('display','none');
            $("#addAlert"+iditem).find('.Alert').css('display','none');
            if(result) {
                console.log(result);
                ConfigDevice2.this.setState({
                    TwoTree:result,
                })
                this.generateMenu(this.state.TwoTree);
                this.publicList();
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //生成树结构
    generateMenu(menuObj) {
        let vdom = [];
        const {changeName} = this.state;
        if (menuObj instanceof Array) {
            let list = [];
            for (var item of menuObj) {
                list.push(this.generateMenu(item));
            }
            vdom.push(
                <ul key="single">
                    {list}
                </ul>
            );
        } else {
            //console.log(menuObj);
            if(menuObj == null){return;}
            vdom.push(
                <li key={menuObj.id} className='addAlert' id={'addAlert'+menuObj.id} onContextMenu={(e)=>this.onContextMenu(e,menuObj.id)}>
                    <h2  onClick={(e)=>this.onMenuClicked(e,menuObj.id)} title={menuObj.region_name}>
                        {menuObj.region_name}
{/*
                        <input type='text' style={{'display':'none'}} defaultValue={menuObj.region_name} onFocus={(e)=>e.stopPropagation()} onChange={(e)=>this.listName(e)}/>
*/}
                    </h2>
                    <input type='text' style={{'display':'none'}} defaultValue={menuObj.region_name} onFocus={(e)=>e.stopPropagation()} onChange={(e)=>this.listName(e)}/>


                    {this.generateMenu(menuObj.children)}
                    <div className="Alert" id={'Alert'+menuObj.id} style={{'display':'none'}}>
                        <button onClick={(e)=>this.changeList(e,menuObj.id)}>修改</button>
                        <button className='cur1' style={{'display':'none'}} onClick={(e)=>this.changeSureList(e,menuObj.id,changeName,menuObj.pid)}>确定</button>
                        <button onClick={(e)=>this.AddTwoList(e,menuObj.id,'新建文件',menuObj.pid)}>添加</button>
                        {menuObj.children ? '':<button onClick={(e)=>this.DeleteList(e,menuObj.id)}>删除</button>}
                    </div>
                </li>
            );
        }
        return vdom;
    }

    //3.共用组织机构列表
    publicList(){
        axios.post(global.Url+'device/region/list',{category_id:sessionStorage.getItem('TwoId')}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                ConfigDevice2.this.setState({
                    TwoTree:result,
                })
                if(result.length === 0){
                    ConfigDevice2.this.setState({
                        ZZListBtu:true,//组织列表按钮
                        SBList:false,//设备列表按钮
                    })
                }else{
                    ConfigDevice2.this.setState({
                        ZZListBtu:false,//组织列表按钮
                        SBList:true,//设备列表按钮
                        TwoTree:result,
                    })
                    this.RightTableList();
                }
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //点击添加组织机构
    AddTwoList(e,iditem,name,pidItem){
        e.stopPropagation();
        console.log(name,pidItem);
        $("#addAlert"+iditem).find('h2').find('input').css('display','none');
        $("#addAlert"+iditem).find('.Alert').find('.cur1').css('display','none');
        $("#addAlert"+iditem).find('.Alert').css('display','none');
        axios.post(global.Url+'device/region/add',{
            category_id:sessionStorage.getItem('TwoId'),
            region_name:name,
            pid:iditem
        }).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.publicList();
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //点击删除组织机构
    DeleteList(e,iditem){
        e.stopPropagation();
        $("#addAlert"+iditem).find('h2').find('input').css('display','none');
        $("#addAlert"+iditem).find('.Alert').find('.cur1').css('display','none');
        $("#addAlert"+iditem).find('.Alert').css('display','none');
        if(window.confirm("您确定要删除该设备嘛？")){
            axios.post(global.Url+'device/region/delete',{id:iditem}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    this.publicList();
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }else{
        }

    }
    //获取右边表格列表
    RightTableList(){
        var ReginId=sessionStorage.getItem('ReginId');
        var data={};
        console.log(ReginId);
        if(!ReginId||ReginId===""){
            data={
                category_id:sessionStorage.getItem('TwoId')
            }
        }else{
            data={
                category_id:sessionStorage.getItem('TwoId'),
                region_id:ReginId
            }
        }
        console.log(data);
        axios.post(global.Url+'device/info/list',data).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result,result.length);
                ConfigDevice2.this.setState({
                    tableList:result,
                })

                if(result.length === 0){

                    ConfigDevice2.this.setState({
                        SBTable:false,//表格内容
                    })
                }else{
                    ConfigDevice2.this.setState({
                        SBTable:true,//表格内容
                    })
                }


            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //上传文件
    importFile(event,item){
        var File;
        File = event.target.files[0];
        console.log(File);
        if(File===null){
            //alert("没有数据！")
            $(".PageShow").show().find('h1').html("没有数据!");
            global.Time();
        }else{
            ConfigDevice2.this.setState({
                OneFile:File
            })
            var settings;
            var form = new FormData();
            if(item === 1){
                form.append("category_id", sessionStorage.getItem('TwoId'));
                form.append("device_region", File);
                settings = {
                    "url": global.Url+'device/region/upload',
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    "dataType":"JSON"
                };
                $.ajax(settings).done(function (res) {
                    console.log(res);
                    const result = res.data;
                    if(result) {
                        console.log(result);
                        ConfigDevice2.this.publicList();
                    }else{
                        $(".PageShow").show().find('h1').html(res.msg);
                        global.Time();
                    }
                });
            }else if(item===2){
                form.append("category_id", sessionStorage.getItem('TwoId'));
                form.append("device_info", File);
                settings = {
                    "url": global.Url+'device/info/upload',
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form,
                    "dataType":"JSON"
                };
                $.ajax(settings).done(function (res) {
                    console.log(res);
                    const result = res.data;
                    if(result) {
                        console.log(result);
                        ConfigDevice2.this.RightTableList();
                    }else{
                        $(".PageShow").show().find('h1').html(res.msg);
                        global.Time();
                    }
                });
            }


        }


    }
    //点击设备上图弹框
    AddPic(iditem,categoryName){
        ConfigDevice2.this.DeleteCesium();
        console.log(iditem);
        sessionStorage.setItem('sbId',iditem);
        ConfigDevice2.this.setState({
            ShowPic:true,
            ShowPosition:false,
            typeName:categoryName,
            TypeId:'',
            indoor:false,
            build:{},//建筑下拉框
            buildId:'',//建筑选取默认ID
            floor:{},//楼层下拉框
            floorId:'',//楼层选取默认ID
        })
        axios.post(global.Url+'device/type/list',{
            category_id:sessionStorage.getItem('TwoId'),
            enable:true,
        }).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                ConfigDevice2.this.setState({
                    PicList:result
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
        //没选择直接点击其他列表删除模型
        this.DeleteCesium();
    }
    //删除Cesium模型的方法共用
    DeleteCesium(){
        var data={
            modelobj:ConfigDevice2.this.state.modelId
        }
        Common.remove3DTilesV2(data);//根据指定Id删除对应模型
        Common.ClearHandler();//清除拖拽事件
        Common.DeletePerspectiveFollow();//删除视角旋转
    }
    //关闭设备上图弹框
    Close(){
        ConfigDevice2.this.setState({
            ShowPic:false,
            ShowPosition:false,
        })
        //没选择直接关闭清除模型
        this.DeleteCesium();
    }
    //选取设备类型 e,item.id,item.map.style,item.map_type
    handleChange=(event,id,mapStyle,mapType)=>{
        console.log(id,mapStyle,mapType);
        if(id === null){
            //alert("请选择设备类型！")
            $(".PageShow").show().find('h1').html("请选择设备类型!");
            global.Time();
        }
        $('.ADDpIC').find('dl.dl'+id).css({'opacity':'1'});
        $('.ADDpIC').find('dl.dl'+id).siblings('dl').css({'opacity':'0.6'});
        //获取单选框选中的值
        ConfigDevice2.this.setState({
            TypeId:id,
            mapStyle:mapStyle,
            mapType:mapType
        })
    }
    //确定设备上图类型
    SureLiu(event,TypeId,mapStyle,mapType){
        console.log(TypeId,mapStyle,mapType);
        if(TypeId === ''){
            //alert('请先选择要添加的设备！')
            $(".PageShow").show().find('h1').html("请先选择要添加的设备!");
            global.Time();
        }else{
            var frame=document.getElementById("core_content");
/*            var url = mapStyle.url;
            url=url.replace('$serverURL$',sessionStorage.getItem('Serverurl'));*/
            var sendData={
                Event : '',
                ModName : "dragModleV2",
                parameter : {
                    "mode": mapType,
                    "data": {
                        "url": mapStyle.url,
                        "height": mapStyle.height,
                        "scale": mapStyle.scale
                    }
                }
            };
            console.log(sendData);
            frame.contentWindow.postMessage(sendData,"*");
            ConfigDevice2.this.setState({
                ShowPic:false,
            })

        }
        //先获取当前视角坐标
        frame=document.getElementById("core_content");
        sendData={
            Event : 'getCameraView()',
            ModName : "",
            parameter : {}
        };
        frame.contentWindow.postMessage(sendData,"*");

    }
    //改变x轴
    ChangeX(e){
        ConfigDevice2.this.setState({
            X: e.target.value
        });
        var data={
            x:e.target.value,
            y:ConfigDevice2.this.state.Y,
            z:ConfigDevice2.this.state.Z,
            heading:ConfigDevice2.this.state.H,
            id:ConfigDevice2.this.state.modelId
        }
        Common.ModifyModelCoordinates(data);
    }
    //改变y轴
    ChangeY(e){
        ConfigDevice2.this.setState({
            Y: e.target.value
        });
        var data={
            x:ConfigDevice2.this.state.X,
            y: e.target.value,
            z:ConfigDevice2.this.state.Z,
            heading:ConfigDevice2.this.state.H,
            id:ConfigDevice2.this.state.modelId
        }
        Common.ModifyModelCoordinates(data);
    }
    //改变z轴
    ChangeZ(e){
        ConfigDevice2.this.setState({
            Z: e.target.value
        });
        var data={
            x:ConfigDevice2.this.state.X,
            y:ConfigDevice2.this.state.Y,
            z:e.target.value,
            heading:ConfigDevice2.this.state.H,
            id:ConfigDevice2.this.state.modelId
        }
        Common.ModifyModelCoordinates(data);
    }
    //改变偏转角
    ChangeH(e){
        ConfigDevice2.this.setState({
            H: e.target.value
        });
        var data={
            x:ConfigDevice2.this.state.X,
            y:ConfigDevice2.this.state.Y,
            z:ConfigDevice2.this.state.Z,
            heading:e.target.value,
            id:ConfigDevice2.this.state.modelId
        }
        Common.ModifyModelCoordinates(data);
    }
    //点击室内室外
    handleIsIndoor(e){
        ConfigDevice2.this.setState(prevState => ({
            indoor: !prevState.indoor
        }));
        if(!this.state.indoor){
            //alert("室内")
            axios.get(global.Url+'map/build/list').then((res) =>{
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    ConfigDevice2.this.setState({
                        build:result,
                        //buildValue:result[0].build_name,
                        buildId:result[0].id,
                    })
                    axios.post(global.Url+'map/floor/list',{build_id:result[0].id}).then((res) =>{
                        const result = res.data.data;
                        if(result) {
                            console.log(result);
                            ConfigDevice2.this.setState({
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
            ConfigDevice2.this.setState({
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
                ConfigDevice2.this.setState({
                    floor:result,
                    floorId:result[0].id
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
        ConfigDevice2.this.setState({
            buildId:e.target.value
        })
    }
    //点击楼层下拉框
    ChangeFloor = e =>{
        e.preventDefault();
        console.log(e.target.value);
        ConfigDevice2.this.setState({
            floorId:e.target.value
        })
    }
    //保存设备
    SaveLiu(TypeId,indoor,buildId,floorId){
        console.log(TypeId,indoor,buildId,floorId)
       // this.DeleteCesium();//先删除之前的模型
        //先获取当前视角坐标
        Common.onCoordinate()
        setTimeout(function(){
            var data;
            var Options=JSON.parse(sessionStorage.getItem('Center'));
            console.log(JSON.parse(sessionStorage.getItem('Center')));
            data={
                id: sessionStorage.getItem('sbId'),
                type_id: TypeId,
                center: JSON.parse(sessionStorage.getItem('center')),
                options: {
                    geom:Options.geom,
                    position:{
                        x:Number(ConfigDevice2.this.state.X),
                        y:Number(ConfigDevice2.this.state.Y),
                        z:Number(ConfigDevice2.this.state.Z),
                        heading:Number(ConfigDevice2.this.state.H),
                        pitch:0,
                        roll:0
                    },
                    scale: Options.scale,
                    url: Options.url,
                    visible: Options.visible
                },
                indoor: indoor,
                build_id: buildId,
                floor_id: floorId,
                geom:ConfigDevice2.this.state.geom
            }
            console.log(data);
            axios.post(global.Url+'device/info/onMap',data).then((res) =>{
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    ConfigDevice2.this.setState({
                        ShowPosition:false
                    })
                    ConfigDevice2.this.RightTableList();
                    Common.ClearHandler();//删除模型
                    Common.DeletePerspectiveFollow();//删除视角旋转
                    Common.HeavyHaulMod(data);//重置

                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        },0)
    }
    //设备下图
    DeletePic(item,e){
        e.stopPropagation();
        $(".device2Show").show().find("h1").html("您确定要取消该设备上图嘛");
        console.log(item);
        ConfigDevice2.this.setState({
            deleteName:'下图',
            deleteId:item.id,
            deviceCode:item.device_code
        })
    }
    //删除设备详情
    Delete(item,e){
        e.stopPropagation();
        $(".device2Show").show();
        ConfigDevice2.this.setState({
            deleteName:'删除',
            deleteId:item
        })
    }
    PageDeleted1() {
        $(".device2Show").hide();
        const {deleteName,deleteId,deviceCode} = this.state;
        if(deleteName==="下图"){
            axios.post(global.Url+'device/info/offMap',{id:deleteId}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    ConfigDevice2.this.RightTableList();
                    //删除模型
                    var data={
                        modelobj: deviceCode
                    }
                    Common.remove3DTilesV2(data);//根据指定Id删除对应模型
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }else{
            axios.post(global.Url+'device/info/delete',{id:deleteId}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    ConfigDevice2.this.RightTableList();
                }else{
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //修改设备详情
    ChangeEdit(e,itemId,deviceName,indoor,buildId,floorId,options){
        console.log(itemId,deviceName,indoor,buildId,floorId,options);
    }
    //修改搜索设备名称
    SBName(e){
        ConfigDevice2.this.setState({
            searchName:e.target.value
        })
    }
    //修改搜索下拉框的值
    ChangeON= e =>{
        e.preventDefault();
        console.log(e.target.value);
        ConfigDevice2.this.setState({
            searchOn:e.target.value
        })
    }
    //点击修改搜索
    Search(searchName,searchOn){
       // console.log(searchName,searchOn);
        if(searchOn ==='false'){
            searchOn=false;
        }else if(searchOn ==='true'){
            searchOn=true;
        }else{
            $(".PageShow").show().find('h1').html('请先选择状态');
            global.Time();
        }
        var regionId=sessionStorage.getItem('ReginId');
        if(regionId===null){
            regionId=''
        }
        var data={category_id:sessionStorage.getItem('TwoId'),on_map:searchOn,device_name:searchName,region_id:regionId};
        if(searchName === '' && searchOn !== ''){
           data={
               on_map:searchOn,
               region_id:sessionStorage.getItem('ReginId'),
           }
        }else if(searchOn === '' && searchName !== ''){
            data={
                device_name:searchName,
                region_id:sessionStorage.getItem('ReginId'),
            }
        }else if(searchName === '' && searchOn === ''){
            data={region_id:sessionStorage.getItem('ReginId')}
        }else if(data.region_id===""||!data.region_id){
            data={
                category_id:sessionStorage.getItem('TwoId'),
                on_map:searchOn,
                device_name:searchName,
            }
        }

        console.log(data);
        axios.post(global.Url+'device/info/list',data).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result,result.length);
                ConfigDevice2.this.setState({
                    tableList:result,
                })
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //点击表格分至定位处
    deviceLocation(e,item){//
        e.stopPropagation();//
        console.log(item);
        if(parseInt(item.build_id)<0){
            console.log('111');
            let Floors = global.floooList;
            if(Floors.length>0){
                if(!(Floors,Floors[0].model_url.indexOf("DXS")!== -1)){
                    var reg = new RegExp("/","g");
                    var flist = [];
                    for (let i = 0; i <  Floors.length; i++) {
                        if(Floors[i].model_url != null){
                            flist.push ({
                                modelId : Floors[i].model_url.replace(reg,"_"),
                                order_num : Floors[i].order_num,
                            })
                        }
                    }
                    Common.ShowSpecifiedModel(flist);
                }
            }

            if(ConfigDevice2.this.state.isShow === false){
                console.log('222');
                Common.BuildingShow({show :false});
                ConfigDevice2.this.setState({
                    isShow:true
                })
            }
            axios.get(global.Url+'map/under/list').then((res) => {
                const result = res.data.data;
                if(result) {
                    $("#liu").css({'display':'block'});
                    $("#liu").find(".configShowNav").find("span").html('地下室');
                    var data={result,number:1}
                    Common.returnData(data)
                }

                var list = [];
                var reg = new RegExp("/","g");//g,表示全部替换。
                result.forEach(element => {
                    if(element.model_url != null){
                        //console.log(element.model_url.replace(reg,"_"))
                        list.push ({
                            modelId : element.model_url.replace(reg,"_"),
                            order_num : element.order_num,
                            more: element
                        })
                    }
                });
                const index = parseInt(item.floor_id.split("B")[1].substr(0,1))
                Common.onMenuClickedV3(list[index-1].modelId,list)
                Common.dxsFlyTo(item)
            })

        }else{
            let data={
                id:item.id,
            }
            Common.CoordinateModelID(data);//飞过去
            Common.returnData(item)
            if(ConfigDevice2.this.state.isShow){
                Common.BuildingShow({show :true});
                ConfigDevice2.this.setState({
                    isShow:false
                })
            }
        }


/*        let data={
            id:item.id,
        }
        //console.log(name);
        Common.CoordinateModelID(data);//飞过去
        Common.returnData(item)*/
    }
    render(){
        const {List,isLoading,One,Two,TwoName,ZZListBtu,SBList,TwoTree,tableList,SBTable,ShowPic,PicList,TypeId,mapStyle,mapType,ShowPosition,
            typeName,X,Y,Z,H,indoor,build,buildId,floor,floorId,searchName,searchOn} = this.state;
        const{navClick} = this.props;
        return(
            <Fragment>
                {isLoading
                    ?
                    <div>
                        {One
                            ?
                            <div className="configShow" style={{'width':'500px'}}>
                                <div className="configShowNav">设备上图 <i onClick={() => navClick(100)}></i></div>
                                <div className="configShowConent">
                                    <h1 className='cur'>设备类别</h1>
                                    <div className="device">
                                        {
                                            List.length > 0 && List.map(
                                                (item,index) => {
                                                    return <li key={index} onClick={() => this.ListClick(item.id,item.category_name)} onContextMenu={this.onContextMenu.bind(this)}>
                                                        <img src={item.category_icon} alt=""/><span>{item.category_name}</span>
                                                    </li>
                                                }
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            :''
                        }
                        {Two
                            ?
                            <div className="configShow" style={{'width':'800px'}}>
                                <div className="configShowNav">设备上图 <i onClick={() => navClick(100)}></i></div>
                                <div className="configShowConent">
                                    <h1 className='cur' style={{'width':'764px'}}><em onClick={()=>this.ReturnOne()}>设备类别</em> >> {TwoName}</h1>
                                    <div className="device" style={{'width':'764px','overflow':'hidden','height':'350px','marginBottom':'-20px'}}>
                                        <div className="Tree">
                                            {ZZListBtu
                                            ?
                                                <div>
                                                    <div>暂无数据</div>
                                                    <div className="import">
                                                        <button className="cur">导入组织机构</button>
                                                        <input type="file" className='change' ref="haveFile" id="fileInput" name="fileInput" onChange={(e)=> this.importFile(e,1)} accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                                    </div>
                                                </div>
                                            :
                                                <div>
                                                    <div className="import">
                                                        <button className={SBList ? 'cur' : 'cur Grayscale'} >导入设备列表</button>
                                                        <input type="file" className='change' ref="haveFile" id="fileInput" name="fileInput" onChange={(e)=> this.importFile(e,2)} accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                                    </div>
                                                    <div className="TreeList" style={{'height':'300px'}}>
                                                        {this.generateMenu(TwoTree)}
                                                    </div>
                                                </div>
                                            }

                                        </div>
                                        <div className="TreeTop">
                                            {SBTable?
                                                <div className="TableList">
                                                    <div className="TableTitle">
                                                        <span><label htmlFor="">设备名称</label>
                                                            <input type="text" defaultValue={searchName} onChange={(e)=>this.SBName(e)}/>
                                                        </span>
                                                        <span><label htmlFor="">状态</label>
                                                            <select defaultValue={searchOn} onChange={this.ChangeON}>
                                                                 <option value="oo">请选择</option>
                                                                 <option value="false">未上图</option>
                                                                 <option value="true">已上图</option>
                                                            </select>
                                                        </span>
                                                        <span><button onClick={()=>this.Search(searchName,searchOn)}>搜索</button></span>
                                                    </div>
                                                    <div className='TreeTable'>
                                                        <table cellPadding="0" cellSpacing="0">
                                                            <thead>
                                                            <tr>
                                                                <th>名称</th>
                                                                <th>类型</th>
                                                                <th>状态</th>
                                                                <th>操作</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                tableList.length > 0 && tableList.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td title={item.device_name} onClick={item.on_map?(e)=>this.deviceLocation(e,item):null}>{item.device_name}</td>
                                                                            <td>{item.device_type}</td>
                                                                            <td>{item.on_map ?
                                                                                <span className='green'>已上图</span> :
                                                                                <span className='red'>未上图</span>}</td>
                                                                            <td>
                                                                           {/*     <button className="Edit"
                                                                                        onClick={(e)=>this.ChangeEdit(e,item.id,item.device_name,item.indoor,item.build_id,item.floor_id,item.options)}
                                                                                ><i></i>
                                                                                </button>*/}
                                                                                {item.on_map ?
                                                                                    <button className="ChangeTable" onClick={(e) => this.DeletePic(item,e)}>
                                                                                        <i></i></button>
                                                                                    : <button className="AddTable" onClick={() => this.AddPic(item.id,item.device_name)}>
                                                                                        <i></i></button>
                                                                                }
                                                                                <button className="deletePic" onClick={(e)=> this.Delete(item.id,e)}><i></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {ShowPic?
                                                        <div className="configShow" style={{'width':'380px','top':'-60px','left':'780px','textAlign':'left'}}>
                                                            <div className="configShowNav">设备类型 <i onClick={() => this.Close()}></i></div>
                                                            <div className="configShowConent">
                                                                <h1 className='cur' style={{'width':'333px', 'textAlign':'left'}}>选择你要添加的设备</h1>
                                                                <div className="ADDpIC">
                                                                    {
                                                                        PicList.length > 0 && PicList.map(
                                                                            (item,index) => {
                                                                                return <dl key={index} className={'dl'+item.id}>
                                                                                    <img src={item.type_icon} alt=""/><span>{item.type_name}</span>
                                                                                    <input type="radio" name='gender' value={item.id} checked={TypeId === item.id}  onChange={(e)=>this.handleChange(e,item.id,item.map_style,item.map_type,item.type_name)}/>
                                                                                </dl>
                                                                            }
                                                                        )
                                                                    }
                                                                    <div className="configBut" style={{marginTop:'35px'}}>
                                                                        <button onClick={(event)=>this.SureLiu(event,TypeId,mapStyle,mapType)} >确定</button>
                                                                        <button onClick={() => this.Close()}>取消</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :''
                                                    }
                                                    {ShowPosition?
                                                        <div className="configShow" style={{'width':'380px','top':'-60px','left':'780px','textAlign':'left'}}>
                                                            <div className="configShowNav">添加设备 <i onClick={() => this.Close()}></i></div>
                                                            <div className="configShowConent" style={{'height':'220px'}}>
                                                                <div className="Position">
                                                                    <div className="PositionName"><span>设备名称</span><input type="text" defaultValue={typeName} readOnly/></div>
                                                                    <div className="PositionX">
                                                                        <span><label>经度:</label><input type="number" step="0.000001" defaultValue={X} onChange={(e)=>this.ChangeX(e)}/></span>
                                                                        <span><label>维度:</label><input type="number" step="0.000001" defaultValue={Y} onChange={(e)=>this.ChangeY(e)}/></span>
                                                                        <span><label>高度:</label><input type="number" step="0.1" defaultValue={Z} onChange={(e)=>this.ChangeZ(e)}/></span>
                                                                        <span><label>偏转角:</label><input type="number" step="0.1" defaultValue={H} onChange={(e)=>this.ChangeH(e)}/></span>
                                                                    </div>
                                                                    <div className="PositionFloor">
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
                                                                    <div className="configBut" style={{marginTop:'15px'}}>
                                                                        <button className='cur' onClick={()=>this.SaveLiu(TypeId,indoor,buildId,floorId)}>保存</button>
                                                                        <button className='cur' onClick={() => this.Close()}>取消</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :''
                                                    }

                                                </div>
                                            :
                                                <div>
                                                    <div>暂无数据</div>
                                                    <div className="import">
                                                        <button className={SBList ? 'cur' : 'cur Grayscale'} >导入设备列表</button>
                                                        <input type="file" className='change' ref="haveFile" id="fileInput" name="fileInput" onChange={(e)=> this.importFile(e,2)} accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                                    </div>
                                                </div>
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                            :''
                        }
                    </div>
                    :''
                }
                <div className="PageShow1 device2Show">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeleted1()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapDispatch = () => ({
    navClick(id) {
        console.log(id);
        ConfigDevice2.this.setState({
            One:false,
            Two:false,
        })

    },
});

export default connect(null,mapDispatch)(ConfigDevice2);