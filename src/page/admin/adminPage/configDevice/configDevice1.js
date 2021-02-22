import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import axios from "axios";
import AddPic from "../../../../images/admin/adminAdd.png";
import $ from 'jquery';

class ConfigDevice1 extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            isLoading:false, //默认为false，当列表加载以后为true,解决第一次挂载数据为初始值空值
            List:{}, //类别管理列表一级
            enable:false, //点击编辑以后显示input框,false为不显示，true为显示
            Save:false, //编辑与否保存
            One:true,//一级菜单显示
            OneAdd:false,//类别管理一级添加
            uploadedFileGetUrl: AddPic,//设备添加图片
            mapDeviceName:'',//设备新增名称
            mapDeviceIntent:'',//设备标识
            isEnable: false,//设备新增状态
            Two:false,//二级菜单显示
            TwoAdd:false,//二级添加显示
            TwoChange:false,//二级修改显示
            TwoName:'',//二级菜单名字
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
            addTitle:'',//二级单个设备修改标题
            deleteNum:'',//删除那级
            deleteId:''//删除ID
        }
        ConfigDevice1.this = this;
        this.fileInputEl = React.createRef();//上传图片所需属性
        this.fileInputEl1 = React.createRef();//上传图片所需属性
        this.ListClick = this.ListClick.bind(this); //点击获取列表选项
        this.Edit = this.Edit.bind(this); //点击编辑 item为1是编辑类别管理一级列表，item为2是编辑类别管理二级列表
        this.Save = this.Save.bind(this);//点击保存  item为1是保存类别管理一级列表，item为2是保存类别管理二级列表
        this.handleCheck = this.handleCheck.bind(this); //item为1是编辑类别管理一级列表，item为2是编辑类别管理二级列表
        this.Add = this.Add.bind(this); //设备添加
        this.deviceSave = this.deviceSave.bind(this); //添加设备
        this.deviceSave1 = this.deviceSave1.bind(this); //二级菜单添加设备
        this.deviceSave2 = this.deviceSave2.bind(this); //二级菜单修改设备
        this.handlePhoto = this.handlePhoto.bind(this);//添加设备图片
        this.deviceName = this.deviceName.bind(this);//添加设备名称
        this.handleIsEnable = this.handleIsEnable.bind(this);//设备添加状态
        this.ReturnOne = this.ReturnOne.bind(this); //返回一级类别管理
        this.deviceTypeName = this.deviceTypeName.bind(this);//二级新增设备类型名称
        this.selectChange = this.selectChange.bind(this); //下拉框选择
        this.handleInfo = this.handleInfo.bind(this);//备注
        this.handleStyle = this.handleStyle.bind(this);//上图参数
        this.handleAddEnable = this.handleAddEnable.bind(this);//二级设备类型添加状态
        this.TwoListClick = this.TwoListClick.bind(this); //二级列表选项点击修改
        this.clickDeleted = this.clickDeleted.bind(this);//删除一级菜单
        this.PageDeletedDevice = this.PageDeletedDevice.bind(this);
        if(this.state.mapType.value === "model"){
            this.state.mapStyle={
                "url": "$serverURL$/gltf/qiangji.gltf",
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

    }
    componentDidMount() {
        //1.先获取设备类别
        this.onDevice();
        //删除本组件所有的右击事件
        document.oncontextmenu = function(){
            return false;
        }
    }
    //1.先获取设备类别
    onDevice(){
        axios.post(global.Url+'device/category/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    List:result,
                    isLoading:true,
                })

            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //编辑
    Edit(item){
        this.setState({
            Save:true,
            enable:true,
            OneAdd:false,
        })
        if(item === 2){
            this.setState({
                TwoAdd:false,
                TwoChange:false,
            })
        }
    }
    //编辑以后复选框改变状态
    handleCheck(index,itemEnable){
        console.log(index,itemEnable); //navItemList  先改变里面id为传值相等的id的enable的值，List
        var ItemEnable = !itemEnable;
        console.log(ItemEnable);
        this.setState({
            List: this.state.List.map((item, idx) => item.id === index ? {...item, 'enable': ItemEnable} : item),
        })
    }
    //保存
    Save(item){
        const {List} = this.state;
        var newList= [];
        for(var i=0; i<List.length; i++){
            var navItem = {id:List[i].id,enable:List[i].enable};
            newList.push(navItem)
        }
        if(item === 2){
            //console.log('二级菜单编辑内容')
            axios.post(global.Url+'device/type/updateEnable',newList).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    this.setState({
                        Save:false,
                        enable:false
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }else{
            axios.post(global.Url+'device/category/updateEnable',newList).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    this.setState({
                        Save:false,
                        enable:false
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    //添加设备按钮
    Add(item){
        if(item === 2){
            console.log(2);
            this.setState({
                TwoAdd:true,
                TwoChange:false,
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
                        "url": "$serverURL$/gltf/qiangji.gltf",
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
        }else{ //点击添加默认打开状态，内容为默认状态
            this.setState({
                OneAdd:true,
                uploadedFileGetUrl: AddPic,//设备添加图片
                mapDeviceName:'',//设备新增名称
                isEnable: false,//设备新增状态
            })
        }
    }
    //添加设备类型名称
    deviceTypeName = (event) => {
        this.setState({
            typeName: event.target.value
        });
    }
    //设备图片
    handlePhoto = async (event,item) => {
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
    //添加设备标识
    deviceIntentName = (event) => {
        this.setState({
            mapDeviceIntent: event.target.value
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
    deviceSave(categoryIcon,categoryName,mapDeviceIntent,enable){
        if(categoryIcon === AddPic){
            //alert('请选择图片')
            $(".PageShow").show().find('h1').html("请选择图片!");
            global.Time();
        }else if(!categoryName){
            //alert("请输入设备名称")
            $(".PageShow").show().find('h1').html("请输入设备名称!");
            global.Time();
        }else if(!mapDeviceIntent){
            //alert("请输入设备标识")
            $(".PageShow").show().find('h1').html("请输入设备标识!");
            global.Time();
        }else{
            //console.log(categoryIcon,categoryName,enable);
            axios.post(global.Url+'device/category/add',{
                category_icon:categoryIcon,
                category_name:categoryName,
                category_intent:mapDeviceIntent,
                enable:enable,
                remark:categoryName
            }).then((res) => {
                const result = res.data.data;
                if(result) {
                    this.onDevice();
                    this.setState({
                        OneAdd:false
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }


            })
        }

    }
    //2.点击列表选项
    ListClick(id,categoryName){
        console.log(id);
        sessionStorage.setItem('categoryId',id);
        this.setState({
            One:false,
            Two:true,
            OneAdd:false,
            TwoName:categoryName
        })
        axios.post(global.Url+'device/type/list',{category_id:id}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    List:result
                })
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //返回一级类别
    ReturnOne(){
        this.onDevice();
        this.setState({
            One:true,
            OneAdd:false,
            OneName:'',
            Two:false,
            TwoAdd:false,
            TwoChange:false
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
            ConfigDevice1.this.setState({
                mapStyle: {
                    "url": "$serverURL$/gltf/qiangji.gltf",
                    "height": 3,
                    "scale": 2
                }
            })
        }else if(newSelect.value === "point"){
            ConfigDevice1.this.setState({
                mapStyle: '2'
            })
        }else if(newSelect.value === "polyline"){
            ConfigDevice1.this.setState({
                mapStyle: '3'
            })
        }else if(newSelect.value === "polygon"){
            ConfigDevice1.this.setState({
                mapStyle: '4'
            })
        }else if(newSelect.value === "wall"){
            ConfigDevice1.this.setState({
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
            mapStyle:JSON.parse(e.target.value)
        })
    }
    //二级设备类型状态
    handleAddEnable=(event)=>{
        //获取单选框选中的值
        this.setState(prevState => ({
            addEnable: !prevState.addEnable
        }));
    }
    //添加成功以后加载页面
    NavList(){
        var categoryId=sessionStorage.getItem('categoryId');
        axios.post(global.Url+'device/type/list',{category_id:categoryId}).then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    List:result
                })
            }else{
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    deviceSave1(typeName,typeIcon,mapIcon,mapTypeText,mapStyle,addRemark,addEnable){  //下拉菜单选择为空对应的参数为空没写
        var a=JSON.stringify(mapStyle);
        console.log(a);
        if(!typeName){
            //alert("请输入类型名称")
            $(".PageShow").show().find('h1').html("请输入类型名称!");
            global.Time();
        }else if(typeIcon === AddPic){
            //alert("请选择类型图标")
            $(".PageShow").show().find('h1').html("请选择类型图标!");
            global.Time();
        }else if(mapIcon === AddPic){
            //alert("请选择展示图标")
            $(".PageShow").show().find('h1').html("请选择展示图标!");
            global.Time();
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
                    this.NavList();
                    this.setState({
                        TwoAdd:false
                        //newNavChangeBox:false,
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }

            })
        }

    }
    //修改单独的设备保存
    deviceSave2(typeName,typeIcon,mapIcon,mapTypeText,mapStyle,addRemark,addEnable){  //下拉菜单选择为空对应的参数为空没写
        if(!typeName){
            //alert("请输入类型名称")
            $(".PageShow").show().find('h1').html("请输入类型名称!");
            global.Time();
        }else if(typeIcon === AddPic){
            //alert("请选择类型图标")
            $(".PageShow").show().find('h1').html("请选择类型图标!");
            global.Time();
        }else if(mapIcon === AddPic){
            //alert("请选择展示图标")
            $(".PageShow").show().find('h1').html("请选择展示图标!");
            global.Time();
        }else{
            console.log(typeName,typeIcon,mapIcon,mapTypeText,mapStyle,addRemark,addEnable);
            var changeId=sessionStorage.getItem('changeId');
            console.log(mapStyle)
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
                    this.NavList();
                    this.setState({
                        TwoAdd:false,
                        TwoChange:false,
                    })
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }

    }
    //点击二级菜单修改单个
    TwoListClick(id,Name){
        console.log(id);
        this.setState({
            TwoChange:true,
            TwoAdd:false,
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
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })

    }
    //鼠标右击事件
    onContextMenu(id,num){
        if(num===1){
            $("#test"+id).find('.Alert').css('display',"block");
            $("#test"+id).siblings().find('.Alert').css('display','none');
        }else if(num===2){
            $("#testTwo"+id).find('.Alert').css('display',"block");
            $("#testTwo"+id).siblings().find('.Alert').css('display','none');
        }

    }
    //删除菜单
    clickDeleted(e,id,num){
        e.stopPropagation(); //阻止上级事件 或者e.preventDefault();
        $(".device1Show").show();
        ConfigDevice1.this.setState({
            deleteNum:num,
            deleteId:id
        })
    }
    PageDeletedDevice(){
        $(".device1Show").hide();
        const {deleteNum,deleteId} = this.state;
        if(deleteNum===1){
            axios.post(global.Url+'device/category/delete',{id:deleteId}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    $(".PageShow").show().find('h1').html("删除成功!");
                    global.Time();
                    this.onDevice();
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }else if(deleteNum===2){
            axios.post(global.Url+'device/type/delete',{id:deleteId}).then((res) => {
                const result = res.data.data;
                if(result) {
                    console.log(result);
                    this.NavList();
                }else{
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }
    }
    render(){
        const {isLoading,List,enable,Save,One,OneAdd,uploadedFileGetUrl,mapDeviceName,isEnable,Two,TwoName,TwoAdd,
            typeName,typeIcon,mapIcon,addEnable,mapType,mapStyle,addRemark,addTitle,TwoChange,mapDeviceIntent} = this.state;
        const{navClick} = this.props;
        return(
            <Fragment>
                { isLoading
                   ?
                    <div>
                        {One
                            ?
                            <div className="configShow" style={{'width':'500px'}}>
                                <div className="configShowNav">类别管理 <i onClick={() => navClick(100)}></i></div>
                                <div className="configShowConent">
                                    <h1 className='cur'>设备类别</h1>
                                    <div className="device">
                                        {
                                            List.length > 0 && List.map(
                                                (item,index) => {
                                                    return <li key={index} className={!item.enable ? 'Grayscale' : ''} onClick={!enable ? () => this.ListClick(item.id,item.category_name) :''} id={'test'+item.id} onContextMenu={()=>this.onContextMenu(item.id,1)}>
                                                        <img src={item.category_icon} alt=""/><span>{item.category_name}</span>
                                                        { enable ?
                                                            (item.enable ?
                                                                    <input type="checkbox"  value = {item.category_name || false } readOnly checked='checked' onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                                    :
                                                                    <input type="checkbox"  value = {item.category_name || false } readOnly onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                            )
                                                            : ''
                                                        }
                                                        <div className="Alert" style={{'display':'none'}}>
                                                            <button onClick={(e) =>this.clickDeleted(e,item.id,1)}>删除</button>
                                                        </div>
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
                        {OneAdd
                            ?
                            <div className="configShow Basic"  style = { { marginLeft: '520px'} }>
                                <div className="configShowNav">设备添加 <i onClick={() => navClick(101)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont DevicePic">
                                        <li><span>设备图标：</span>
                                            <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,1)} />
                                            <em onClick={() => {this.fileInputEl.current.click()}}><img src={uploadedFileGetUrl} alt=""/></em>
                                        </li>
                                        <li><span>设备名称：</span><input type="text" value={mapDeviceName} onChange={(e) => this.deviceName(e)} /></li>
                                        <li><span>设备标识：</span><input type="text" value={mapDeviceIntent} onChange={(e) => this.deviceIntentName(e)} /></li>
                                        <li><span>状态：</span><input type="checkbox" checked={isEnable} onChange={() => this.handleIsEnable()} /></li>
                                    </div>
                                    <div className="configBut" style={{marginTop:'35px'}}>
                                        <button onClick={() => this.deviceSave(uploadedFileGetUrl,mapDeviceName,mapDeviceIntent,isEnable)}>添加</button>
                                        <button onClick={() => navClick(101)}>关闭</button>
                                    </div>
                                </div>
                            </div>
                            :''
                        }
                        {Two  //二级菜单显示
                            ?
                            <div className="configShow" style={{'width':'500px'}}>
                                <div className="configShowNav">类别管理 <i onClick={() => navClick(100)}></i></div>
                                <div className="configShowConent">
                                    <h1 className='cur'><em onClick={()=>this.ReturnOne()}>设备类别</em> >> {TwoName}</h1>
                                    <div className="device">
                                        {
                                            List.length > 0 && List.map(
                                                (item,index) => {
                                                    return <li key={index} className={!item.enable ? 'Grayscale' : ''} onClick={!enable ? () => this.TwoListClick(item.id,item.type_name) : ''} id={'testTwo'+item.id} onContextMenu={()=>this.onContextMenu(item.id,2)}>
                                                        <img src={item.type_icon} alt=""/><span>{item.type_name}</span>
                                                        { enable ?
                                                            (item.enable ?
                                                                    <input type="checkbox"  value = {item.type_name || false } readOnly checked='checked' onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                                    :
                                                                    <input type="checkbox"  value = {item.type_name || false } readOnly onChange={() => this.handleCheck(item.id,item.enable)}/>
                                                            )
                                                            : ''
                                                        }
                                                        <div className="Alert" style={{'display':'none'}}>
                                                            <button onClick={(e) =>this.clickDeleted(e,item.id,2)}>删除</button>
                                                        </div>
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
                        {TwoAdd //二级设备添加显示
                            ?
                            <div className="configShow Basic"  style = { { marginLeft: '520px'} }>
                                <div className="configShowNav">{TwoName}添加 <i onClick={() => navClick(101)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont DevicePic">
                                        <li><span>类型名称：</span><input type="text" value={typeName} onChange={(event) => this.deviceTypeName(event)} /></li>
                                        <li><span>类型图标：</span>
                                            <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,2)} />
                                            <em onClick={() => {this.fileInputEl.current.click()}}><img style={{'marginLeft':'0'}} src={typeIcon} alt=""/></em>
                                        </li>
                                        <li><span>展示图标：</span>
                                            <input type="file" ref={this.fileInputEl1} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,3)} />
                                            <em onClick={() => {this.fileInputEl1.current.click()}}><img style={{'marginLeft':'0'}} src={mapIcon} alt=""/></em>
                                        </li>
                                        <li><span>展示方式：</span>
                                            <select
                                                onChange={this.selectChange}
                                                className='AddSelect'
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
                                        <li><span>上图参数：</span><textarea className='AddTextarea' value={JSON.stringify(mapStyle)} onChange={this.handleStyle} /></li>
                                        <li><span>备注：</span><textarea className='AddTextarea' style={{'height':'30px'}} defaultValue={addRemark} onChange={this.handleInfo}></textarea></li>
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
                        {TwoChange //二级设备修改显示
                            ?
                            <div className="configShow Basic"  style = { { marginLeft: '520px'} }>
                                <div className="configShowNav">{addTitle}修改 <i onClick={() => navClick(101)}></i></div>
                                <div className="configShowConent">
                                    <div className="configShowConent_cont DevicePic">
                                        <li><span>类型名称：</span><input type="text" value={typeName} onChange={(event) => this.deviceTypeName(event)} /></li>
                                        <li><span>类型图标：</span>
                                            <input type="file" ref={this.fileInputEl} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,2)} />
                                            <em onClick={() => {this.fileInputEl.current.click()}}><img style={{'marginLeft':'0'}} src={typeIcon} alt=""/></em>
                                        </li>
                                        <li><span>展示图标：</span>
                                            <input type="file" ref={this.fileInputEl1} accept=".jpg,.jpeg,.png"	hidden onChange={(event) => this.handlePhoto(event,3)} />
                                            <em onClick={() => {this.fileInputEl1.current.click()}}><img style={{'marginLeft':'0'}} src={mapIcon} alt=""/></em>
                                        </li>
                                        <li><span>展示方式：</span>
                                            <select
                                                onChange={this.selectChange}
                                                className='AddSelect'
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
                                        <li><span>上图参数：</span><textarea className='AddTextarea' value={JSON.stringify(mapStyle)} onChange={this.handleStyle}></textarea></li>
                                        <li><span>备注：</span><textarea className='AddTextarea' style={{'height':'30px'}} defaultValue={addRemark} onChange={this.handleInfo}></textarea></li>
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
                <div className="PageShow1 device1Show">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={()=>this.PageDeletedDevice()}>确定</button><button onClick={()=>global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapDispatch = () => ({
    navClick(id) {
        console.log(id);
        ConfigDevice1.this.setState({
            One:false,
            OneAdd:false,
            Two:false,
            TwoAdd:false,
            TwoChange:false,
        })
        if(id === 101){
            if(ConfigDevice1.this.state.OneAdd){
                ConfigDevice1.this.setState({
                    One:true,
                    OneAdd:false,
                    Two:false,
                    TwoAdd:false,
                    TwoChange:false,
                })
            }else{
                ConfigDevice1.this.setState({
                    One:false,
                    Two:true,
                    OneAdd:false,
                    TwoAdd:false,
                    TwoChange:false,
                })
            }
        }
    },
});

export default connect(null,mapDispatch)(ConfigDevice1);