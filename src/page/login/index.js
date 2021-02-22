import React, {Fragment,PureComponent} from "react";
import '../../style/common.css';
import Video from '../../images/video-diqiu.mp4';
import {Redirect} from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LoGO from '../../images/loginLogo.png';
import axios from 'axios';
import $ from "jquery";


class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            typeID:0,  //用户前后台显示，0为前台、1为后台
            loginState:false, //判断用户是否登录
            user:'', //用户名
            password:'', //密码
            Show:false  //验证是否免密
        }
        this.UserClick = this.UserClick.bind(this);   //用户前后台标签切换
        this.userChange = this.userChange.bind(this);  //用户名改变
        this.passwordChange = this.passwordChange.bind(this); //密码改变
        this.login = this.login.bind(this);  //登录
    };
    //填写用户名
    userChange = (event) => {
        //console.log(event.target.value);
        this.setState({
            user: event.target.value
        });
    };
    //填写密码
    passwordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    };
    //用户登录样式切换
    UserClick(id) {
        //console.log(id);
        this.setState({
            typeID: id,
        });
    }
    //用户登录
    login(user,password,id){
        if(this.state.Show){
            id=1
        }
        if(!user){
            //alert("请输入用户名！");
            $(".PageShow").show().find('h1').html('请输入用户名');
            global.Time();
        }else if(!password){
            //alert("请输入密码！")
            $(".PageShow").show().find('h1').html('请输入用户名');
            global.Time();
        }else{
            axios.post(global.Url+'sys/user/login',{
                user_name:user,
                user_pwd:password,
                //database:global.Database
                type:id.toString()
            }).then((res) => {
                const result = res.data.data;
                if(result && (!(JSON.stringify(result)==="{}"))){
                    sessionStorage.setItem('role',result.role_id);
                    sessionStorage.setItem('userName',result.full_name);
                    sessionStorage.setItem('user',result.user_name);
                    sessionStorage.setItem('typeId',id);
                    //console.log(result);
                    //console.log(result.full_name);
                    if(id === 1){
                        this.props.history.push( '/admin')
                    }else if(id === 0){
                        this.props.history.push( '/')
                    }
                }else{
                    //alert('登录失败')
                    $(".PageShow").show().find('h1').html('登录失败!');
                    global.Time();
                }
            })
        }
    }
    //按回车键实现登录
    componentDidMount() {
        document.body.addEventListener("keyup",(e) => {
            if(window.event){
                e = window.event
            }
            let code = e.charCode || e.keyCode
            if(code === 13){
                const {user,password,typeID} = this.state;
                this.login(user,password,typeID)
            }
        })
    }
    componentWillMount() {  //omponentDidMount
        document.body.removeEventListener('keyup',() => {})
        axios.get(global.Url+'sys/config/isLogin').then((res) => {
            const result = res.data.data;
            if(result) {
                //console.log(result);
                //sessionStorage.setItem('isLogin',result.is_login);
                this.setState({
                    Show: result.is_login //判断用户是否需要前台登录  为true登录，为false不登录
                });

            }else{
                //alert()
                $(".PageShow").show().find('h1').html(res.msg);
                global.Time();
            }
        })

    }
    render(){
        const {loginState,typeID,user,password,Show} = this.state;
        if(!loginState){
            return(
                <DocumentTitle title='图为视智慧安防三维平台'>
                    <Fragment>
                        <div id="loginBJ" className="loginContainer">
                            <video muted="muted" autoPlay="autoplay" loop="loop" className="video">
                                <source type="video/mp4" src={Video} />
                            </video>
                            <div className="loginLogo" style={{'display':'block'}} ><img src={LoGO} alt=""/><br/>图为视智慧安防三维平台</div>
                            <div className="login">
                                <div className="loginWrapper">
                                    {
                                        Show ?
                                            <h1>
                                                <span className="cur1" onClick={() => this.UserClick(1)}>后台管理</span>
                                            </h1>
                                            :
                                            <h1>
                                                <span className={typeID === 0 ? "cur" :" "} onClick={() => this.UserClick(0)}>用户登录</span>
                                                <span className={typeID === 1 ? "cur" :" "}  onClick={() => this.UserClick(1)}>后台管理</span>
                                            </h1>
                                    }

                                    <input type="text" value={user} onChange={(event) => this.userChange(event)} placeholder="用户名"/>
                                    <input type="password" value={password} onChange={(event) => this.passwordChange(event)} placeholder="密码"/>
                                    <button onClick={() => this.login(user,password,typeID)}>登录<i></i></button>
                                </div>
                            </div>
                            <div className="PageShow">
                                <div className="PageShowCont">
                                    <h1>保存成功！</h1>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                </DocumentTitle>
            )
        }else{
            if(typeID===1){
                return <Redirect to="/admin" />
            }else{
                return <Redirect to="/" />
            }
        }

    }
}

export default Index;