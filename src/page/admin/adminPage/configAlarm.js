import React, { Fragment, PureComponent } from "react";
import { connect } from 'react-redux';
import { actionCreators } from "../store";
import axios from "axios";
import $ from "jquery";
import { Common } from "../../Cesium/method";

class ConfigAlarm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            SBList: {},//设备类别
            tableList: {},//表格列表
            OneList: true,//一级菜单
            TwoList: false,//二级菜单
            TwoName: '',//二级菜单名称
            AddAlarm: false,//添加报警弹框
            Name: '',//事件名称
            Level: 0,//事件等级
            isPush: false,//是否推送
            isLink: false,//是否联动
            isAlarm: false,//是否报警
            isWrite: false,//日志写入
            isEnable: false,//是否启用
            TwoChangeAlarm: false,//二级修改菜单
            deleteId: '',//删除id
            navItem: 0,//子菜单
            nav: false,
            TwoTree: [],//列表树结构
            LiandongList: [],//视频联动列表
            categoryId: "",
            addFlag: true,
            Listliandongitem: {},
            next: false,
            xzList: [],
        }
        ConfigAlarm.this = this;
        this.ListClick = this.ListClick.bind(this);//点击类别
        this.ReturnOne = this.ReturnOne.bind(this);//返回一级菜单
        this.AddAlarm = this.AddAlarm.bind(this);//添加报警处理
        this.Close = this.Close.bind(this);//关闭添加的报警处理
        this.syaName = this.syaName.bind(this);//事件名称的改变
        this.ChangeLevel = this.ChangeLevel.bind(this);//事件等级
        this.configSave = this.configSave.bind(this);//保存添加
        this.deleteList = this.deleteList.bind(this);//删除列表
        this.ChangeList = this.ChangeList.bind(this);//修改列表
        this.configSave1 = this.configSave1.bind(this);//修改保存
        this.PageDeleted = this.PageDeleted.bind(this);
    }
    componentDidMount() {
        this.onList();
    }
    //获取列表
    onList() {
        axios.post(global.Url + 'device/category/list', { enable: true }).then((res) => {
            const result = res.data.data;
            if (result) {
                console.log(result);
                this.setState({
                    SBList: result
                })
            } else {
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //获取二级菜单共用
    List() {
        axios.post(global.Url + 'event/type/list', { category_id: sessionStorage.getItem('TwoListId') })
            .then(function (res) {
                const result = res.data.data;
                if (result) {
                    console.log(result);
                    ConfigAlarm.this.setState({
                        tableList: result,
                    });
                } else {
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
    }
    //点击获取二级菜单
    ListClick(item, categoryName) {
        const navItem = this.state.navItem
        if (navItem === 1) {
            this.setState({
                OneList: false,
                TwoList: true,
                TwoName: categoryName,
                categoryId: item
            });
            sessionStorage.setItem('TwoListId', item);
            this.List();
        } else {
            this.ListTree(item, categoryName);
            this.setState({
                OneList: false,
                TwoList: true,
                TwoName: categoryName,
                categoryId: item,
                LiandongList: []
            });
            sessionStorage.setItem('TwoListId', item);
            axios.post(global.Url + 'business/resourcesMap', { category_id: item }).then((res) => {
                const results = res.data.data;
                console.log(results);
                if (results && res.data.msg === 'success') {
                    this.setState({
                        TwoTree: results
                    })
                } else {
                    //alert(res.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
        }

    }
    //点击返回一级列表
    ReturnOne() {
        this.onList();
        this.setState({
            OneList: true,//一级菜单
            TwoList: false,//二级菜单
            TwoName: '',//二级菜单名称
            AddAlarm: false,//添加报警弹框
        })
    }
    //添加报警处理
    AddAlarm() {
        this.setState({
            AddAlarm: true,
            TwoChangeAlarm: false,//二级修改菜单
            Name: '',//事件名称
            Level: 0,//事件等级
            isPush: false,//是否推送
            isLink: false,//是否联动
            isAlarm: false,//是否报警
            isWrite: false,//日志写入
            isEnable: false,//是否启用
        })
    }
    //关闭添加的报警处理
    Close() {
        this.setState({
            AddAlarm: false,
            TwoChangeAlarm: false,//二级修改菜单
        })
    }
    //事件名称
    syaName(e) {
        this.setState({
            Name: e.target.value
        })
    }
    //事件等级
    ChangeLevel = e => {
        e.preventDefault();
        console.log(e.target.value);
        this.setState({
            Level: e.target.value
        })
    }
    //是否推送
    handleIsPush() {
        this.setState({
            isPush: !this.state.isPush
        })
    }
    //是否联动
    handleIsLink() {
        this.setState({
            isLink: !this.state.isLink
        })
    }
    //是否报警
    handleIsAlarm() {
        this.setState({
            isAlarm: !this.state.isAlarm
        })
    }
    //写入日志
    handleIsWrite() {
        this.setState({
            isWrite: !this.state.isWrite
        })
    }
    //是否启用
    handleIsEnable() {
        this.setState({
            isEnable: !this.state.isEnable
        })
    }
    //保存添加
    configSave(Name, Level, isPush, isLink, isAlarm, isWrite, isEnable) {
        console.log(Name, Level, isPush, isLink, isAlarm, isWrite, isEnable);
        if (!Name) {
            //alert("请输入事件名称！")
            $(".PageShow").show().find('h1').html("请输入事件名称!");
            global.Time();
        } else if (Level === 0) {
            //alert('请选择事件等级!');
            $(".PageShow").show().find('h1').html("请选择事件等级!");
            global.Time();
        } else {
            axios.post(global.Url + 'event/type/add', {
                category_id: sessionStorage.getItem('TwoListId'),
                event_name: Name,
                event_level: Level,
                push_data: isPush,
                link_info: isLink,
                alarm_event: isAlarm,
                write_log: isWrite,
                enable: isEnable,
            })
                .then(function (res) {
                    const result = res.data.data;
                    if (result) {
                        console.log(result);
                        ConfigAlarm.this.List();
                        ConfigAlarm.this.setState({
                            OneList: false,//一级菜单
                            TwoList: true,//二级菜单
                            AddAlarm: false,//添加报警弹框
                        })
                    } else {
                        //alert(res.data.msg)
                        $(".PageShow").show().find('h1').html(res.data.msg);
                        global.Time();
                    }
                })
        }

    }
    //删除列表
    deleteList(item) {
        $(".AlarmShow").show();
        this.setState({
            deleteId: item
        })
    }
    PageDeleted() {
        $(".AlarmShow").hide();
        const { deleteId } = this.state;
        axios.post(global.Url + 'event/type/delete', { id: deleteId })
            .then(function (res) {
                const result = res.data.data;
                if (result) {
                    console.log(result);
                    ConfigAlarm.this.List();
                } else {
                    //alert(res.data.msg)
                    $(".PageShow").show().find('h1').html(res.data.msg);
                    global.Time();
                }
            })
    }
    //修改列表
    ChangeList(item, eventName, eventLevel, pushData, linkInfo, alarmEvent, writeLog, Enable) {
        console.log(item, eventName, eventLevel, pushData, linkInfo, alarmEvent, writeLog, Enable);
        sessionStorage.setItem('TwoListTwoId', item);
        ConfigAlarm.this.setState({
            OneList: false,//一级菜单
            TwoList: true,//二级菜单
            AddAlarm: false,//添加报警弹框
            TwoChangeAlarm: true,//二级修改菜单
            Name: eventName,//事件名称
            Level: eventLevel,//事件等级
            isPush: pushData,//是否推送
            isLink: linkInfo,//是否联动
            isAlarm: alarmEvent,//是否报警
            isWrite: writeLog,//日志写入
            isEnable: Enable,//是否启用
        })
    }
    //修改确定添加
    configSave1(Name, Level, isPush, isLink, isAlarm, isWrite, isEnable) {
        console.log(Name, Level, isPush, isLink, isAlarm, isWrite, isEnable);
        if (!Name) {
            //alert("请输入事件名称！")
            $(".PageShow").show().find('h1').html("请输入事件名称!");
            global.Time();
        } else if (Level === 0) {
            //alert('请选择事件等级!');
            $(".PageShow").show().find('h1').html("请选择事件等级!");
            global.Time();
        } else {
            axios.post(global.Url + 'event/type/update', {
                id: sessionStorage.getItem('TwoListTwoId'),
                event_name: Name,
                event_level: Level,
                push_data: isPush,
                link_info: isLink,
                alarm_event: isAlarm,
                write_log: isWrite,
                enable: isEnable,
            })
                .then(function (res) {
                    const result = res.data.data;
                    if (result) {
                        console.log(result);
                        ConfigAlarm.this.List();
                        ConfigAlarm.this.setState({
                            OneList: false,//一级菜单
                            TwoList: true,//二级菜单
                            AddAlarm: false,//添加报警弹框
                            TwoChangeAlarm: false,//二级修改菜单
                        })
                    } else {
                        //alert(res.data.msg)
                        $(".PageShow").show().find('h1').html(res.data.msg);
                        global.Time();
                    }
                })
        }

    }
    navItemClick(item) {
        this.setState({
            nav: false,
            navItem: item,
        })
    }
    ListTree(id, name) {
        // sessionStorage.setItem('TwoId',id);
        // sessionStorage.removeItem('ReginId');
        axios.post(global.Url + 'device/info/list', { on_map: true, category_id: id }).then((res) => {
            const result = res.data.data;
            if (result) {
                console.log(result, "我是树结构");
                if (result.length !== 0) {
                    ConfigAlarm.this.setState({
                        TwoTree: result,
                    })
                }
            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
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
            if (menuObj == null) {
                return;
            }
            vdom.push(
                <li key={menuObj} className='newMap' id={'newMap' + menuObj.id}>
                    <span onClick={(e) => this.onMenuClicked(e, menuObj)}>
                        {(() => {
                            switch (menuObj.node_type) {
                                case 'grid_region':
                                    return <i className='rightjt'></i>;
                                case 'grid_info':
                                    return <i className='rightjt'></i>;
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
                        {/* {menuObj.node_type==='device_info'?'':<em>
                            {menuObj.count}
                        </em>} */}
                    </span>

                    {this.generateMenu(menuObj.children)}
                </li>
            );
        }
        return vdom;
    }
    generateMenuLd(menuObj) {
        let vdom = [];
        if (menuObj instanceof Array) {
            let list = [];
            for (var item of menuObj) {
                list.push(this.generateMenuLd(item));
            }
            vdom.push(
                <ul key="single">
                    {list}
                </ul>
            );
        } else {
            if (menuObj == null) {
                return;
            }
            vdom.push(
                <li key={menuObj} className='newMap' id={'newMap2' + menuObj.id}>
                    <span style={{ color: menuObj.node_type === 'device_info' && menuObj.linkage ? "#268ae4" : "white" }}>
                        {(() => {
                            switch (menuObj.node_type) {
                                case 'grid_region':
                                    return <i className='rightjt'></i>;
                                case 'grid_info':
                                    return <i className='rightjt'></i>;
                                case 'device_info':
                                    return <i className='details'></i>;
                                default:
                                    return null;
                            }
                        })()}
                        <input type="checkbox" onChange={(e) => this.checkboxBtn(e, menuObj, 0)} checked={menuObj.linkage} />
                        <span onClick={(e) => this.onMenuClickedLd(e, menuObj)}>{(() => {
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
                        })()}</span>
                        {/* {menuObj.node_type==='device_info'?'':<em>
                            {menuObj.count}
                        </em>} */}
                    </span>

                    {this.generateMenuLd(menuObj.children)}
                </li>
            );
        }
        return vdom;
    }
    onMenuClickedLd(ev, name) {
        ev.stopPropagation();
        // 被点击的<h1>
        let node = $(ev.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.parent("span").siblings('ul');

        // 显示/隐藏这个列表
        //subMenu.css("display",'none');
        subMenu.css("display", subMenu.css('display') === "none" ? "block" : "none");
        console.log(name.node_type, "name.node_type")
        if (name.node_type === 'device_info') {
            console.log('我是子类')
            this.checkboxBtn(ev, name, 1)
            // this.Listliandong(name, name.device_code)
        } else {
            if (subMenu.css('display') === "none") {
                $("#newMap2" + name.id).children('span').find('i').removeClass("downjt").addClass("rightjt")
            } else {
                $("#newMap2" + name.id).children('span').find('i').removeClass("rightjt").addClass("downjt")
            }
        }
    }
    checkboxAll(obj, flag) {
        let LiandongList = this.state.LiandongList;
        if (flag === undefined) {
            obj.linkage = !obj.linkage
        }
        obj.children.forEach((item) => {
            item.linkage = flag === undefined ? obj.linkage : flag
            if (item.children) {
                this.checkboxAll(item, flag === undefined ? obj.linkage : flag)
            }
        })
        this.setState({
            LiandongList: JSON.parse(JSON.stringify(LiandongList))
        })
    }

    checkboxBtn(e, obj, type) {
        e.stopPropagation();
        let LiandongList = this.state.LiandongList;

        console.log(obj, LiandongList, "obj")
        if (obj.node_type === 'device_info') {
            obj.linkage = !obj.linkage
            this.setState({
                LiandongList: JSON.parse(JSON.stringify(LiandongList))
            })
        } else {
            this.checkboxAll(obj)
        }
    }
    onMenuClicked(ev, name) {
        ev.stopPropagation();
        // 被点击的<h1>
        let node = $(ev.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.siblings('ul');

        // 显示/隐藏这个列表
        //subMenu.css("display",'none');
        subMenu.css("display", subMenu.css('display') === "none" ? "block" : "none");
        $("#newMap" + name.id).parents().find('li').find('span').css({ 'color': '#fff', 'fontWeight': '100' });
        $("#newMap" + name.id).parents().find('span').find('i').removeClass('only');
        $("#newMap" + name.id).find('span').css({ 'color': '#54b2df', 'fontWeight': 'bold' });
        $("#newMap" + name.id).find('span').find('i').addClass('only');
        $("#newMap" + name.id).siblings().find('span').css({ 'color': '#fff', 'fontWeight': '100' });
        $("#newMap" + name.id).siblings().find('span').find('i').removeClass('only');
        $("#newMap" + name.id).children().find('span').css({ 'color': '#fff', 'fontWeight': '100' });
        $("#newMap" + name.id).children().find('span').find('i').removeClass('only');
        console.log(name.node_type, "name.node_type")
        if (name.node_type === 'device_info') {
            this.Listliandong(name, name.device_code)
        } else {
            if (subMenu.css('display') === "none") {
                $("#newMap" + name.id).children('span').find('i').removeClass("downjt").addClass("rightjt")
            } else {
                $("#newMap" + name.id).children('span').find('i').removeClass("rightjt").addClass("downjt")
            }
        }
    }
    Listliandong(item, code) {
        const url = "device/linkage/list"
        const data = { device_code: code }
        axios.post(global.Url + url, data).then((res) => {
            const result = res.data.data;
            console.log(res, "res")
            if (result) {
                console.log(result, "我是联动树结构");
                ConfigAlarm.this.setState({
                    LiandongList: result,
                    Listliandongitem: item,
                    next: res.data.next
                })

            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    seach() {
        const categoryId = this.state.categoryId
        const val = $('#treeseach').val()
        axios.post(global.Url + "device/info/list", { on_map: true, category_id: categoryId, device_name: val }).then((res) => {
            const result = res.data.data;
            if (result) {
                console.log(result, "我是联动树结构");
                ConfigAlarm.this.setState({
                    TwoTree: result,
                })
            } else {
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    btnAlltj(obj) {
        let xzList = this.state.xzList;
        console.log(obj, "obj")
        obj.children.forEach((item) => {
            if (item.node_type === 'device_info') {
                if (item.linkage) {
                    xzList.push(item.device_code)
                }
            } else if (item.children) {
                this.btnAlltj(item)
            }
        })
        this.setState({
            xzList: xzList
        })
    }
    btnQd() {
        const LiandongList = this.state.LiandongList
        this.btnAlltj(LiandongList[0])
        const next = this.state.next
        const deviecCode = this.state.Listliandongitem.device_code
        const deviecName = this.state.Listliandongitem.device_name
        const url = next ? "device/linkage/update" : "device/linkage/add"
        let xzList = this.state.xzList;
        axios.post(global.Url + url, { device_code: deviecCode, device_name: deviecName, linkage_info: xzList }).then((res) => {
            console.log(res, "联动成功")
            ConfigAlarm.this.setState({
                xzList: []
            })
            $(".PageShow").show().find('h1').html("关联成功！");
            global.Time();
        })
    }
    render() {
        const { LiandongList, TwoTree, nav, navItem, SBList, OneList, TwoList, TwoName, tableList, Name, Level, isPush, isLink, isAlarm, isWrite, isEnable, AddAlarm, TwoChangeAlarm } = this.state;
        const { adminItem, navClick } = this.props;
        return (
            <Fragment>
                <li key="7" className={adminItem === 7 ? 'cur' : ''} onClick={() => navClick(7)}>报警管理</li>
                <div>
                    {adminItem === 7 && nav
                        ?
                        <div className="navItem" style={{ left: "838px" }}>
                            <li className={navItem === 1 ? 'cur' : ''} onClick={() => this.navItemClick(1)}>报警管理</li>
                            <li className={navItem === 2 ? 'cur' : ''} onClick={() => this.navItemClick(2)}>报警视频联动</li>
                        </div>
                        : ''
                    }
                    {adminItem === 7 && (navItem === 1 || navItem === 2) && OneList
                        ?
                        <div className="configShow" style={{ 'width': '500px' }}>
                            <div className="configShowNav">{navItem === 1 ? "报警管理" : "视频联动配置"} <i onClick={() => this.navItemClick(0)}></i></div>
                            <div className="configShowConent">
                                <h1 className='cur'>设备类别</h1>
                                <div className="device">
                                    {
                                        SBList.length > 0 && SBList.map(
                                            (item, index) => {
                                                return <li key={index} onClick={() => this.ListClick(item.id, item.category_name)}>
                                                    <img src={item.category_icon} alt="" /><span>{item.category_name}</span>
                                                </li>
                                            }
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        : ""
                    }
                    {adminItem === 7 && navItem === 2 && TwoList
                        ?
                        <div className="configShow" style={{ 'width': '800px' }}>
                            <div className="configShowNav">视频联动配置<i onClick={() => navClick(100)}></i></div>
                            <div className="Alarm">
                                <div className='AlarmCur' style={{ width: "765px" }}><em onClick={() => this.ReturnOne()}>设备类别</em> >> {TwoName}</div>
                                <div className="Alarmlist" style={{ marginTop: "40px", display: "flex", width: "755px", position: "absolute", marginLeft: "-10px" }}>
                                    <div className="TreeLeft" style={{ 'height': '285px', width: "40%", borderRight: "1px solid #2b90e2" }}>
                                        {/* <div className="Treeseach">
                                            <input type="text" id="treeseach" />
                                            <button onClick={() => this.seach()}>搜索</button>
                                        </div> */}
                                        {/* <ul>
                                            {TwoTree.map((item, index) => {
                                                return (
                                                    <li key={index} onClick={(e) => this.Listliandong(e, item, item.device_code)}>{item.device_name}</li>
                                                )
                                            })}
                                        </ul> */}
                                        <div className='ResourceMapTreeUl'>
                                            {this.generateMenu(TwoTree)}
                                        </div>
                                    </div>
                                    <div className="TreeRight" style={{ 'height': '285px', width: "60%" }}>
                                        <p>视频联动列表</p>
                                        <div className='ResourceMapTreeUl' style={{ height: "200px" }}>
                                            {this.generateMenuLd(LiandongList)}
                                        </div>
                                        {/* <ul>
                                            {LiandongList.map((item, index) => {
                                                return (
                                                    <li key={index}><input type="checkbox" onChange={(e) => this.checkboxBtn(e, index, 0)} checked={item.linkage} /><span style={{ color: item.linkage ? "#268ae4" : "white" }} className="checkboxText" onClick={(e) => this.checkboxBtn(e, index, 1)}>{item.device_name}</span></li>
                                                )
                                            })}
                                        </ul> */}
                                        <div style={{ textAlign: "right" }}><button className="btnQd" onClick={() => this.btnQd()}>确定</button></div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        : ""
                    }
                    {adminItem === 7 && navItem === 1 && TwoList
                        ?
                        <div className="configShow" style={{ 'width': '700px' }}>
                            <div className="configShowNav">报警管理<i onClick={() => navClick(100)}></i></div>
                            <div className="Alarm">
                                <div className='AlarmCur'><em onClick={() => this.ReturnOne()}>设备类别</em> >> {TwoName}</div>
                                <h1><button onClick={() => this.AddAlarm()}>添加</button></h1>
                                <div className="AlarmTable">
                                    <table cellPadding="0" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>事件名称</th>
                                                <th>事件等级</th>
                                                <th>是否推送</th>
                                                <th>是否联动</th>
                                                <th>报警事件</th>
                                                <th>写入日志</th>
                                                <th>是否启用</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                tableList.length > 0 && tableList.map(
                                                    (item, index) => {
                                                        return <tr key={index}>
                                                            <td>{item.event_name}</td>
                                                            <td>
                                                                {(() => {
                                                                    switch (item.event_level) {
                                                                        case 1:
                                                                            return <span className='red'>高</span>;
                                                                        case 2:
                                                                            return <span className='orange'>中</span>;
                                                                        case 3:
                                                                            return <span className='green'>低</span>;
                                                                        default:
                                                                            return null;
                                                                    }
                                                                })()}
                                                            </td>
                                                            <td>{item.push_data ? <span className='red'>已推送</span> : <span className='green'>未推送</span>}</td>
                                                            <td>{item.link_info ? <span className='red'>已联动</span> : <span className='green'>未联动</span>}</td>
                                                            <td>{item.alarm_event ? <span className='red'>报警事件</span> : <span className='green'>非报警事件</span>}</td>
                                                            <td>{item.write_log ? <span className='red'>已写入</span> : <span className='green'>未写入</span>}</td>
                                                            <td>{item.enable ? <span className='red'>已启用</span> : <span className='green'>未启用</span>}</td>
                                                            <td><button className="Edit" onClick={() => this.ChangeList(item.id, item.event_name, item.event_level, item.push_data, item.link_info, item.alarm_event, item.write_log, item.enable)}><i></i></button>
                                                                <button className="deletePic" onClick={() => this.deleteList(item.id)}><i></i></button>
                                                            </td>
                                                        </tr>

                                                    }
                                                )
                                            }

                                        </tbody>
                                    </table>
                                    {tableList.length <= 0 ? <div className='no'>暂无数据，请先添加！</div> : ''}
                                </div>
                            </div>
                        </div>
                        : ""
                    }
                    {adminItem === 7 && navItem === 1 && AddAlarm
                        ?
                        <div className="configShow" style={{ 'width': '350px', 'left': '270px', }}>
                            <div className="configShowNav">添加事件<i onClick={() => this.Close()}></i></div>
                            <div className="configShowConent">
                                <div className="configShowConent_cont AlarmCont">
                                    <li><span>事件名称：</span><input style={{ 'width': '150px' }} type="text" defaultValue={Name} onChange={(event) => this.syaName(event)} /></li>
                                    <li>
                                        <span>事件等级：</span>
                                        <select defaultValue={Level} onChange={this.ChangeLevel}>
                                            <option value="0">请选择</option>
                                            <option value="1">高</option>
                                            <option value="2">中</option>
                                            <option value="3">低</option>
                                        </select>
                                    </li>
                                    <li><span>推送：</span><input type="checkbox" checked={isPush} onChange={(e) => this.handleIsPush(e)} /></li>
                                    <li><span>联动：</span><input type="checkbox" checked={isLink} onChange={(e) => this.handleIsLink(e)} /></li>
                                    <li><span>报警：</span><input type="checkbox" checked={isAlarm} onChange={(e) => this.handleIsAlarm(e)} /></li>
                                    <li><span>日志：</span><input type="checkbox" checked={isWrite} onChange={(e) => this.handleIsWrite(e)} /></li>
                                    <li><span>启用：</span><input type="checkbox" checked={isEnable} onChange={(e) => this.handleIsEnable(e)} /></li>
                                </div>
                                <div className="configBut"><button onClick={() => this.configSave(Name, Level, isPush, isLink, isAlarm, isWrite, isEnable)}>保存</button><button onClick={() => this.Close()}>关闭</button></div>
                            </div>
                        </div>
                        : ''
                    }
                    {adminItem === 7 && navItem === 1 && TwoChangeAlarm
                        ?
                        <div className="configShow" style={{ 'width': '350px', 'left': '270px', }}>
                            <div className="configShowNav">修改事件<i onClick={() => this.Close()}></i></div>
                            <div className="configShowConent">
                                <div className="configShowConent_cont AlarmCont">
                                    <li><span>事件名称：</span><input style={{ 'width': '150px' }} type="text" defaultValue={Name} onChange={(event) => this.syaName(event)} /></li>
                                    <li>
                                        <span>事件等级：</span>
                                        <select defaultValue={Level} onChange={this.ChangeLevel}>
                                            <option value="0">请选择</option>
                                            <option value="1">高</option>
                                            <option value="2">中</option>
                                            <option value="3">低</option>
                                        </select>
                                    </li>
                                    <li><span>推送：</span><input type="checkbox" checked={isPush} onChange={(e) => this.handleIsPush(e)} /></li>
                                    <li><span>联动：</span><input type="checkbox" checked={isLink} onChange={(e) => this.handleIsLink(e)} /></li>
                                    <li><span>报警：</span><input type="checkbox" checked={isAlarm} onChange={(e) => this.handleIsAlarm(e)} /></li>
                                    <li><span>日志：</span><input type="checkbox" checked={isWrite} onChange={(e) => this.handleIsWrite(e)} /></li>
                                    <li><span>启用：</span><input type="checkbox" checked={isEnable} onChange={(e) => this.handleIsEnable(e)} /></li>
                                </div>
                                <div className="configBut"><button onClick={() => this.configSave1(Name, Level, isPush, isLink, isAlarm, isWrite, isEnable)}>确定</button><button onClick={() => this.Close()}>关闭</button></div>
                            </div>
                        </div>
                        : ''
                    }
                </div>

                <div className="PageShow1 AlarmShow">
                    <div className="PageShowCont">
                        <h1>您确定要删除嘛！</h1>
                        <h2><button onClick={() => this.PageDeleted()}>确定</button><button onClick={() => global.PageHide()}>取消</button></h2>
                    </div>
                </div>
            </Fragment>
        )
    }
}
const mapState = (state) => {
    return {
        adminItem: state.admin.get('adminItem')
    }
};
const mapDispatch = (dispatch) => ({
    navClick(id) {
        Common.Close();
        dispatch(actionCreators.nav_click(id));
        ConfigAlarm.this.setState({
            OneList: true,
            TwoList: false,
            AddAlarm: false,
            nav: true,
            navItem: 0
        })
    },
});

export default connect(mapState, mapDispatch)(ConfigAlarm);