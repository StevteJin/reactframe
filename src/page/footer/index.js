import React, {Component} from "react";
import '../../style/common.css'
import Home from "./components/home";
import Position from "./components/position";
import More from "./components/more";
import Customizing from "./components/customizing";
import Point from "./components/point";

class Footer extends Component{
    constructor(props){
        super(props);
        this.state=({
            item:0,
        });
    }
    render(){
        return(
                <div className="footer">
                    <div className="footerContent">
                        <Home/>
                        <Position/>
                        <More/>
                        <Customizing/>
                        <Point/>
                    </div>
                    <div className="PageShow">
                        <div className="PageShowCont">
                            <h1>保存成功！</h1>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Footer;