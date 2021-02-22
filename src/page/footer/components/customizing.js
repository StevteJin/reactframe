import React, {Fragment, PureComponent} from 'react';
import '../../../style/common.css'
import {actionCreators} from "../store";
import {connect} from "react-redux";
import axios from "axios";
import {Common} from "../../Cesium/method";
import $ from 'jquery';

class Customizing extends PureComponent{
    constructor(props) {
        super(props)
        this.state = {
            activeBtn: false,
            dataList: null,
            imgclick: null,
        }
        this.changeStatus = this.changeStatus.bind(this);//双击效果
        this.OnClickDisplay = this.OnClickDisplay.bind(this)//点击显示模型
    }
    changeStatus() {
        this.setState({
            activeBtn: !this.state.activeBtn
        })
    }
    componentWillMount() {
        //加载自定义数据
        axios.get(global.Url + "map/group/list").then((res) => {
            const result = res.data.data;
            //console.info("group:" + result);
            if (result) {
               // console.log(result);
                var List = [];
                result.forEach(element => {
                    var data = {
                        item : element,
                        state : true
                    }
                    List.push(data)
                });

                this.setState({
                    dataList: List
                })
            } else {
                //alert(res.data.msg)
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    //点击显示模型
    OnClickDisplay = (event, id) => {
        $("#more"+id).find('span').toggleClass('active');
        $("#more"+id).find('img').toggleClass('active');
        const {dataList} = this.state;
        for (let index = 0; index < dataList.length; index++) {
            if (dataList[index].item.id === id) {
                if(!dataList[index].item.state){
                    dataList[index].item.state = true;//显示
                    console.log("1")
                    Common.CustomView(id)
                }else{
                    console.log("0")
                    Common.ClearCustomView(id)
                    dataList[index].item.state = false;//隐藏
                }

            }
        }
    }
    render(){
        const { index, clickIcon, } = this.props;
        const { activeBtn, dataList, } = this.state;
        return(
            <Fragment>
                <li onClick={() => {clickIcon(4);this.changeStatus()}} className={activeBtn  && index === 4  ? 'active' :''}>
                    <i className="icon4"></i><span>自定义</span>
                </li>
                {index === 4 && activeBtn ?
                        <div className='addMore'>
                            <div className="MoreShow MoreCur">
                                {dataList.length > 0 && dataList.map(
                                    (item, index) => {
                                        return <div key={index} onClick={(event) => this.OnClickDisplay(event, item.item.id, index)} className="MoreItem" id={"more"+item.item.id}><img alt='' src={item.item.group_icon}></img><span>{item.item.group_name}</span></div>
                                    }
                                )
                                }
                            </div>
                        </div>
                    : " "}
            </Fragment>

        )
    }
}
const mapState = (state) => {
    return{
        index:state.footer.get('index'),
        moreIndex:state.footer.get('moreIndex')
    }
};
const mapDispatch = (dispatch) => ({
    clickIcon(item) {
        //关闭地下
        //Common.BuildingShow({show : true});
        //关闭楼层
        $("#liu").css({'display':'none'});
        dispatch(actionCreators.click_Icon(item));
    },
    clickIconItem(e,item) {
        e.stopPropagation(); //阻止上级事件 或者e.preventDefault();
        dispatch(actionCreators.click_Icon_Item(item));
    },
});
export default connect(mapState,mapDispatch)(Customizing);

