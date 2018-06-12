import React,{Component} from  'react';
import PropTypes from 'prop-types';
import '../css/calendar.css';
import {isDate} from "../util/isType";

const CalendarBody = (props)=>{
        const {date,handlePickDate,selectDate,disabledDate} = props;
        const dateArray = getRangeDate(date);
        let trKey=1;
        let tr = [];
        const td = dateArray.map(val=>{
            const title = `${val.getFullYear()}-${val.getMonth()+1}-${val.getDate()}`;
            const isDisabled = (disabledDate) ? disabledDate(val) : false;
            return (
                <td
                    className={getTrClassName(val,date,selectDate,isDisabled)}
                    key={title}
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
    selectDate : PropTypes.object,
    disabledDate : PropTypes.func
}
const CalendarHeader = (props)=>{
        const {date,handleCalendarChange} = props;
        return (
            <div className="calendar-header">
                <i className="iconfont icon-arrowleftdl" onClick={handleCalendarChange} data-change="toPreYear"></i>
                <i className="iconfont icon-arrowleftl" onClick={handleCalendarChange} data-change="toPreMonth"></i>
                <span>{date.getFullYear()}年</span>
                <span>{date.getMonth()+1}月</span>
                <i className="iconfont icon-arrowrightl" onClick={handleCalendarChange} data-change="toNextMonth"></i>
                <i className="iconfont icon-arrowrightdl" onClick={handleCalendarChange} data-change="toNextYear"></i>
            </div>
        );
}
CalendarHeader.propTypes = {
    showNext : PropTypes.bool,
    showPre : PropTypes.bool,
    handleCalendarChange : PropTypes.func,
    data : PropTypes.object
}
export default class Calendar extends Component{
    constructor(props){
        super(props);
        this.calendar = React.createRef();
        const {defaultDate,selectDate} = props;
        let date = (isDate(defaultDate)) ? new Date(defaultDate.toDateString()) : new Date();
        date = (isDate(selectDate)) ? new Date(selectDate.toDateString()) : date;
        this.state={
            date,
            showUnder : true
        }
    }
    showPanelUnder = ()=>{
        const calendar = this.calendar.current;
        const input = this.props.input.current;
        console.log(calendar,input);
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
    handleCalendarChange = (event)=>{
        const {change} = event.target.dataset;
        let {date} = this.state;
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
            default:
                return ;
        }
        this.setState({
            date
        });
    }
    render(){
        const {handlePickDate,disabledDate,selectDate,showToday} = this.props;
        const {date,showUnder} = this.state;
        const now = new Date();
        return (
            <div ref={this.calendar} className={`calendar-panel ${(showUnder)?'under-input':'above-input'}`}>
                <CalendarHeader
                    date={date}
                    handleCalendarChange={this.handleCalendarChange}
                />
                <CalendarBody
                    disabledDate={disabledDate}
                    date={date}
                    selectDate={selectDate}
                    handlePickDate={handlePickDate}
                />
                {showToday
                    ?
                    <div className="today">
                        <div
                            title={`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`}
                            onClick={handlePickDate}
                        >今天</div>
                    </div>
                    : ''
                }
            </div>
        );
    }
}
Calendar.propTypes={
    disabledDate : PropTypes.func,
    selectDate : PropTypes.object,
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

function getTrClassName(trDate,date,selectDate,isDisabled) {
    if(!isDate(trDate)){
        return ;
    }
    let className = '';
    let isNowMonth = (date.getMonth()+1) === trDate.getMonth()+1;
    //判断是否为今天
    if(new Date().toDateString() === trDate.toDateString()){
        className += ' now-date';
    }
    //判断是否该月中的一天
    if(!isNowMonth){
        className += ' no-now-month'
    }
    //判断是否选中该日期
    if(isDate(selectDate) &&selectDate.toDateString() === trDate.toDateString()){
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
