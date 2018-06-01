import React,{Component} from 'react';
import '../css/date-picker.css'
import '../css/icont/iconfont.css';
import { isParentOfTarget} from '../util/lib';
import Calendar from '../component/Calendar';
import {isFunction} from "../util/isType";

class DatePicker extends  Component{
    constructor(props){
        super(props);
        this.state = {
            showPanel : false,
            selectDate : {},
            inputValue : ''
        }
        this.input = React.createRef();
    }
    static defaultProps ={
        placeholder : '请选择日期'
    }
    closePanel = (event)=>{
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
        if(this.state.showPanel){
            return;
        }
        this.setState({
            showPanel : true
        });
    }
    handleDeleteDate = (event)=>{
        event.stopPropagation();
        const {onChange} = this.props ;
        this.setState({
            inputValue : '',
            selectDate : {},
            showPanel : false
        });
        if(isFunction(onChange)){
            onChange(null,'');
        }
    }
    handlePickDate = (event)=>{
        const {title} = event.currentTarget;
        let {disabled} = event.currentTarget.dataset;
        const {onChange} = this.props ;
        if(disabled ==="true"){
            return ;
        }
        let date = title.split('-');
        date = new Date(date[0],date[1]-1,date[2])
        this.setState({
            selectDate : date,
            showPanel : false,
            inputValue : title
        })
        if(isFunction(onChange)){
            onChange(date,title);
        }
    }
    componentDidMount(){
        document.body.addEventListener('click',this.closePanel);
    }
    componentWillMount(){
        document.body.removeEventListener('click',this.closePanel);
    }
    render(){
        const {showPanel,inputValue,selectDate} = this.state;
        const {disabledDate,defaultDate,showToday=false,placeholder} = this.props;
        return (
            <div className="picker-panel" >
                <div className="input" ref={this.input} onClick={this.handleShowPanel}>
                    <i className="iconfont icon-rili rili"></i>
                    <input type="text" readOnly={true} placeholder={placeholder}  value={inputValue} />
                    {inputValue ? <i onClick={this.handleDeleteDate} className="iconfont icon-delete delete"></i> : ''}
                </div>
                    {showPanel ? <Calendar
                                            input={this.input}
                                            showToday={showToday}
                                           disabledDate={disabledDate}
                                           selectDate={selectDate}
                                           defaultDate={defaultDate}
                                           handlePickDate={this.handlePickDate}
                    /> : ''}
                </div>
        )
    }
}

export default DatePicker;