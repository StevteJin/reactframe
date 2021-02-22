import React, { Component,Fragment} from 'react';
import '../../style/base.css';
// import axios from 'axios'
import $ from 'jquery';
// import imgd from '../../images/car1.png'
class VehicleInspection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleFlag:false,
            flag:true,
            tabflag:false,
            img:'',
            list:[],
           tablelist:[],
            // 原始
            dataList:'',// 原始数据
            // 下拉框
            selectValue:"",
            bigimageflag:false,
            // 审核状态
            shenhevalue:"",
            // 驶入时间
            Timevalue:"" ,
            // 车牌号
            cph:"",
            // 驾驶员
            jsy:"",
            end_time:"",
            stime:'',
            etime:''
        }
        VehicleInspection.this=this
    }
    componentDidMount(){
        this.Picture()
        this.table()
        // this.selectCha()
    }
    // 点击车辆检测
    vehilceClick(){
        this.setState({
            vehicleFlag:true,
            flag:false
        })
    }
    imgClick(){
        this.setState({
            vehicleFlag:false,
            flag:true,
            tabflag:false,
            bigimageflag:false
        
        })
    }
    // 点击历史记录
    history(){
        this.setState({
            tabflag:true,
            vehicleFlag:false,
            bigimageflag:false
        })
    }
    // 图片接口
    Picture(){
        $.get("http://192.168.0.46:8090/react/car/info/list",{},
        function(data,status){
            if(data.msg === "success" && status){
                var a = [];
                data.data.forEach(element => {
                    a.push({
                        // 车牌号
                        cph:element.car_license,
                        // 车俩状态
                        clzt:element.car_status,
                        // 审核状态
                        shzt:element.check_status,
                        // 驶入时间
                        starttime:element.start_time,
                        // 驶出时间
                        endtime:element.end_time,
                        // 驾驶员
                        jsy:element.car_hoster,
                        // 带队民警
                        ddmj:element.leader_plice,
                        // 检查民警
                        jcmj:element.check_plice,
                        // 车辆图片
                        img:element.img
                    })

                });
                VehicleInspection.this.setState({list:a.splice(4)})
                console.log(data,'图片接口aaaaaaaaaaaaaa')
            }else{
                alert("接口请求失败");
            }
        });
    }
    // 这个遍历 的  表格的
    table(){
        console.log("jfkdfyhukdhguj")
        $.get("http://192.168.0.46:8090/react/car/info/list",
        { 
         
        },
        function(data,status){
            if(data.msg === "success"  && status){
                console.log(data+"fdkfyudyhfuj")
                console.log(status)
                var a = [];
                data.data.forEach(element => {
                    console.log(element+"dhjgfjydgfyjgdyjfg")
                    a.push({
                        // 车牌号
                        cph:element.car_license,
                        // 车俩状态
                        clzt:element.car_status,
                        // 审核状态
                        shzt:element.check_status,
                        // 驶入时间
                        starttime:element.start_time,
                        // 驶出时间
                        endtime:element.end_time,
                        // 驾驶员
                        jsy:element.car_hoster,
                        // 带队民警
                        ddmj:element.leader_plice,
                        // 检查民警
                        jcmj:element.check_plice,
                    })

                });
                console.log(a)
                VehicleInspection.this.setState({tablelist:a})
                
            }else{
                alert("接口请求失败");
            }
        });

    }
    // 下拉框selectChange
    selectChange(e){
        console.log(e.target.value)
        this.setState({
            selectValue:e.target.value
        })

    }
    // 查询
    selectCha(){
        // 车辆状态
        var paramer ={
            "car_license":this.state.cph,
            "car_hoster":this.state.jsy,
            "car_status":this.state.selectValue,
            "check_status":this.state.shenhevalue,
            "start_time":this.state.stime,
            "end_time":this.state.etime
        }
        $.post('http://192.168.0.46:8090/react/car/info/select',paramer).then((res) => {
            const result = res.data;
            console.log(res,'gan')
            if (result) {
                // 处理数据
                var newData = [];
                result.forEach(element => {
                    newData.push({
                        // 车牌号
                        cph:element.car_license,
                        // 车俩状态
                        clzt:element.car_status,
                        // 审核状态
                        shzt:element.check_status,
                        // 驶入时间
                        starttime:element.start_time,
                        // 驶出时间
                        endtime:element.end_time,
                        // 驾驶员
                        jsy:element.car_hoster,
                        // 带队民警
                        ddmj:element.leader_plice,
                        // 检查民警
                        jcmj:element.check_plice,
                    })
                });
                // 展示数据
                console.log(newData,'数据')
                VehicleInspection.this.setState({tablelist:newData})
            } else {
                console.log('当钱无数据')
            }
        })
    }
    // 查查查button按钮
    ChaButton(){
        this.selectCha()
    }
    // 方法图片
    bigIamge(index,e){
        console.log(e+"dkjfhkudhgukdhuk")
        var list=this.state.list[index].img
        this.setState({
            img: list,
            bigimageflag:true
        })
    }
    // 
    display(){
        this.setState({
            bigimageflag:false
        })
    }
    // 审核状态
    shenhevalue(e){
        this.setState({
            shenhevalue:e.target.value
        })
    }
    // 时间
    timeChange(time,dtime,e){
        var date = new Date(e.target.value)
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
        var strDate = Y+M+D+h+m;
        this.setState({
            [time]:e.target.value,
            [dtime]:strDate
        })
    }
    // 车牌号
    cph(e){
        this.setState({
           cph:e.target.value
        })

    }
    // 驾驶员
    jsy(e){
        this.setState({
            jsy:e.target.value
         })
    }
    resetInput(){
        this.setState({
            Timevalue:'',
            end_time:'',
            stime:'',
            etime:'',
            cph:'',
            jsy:'',
            selectValue:'全部',
            shenhevalue:'全部'
        })
    }
    render() { 
        const{
            vehicleFlag,flag,tablelist,tabflag,img,bigimageflag,list,shenhevalue}=this.state
        return (  
             <Fragment>
                  {flag && <div className="AlarmButtons" onClick={this.vehilceClick.bind(this)} >
                      车辆检测
                      <span id="UnmCount">0</span>    
                      </div>}
                  {
                     vehicleFlag && <div className="AlarmShows One" >
                      {/*车辆抓拍  */}
                      <div className="header">
                        <h3>车辆抓拍</h3>
                        <p onClick={this.imgClick.bind(this)}>X</p>
                      </div>
                      {/* 抓拍到的图片 */}
                      <div className="header-lunbo"> 
                       <ul>
                          {
                              list.map((item,index)=>{
                               return(
                                   <li key={index}  onClick={this.bigIamge.bind(this,index)} className="lunboli">
                                      <img src={item.img} alt="" />
                                   </li>
                               )
                              })
                          }
                       </ul>

                    </div>
                     {/* 历史记录 */}
                     <div className="history">
                        <p onClick={this.history.bind(this)}>历史记录</p>
                    </div>
                 </div>   
                 } 
                 {
                     bigimageflag&& <div className="AlarmShowsling One" >
                      <div className="bigimage"  onClick={this.display.bind(this)}>
                           <img src={img} alt=""/>
                      </div>
                     </div>

                 }
                 
                 {/* 历史记录 */}
                 {/* <div className="AlarmButtons" onClick={this.vehilceClick.bind(this)} >历史记录</div> */}
                 {
                   tabflag && <div className="AlarmShowee One" >
                     <div className="header">
                        <h3>历史记录</h3>
                        <p onClick={this.imgClick.bind(this)}>X</p>
                      </div>
                      {/* 车牌号 */}
                      <div className="carPai">
                          <ul>
                              <li>
                                  <p>车牌号</p>
                                  <input type="text" value={this.state.cph} onChange={this.cph.bind(this)}/>
                              </li>
                              <li>
                                  <p>驾驶员</p>
                                  <input type="text" value={this.state.jsy} onChange={this.jsy.bind(this)}/>
                              </li>
                              <li>
                                  <p>车辆状态</p>
                                  <select className="select" value={this.state.selectValue}  onChange={this.selectChange.bind(this)}>
                                        <option>全部</option>
                                        <option>未驶出</option>
                                        <option>已驶出</option>
                                        <option>未知</option>
                                  </select>
                              </li>
                              <li>
                                  <p>审核状态</p>
                                  <select className="select"value={shenhevalue}  onChange={this.shenhevalue.bind(this)} >
                                        <option>全部</option>
                                        <option>正常</option>
                                        <option>异常</option>
                                  </select>
                              </li>
                              <li>
                                  <p>驶入时间</p>
                                  <input type="datetime-local" id="myLocalDate" value={this.state.Timevalue} onChange={this.timeChange.bind(this,'Timevalue','stime')}/>

                              </li>
                              <li>
                                  <p>驶出时间</p>
                                  <input type="datetime-local" id="myLocalDate" value={this.state.end_time} onChange={this.timeChange.bind(this,'end_time','etime')}/>
                              </li>
                          </ul>
                          <div className="SelectCha">
                          <button onClick={this.ChaButton.bind(this)}>查询</button>
                          <button onClick={this.resetInput.bind(this)}>重置</button>
                      </div>
                      </div>
                      {/* 表格 */} 
                       <div className="SelectTable">
                           <div className="table-more">
                           <table>
                               <thead>
                                   <tr>
                                       <th>车牌号</th>
                                       <th>车辆状态</th>
                                       <th>审核状态</th>
                                       <th>驶入时间</th> 
                                       <th>驶出时间</th> 
                                       <th>驾驶员</th>
                                       <th>带队民警</th> 
                                       <th>检查民警</th>                   
                                    </tr>
                               </thead>
                               <tbody>
                                   {
                                      tablelist.map((item,index)=>{
                                           return(
                                            <tr key={index}>
                                                <td>{item.cph}</td>
                                                <td>{item.clzt}</td>
                                                <td>{item.shzt}</td>
                                                <td>{item.starttime}</td>
                                                <td>{item.endtime}</td>
                                                <td>{item.jsy}</td>
                                                <td>{item.ddmj}</td>
                                                <td>{item.jcmj}</td>
                                        </tr>
                                           )

                                       })
                                   }               
                                </tbody>
                           </table>

                           </div>
                       </div>
                 </div>
                 }
          
            </Fragment>
        );
    }
}
// 历史记录
export default VehicleInspection;