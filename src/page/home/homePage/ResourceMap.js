import React,{Component,Fragment} from "react";
import axios from 'axios';
import $ from "jquery";
import {Common} from "../../Cesium/method";

class ResourceMap extends Component{
    constructor(props) {
        super(props);
        this.state={
            treeList:{},
            TopList: {},
            titlename: '',
            deleteId:'',//删除ID
            isShow:false,
            isShowTwo:false
        };
        ResourceMap.this = this;
    }
    componentDidMount() {
        this.onTopList();
    }

    //获取网格列表信息
    onLoad() {
        axios.post(global.Url+'business/resourcesMap',{ category_id: global.titid}).then((res) => {
            const results = res.data.data;
            console.log(results);
            if(results && res.data.msg === 'success') {
                this.setState({
                    treeList: results
                })
            }else{
                //alert(res.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }

    //生成资源图谱列表信息
    onTopList(){
        axios.get(global.Url+'device/info/countForCategory').then((res) => {
            const results = res.data.data;
            console.log(results);
            if(results && res.data.msg === 'success') {
                this.setState({
                    TopList: results
                })
            }else{
                //alert(res.msg)
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
            if(menuObj == null){
                return;
            }
            vdom.push(
                <li key={menuObj} className='newMap' id={'newMap'+menuObj.id}>
                    <span onClick={(e)=>this.onMenuClicked(e,menuObj)}>
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
        // 被点击的<h1>
        let node = $(ev.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.siblings('ul');

        // 显示/隐藏这个列表
        //subMenu.css("display",'none');
        subMenu.css("display", subMenu.css('display') === "none" ? "block" : "none");
        $("#newMap"+ name.id).parents().find('li').find('span').css({'color':'#fff','fontWeight':'100'});
        $("#newMap"+ name.id).parents().find('span').find('i').removeClass('only');
        $("#newMap"+ name.id).find('span').css({'color':'#54b2df','fontWeight':'bold'});
        $("#newMap"+ name.id).find('span').find('i').addClass('only');
        $("#newMap"+ name.id).siblings().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#newMap"+ name.id).siblings().find('span').find('i').removeClass('only');
        $("#newMap"+ name.id).children().find('span').css({'color':'#fff','fontWeight':'100'});
        $("#newMap"+ name.id).children().find('span').find('i').removeClass('only');
        console.log('我是子类')
        if(name.node_type === 'device_info'){
            if(parseInt(name.build_id)<0){
                //加载一次
                if(this.state.isShow === false){Common.BuildingShow({show :false});this.setState({isShow:true})}
                //地下室比对监控所在楼层
                axios.get(global.Url+'map/under/list').then((res) => {
                    const result = res.data.data;
                    if(result) {
                        $("#liu").css({'display':'block'});
                        $("#liu").find(".configShowNav").find("span").html('地下室');
                        var data={result,number:1}
                        Common.returnData(data)
                        var list = [];
                        var reg = new RegExp("/","g");//g,表示全部替换。
                        result.forEach(element => {
                            if(element.model_url != null){list.push ({modelId : element.model_url.replace(reg,"_"),order_num : element.order_num,more: element})}
                        });
                    }
                    const index = parseInt(name.floor_id.split("B")[1].substr(0,1))
                    Common.onMenuClickedV3(list[index-1].modelId,list)
                    Common.returnData(name)
                    Common.dxsFlyTo(name)//地下室飞回去
                })
                
            }else{
                if(this.state.isShow){Common.BuildingShow({show :true});this.setState({isShow:false})}
                let data={id:name.id}
                Common.returnData(name)
                Common.CoordinateModelID(data);//飞过去
            }
        }
    }
    //图谱按钮事件
    AssignedLabelID(item) {
        //console.info(item);
        global.titid = item.id;
        let data1={
            id:ResourceMap.this.state.deleteId,
        }
        Common.removeBubbleLabel(data1);
        this.onLoad();
        this.setState({
            titlename:item.category_name + "列表",
            deleteId:item.id
        })
        $(".onlyNav"+ item.id).parents().css({'color':'#fff'});
        $(".onlyNav"+ item.id).css({'color':'#01F8FF'});
        $(".onlyNav"+ item.id).siblings().css({'color':'#fff'});
        $(".onlyNav"+ item.id).children().css({'color':'#fff'});
        let data={
            id:item.id,
            image:item.category_icon
        }
        Common.AddBubbleLabel(data);

    }

    render(){
        const { TopList, treeList, titlename} = this.state;
        return(
            <Fragment>
                <div className="AlarmShow resourceMap" style={{ 'height': 'calc(100vh - 125px)'}}>
                    <h1><span>资源图谱</span></h1>
                    <div className="ResourceMapList">
                        <button><i></i><span>资源图谱</span></button>
                        <ul>
                            {
                                TopList.length > 0 && TopList.map(
                                    (item,index) => {
                                        return  <li key={index} className={'onlyNav'+item.id} onClick={()=>this.AssignedLabelID(item)}>{item.category_name}({item.count})</li>
                                    }
                                )
                            }
                        </ul>
                    </div>
                    <div className="ResourceMapTree">
                        <h2><span>{titlename}</span></h2>
                        <div className='ResourceMapTreeUl'>
                            {this.generateMenu(treeList)}
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ResourceMap;



