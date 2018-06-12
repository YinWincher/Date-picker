import React,{Component} from  'react';
import PropTypes from 'prop-types';
import '../css/range-calendar.css';
import {isDate} from "../util/isType";

const CalendarBody = (props)=>{
    const {date,handlePickDate,handleMove,selectDate,disabledDate,hoverValues} = props;
    const dateArray = getRangeDate(date);
    let trKey=1;
    let tr = [];
    const td = dateArray.map(val=>{
        const title = `${val.getFullYear()}-${val.getMonth()+1}-${val.getDate()}`;
        const isDisabled = (disabledDate) ? disabledDate(val) : false;
        return (
            <td
                data-disabled={isDisabled}
                className={getTrClassName(val,date,selectDate,isDisabled,hoverValues)}
                key={title}
                onMouseEnter={handleMove}
                onClick={isDisabled?null:handlePickDate}
                title={title}>
                {val.getDate()}
            </td>
        );
    });
    for(let i=0;i<6;i++){
        tr.push(
            <tr key={trKey++}>
                {td.splice(0,7)}
            </tr>
        )
    }
    return (
        <div className="calendar-body">
            <table>
                <thead>
                <tr >
                    <th title="日">日</th>
                    <th title="一">一</th>
                    <th title="二">二</th>
                    <th title="三">三</th>
                    <th title="四">四</th>
                    <th title="五">五</th>
                    <th title="六">六</th>
                </tr>
                </thead>
                <tbody>
                {tr}
                </tbody>
            </table>
        </div>
    );
}
CalendarBody.propTypes = {
    handlePickDate : PropTypes.func,
    date : PropTypes.object,
    selectDate : PropTypes.array,
    disabledDate : PropTypes.func,
    hoverValues : PropTypes.array,
    handleMove : PropTypes.func
}
const CalendarHeader = (props)=>{
    const {date,handleCalendarChange,showNext=true,direction,showPre=true} = props;
    return (
        <div className="calendar-header">
            {showPre ? <i className="iconfont icon-arrowleftdl" onClick={handleCalendarChange} data-direction={direction} data-change="toPreYear"></i> : ''}
            {showPre ? <i className="iconfont icon-arrowleftl" onClick={handleCalendarChange} data-direction={direction} data-change="toPreMonth"></i> : ''}
            <span>{date.getFullYear()}年</span>
            <span>{date.getMonth()+1}月</span>
            {showNext ? <i className="iconfont icon-arrowrightl" onClick={handleCalendarChange} data-direction={direction} data-change="toNextMonth"></i> : ''}
            {showNext ? <i className="iconfont icon-arrowrightdl" onClick={handleCalendarChange} data-direction={direction} data-change="toNextYear"></i> : ''}
        </div>
    );
}
CalendarHeader.propTypes = {
    showNext : PropTypes.bool,
    showPre : PropTypes.bool,
    direction : PropTypes.string,
    selectDate : PropTypes.array,
    handleCalendarChange : PropTypes.func,
    date : PropTypes.object
}
export default class RangeCalendar extends Component{
    constructor(props){
        super(props);
        this.calendar = React.createRef();
        this.state={
            showUnder : true
        }
    }
    showPanelUnder = ()=>{
        const calendar = this.calendar.current;
        const input = this.props.input.current;
        if(!calendar || !input){
            return;
        }
        const isShowUnder = canShowPanelUnder(calendar,input);
        if(isShowUnder && !this.state.showUnder){
            this.setState({
                showUnder : true
            })
        }else if(!isShowUnder && this.state.showUnder){
            this.setState({
                showUnder : false
            })
        }
    }
    componentDidMount(){
        window.addEventListener('scroll',this.showPanelUnder);
        const {calendar} = this;
        const {input} = this.props;
        if(!calendar.current || !input.current){
            return;
        }
        const isShowUnder = canShowPanelUnder(calendar.current,input.current);
        if(!isShowUnder){
            this.setState({
                showUnder : false
            })
        }
    }
    componentWillUnmount(){
        window.removeEventListener('scroll',this.showPanelUnder);
    }
    render(){
        const {handlePickDate,hoverValues,handleCalendarChange,disabledDate,selectDate,showDate,showToday,className,showNext,showPre,handleMove} = this.props;
        const {showUnder} = this.state;
        return (
            <div ref={this.calendar} className={`range-calendar ${className} ${(showUnder)?'under-input':'above-input'}`}>
                <CalendarHeader
                    showNext={showNext}
                    showPre={showPre}
                    date={showDate}
                    selectDate={selectDate}
                    direction={className}
                    handleCalendarChange={handleCalendarChange}
                />
                <CalendarBody
                    hoverValues={hoverValues}
                    handleMove={handleMove}
                    disabledDate={disabledDate}
                    date={showDate}
                    selectDate={selectDate}
                    handlePickDate={handlePickDate}
                />
            </div>
        );
    }
}
RangeCalendar .propTypes={
    disabledDate : PropTypes.func,
    selectDate : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    defaultDate : PropTypes.object,
    handlePickDate : PropTypes.func
}

function canShowPanelUnder(panel,input){
    if(!panel&&!input){
        return ;
    }
    const calenHeight = panel.offsetHeight;
    const windowHeight = window.innerHeight;
    const {bottom} = input.getBoundingClientRect();
    const toBottomLen = windowHeight-bottom;
    const canShowPanelUnder = toBottomLen >= calenHeight ;
    return canShowPanelUnder;
}
function getTrClassName(trDate,date,selectDate,isDisabled,hoverValues) {
    if(!isDate(trDate)){
        return ;
    }
    let className = '';
    let isSelectDate ;
    let isHoverDate;
    let isBetweenHoverValues=false;
    if(Array.isArray(hoverValues)&&hoverValues.length===2){
        isHoverDate = hoverValues.some(val=>{
            return val.toDateString() === trDate.toDateString();
        })
        let isBigger = hoverValues[0] < hoverValues[1];
        isBetweenHoverValues = (isBigger) ? (trDate > hoverValues[0] && trDate < hoverValues[1]):(trDate < hoverValues[0] && trDate > hoverValues[1]);
    }
    if(Array.isArray(selectDate)){
        isSelectDate = selectDate.some((ele)=>{
            return isDate(ele) && ele.toDateString() === trDate.toDateString();
        });
    }else{
        isSelectDate = isDate(selectDate) &&selectDate.toDateString() === trDate.toDateString();
    }
    let isNowMonth = (date.getMonth()+1) === trDate.getMonth()+1;
    //判断是否为今天
    if(new Date().toDateString() === trDate.toDateString()){
        className += ' now-date';
    }
    //判断是否该月中的一天
    //判断是否选中该日期
    if(!isNowMonth){
        className += ' no-now-month'
    }
    if(isBetweenHoverValues && isNowMonth){
        className += ' beteen-hover';
    }
    if((isSelectDate||isHoverDate) && isNowMonth){
        className += ' select'
    }
    //判断是否为disabled的日期
    if (isDisabled) {
        className += ' disabled'
    }
    return className;
}
function getRangeDate(date){
    if(!isDate(date)){
        throw new Error('参数类型不为Date');
    }
    let calendar = [];
    const DateString = date.toDateString();
    let dat = DateString === "Invalid Date" ? new Date() : new Date(DateString) ;
    dat.setDate(1);
    let day = dat.getDay()===0 ? 7 : dat.getDay();
    dat.setDate(1-day);
    let y = dat.getFullYear();
    let m = dat.getMonth();
    let d = dat.getDate();
    for(let i = 0;i<42;i++){
        let temDate = new Date(y,m,d);
        calendar.push(temDate);
        d++;
    }
    return calendar;
}
