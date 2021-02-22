import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import axios from "axios";
import $ from "jquery";
import {Common} from "../../../Cesium/method";

//调色板
import reactCSS from "reactcss";
import {ChromePicker} from "react-color";

class ConfigData4 extends PureComponent{
    constructor(props) {
        super(props);
        this.state={
            isLoad:true,
            treeList:{},//左边树状列表
            regionName:'',//网格信息名称
            oneInfo:true,//添加信息
            Pid:0,//添加的pid,顶级未0，其他子级未上级的id
            Id:'',//修改用的id
            addChange:false,
            twoInfo:false,//右侧展示内容
            twoImport:false,//右侧导入信息
            SaveId:'',//保存网格信息所需要的id
            isIndoor:false,//室内室外，默认室内
            build:{},//楼下拉框
            buildId:'',//楼选取默认ID
            floor:{},//层下拉框
            floorId:'',//层选取默认ID
            SHP:'',//导入文件.shp
            DBF:'',//导入文件.dbf
            gridName:'',//子类网格信息里面的名称
            labelId:'',//修改子类网格信息的id
            TwoItem:true,//切换信息的网格信息
            TwoItemTwo:false,//切换信息的网格设备
            gridStyle:{//网格信息
                color:'#436eee',//网格颜色
                colorTransparency:50,//颜色透明度
                borderWidth:'1',//边框宽度
                borderColor:'#ff0000',//边框颜色
                borderTransparency:50,//边框透明度
            },//网格样式
            tableList:{},//网格设备
            deleteName:"删除",//删除还是重置
            deleteId:'',//删除或者充值Id
            gridPicker:false,//调色板显示隐藏(网格)
            borderPicker:false//调色板显示隐藏(边框))
        }
        ConfigData4.this = this;
        this.Close = this.Close.bind(this);//关闭事件
        this.onContextMenu = this.onContextMenu.bind(this);//右击事件
        this.addInfo = this.addInfo.bind(this);//添加事件，1为顶级添加，2为左侧列表添加
        this.saveInfo = this.saveInfo.bind(this);//添加保存时间
        this.onMenuClicked = this.onMenuClicked.bind(this);//点击子类
        this.deleteInfo = this.deleteInfo.bind(this);//删除
        this.importInfo = this.importInfo.bind(this);//导入信息
        this.saveTwoTag = this.saveTwoTag.bind(this);//保存网格信息
        this.navItemClick = this.navItemClick.bind(this);//二级网格信息切换
        this.saveSure = this.saveSure.bind(this);//确定事件
        this.onReset = this.onReset.bind(this);//重置
        this.PageDeletedData4 = this.PageDeletedData4.bind(this);
    }
    //关闭
    Close(){
        this.setState({
            isLoad:false
        })
        let list = this.state.treeList;
        list.forEach(element => {
            Common.Emptyentities({id:element.id})
        });
    }
    componentDidMount() {
        //获取网格列表信息
        this.onLoad();
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
    }
    //获取网格列表信息
    onLoad(){
        var list=[];
        axios.get(global.Url+'grid/region/list').then((res) => {
            const result = res.data.data;
            if(result) {
                list=result;
                console.log(list);
                axios.post(global.Url+'grid/info/list').then((res) => {
                    const results = res.data.data;
                    if(results) {
                        console.log(results);
                        results.forEach(element => {
                            var arr = {
                                id: element.id
                                ,pid: element.region_id
                                ,region_name: element.grid_name
                                ,node_type: "details"
                                ,position: element.position
                                ,indoor: element.indoor
                                ,build_id: element.build_id
                                ,floor_id: element.floor_id
                                ,children: [],
                                grid_style:element.grid_style,
                                geom:element.geom
                            }
                            list.push(arr);
                        });
                        this.setState({
                            treeList:list
                        })
                        global.GridTree=list;
                        console.log(list);

                    }else{
                        alert(res.data.msg)
                    }
                })


            }else{
                alert(res.data.msg)
            }
        })
    }
    //树结构生成
    AnalyticFormat(vdom) {
        var menuObj = vdom;
        //转成树
        function getTree(data, Pid) {
            let result = [];
            let temp;
            for (let i = 0; i < data.length; i++) {
                if (data[i].pid === Pid) {
                    temp = getTree(data, data[i].id);
                    /*            if (temp.length > 0) {
                                    data[i].children = temp
                                }*/
                    data[i].children = temp
                    result.push(data[i])

                }
            }
            return result


        }

        return getTree(menuObj, "0");

    }
    generateMenu(menuObj) {
        let vdom = [];
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
                <li key={menuObj.id} className='layer' id={'layer'+menuObj.id} onContextMenu={menuObj.node_type === 'details'?(e)=>this.onContextMenu1(e):(e)=>this.onContextMenu(e,menuObj.id)}>
                    <span  onClick={menuObj.node_type === 'details'?(e)=>this.onMenuClicked(e,menuObj,1):(e)=>this.onMenuClicked(e,menuObj,2)} >
                        {(() => {
                            switch (menuObj.node_type) {
                                case 'group':
                                    return <i className='group'></i>;
                                case 'grid':
                                    return <i className='grid'></i>;
                                case 'details':
                                    return <i className='details'></i>;
                                default:
                                    return null;
                            }
                        })()}
                        {menuObj.region_name}
                    </span>
                    {this.generateMenu(menuObj.children)}
                    <div className="Alert_tk" id={'Alert'+menuObj.id} style={{'display':'none'}}>
                        {(() => {
                            switch (menuObj.node_type) {
                                case 'group':
                                    return <div>
                                        <button onClick={(e)=>this.addInfo(e,2,menuObj.id)}>添加</button>
                                        <button onClick={(e)=>this.addInfo(e,3,menuObj)}>修改</button>
                                        {menuObj.children.length<1?<button onClick={(e) =>this.deleteInfo(e,menuObj.id)}>删除</button>:''}
                                        <button onClick={(e)=>this.importInfo(e,menuObj)}>导入</button>
                                    </div>;
                                case 'grid':
                                    return <div>
                                        <button onClick={(e)=>this.addInfo(e,3,menuObj)}>修改</button>
                                        <button onClick={(e)=>this.onReset(e,menuObj.id)}>重置</button>
                                    </div>;
                                default:
                                    return null;
                            }
                        })()}
                    </div>
                </li>
            );
        }
        return vdom;
    }
    //点击子类
    onMenuClicked(ev,name,ID) {
        console.log(name);
        ev.stopPropagation();
        Common.HeavyHaulMod();
        // 被点击的<h1>
        let node = $(ev.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.next();

        // 显示/隐藏这个列表
        subMenu.css("display", subMenu.css('display') === "none" ? "block" : "none");
        $("#layer"+ name.id).parents().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#layer"+ name.id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#layer"+ name.id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#layer"+ name.id).children().find('span').css({'color':'#fff','fontWeight':'100'});
        $(".layer_t").find('span').css({'color':'#fff','fontWeight':'100'});
        $(".layer").find(".Alert_tk").css('display',"none");
        let list = this.state.treeList;
        list.forEach(element => {
            Common.Emptyentities({id:element.id})
        });
        if(name.indoor){
            let data={
                id:name.id,
            }
            console.log(name.id)
            Common.CoordinateModelID(data);//飞过去
        }
        if(ID===1){
            let data = {
                style :name.grid_style,
                gridList:name.geom.coordinates,
                flyTo : true,
                id:name.id
            }
            Common.showGrid(data);
            ConfigData4.this.setState({
                twoInfo:true,
                oneInfo:false,
                twoImport:false,
                gridName:name.region_name,
                gridStyle:name.grid_style,
                labelId:name.id,
                TwoItem:true,
                TwoItemTwo:false
            })
            $(".TwoDataNav").find('span:last-child').removeClass('cur');
            $(".TwoDataNav").find('span:first-child').addClass('cur');
        }else if(ID===2){
            console.log(name);
            if(name.node_type==="grid"){
                if(name.children.length>0){
                    for(var i=0; i<name.children.length;i++){
                        let data = {
                            style :name.children[i].grid_style,
                            gridList:name.children[i].geom.coordinates,
                            flyTo : true,
                            id:name.children[i].id
                        }
                        Common.showGrid(data);
                    }
                }
            }else{
                return
            }
        }

    }
    //右击事件
    onContextMenu(e,id){
        e.stopPropagation();
        console.log(id)
        $("#layer"+ id).parents().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#layer"+ id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#layer"+ id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#layer"+ id).children().find('span').css({'color':'#fff','fontWeight':'100'});
        $(".layer_t").find('span').css({'color':'#fff','fontWeight':'100'});
        $(".layer").find(".Alert_tk").css('display',"none");
        $("#layer"+id).find('#Alert'+id).css('display',"block");//找到它下自己显示
    }
    onContextMenu1(e){
        e.stopPropagation();
        $(".layer").find(".Alert_tk").css('display',"none");
    }
    //添加事件
    addInfo(e,num,Item){ //1为顶级添加，2为子级添加，3为修改展示
        $(".layer").find(".Alert_tk").css('display',"none");
        e.stopPropagation();
        this.setState({
            Pid:Item,
            oneInfo:true,
            regionName:'',
            addChange:false,
            twoInfo:false,
            twoImport:false,
        })
        if(num === 1){
            console.log('顶级添加')
        }else if(num === 2){
            console.log('子级添加')
        }else if(num === 3){
            this.setState({
                Pid:Item.pid,
                regionName:Item.region_name,
                addChange:true,
                Id:Item.id,
            })
        }
    }
    //添加保存事件和修改保存事件
    saveInfo(num){  //num为1是新增保存，为2是修改保存
        if(num === 1 ){
            debugger
            const {regionName} = this.state;
            if(!regionName){
                $(".PageShow").show().find('h1').html("请先输入网格名称!");
                global.Time();
            }else{
                axios.post(global.Url+'grid/region/add',{
                    region_name:ConfigData4.this.state.regionName,
                    pid:ConfigData4.this.state.Pid
                }).then((res) => {
                    const result = res.data.data;
                    if(result) {
                        console.log(result);
                        //alert("添加成功！");
                        $(".PageShow").show().find('h1').html("添加成功!");
                        global.Time();
                        this.onLoad();
                        this.setState({
                            regionName:'',
                            Pid:0,
                        })
                    }else{
                        alert(res.data.msg)
                    }
                })
            }

        }else if(num===2){
            axios.post(global.Url+'grid/region/update',{
                region_name:ConfigData4.this.state.regionName,
                id:ConfigData4.this.state.Id,
                pid:ConfigData4.this.state.Pid
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    //alert("修改成功！");
                    $(".PageShow").show().find('h1').html("修改成功!");
                    global.Time();
                    this.setState({
                        addChange:false,
                    })
                    this.onLoad();
                    this.setState({
                        regionName:'',
                        Pid:0,
                    })
                }else{
                    alert(res.data.msg)
                }
            })
        }

    }
    //删除事件
    deleteInfo(e,item){
        e.stopPropagation();
        ConfigData4.this.setState({
            deleteName:"删除",
            deleteId:item
        })
        $(".data4Show").show().find('h1').html("您确定要删除吗？");
    }
    //重置
    onReset(e,item){
        e.stopPropagation();
        ConfigData4.this.setState({
            deleteName:"重置",
            deleteId:item
        })
        $(".data4Show").show().find('h1').html("您确定要重置吗");
    }
    PageDeletedData4(){
        $(".data4Show").hide();
        const {deleteName,deleteId} =this.state;
        if(deleteName==="删除"){
            axios.post(global.Url+'grid/region/delete',{id:deleteId}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    //alert("删除成功！");
                    $(".PageShow").show().find('h1').html("删除成功!");
                    global.Time();
                    this.onLoad();
                    Common.HeavyHaulMod();
                }else{
                    alert(res.data.msg)
                }
            })
        }else{
            axios.post(global.Url+'grid/region/reset',{id:deleteId}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    //alert("重置成功！");
                    $(".PageShow").show().find('h1').html("重置成功!");
                    global.Time();
                    this.onLoad();
                    Common.HeavyHaulMod();
                }else{
                    alert(res.data.msg)
                }
            })
        }
    }
    //导入信息按钮
    importInfo(e,item){
        $(".layer").find(".Alert_tk").css('display',"none");
        e.stopPropagation();
        console.log(item);
        this.setState({
            oneInfo:false,
            twoInfo:false,
            twoImport:true,
            SaveId:item.id
        })
    }
    //上传文件
    importFile(event){
        var File=event.target.files;
        var form = new FormData();
        console.log(File[1],File[0])
        form.append("shp", File[1]);
        form.append("dbf", File[0]);
        this.setState({
            SHP:File[1],
            DBF:File[0]
        })
        var settings = {
            "url": global.Url+'grid/info/analysisSHP',
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            "dataType":"JSON"
        };
        console.log(form);
        debugger
        $.ajax(settings).done(function (res) {
            console.log(res);
            const result = res.data;
            if(result) {
                var data = {
                    style :ConfigData4.this.state.gridStyle,
                    gridList:result,
                }
                console.log(result,ConfigData4.this.state.gridStyle,data);
                Common.PreviewGrid(data);

            }else{
                alert(res.msg)
            }
        });

    }
    //修改网格名称
    changeRegionName(e){
        this.setState({
            regionName:e.target.value
        })
    }
    //室内室外
    handleIsIndoor(e){
        this.setState(prevState => ({
            isIndoor: !prevState.isIndoor
        }));
        if(!this.state.isIndoor){
            //alert("室内")
            axios.get(global.Url+'map/build/list').then((res) =>{
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    this.setState({
                        build:result,
                        //buildValue:result[0].build_name,
                        buildId:result[0].id,
                    })
                    axios.post(global.Url+'map/floor/list',{build_id:result[0].id}).then((res) =>{
                        const result = res.data.data;
                        if(result) {
                            console.log(result);
                            this.setState({
                                floor:result,
                                //floorValue:result[0].floor_name,
                                floorId:result[0].id
                            })
                        }else{
                            alert(res.data.msg)
                        }
                    })
                }else{
                    alert(res.data.msg)
                }
            })

        }else{
            //alert("室外")
            this.setState({
                build:{},
                buildValue:'',
                buildId:'',
                floor:{},
                floorValue:'',
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
                this.setState({
                    floor:result,
                    //floorValue:result[0].floor_name,
                    floorId:result[0].id
                })
            }else{
                alert(res.data.msg)
            }
        })
        this.setState({
            buildId:e.target.value
        })
    }
    //点击层下拉框
    ChangeFloor = e =>{
        e.preventDefault();
        console.log(e.target.value);
        this.setState({
            floorId:e.target.value
        })
    }
    //文本监听方法
    onChangeData(){
        setTimeout(function(){
            var that = ConfigData4.this.state;
            var data = {
                ids:[that.labelId],
                style:that.gridStyle,
            }
            Common.modifyGrid(data)
        },10);
    }
    //修改网格颜色
    ChangeColor(e){
        //ConfigData4.this.state.gridStyle.color = e.target.value;
        var tarns1 = ConfigData4.this.state.gridStyle;
        tarns1.color = e.target.value;
        ConfigData4.this.setState(tarns1);
        this.onChangeData();
    }
    //修改颜色透明度
    changeColorTransparency(e){
        var tarns1 = ConfigData4.this.state.gridStyle;
        tarns1.colorTransparency = e.target.value;
        ConfigData4.this.setState(tarns1);
        this.onChangeData();
    }
    //修改边框宽度
    ChangeBorderWidth(e){
        //ConfigData4.this.state.gridStyle.borderWidth = e.target.value;
        var tarns1 = ConfigData4.this.state.gridStyle;
        tarns1.borderWidth = e.target.value;
        ConfigData4.this.setState(tarns1);
        this.onChangeData();
    }
    //修改边框颜色
    changeBorderColor(e){
        //ConfigData4.this.state.gridStyle.borderColor = e.target.value;
        var tarns1 = ConfigData4.this.state.gridStyle;
        tarns1.borderColor = e.target.value;
        ConfigData4.this.setState(tarns1);
        this.onChangeData();
    }
    //修改边框透明度
    changeBorderTransparency(e){
        var tarns2 = ConfigData4.this.state.gridStyle;
        tarns2.borderTransparency = e.target.value;
        ConfigData4.this.setState(tarns2);
        this.onChangeData();
    }
    //修改子类网格信息的网格名称
    GridName(e){
        ConfigData4.this.setState({
            gridName:e.target.value
        });
    }
    //保存网格信息
    saveTwoTag(){
        const {SaveId,SHP,DBF,isIndoor,buildId,floorId,gridStyle} =this.state;
        console.log(SaveId,SHP,DBF,isIndoor,buildId,floorId,gridStyle,gridStyle.color);
        var form = new FormData();
        form.append("shp", SHP);
        form.append("dbf", DBF);
        form.append("region_id", SaveId);
        form.append("indoor", isIndoor);
        form.append("build_id", buildId);
        form.append("floor_id", floorId);
        form.append("grid_style", JSON.stringify(gridStyle));
        console.log(form);
        if(!SHP){
            //alert("请先选择数据！")
            $(".PageShow").show().find('h1').html("请先选择数据!");
            global.Time();
        }else{
            var settings = {
                "url": global.Url+'grid/info/upload',
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
                    //alert("保存成功!");
                    $(".PageShow").show().find('h1').html("保存成功!");
                    global.Time();
                    axios.post(global.Url+'grid/info/list').then((res) => {
                        const result = res.data.data;
                        if(result) {
                            console.log(result);
                            ConfigData4.this.onLoad();
                            ConfigData4.this.setState({
                                regionName:'',
                                Pid:0,
                                oneInfo:true,
                                twoInfo:false,
                                twoImport:false
                            })

                        }else{
                            //alert(res.data.msg)
                            $(".PageShow").show().find('h1').html(res.data.msg);
                            global.Time();
                        }
                    })

                }else{
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            });
        }

    }
    //二级网格信息切换
    navItemClick(item){
        if(item === 1){
            ConfigData4.this.setState({
                TwoItem:true,
                TwoItemTwo:false
            })
            $(".TwoDataNav").find('span:last-child').removeClass('cur');
            $(".TwoDataNav").find('span:first-child').addClass('cur');
        }else if(item === 2){
            ConfigData4.this.setState({
                TwoItem:false,
                TwoItemTwo:true
            })
            $(".TwoDataNav").find('span:last-child').addClass('cur');
            $(".TwoDataNav").find('span:first-child').removeClass('cur');
            let tableList=[];
            axios.post(global.Url+'device/category/categoryByGrid',{id:ConfigData4.this.state.labelId}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    tableList=result;
                    axios.post(global.Url+'device/info/deviceByGrid',{id:ConfigData4.this.state.labelId}).then((res) => {
                        const results = res.data.data;
                        if(results) {
                            tableList.forEach(elements => {
                                elements.subsets = [];
                            });
                            results.forEach(element => {
                                tableList.forEach(elements => {
                                    if(element.category_name === elements.category_name){
                                        elements.subsets.push(element)
                                    }
                                });
                            });
                            console.log(tableList);
                            ConfigData4.this.setState({
                                tableList:tableList
                            })
                        }else{
                            //alert(res.data.msg)
                            $(".PageShow").show().find('h1').html(res.data.msg);
                            global.Time();
                        }
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //确定修改信息
    saveSure(){
        const {gridName,labelId,gridStyle} = this.state;
        axios.post(global.Url+'grid/info/update',{
            id:labelId,
            grid_name: gridName,
            grid_style: gridStyle
        }).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                ConfigData4.this.onLoad();
                //alert("修改成功！")
                $(".PageShow").show().find('h1').html("修改成功!");
                global.Time();
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
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
        this.onChangeData();
    }
    render(){
        const {isLoad,treeList,regionName,oneInfo,addChange,twoInfo,twoImport,isIndoor,buildId,build,floorId,floor,gridStyle,gridName,TwoItem,TwoItemTwo,tableList,gridPicker,borderPicker} =this.state;
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
        return(
            <Fragment>
                {isLoad?
                    <div className="configShow" style={{'width':'530px'}}>
                        <div className="configShowNav">网格模式<i onClick={()=>this.Close()}></i></div>
                        <div className="configData" style={{'height':'400px'}}>
                            <div className="LayerLeftNew">
                                <div className="LeftList">
                                    <div className="LeftListTitle">
                                        <button onClick={(e)=>this.addInfo(e,1,0)}>添加信息</button>
                                    </div>
                                    <div className="TreeList">
                                        <ul>
                                            {this.generateMenu(this.AnalyticFormat(treeList))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="configDataRight LayerRight" style={{'width':'279px'}}>
                                {oneInfo?
                                    <div>
                                        <li><span>网格名称：</span><input type="text" value={regionName} onChange={(event) => this.changeRegionName(event)}/></li>

                                        <div className="configBut" >{addChange?<button onClick={()=>this.saveInfo(2)}>修改保存</button>:<button onClick={()=>this.saveInfo(1)}>保存</button>}</div>
                                    </div>
                                    :''}
                                {twoImport?
                                    <div>
                                        <div className="LeftListTitle" style={{'marginLeft':'15px'}}>
                                            <input type="file" name="filename" multiple="multiple" onChange={(e)=> this.importFile(e)}/>
                                            <button>选取数据</button>
                                        </div>
                                        <div className='AddImport'>
                                            <div className="PositionFloor">
                                                <span><label>室内：</label><input type="checkbox" checked={isIndoor} onChange={(e) => this.handleIsIndoor(e)}/></span>
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
                                            </div>
                                            <li><span>网格样式</span></li>
                                            <li><span>网格颜色：</span>
                                                {/* <select
                                                    className='AddSelect'
                                                    onChange={(e)=>this.ChangeColor(e)}
                                                    defaultValue = {gridStyle.color}>
                                                    <option value='#ff0000'>红</option>
                                                    <option value='#ffd700'>黄</option>
                                                    <option value='#436eee'>蓝</option>
                                                    <option value='#228b22'>绿</option>
                                                    <option value='#ffffff'>白</option>
                                                </select> */}
                                                <div style={colorStyles.outer}>
                                                    <div style={{...colorStyles.color,background:gridStyle.color}} onClick={ this.handlePalette.bind(this,'gridPicker')} />
                                                    {
                                                        gridPicker&&
                                                        <div style={colorStyles.popover}>
                                                            <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'gridPicker')}/>
                                                            <ChromePicker color={gridStyle.color} onChange={this.handleChoosePalette.bind(this,'color','gridStyle')} />
                                                        </div>
                                                    }
                                                </div>
                                            </li>
                                            <li><span>透明度：</span>
                                                <input type="range" max='100' min='0' defaultValue={gridStyle.colorTransparency}
                                                       onChange={(event) => this.changeColorTransparency(event)}/>
                                                <i>{gridStyle.colorTransparency}%</i>
                                            </li>
                                            <li><span>边框宽度：</span><input type="text" defaultValue={gridStyle.borderWidth} onChange={(event) => this.ChangeBorderWidth(event)}/></li>
                                            <li><span>边框颜色：</span>
                                                {/* <select
                                                    className='AddSelect'
                                                    onChange={(e)=>this.changeBorderColor(e)}
                                                    defaultValue = {gridStyle.borderColor}>
                                                    <option value='#ff0000'>红</option>
                                                    <option value='#ffd700'>黄</option>
                                                    <option value='#436eee'>蓝</option>
                                                    <option value='#228b22'>绿</option>
                                                    <option value='#ffffff'>白</option>
                                                </select> */}
                                                <div style={colorStyles.outer}>
                                                    <div style={{...colorStyles.color,background:gridStyle.borderColor}} onClick={ this.handlePalette.bind(this,'borderPicker')} />
                                                    {
                                                        borderPicker&&
                                                        <div style={colorStyles.popover}>
                                                            <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'borderPicker')}/>
                                                            <ChromePicker color={gridStyle.borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor','gridStyle')} />
                                                        </div>
                                                    }
                                                </div>
                                            </li>
                                            <li><span>透明度：</span>
                                                <input type="range" max='100' min='0' defaultValue={gridStyle.borderTransparency}
                                                       onChange={(event) => this.changeBorderTransparency(event)}/>
                                                <i>{gridStyle.borderTransparency}%</i>
                                            </li>
                                        </div>
                                        <div className="configBut" ><button onClick={()=>this.saveTwoTag()}>保存</button></div>
                                    </div>
                                    :''
                                }
                                {twoInfo?
                                    <div>
                                        <div className="TwoDataNav"><span className='cur' onClick={()=>this.navItemClick(1)}>网格信息</span><span onClick={()=>this.navItemClick(2)}>网格设备</span></div>
                                        <div className="one">
                                            {TwoItem?
                                                <div>
                                                    <div className='AddImport one'>
                                                        <li><span>网格名称：</span><input type="text" value={gridName} onChange={(e)=>this.GridName(e)}/></li>
                                                        <li><span>网格颜色：</span>
                                                            {/* <select
                                                                className='AddSelect'
                                                                onChange={(e)=>this.ChangeColor(e)}
                                                                value = {gridStyle.color}>
                                                                <option value='#ff0000'>红1</option>
                                                                <option value='#ffd700'>黄</option>
                                                                <option value='#436eee'>蓝</option>
                                                                <option value='#228b22'>绿</option>
                                                                <option value='#ffffff'>白</option>
                                                            </select> */}
                                                            <div style={colorStyles.outer}>
                                                                <div style={{...colorStyles.color,background:gridStyle.color}} onClick={ this.handlePalette.bind(this,'gridPicker')} />
                                                                {
                                                                    gridPicker&&
                                                                    <div style={colorStyles.popover}>
                                                                        <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'gridPicker')}/>
                                                                        <ChromePicker color={gridStyle.color} onChange={this.handleChoosePalette.bind(this,'color','gridStyle')} />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </li>
                                                        <li><span>透明度：</span>
                                                            <input type="range" max='100' min='0' value={gridStyle.colorTransparency}
                                                                   onChange={(event) => this.changeColorTransparency(event)}/>
                                                            <i>{gridStyle.colorTransparency}%</i>
                                                        </li>
                                                        <li><span>边框宽度：</span><input type="text" value={gridStyle.borderWidth} onChange={(event) => this.ChangeBorderWidth(event)}/></li>
                                                        <li><span>边框颜色：</span>
                                                            {/* <select
                                                                className='AddSelect'
                                                                onChange={(e)=>this.changeBorderColor(e)}
                                                                value = {gridStyle.borderColor}>
                                                                <option value='#ff0000'>红1</option>
                                                                <option value='#ffd700'>黄</option>
                                                                <option value='#436eee'>蓝</option>
                                                                <option value='#228b22'>绿</option>
                                                                <option value='#ffffff'>白</option>
                                                            </select> */}
                                                            <div style={colorStyles.outer}>
                                                                <div style={{...colorStyles.color,background:gridStyle.borderColor}} onClick={ this.handlePalette.bind(this,'borderPicker')} />
                                                                {
                                                                    borderPicker&&
                                                                    <div style={colorStyles.popover}>
                                                                        <div style={ colorStyles.cover } onClick={this.handlePaletteClose.bind(this,'borderPicker')}/>
                                                                        <ChromePicker color={gridStyle.borderColor} onChange={this.handleChoosePalette.bind(this,'borderColor','gridStyle')} />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </li>
                                                        <li><span>透明度：</span>
                                                            <input type="range" max='100' min='0' value={gridStyle.borderTransparency}
                                                                   onChange={(event) => this.changeBorderTransparency(event)}/>
                                                            <i>{gridStyle.borderTransparency}%</i>
                                                        </li>
                                                    </div>
                                                    <div className="configBut" ><button onClick={()=>this.saveSure()}>确定</button></div>
                                                </div>
                                                :''
                                            }
                                            {TwoItemTwo?
                                                <div className='AddImport two'>
                                                    <div className="GridNav">
                                                        {
                                                            tableList.length > 0 && tableList.map(
                                                                (item,index) => {
                                                                    return  <li key={index}>{item.category_name}</li>
                                                                }
                                                            )
                                                        }
                                                    </div>
                                                    <div className="GridNavTable">
                                                        <table>
                                                            <thead>
                                                            <tr>
                                                                <th>类型</th>
                                                                <th>名称</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                tableList.length > 0 && tableList.map(
                                                                    (item,index) => {
                                                                        return (
                                                                            <Fragment key={index}>
                                                                                {
                                                                                    item.subsets.length > 0 && item.subsets.map(
                                                                                        (name,ele) => {
                                                                                            return  <tr key={ele}><td>{name.device_type}</td><td>{name.device_name}</td></tr>
                                                                                        }
                                                                                    )
                                                                                }
                                                                            </Fragment>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                :''
                                            }

                                        </div>
                                    </div>
                                    :''
                                }
                            </div>

                        </div>
                    </div>
                    :''
                }
                <div className="PageShow1 data4Show">
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

export default connect(mapState,mapDispatch)(ConfigData4);