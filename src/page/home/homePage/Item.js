import React,{Component,Fragment} from "react";

class Item extends Component{
    render(){
        const treeList= this.props.children || [];
        //const {treeList} = this.props;
        return(
            <div className="item">
                {
                    treeList.map((item, index) => {
                        console.log(item)
                        return <Fragment key={index}>
                            <li key={item.id} className='newMap' id={'newMap'+item.id}>
                                                    <span onClick={(e)=>this.onMenuClicked(e,item)}>
                                                        {item.node_type==='last'?'':<i></i>}
                                                        {item.region_name}
                                                        {item.node_type==='last'?'':<em>
                                                            {item.pid==='0' && item.count?item.count:0}
                                                        </em>}
                                                    </span>

                                {
                                    // 当该节点还有children时，则递归调用本身
                                    item.children && item.children.length ?
                                        <Item>{item.children}</Item> : null
                                }
                            </li>

                        </Fragment>
                    })
                }
            </div>
        )
    }
}

export default Item;