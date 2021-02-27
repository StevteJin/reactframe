import React, {Component} from "react";
import '../../style/common.css'
import Home from "./components/home";
import Position from "./components/position";
import More from "./components/more";
import Customizing from "./components/customizing";
import Point from "./components/point";
import Dimension from "./components/dimension";


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
                        <Dimension/>
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