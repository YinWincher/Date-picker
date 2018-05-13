import React,{Component} from 'react';
import '../css/date-picker.css'
import '../css/icont/iconfont.css';
import {isParentOfTarget} from '../lib/lib';
import Calendar from '../component/Calendar';
class DatePicker extends  Component{
    constructor(props){
        super(props);
        this.state = {
            showPanel : false,
            date : new Date(),
            inputValue : ''
        }
    }
    showPanel = (event)=>{
        if(isParentOfTarget('div.picker-panel',event.target)){
            return ;
        }
        if(this.state.showPanel){
            this.setState({
                showPanel : false
            });
        }
    }
    handleShowPanel = ()=>{
        this.setState({
            showPanel : true
        });
    }
    handlePickDate = (event)=>{
        const {title} = event.target;
        const date = title.split('-');
        this.setState({
            date : new Date(date[0],date[1]-1,date[2]),
            showPanel : false,
            inputValue : title
        })
    }
    componentDidMount(){
        document.body.addEventListener('click',this.showPanel);
    }
    componentWillMount(){
        document.body.removeEventListener('click',this.showPanel);
    }
    render(){
        const {showPanel,date,inputValue} = this.state;
        return (
            <div className="picker-panel" >
                <div className="input" onClick={this.handleShowPanel}>
                    <i className="iconfont icon-rili"></i>
                    <input type="text" placeholder="请输入日期"  value={inputValue} />
                </div>
                {showPanel ? <Calendar date={date} handlePickDate={this.handlePickDate} /> : ''}
            </div>
        )
    }
}
function canShowPanelUnder(panel,input){
    const calenHeight = panel.offsetHeight;
    console.log(calenHeight);
    const windowHeight = window.innerHeight;
    const {bottom} = input.getBoundingClientRect();
    const toBottomLen = windowHeight-bottom;
    const canShowPanelUnder = toBottomLen >= calenHeight ;
    return canShowPanelUnder;
}
export default DatePicker;