import React,{Fragment,PureComponent} from "react";
import {connect} from 'react-redux';
import {actionCreators} from "../../store";
import axios from "axios";

class ConfigDevice extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            List:{}, //设备列表一级

        }
        this.ListClick = this.ListClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }
    componentDidMount() {
        //1.先获取设备类别
        this.onDevice();
    }
    //1.先获取设备类别
    onDevice(){
        axios.post(global.Url+'device/category/list').then((res) => {
            const result = res.data.data;
            if(result) {
                console.log(result);
                this.setState({
                    List:result
                })

            }else{
                alert(res.msg)
            }
        })
    }
    onContextMenu(id){
        //e.preventDefault();
        alert("右单击", id)
    }
    //2.点击列表选项
    ListClick(id,name){

    }
    render(){
        const {List} = this.state;
        const{adminItem,navClick,adminIndex} = this.props;
        return(
            <Fragment>
                <div className="configShow">
                    <div className="configShowNav">设备上图 <i onClick={() => navClick(100)}></i></div>
                    <div className="configShowConent">
                        <h1>设备类别</h1>
                        <div className="device">
                            {
                                List.length > 0 && List.map(
                                    (item,index) => {
                                        return <li key={index} onClick={() => this.ListClick(item.id,item.category_name)} onContextMenu={()=>this.onContextMenu(item.id)}>
                                            <img src={item.category_icon} alt=""/>{item.category_name}
                                        </li>
                                    }
                                )
                            }
                        </div>
                    </div>
                </div>
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
    navClick(id,item) {
        console.log(id);
        if(id === 4){
            dispatch(actionCreators.nav_click(id,item));
        }

    },
});

export default connect(mapState,mapDispatch)(ConfigDevice);