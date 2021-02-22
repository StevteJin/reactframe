import React,{Component} from 'react';
import {HashRouter,Route} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import Login from './page/login';
import Home from './page/home';
import Admin from './page/admin';

class App extends Component {
    shouldComponentUpdate(nextProps,nextState){
        return (this.props.router.location.action === 'PUSH');
    }
  render(){
    return(
        <Provider store={store}>
            <HashRouter>
                <div>
                    <Route path="/login" exact component={Login}  onEnter={()=>{document.title='平台登录'}}></Route>
                    <Route path="/" exact component={Home}  onEnter={()=>{document.title='图为视智慧安防三维平台'}}></Route>
                    <Route path="/admin" exact component={Admin} onEnter={()=>{document.title='图为视智慧安防三维平台-后台管理'}}></Route>
                </div>
            </HashRouter>
        </Provider>
    )
  }
}

export default App;
