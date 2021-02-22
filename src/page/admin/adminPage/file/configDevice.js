import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import AddPic from '../../../../images/admin/adminAdd.png'
import axios from "axios";
import ConfigDevice1 from "./configDevice1";

class ConfigDevice extends PureComponent{
    constructor(props){
        super(props);
        ConfigDevice.this = this;
        this.state = {
            Nav:true,//下拉导航显示
            navItem:0, //下拉菜单id,id为1是类别管理，id为,2是设备上图
            navItemList:[{}], //类别管理列表
            Save:false, //编辑与否保存
            enable:false, //点击编辑以后显示input框,false为不显示，true为显示
            newBox:false, //一级编辑里面的新增
            addList:[], //新增的改变的input复选框列表
            uploadedFileGetUrl: AddPic,//设备添加图片
            mapDeviceName:'',//设备新增名称
            isEnable: false,//设备新增状态
            navItemShow:true,//一级菜单显示
            navShow:false,//二级菜单显示
            navName:'',//二级菜单名字
            newNavBox:false, //二级编辑里面的新增
            newNavChangeBox:false, //二级编辑里面的修改
            typeName:'',//二级新增设备类型名称
            typeIcon:AddPic,//二级新增设备类型图标
            mapIcon:AddPic,//二级新增设备类型图标展示
            addEnable:false,//二级新增设备类型状态
            mapType: {
                ls: [{value:"model",text:"模型"},{value:"point",text:"点"},{value:"polyline",text:"折线"},{value:"polygon",text:"多边形面"},{value:"wall",text:"立体墙"}],
                value: 'model',
                text: "模型"
            },//二级新增设备类展示方式下拉
            mapStyle:'',//二级新增设备类展示方式的参数
            addRemark:'',//二级新增设备类型备注
            addTitle:''//二级单个设备修改标题
        }
        if(this.state.mapType.value === "model"){
            this.state.mapStyle={
                    "utl": "$serverURL$/gltf/qiangji.gltf",
                    "height": 3,
                    "scale": 2
            }
        }else if(this.state.mapType.value === "point"){
            this.state.mapStyle="2"
        }else if(this.state.mapType.value === "polyline"){
            this.state.mapStyle="3"
        }else if(this.state.mapType.value === "polygon"){
            this.state.mapStyle="4"
        }else if(this.state.mapType.value === "wall"){
            this.state.mapStyle="5"
        }
        this.fileInputEl = React.createRef();
        this.fileInputEl1 = React.createRef();
        this.navItemClick = this.navItemClick.bind(this); //下拉菜单切换
        this.Edit = this.Edit.bind(this); //编辑
        this.handleCheck = this.handleCheck.bind(this); //点击选中
        this.Save = this.Save.bind(this); //保存
        this.Add = this.Add.bind(this); //设备添加
        this.deviceSave = this.deviceSave.bind(this); //添加设备
        this.deviceSave1 = this.deviceSave1.bind(this); //二级菜单添加设备
        this.deviceSave2 = this.deviceSave2.bind(this); //二级菜单修改设备
        this.handlePhoto = this.handlePhoto.bind(this);//添加设备图片
        this.deviceName = this.deviceName.bind(this);//添加设备名称
        this.handleIsEnable = this.handleIsEnable.bind(this);//设备添加状态
        this.ReturnNav = this.ReturnNav.bind(this);//类别返回
        this.liNav = this.liNav.bind(this);//类别二级菜单
        this.deviceTypeName = this.deviceTypeName.bind(this);//二级新增设备类型名称
        this.selectChange = this.selectChange.bind(this); //下拉框选择
        this.handleInfo = this.handleInfo.bind(this);//备注
        this.handleStyle = this.handleStyle.bind(this);//上图参数
        this.handleAddEnable = this.handleAddEnable.bind(this);//二级设备类型添加状态
        this.changeNav = this.changeNav.bind(this);//二级设备点击修改
    }
    //下拉菜单切换
    List(){
        axios.post(global.Url+'device/category/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    navItemList:result
                })
                console.log(this.state.navItemList);

            }else{
                alert(res.msg)
            }
        })
    }
    navItemClick(item){
        this.setState({
            navItem:item
        })
        debugger
        if(item === 1){
            this.List();
            ConfigDevice.this.setState({
                Nav:false,
                navItemShow:true,
                navShow:false,
                newBox:false,
                newNavBox:false,
                newNavChangeBox:false,
            })
        }else if(item === 2){
            ConfigDevice.this.setState({
                Nav:false,
                navItemShow:true,
                navShow:false,
                newBox:false,
                newNavBox:false,
                newNavChangeBox:false,
            })
        }
    }
    //编辑
    Edit(item){
        this.setState({
            Save:true,
            enable:true,
            newBox:false
        })
        if(item === 2){
            this.setState({
                newNavBox:false,
                newNavChangeBox:false,
            })
        }
    }
    //复选框改变状态
    handleCheck(index,itemEnable){
        console.log(index,itemEnable); //navItemList  先改变里面id为传值相等的id的enable的值，在重新赋值navItemList
        var ItemEnable = !itemEnable;
        console.log(ItemEnable);
        this.setState({
            navItemList: this.state.navItemList.map((item, idx) => item.id === index ? {...item, ['enable']: ItemEnable} : item),
        })

    }
    //保存
    Save(item){
        const {navItemList} = this.state;
        console.log(navItemList);
        var list= [];
        for(var i=0; i<navItemList.length; i++){
            var navItem = {id:navItemList[i].id,enable:navItemList[i].enable};
            list.push(navItem)
        }
        console.log(list);
        if(item === 2){
            //console.log('二级菜单编辑内容')
            axios.post(global.Url+'device/type/updateEnable',list).then((res) => {
                const result = res.data.data;
                debugger
                if(result) {
                    console.log(result);
                    this.setState({
                        Save:false,
                        enable:false
                    })
                }else{
                    alert(res.msg)
                }
            })
        }else{
            axios.post(global.Url+'device/category/updateEnable',list).then((res) => {
                const result = res.data.data;
                debugger
                if(result) {
                    console.log(result);
                    this.setState({
                        Save:false,
                        enable:false
                    })
                }else{
                    alert(res.msg)
                }
            })
        }
    }
    //添加设备按钮
    Add(item){
        if(item === 2){
            console.log(2);
            this.setState({
                newNavBox:true,
                newNavChangeBox:false,
                typeName:'',
                typeIcon:AddPic,
                mapIcon:AddPic,
                addEnable:false,//二级新增设备类型状态
                mapType: {
                    ls: [{value:"model",text:"模型"},{value:"point",text:"点"},{value:"polyline",text:"折线"},{value:"polygon",text:"多边形面"},{value:"wall",text:"立体墙"}],
                    value: 'model',
                    text: "模型"
                },//二级新增设备类展示方式下拉
                mapStyle:'',//二级新增设备类展示方式的参数
                addRemark:'',//二级新增设备类型备注
            })
            if(this.state.mapType.value === "model"){
                this.setState({
                    mapStyle:{
                        "utl": "$serverURL$/gltf/qiangji.gltf",
                        "height": 3,
                        "scale": 2
                    }
                })
            }else if(this.state.mapType.value === "point"){
                this.setState({
                    mapStyle:2
                })
            }else if(this.state.mapType.value === "polyline"){
                this.setState({
                    mapStyle:3
                })
            }else if(this.state.mapType.value === "polygon"){
                this.setState({
                    mapStyle:4
                })
            }else if(this.state.mapType.value === "wall"){
                this.setState({
                    mapStyle:5
                })
            }
        }else{
            this.setState({
                newBox:true
            })
        }
    }
    //设备图片
    handlePhoto = async (event,item) => {
        debugger
        var imgFile;
        let reader = new FileReader();     //html5读文件
        reader.readAsDataURL(event.target.files[0]);
        var that=this;
        reader.onload=function(event) {        //读取完毕后调用接口
            imgFile = event.target.result;
            if(item === 1){
                console.log(1)
                that.setState({
                    uploadedFileGetUrl:imgFile
                })
            }else if(item === 2){
                console.log(2)
                that.setState({
                    typeIcon:imgFile
                })
            }else if(item === 3){
                console.log(3)
                that.setState({
                    mapIcon:imgFile
                })
            }

        }
    }
    //添加设备名称
    deviceName = (event) => {
        this.setState({
            mapDeviceName: event.target.value
        });
    }
    //选取新增设备状态
    handleIsEnable=(event)=>{
        //获取单选框选中的值
        this.setState(prevState => ({
            isEnable: !prevState.isEnable
        }));
    }
    //添加设备保存
    deviceSave(categoryIcon,categoryName,enable){
        if(categoryIcon === AddPic){
            alert('请选择图片')
        }else if(!categoryName){
            alert("请输入设备名称")
        }else{
            //console.log(categoryIcon,categoryName,enable);
            axios.post(global.Url+'device/category/add',{
                category_icon:categoryIcon,
                category_name:categoryName,
                category_intent:'camera',
                enable:enable,
                remark:categoryName
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    debugger
                    this.List();
                    this.setState({
                        newBox:false
                    })
                }else{
                    alert(res.msg)
                }


            })
        }

    }
    //添加成功以后加载页面
    NavList(){
        var categoryId=sessionStorage.getItem('categoryId');
        axios.post(global.Url+'device/type/list',{category_id:categoryId}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    navItemList:result
                })
            }else{
                alert(res.msg)
            }
        })
    }
    deviceSave1(typeName,typeIcon,mapIcon,mapTypeText,mapStyle,addRemark,addEnable){  //下拉菜单选择为空对应的参数为空没写
        var a=JSON.stringify(mapStyle);
        console.log(a);
        debugger
        if(!typeName){
            alert("请输入类型名称")
        }else if(typeIcon === AddPic){
            alert("请选择类型图标")
        }else if(mapIcon === AddPic){
            alert("请选择展示图标")
        }else{
            console.log(typeName,typeIcon,mapIcon,mapTypeText,mapStyle,addRemark,addEnable);
            var categoryId=sessionStorage.getItem('categoryId');
            //sessionStorage.setItem('categoryId',id);
            axios.post(global.Url+'device/type/add',{
                type_name:typeName,
                type_icon:typeIcon,
                category_id:categoryId,
                map_icon:mapIcon,
                map_type:mapTypeText,
                map_style:mapStyle,
                remark:typeName,  //默认为addRemark是空的，现在写的是名称
                enable:addEnable,
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    debugger
                    this.NavList();
                    this.setState({
                        newNavBox:false
                        //newNavChangeBox:false,
                    })
                }else{
                    alert(res.msg)
                }

            })
        }

    }
    //修改单独的设备保存
    deviceSave2(typeName,typeIcon,mapIcon,mapTypeText,mapStyle,addRemark,addEnable){  //下拉菜单选择为空对应的参数为空没写
        debugger
        if(!typeName){
            alert("请输入类型名称")
        }else if(typeIcon === AddPic){
            alert("请选择类型图标")
        }else if(mapIcon === AddPic){
            alert("请选择展示图标")
        }else{
            console.log(typeName,typeIcon,mapIcon,mapTypeText,mapStyle,addRemark,addEnable);
            var changeId=sessionStorage.getItem('changeId');
            var data={
                type_name:typeName,
                type_icon:typeIcon,
                id:changeId,
                map_icon:mapIcon,
                map_type:mapTypeText,
                map_style:mapStyle,
                remark:typeName,  //默认为addRemark是空的，现在写的是名称
                enable:addEnable
            }
            console.log(data);
            //sessionStorage.setItem('categoryId',id);
            axios.post(global.Url+'device/type/update',{
                type_name:typeName,
                type_icon:typeIcon,
                id:changeId,
                map_icon:mapIcon,
                map_type:mapTypeText,
                map_style:mapStyle,
                remark:typeName,  //默认为addRemark是空的，现在写的是名称
                enable:addEnable,
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    debugger
                    this.NavList();
                    this.setState({
                        newNavBox:false,
                        newNavChangeBox:false,
                    })
                }else{
                    alert(res.msg)
                }
            })
        }

    }
    //类别返回
    ReturnNav(){
        this.List();
        this.setState({
            navItemShow:true,
            navShow:false,
            navName:'',
            newNavBox:false,
            newNavChangeBox:false,
        })
    }
    //添加设备类型名称
    deviceTypeName = (event) => {
        this.setState({
            typeName: event.target.value
        });
    }
    //二级下来菜单
    liNav(id,categoryName){
        console.log(id);
        sessionStorage.setItem('categoryId',id);
        this.setState({
            navItemShow:false,
            navShow:true,
            newBox:false,
            navName:categoryName
        })
        axios.post(global.Url+'device/type/list',{category_id:id}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    navItemList:result
                })
            }else{
                alert(res.msg)
            }
        })
    }
    //下拉框选择
    selectChange (e) {
        e.preventDefault();
        console.log(e.target);
        let optionDom = e.target.options[e.target.selectedIndex];
        let v = optionDom.value,
            t = optionDom.text;
        let newSelect = {
            ls: this.state.mapType.ls,
            value: v,
            text: t
        }
        this.setState({
            mapType: newSelect
        })
        if(newSelect.value === "model"){
            ConfigDevice.this.setState({
                mapStyle: {
                    "utl": "$serverURL$/gltf/qiangji.gltf",
                    "height": 3,
                    "scale": 2
                }
            })
        }else if(newSelect.value === "point"){
            ConfigDevice.this.setState({
                mapStyle: '2'
            })
        }else if(newSelect.value === "polyline"){
            ConfigDevice.this.setState({
                mapStyle: '3'
            })
        }else if(newSelect.value === "polygon"){
            ConfigDevice.this.setState({
                mapStyle: '4'
            })
        }else if(newSelect.value === "wall"){
            ConfigDevice.this.setState({
                mapStyle: '5'
            })
        }
    }
    //备注
    handleInfo=(e)=>{
        this.setState({
            addRemark:e.target.value
        })
    }
    //上图参数
    handleStyle=(e) => {
        this.setState({
            mapStyle:e.target.value
        })
    }
    //二级设备类型状态
    handleAddEnable=(event)=>{
        //获取单选框选中的值
        this.setState(prevState => ({
            addEnable: !prevState.addEnable
        }));
    }
    //二级点击修改单个
    changeNav(id,Name){
        console.log(id);
        this.setState({
            newNavChangeBox:true,
            newNavBox:false,
            typeName:Name
        })
        axios.post(global.Url+'device/type',{id:id}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                sessionStorage.setItem('changeId',id);
                this.setState({
                    typeName:result.type_name,
                    typeIcon:result.type_icon,
                    mapIcon:result.map_icon,
                    addEnable:result.enable,//二级新增设备类型状态
                    mapType: {
                        ls: [{value:"model",text:"模型"},{value:"point",text:"点"},{value:"polyline",text:"折线"},{value:"polygon",text:"多边形面"},{value:"wall",text:"立体墙"}],
                        value: result.map_type,
                        text: "模型"
                    },//二级新增设备类展示方式下拉
                    mapStyle:result.map_style,//二级新增设备类展示方式的参数
                    addRemark:result.remark,//二级新增设备类型备注
                    addTitle:result.type_name
                })
            }else{
                alert(res.msg)
            }
        })

    }
    render(){
        const {Nav,navItem,navItemList,Save,enable,mapDeviceName,isEnable,uploadedFileGetUrl,newBox,navItemShow,navShow,navName,newNavBox,
            typeName,typeIcon,mapIcon,addEnable,mapType,mapStyle,addRemark,newNavChangeBox,addTitle} = this.state;
        const{adminItem,navClick,adminIndex} = this.props;
        return(
            <Fragment>
                <li className={adminItem === 4 ? 'cur' : ''} onClick={ () => navClick(4,1)}>设备配置</li>
                {adminItem === 4 && Nav
                    ?
                    <div className="navItem">
                        <li className={navItem === 1 ? 'cur' : ''} onClick={() => this.navItemClick(1)}>类别管理</li>
                        <li className={navItem === 2 ? 'cur' : ''} onClick={() => this.navItemClick(2)}>设备上图</li>
                    </div>
                    :""
                }
                {navItem === 1 && adminIndex === 1
                    ?
                    <div>
                        {navItemShow  //一级菜单显示
                            ?
                            <div className="configShow">
                                <div className="configShowNav">类别管理 <i onClick={() => navClick(100)}></i></div>
                                <div className="configShowConent">
                                    <h1>设备类别</h1>
                                    <div className="device">
                                        {
                                            navItemList.length > 0 && navItemList.map(
                                                (item,index) => {
                                                    return <li key={index} className={!item.enable ? 'Grayscale' : ''} onClick={navItemShow && !enable ? () => this.liNav(item.id,item.category_name) :''}><img src={item.category_icon} alt=""/>{item.category_name}
                                                        { enable ?
                                                            (item.enable ?
                                                                    <input type="checkbox"  value = {item.category_name || false } readOnly checked='checked' onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                                    :
                                                                    <input type="checkbox"  value = {item.category_name || false } readOnly onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                            )
                                                            : ''
                                                        }
                                                    </li>
                                                }
                                            )
                                        }
                                        {enable ? '' : <li onClick={() => this.Add(1)}><img src={AddPic} alt=""/>添加</li>}
                                    </div>
                                    <div className="configBut">{!Save?<button onClick={() =>this.Edit(1)}>编辑</button>:<button onClick={() => this.Save(1)}>保存</button>}</div>
                                </div>
                            </div>
                            :''
                        }
                        {navShow  //二级菜单显示
                            ?
                            <div className="configShow">
                                <div className="configShowNav">类别管理 <i onClick={() => navClick(100)}></i></div>
                                <div className="configShowConent">
                                    <h1><a onClick={()=>this.ReturnNav()}>设备类别</a> >> {navName}</h1>
                                    <div className="device">
                                        {
                                            navItemList.length > 0 && navItemList.map(
                                                (item,index) => {
                                                    return <li key={index} className={!item.enable ? 'Grayscale' : ''} onClick={navShow && !enable ? () => this.changeNav(item.id,item.type_name) : ''}><img src={item.type_icon} alt=""/>{item.type_name}
                                                        { enable ?
                                                            (item.enable ?
                                                                    <input type="checkbox"  value = {item.type_name || false } readOnly checked='checked' onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                                    :
                                                                    <input type="checkbox"  value = {item.type_name || false } readOnly onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                            )
                                                            : ''
                                                        }
                                                    </li>
                                                }
                                            )
                                        }
                                        {enable ? '' : <li onClick={() => this.Add(2)}><img src={AddPic} alt=""/>添加</li>}
                                    </div>
                                    <div className="configBut">{!Save?<button onClick={() =>this.Edit(2)}>编辑</button>:<button onClick={() => this.Save(2)}>保存</button>}</div>
                                </div>
                            </div>
                            :''
                        }
                        {newBox //一级设备添加显示
                            ?
                            <div className="configShow Basic"  style = { { marginLeft: '480px'} }>
                                <div className="configShowNav">设备添加 <i onClick={() => navClick(101)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont DevicePic">
                                        <li><span>设备图标：</span>
                                            <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,1)} />
                                            <a onClick={() => {this.fileInputEl.current.click()}}><img src={uploadedFileGetUrl} alt=""/></a>
                                        </li>
                                        <li><span>设备名称：</span><input type="text" value={mapDeviceName} onChange={(event) => this.deviceName(event)} /></li>
                                        <li><span>状态：</span><input type="checkbox" checked={isEnable} onChange={(e) => this.handleIsEnable(e)} /></li>
                                    </div>
                                    <div className="configBut" style={{marginTop:'35px'}}>
                                        <button onClick={() => this.deviceSave(uploadedFileGetUrl,mapDeviceName,isEnable)}>添加</button>
                                        <button onClick={() => navClick(101)}>关闭</button>
                                    </div>
                                </div>
                            </div>
                            : ''
                        }
                        {newNavBox //二级设备添加显示
                            ?
                            <div className="configShow Basic"  style = { { marginLeft: '480px'} }>
                                <div className="configShowNav">{navName}添加 <i onClick={() => navClick(101)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont DevicePic">
                                        <li><span>类型名称：</span><input type="text" value={typeName} onChange={(event) => this.deviceTypeName(event)} /></li>
                                        <li><span>类型图标：</span>
                                            <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,2)} />
                                            <a onClick={() => {this.fileInputEl.current.click()}}><img src={typeIcon} alt=""/></a>
                                        </li>
                                        <li><span>展示图标：</span>
                                            <input type="file" ref={this.fileInputEl1} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,3)} />
                                            <a onClick={() => {this.fileInputEl1.current.click()}}><img src={mapIcon} alt=""/></a>
                                        </li>
                                        <li><span>展示方式：</span>
                                            <select
                                                onChange={this.selectChange}
                                                value = {mapType.value}>
                                                {
                                                    mapType.ls.map((item,i) => {
                                                        return (
                                                            <option key={"op"+i} index={i} value={item.value}>{item.text}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </li>
                                        <li><span>上图参数：</span><textarea value={JSON.stringify(mapStyle)} onChange={this.handleStyle} /></li>
                                        <li><span>备注：</span><textarea defaultValue={addRemark} onChange={this.handleInfo}></textarea></li>
                                        <li><span>状态：</span><input type="checkbox" checked={addEnable} onChange={(e) => this.handleAddEnable(e)} /></li>
                                    </div>
                                    <div className="configBut" style={{marginTop:'35px'}}>
                                        <button onClick={() => this.deviceSave1(typeName,typeIcon,mapIcon,mapType.value,mapStyle,addRemark,addEnable)}>添加</button>
                                        <button onClick={() => navClick(101)}>关闭</button>
                                    </div>
                                </div>
                            </div>
                            : ''
                        }
                        {newNavChangeBox //二级设备修改显示
                            ?
                            <div className="configShow Basic"  style = { { marginLeft: '480px'} }>
                                <div className="configShowNav">{addTitle}修改 <i onClick={() => navClick(101)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont DevicePic">
                                        <li><span>类型名称：</span><input type="text" value={typeName} onChange={(event) => this.deviceTypeName(event)} /></li>
                                        <li><span>类型图标：</span>
                                            <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,2)} />
                                            <a onClick={() => {this.fileInputEl.current.click()}}><img src={typeIcon} alt=""/></a>
                                        </li>
                                        <li><span>展示图标：</span>
                                            <input type="file" ref={this.fileInputEl1} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,3)} />
                                            <a onClick={() => {this.fileInputEl1.current.click()}}><img src={mapIcon} alt=""/></a>
                                        </li>
                                        <li><span>展示方式：</span>
                                            <select
                                                onChange={this.selectChange}
                                                value = {mapType.value}>
                                                {
                                                    mapType.ls.map((item,i) => {
                                                        return (
                                                            <option key={"op"+i} index={i} value={item.value}>{item.text}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </li>
                                        <li><span>上图参数：</span><textarea value={JSON.stringify(mapStyle)} onChange={this.handleStyle}></textarea></li>
                                        <li><span>备注：</span><textarea defaultValue={addRemark} onChange={this.handleInfo}></textarea></li>
                                        <li><span>状态：</span><input type="checkbox" checked={addEnable} onChange={(e) => this.handleAddEnable(e)} /></li>
                                    </div>
                                    <div className="configBut" style={{marginTop:'35px'}}>
                                        <button onClick={() => this.deviceSave2(typeName,typeIcon,mapIcon,mapType.value,mapStyle,addRemark,addEnable)}>修改</button>
                                        <button onClick={() => navClick(101)}>关闭</button>
                                    </div>
                                </div>
                            </div>
                            : ''
                        }

                    </div>
                    :''
                }
                {navItem === 2 && adminIndex === 1
                    ?
                    <ConfigDevice1></ConfigDevice1>
                    :''
                }
            </Fragment>
        )
    }
}
const mapState = (state) => {
    return{
        adminItem:state.admin.get('adminItem'),
        adminIndex:state.admin.get('adminIndex')
    }
};
const mapDispatch = (dispatch) => ({
    //newBox:false, //一级编辑里面的新增 navItemShow:true,//一级菜单显示  navShow:false,//二级菜单显示  newNavBox:false, //二级编辑里面的新增
    navClick(id,item) {
        console.log(id);
        ConfigDevice.this.setState({
            Nav:true,
            navItemShow:false,
            navShow:false,
            newBox:false,
            newNavBox:false,
            newNavChangeBox:false,
        })
        if(id === 4){
            dispatch(actionCreators.nav_click(id,item));
        }else if(id===101){
            if(ConfigDevice.this.state.newBox){
                ConfigDevice.this.setState({
                    newBox:false,
                    navItemShow:true,
                })
            }else if(ConfigDevice.this.state.newNavBox){
                ConfigDevice.this.setState({
                    newNavBox:false,
                    navShow:true,
                })
            }else if(ConfigDevice.this.state.newNavChangeBox){
                ConfigDevice.this.setState({
                    newNavChangeBox:false,
                    navShow:true,
                })
            }else{
                ConfigDevice.this.setState({
                    Nav:false
                })
            }
        }

    },
});

export default connect(mapState,mapDispatch)(ConfigDevice);