import React,{Component} from 'react';
import '../css/range-picker.css'
import '../css/icont/iconfont.css';
import {isParentOfTarget} from '../util/lib';
import RangeCalendar from '../component/RangeCalendar';
import {isDate} from "../util/isType";
import {isSameMonth,isSameYear,getNextMonth} from "../util/date";

class RangeDatePicker extends  Component{
    constructor(props){
        super(props);
        const now = new Date();
        const nextMonth = getNextMonth(now);
        this.state = {
            showPanel : false,
            selectDates : [],
            inputValue : [],
            preSelectDates :[],
            leftPanelDate : now,
            rightPanelDate : nextMonth,
            hoverValues :[]
        }
        this.input = React.createRef();
    }
    closePanel = (event)=>{
        if(isParentOfTarget('div.range-picker-panel',event.target)){
            return ;
        }
        if(this.state.showPanel){
            this.setState({
                showPanel : false,
                selectDates : [...this.state.preSelectDates],
                hoverValues:[]
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
        const now = new Date();
        const next = getNextMonth(now);
        this.setState({
            inputValue : [],
            selectDates : [],
            showPanel : false,
            preSelectDates :[],
            leftPanelDate : now,
            rightPanelDate : next,
            hoverValues :[]
        })
    }
    handleCalendarChange = (event)=>{
        const {change,direction} = event.target.dataset;
        let date = (direction==='left') ? this.state.leftPanelDate : this.state.rightPanelDate;
        date = new Date(date.toDateString());
        switch (change){
            case "toPreYear":
                date.setFullYear(date.getFullYear()-1);
                break;
            case "toNextYear":
                date.setFullYear(date.getFullYear()+1);
                break;
            case "toPreMonth":
                date.setMonth(date.getMonth()-1);
                break;
            case "toNextMonth":
                date.setMonth(date.getMonth()+1);
                break;
        }
        if(direction==='left'){
            this.setState({
                leftPanelDate : date
            });
        }else{
            this.setState({
                rightPanelDate : date
            });
        }

    }
    handleMove = (event)=>{
        const {title} = event.currentTarget;
        let {disabled} = event.currentTarget.dataset;
        const {selectDates,hoverValues} = this.state;

        if(disabled ==="true" || hoverValues.length<1||selectDates.length===2){
            return ;
        }
        let dat = title.split('-');
        let date = new Date(dat[0],dat[1]-1,dat[2]);
        this.setState({
            hoverValues : [hoverValues[0],date]
        })
    }
    handlePickDate = (event)=>{
        const {onRangeChange} = this.props;
        const {title} = event.currentTarget;
        const {selectDates} = this.state;
        //数组中有1/0个元素  有1个元素 >/< 下一个元素
        let dat = title.split('-');
        let date = new Date(dat[0],dat[1]-1,dat[2]);
        if(selectDates.length ===1){
            //1个元素  <下一个元素
            if(selectDates[0] < date){
                this.setState({
                    selectDates : [...this.state.selectDates,date],
                    preSelectDates : [...this.state.selectDates,date],
                    showPanel : false,
                    leftPanelDate : new Date(this.state.selectDates[0].toDateString()),
                    rightPanelDate : new Date(date.toDateString())
                })
                onRangeChange(this.state.selectDates[0],date);
            }else{
                this.setState({
                    selectDates : [date,...this.state.selectDates],
                    preSelectDates : [date,...this.state.selectDates],
                    showPanel : false,
                    leftPanelDate : new Date(date.toDateString()),
                    rightPanelDate : new Date(this.state.selectDates[0].toDateString())
                });
                onRangeChange(date,this.state.selectDates[0]);
            }
            if( isSameMonth(selectDates[0],date) && isSameYear(selectDates[0],date)){
                let dat = getNextMonth(date);
                this.setState({
                    leftPanelDate : new Date(this.state.selectDates[0].toDateString()),
                    rightPanelDate : new Date(dat.toDateString())
                })
            }

        }else{
            this.setState({
                selectDates : [date],
                hoverValues:[date]
            })
        }
    }
    componentDidMount(){
        document.body.addEventListener('click',this.closePanel);
    }
    componentWillUnmount(){
        document.body.removeEventListener('click',this.closePanel);
    }
    render(){
        const {showPanel,inputValue,selectDates,leftPanelDate,rightPanelDate,preSelectDates,hoverValues} = this.state;
        const {disabledDate,defaultDate} = this.props;
        const inputLeft = (isDate(preSelectDates[0])) ? getStringFromDate(preSelectDates[0]) : '';
        const inputRight = (isDate(preSelectDates[1])) ? getStringFromDate(preSelectDates[1]) : '';
        const rangeCalendar = (showPanel) ? (
            <div className="range-calendar-panel">
                {<RangeCalendar
                    hoverValues={hoverValues}
                    handleCalendarChange={this.handleCalendarChange}
                    className={'left'}
                    input={this.input}
                    disabledDate={disabledDate}
                    selectDate={selectDates||{}}
                    showDate={leftPanelDate}
                    defaultDate={defaultDate}
                    handleMove={this.handleMove}
                    handlePickDate={this.handlePickDate}
                    showNext={!isPreMonth(leftPanelDate,rightPanelDate)}
                    showPre={true}
                />}
                {<RangeCalendar
                    hoverValues={hoverValues}
                    handleCalendarChange={this.handleCalendarChange}
                    handleMove={this.handleMove}
                    showDate={rightPanelDate}
                    className={'right'}
                    input={this.input}
                    disabledDate={disabledDate}
                    selectDate={selectDates || {}}
                    showNext={true}
                    showPre={!isPreMonth(leftPanelDate,rightPanelDate)}
                    handlePickDate={this.handlePickDate}
                />}
            </div>
        ) : null;
        return (
            <div className="range-picker-panel" >
                <div className="input" ref={this.input} onClick={this.handleShowPanel}>
                    <i className="iconfont icon-rili rili"></i>
                    <input type="text" readOnly={true} placeholder="请输入日期"  value={inputLeft} />
                    <span>~</span>
                    <input type="text" readOnly={true} placeholder="请输入日期"  value={inputRight} />
                    {inputValue ? <i onClick={this.handleDeleteDate} className="iconfont icon-delete delete"></i> : ''}
                </div>
                {rangeCalendar}
            </div>
        )
    }
}
function getStringFromDate(date){
    const y = date.getFullYear();
    const m = date.getMonth()+1;
    const d = date.getDate();
    return `${y}-${m}-${d}`;
}
function isPreMonth(pre,now){
    const n = new Date(now.toDateString());
    n.setMonth(now.getMonth()-1);
    return n.getFullYear()===pre.getFullYear() && n.getMonth() === pre.getMonth();
}
export default RangeDatePicker;


