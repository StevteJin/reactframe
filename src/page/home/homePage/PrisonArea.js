import React,{Component,Fragment} from "react";
import axios from 'axios';
import $ from "jquery";
import {Common} from "../../Cesium/method";

class PrisonArea extends Component{
    constructor(props) {
        super(props);
        this.state={
            layerList:{},
            mmid:''
        };
        PrisonArea.this = this;
        this.CHULI=this.CHULI.bind(this);//显示详细信息
        this.CloseCHULI = this.CloseCHULI.bind(this);//关闭详细信息
        this.CloseJianShi = this.CloseJianShi.bind(this);//关闭监室
    }
    componentDidMount() {
        this.onLayer();
        window.receiveMessageFromIndex = function ( e ) {
            if(e !== undefined){
                //  console.log( '我是react,我接受到了来自iframe的模型ID：', e.data);
                switch(e.data.switchName){
                    case 'jianqu':
                        console.log(e.data);
                        //sessionStorage.setItem('TadId',e.data.tabid);
                        $(".Prisonmain").show();
                        break;
                    default:
                        return null;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
    //加载监区楼层管理
    onLayer(){
        var Layers = [];
        axios.post(global.Url+'watchChildren/list',).then((res) => {
            const result = res.data.data;
            if(result && res.data.msg === 'success') {
                if(result.length>0){
                    for (let i = 0; i < result.length; i++) {
                        axios.post(global.Url+'watch/list',{watchchildren_id:result[i].id}).then((res) => {
                            const results = res.data.data;
                            if(results && res.data.msg === 'success') {
                                Layers.push(
                                    {
                                        LayerItems:result[i],
                                        LayerLists:results
                                    }
                                )
                                if(i === result.length - 1){
                                    setTimeout(function(){
                                        PrisonArea.this.setState({
                                            layerList:Layers
                                        })
                                    },100)
                                }
                                // if(Layers.length ===3){
                                    sessionStorage.setItem('MianList',JSON.stringify(Layers))
                                    console.log(Layers,'Layers')
                                // }
                            }else{
                                $(".PageShow").show().find('h1').html(res.data.msg);
                                global.Time();
                            }
                        })
                    }
                }else{
                    PrisonArea.this.setState({
                        layerList:{}
                    })
                }
            }else{
                $(".PageShow").show().find('h1').html(res.data.msg);
                global.Time();
            }
        })
    }
    // 点击一级菜单
    handleFirst(data){
        const {mmid} = this.state;
        if(mmid){
            Common.Emptyentities({id:mmid})
        }
        //展示隐藏
        $('.PrisonList #ulFirst li').find('ul').css({'display':'none'});
        $(".MeauFistItem"+ data.LayerItems.id).find('ul').css({'display':'block'})
        //分层
        var modelId;
        var list = [];
        var Floors= [];
        var reg = new RegExp("/","g");
        var FL = JSON.parse(sessionStorage.getItem('Floor'));
        FL.forEach(element => {
            element.Floorlists.forEach(FLIT => {
                Floors.push(FLIT)
            });
        });
        Floors.forEach(element => {
            if(element.model_url != null){
                list.push ({
                    modelId : element.model_url.replace(reg,"_"),
                    order_num : element.order_num,
                    more: element
                })
            }
        });
        for (let i = 0; i <  Floors.length; i++) {
            if(Floors[i].id === data.LayerItems.floor_id){
                modelId=Floors[i].model_url.replace(reg,"_");
                Common.onMenuClickedV2(modelId,list);
            }
        }
        //可视区域展示
        Common.PrisonView2(data.LayerItems);
        PrisonArea.this.setState({
            mmid:data.LayerItems.id
        })
    }
    // 点击二级菜单
    handleSecond(e,data){
        e.stopPropagation();
        Common.PrisonView2(data);
    }
    //点击详情
    CHULI(){
       $(".Custodyinfomt").show(); 
    }
    //点击关闭详细信息
    CloseCHULI(){
        $(".Custodyinfomt").hide();
    }
    //点击关闭监室
    CloseJianShi(){
        $(".Prisonmain").hide();
    }
    render(){
        const {layerList} = this.state;
        return(
            <Fragment>
                <div className="AlarmShow PrisonArea" style={{ 'height': '400px','display':'none'}}>
                    <h1><span>监区信息</span></h1>
                    <div className="PrisonList">
                        <ul id ="ulFirst">
                            {
                                layerList.length > 0 && layerList.map(
                                    (item,index) => {
                                        // return  <li key={index} className={'onlyNav'+item.id} onClick={()=>this.handleFirst(item)}>{item}</li>
                                        return <li key={index} id="MeauFistItemID" className={'MeauFistItem'+item.LayerItems.id}  onClick={()=>this.handleFirst(item)}>{item.LayerItems.area_name}
                                            <ul style={{'display':'none'}} id="ulSecond">
                                                {
                                                    item.LayerLists.length > 0 && item.LayerLists.map(
                                                        (name,i) => { 
                                                            return  <li key={i} className='MeauSedItemID' id={'MeauSedItem'+name.id} onClick={(e)=>this.handleSecond(e,name)}><span>{name.name}</span></li>
                                                        }
                                                    )
                                                }
                                            </ul>
                                        </li>
                                    }
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className="Prisonmain">
                 <h2 className="Prisontit"><span className="Prisontit_cl" onClick={()=>this.CloseJianShi()} >X</span><span>0201监室</span></h2>
                 <div className="PrisoninfoTB">
                 <div className="Prisoninfo"><i></i>监室信息</div>
                 <div className="Prisoninfotd">
                     <span>主管名字：<i>丁涛</i></span>
                     <span>协管民警：<i>罗盆盈</i></span>
                 </div>
                 <div className="Prisoninfo"><i></i>人员列表</div>
                 <table  className="Personnelist">
                    <thead>
                    <tr>
                        <th >姓名</th>
                        <th >编号</th>
                        <th>诉讼环节</th>
                        <th>风险等级</th>
                        <th>详情信息</th>
                    </tr>
                    </thead>
                    <tbody>
                {/* { tableData.map((item,index)=>{
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.code}</td>
                                    <td>{item.briht}</td>
                                    <td>{item.devicid}</td>
                                    <td><a className="Personck">查看</a></td>
                                </tr>
                            )
                        })
                        } */}
                    </tbody>
                  </table>
                  <div className="PrisonoperationBT">
                        <button className="Prisonimmediatelybt" onClick={()=>this.CHULI()}>立即处理</button> <button className="PrisonLaterbt" onClick={()=>this.CHULI()}>稍后处理</button>
                    </div>
                 </div>
                 <div className="Custodyinfomt">
                <h2 className="tit"><span>张XX</span><span className="tit_cl" onClick={()=>this.CloseCHULI()}>X</span></h2>
                <div className="custinfobody">
                <div className="csmationone">
                    <div className="csmationOtit"><i></i>在押人员基本信息</div>
        
                    </div>
                    <div className="custinfobodychildboy">
                    
                  
                    <div className="basicinfo"><i></i>人员基本信息</div>
                    <div className="basicinfoTab">
                        <div className="formtionIg">
                            <div className="formtionimg"></div>
                            <div className="formtiontd">
                                <div className="formationtd_one">
                                    <span className="Tabth">姓名</span><span></span>
                                    <span className="Tabth">别名</span><span> </span>
                                    <span className="Tabth">性别</span><span> </span>
                                    <span className="Tabth">证据类型</span><span></span>
                                    <span className="Tabth">证据号码</span><span className="doubleTabth"></span>
                                    <span className="Tabth">出身日期</span><span></span>
                                </div>
                                <div className="formationtd_one">
                                    <span className="Tabth">民族</span><span> </span>
                                    <span className="Tabth">政治面貌</span><span> </span>
                                    <span className="Tabth">文化程度</span><span> </span>
                                    <span className="Tabth">婚姻状况</span><span></span>
                                    <span className="Tabth">身份</span><span></span>
                                    <span className="Tabth">特殊身份</span><span></span>
                                    <span className="Tabth">国籍</span><span></span>
                                </div>
                                <div className="formationtd_one">
                                    <span className="Tabth">辖区</span><span className="doubleTabth"> </span>
                                    <span className="Tabth">职务</span><span > </span>
                                    <span className="Tabth">职业</span><span className="doubleTabth"> </span>
                                    <span className="Tabth">番号</span><span></span>
                                    <span className="Tabth">档案号</span><span></span>
                                 </div>
                                 <div className="formationtd_one">
                                    <span className="Tabth">办案人</span><span> </span>
                                    <span className="Tabth">办案人电话</span><span> </span>
                                    <span className="Tabth">关押监室</span><span> </span>
                                    <span className="Tabth">关押期限</span><span></span>
                                    <span className="Tabth">血样编码</span><span></span>
                                    <span className="Tabth">户籍地址详情</span><span className="doubleTabth"></span>
                                 </div>
                                 <div className="formationtd_one">
                                    <span className="Tabth">现住地址</span><span className="doubleTabth"> </span>
                                    <span className="Tabth">户籍所在地</span><span className="doubleTabth"> </span>
                                    <span className="Tabth">指纹编号</span><span> </span>
                                    <span className="Tabth">专长</span><span></span>
                                    <span className="Tabth"> </span><span></span>
                                 </div>
                            </div>
                            <div className="formtionaddrie">
                            <span className="Tabthadd">现住地址详情</span><span></span>
                            </div>
                        </div>
                    </div>
                   
                    <div className="archivesinfo"><i></i>人员档案信息</div>
                    <div className="archivesinfoTab">
                        <div className="archivesinfoTabtd">
                            <span className="arcTabth">拘留日期</span><span></span>
                            <span className="arcTabth">逮捕日期</span><span> </span>
                            <span className="arcTabth">关押日期</span><span> </span>
                            <span className="arcTabth">入所日期</span><span className="arcdoubleTabth"></span>
                            <span className="arcTabth">入所原因</span><span></span>
                            <span className="arcTabth">送押单位</span><span className="arcdoubleTabth"></span>
                        </div>
                      <div  className="archivesinfoTabtd">
                            <span className="arcTabth">收押凭证</span><span></span>
                            <span className="arcTabth">送押人</span><span> </span>
                            <span className="arcTabth">人所法律文书</span><span className="arcdoubleTabth"></span>
                            <span className="arcTabth">人员管理类别</span><span></span>
                            <span className="arcTabth">重刑犯</span><span></span>
                            <span className="arcTabth">转来单位</span><span className="arcdoubleTabth"></span>
                      </div>
                      <div  className="archivesinfoTabtd">
                            <span className="arcTabth">犯法犯罪经历</span><span></span>
                            <span className="arcTabth">案件类别</span><span className="tripleTabth"></span>
                            <span className="arcTabth">办案单位</span><span className="arcdoubleTabth"> </span>
                            <span className="arcTabth">批准人</span><span></span>
                            <span className="arcTabth">批准时间</span><span></span>
                      </div>
                      <div  className="archivesinfoTabtd">
                            <span className="arcTabth">出所法律文书</span><span></span>
                            <span className="arcTabth">监督单位</span><span> </span>
                            <span className="arcTabth">固所时间</span><span> </span>
                            <span className="arcTabth">出所去向</span><span></span>
                            <span className="arcTabth">出所原因</span><span></span>
                            <span className="arcTabth">出所日期</span><span></span>
                            <span className="arcTabth">担保人</span><span></span>
                            <span className="arcTabth">担保人地址</span><span></span>
                     </div>
                      <div className="archivesinfoTabtd">
                            <span className="arcTabth">与在押人员关系</span><span></span>
                            <span className="arcTabth">律师见面许可</span><span> </span>
                            <span className="arcTabth">备注</span><span className="tripleTabth"> </span>
                            <span className="arcTabth"> </span><span ></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span ></span>
                      </div>
                      <div  className="archivesinfoTabtd">
                            <span className="arcTabth">拘留日期</span><span className="fullTabth"></span>
                        </div>
                    </div>
                    
                    <div className="healthinfo"><i></i>健康状况</div>
                    <div className="healthinfoTab">
                        <div className="healthinfoTabtd">
                            <span className="arcTabth">健康状况</span><span></span>
                            <span className="arcTabth"> </span><span> </span>
                            <span className="arcTabth"> </span><span> </span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                        </div>
                    </div>

                    <div className="takeinfo"><i></i>人员羁押信息</div>
                    <div className="healthinfoTab">
                        <div className="healthinfoTabtd">
                            <span className="arcTabth">收到日期</span><span></span>
                            <span className="arcTabth"> 换押日期</span><span> </span>
                            <span className="arcTabth"> 办案人</span><span> </span>
                            <span className="arcTabth">办案单位</span><span className="arcdoubleTabth"></span>
                            <span className="arcTabth">办案单位类型 </span><span></span>
                            <span className="arcTabth">诉讼阶段 </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                        </div>
                    </div>

                    <div className="handleinfo"><i></i>人员处理信息</div>
                    <div className="handleinfoTab">
                        <div className="handleinfoTabtd">
                            <span className="arcTabth">法律文书号</span><span className="arcdoubleTabth"></span>
                            <span className="arcTabth"> 处理时间</span><span> </span>
                            <span className="arcTabth"> 处理结果</span><span> </span>
                            <span className="arcTabth">判决罪名</span><span className="arcdoubleTabth"></span>
                            <span className="arcTabth">刑期 </span><span></span>
                            <span className="arcTabth">刑期开始时间 </span><span></span>
                        </div>
                        <div className="handleinfoTabtd">
                            <span className="arcTabth">刑法处置时间</span><span></span>
                            <span className="arcTabth"> 附加处理</span><span> </span>
                            <span className="arcTabth"> 附加处理刑期</span><span> </span>
                            <span className="arcTabth">上诉日期</span><span></span>
                            <span className="arcTabth">执行日期 </span><span></span>
                            <span className="arcTabth">罚金金额 </span><span></span>
                            <span className="arcTabth">缓刑刑期 </span><span></span>
                            <span className="arcTabth">审判长 </span><span></span>
                        </div>
                    </div>

                    <div className="Detentioninfo"><i></i>人员留所信息</div>
                    <div className="healthinfoTab">
                        <div className="healthinfoTabtd">
                            <span className="arcTabth">批准日期</span><span></span>
                            <span className="arcTabth"> 批准单位</span><span> </span>
                            <span className="arcTabth"> 留所原因</span><span> </span>
                            <span className="arcTabth">刑期</span><span></span>
                            <span className="arcTabth">刑满日期 </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                        </div>
                    </div>

                    <div className="officeinfo"><i></i>所内状态</div>
                    <div className="healthinfoTab">
                        <div className="healthinfoTabtd">
                            <span className="arcTabth">所内状态</span><span></span>
                            <span className="arcTabth"> </span><span> </span>
                            <span className="arcTabth"> </span><span> </span>
                            <span className="arcTabth"></span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                            <span className="arcTabth"> </span><span></span>
                        </div>
                    </div>

                    <div className="operationBT">
                        <div className="immediatelybt">立即处理</div> <div className="Laterbt">稍后处理</div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
            </Fragment>
        )
    }
}

export default PrisonArea;



