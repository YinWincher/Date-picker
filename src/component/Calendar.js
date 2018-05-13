import React,{Component} from  'react';
import '../css/calendar.css';
import {debounce} from "../lib/lib";

function getTrClassName(trDate,date){
    let className = '';
    let now = new Date();
    let isNowMonth = (date.getMonth()+1) === trDate.month;
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth()+1;
    let nowDate = now.getDate();
    let selectedYear = date.getFullYear();
    let selectedMonth = date.getMonth()+1;
    let selectedDate = date.getDate();
    if(nowYear === trDate.year && nowMonth === trDate.month && nowDate===trDate.date){
        className = 'now-date';
    }else if(!isNowMonth){
        className = 'no-now-month'
    }else if(selectedYear === trDate.year && selectedMonth=== trDate.month && selectedDate===trDate.date){
        className = 'select';
    }
    return className;
}
const CalendarDate = (props)=>{
    const {dateArray,handlePickDate,date} = props;
    let body = [];
    let tdKey = 1;
    let trKey=1;
    for(let i=0;i<6;i++){
        let items = (
            <tr key={trKey++}>
                {dateArray.splice(0,7).map((val)=>{
                    return (
                        <td
                            className={getTrClassName(val,date)}
                            key={tdKey++}
                            onClick={handlePickDate}
                            title={`${val.year}-${val.month}-${val.date}`}>
                            {val.date}</td>
                    );
                })}
            </tr>
        );
        body.push(items);
    }
    return (
        <tbody>
        {body}
        </tbody>
    )
}
export default class Calendar extends Component{
    constructor(props){
        super(props);
        this.state={
            date : new Date(props.date.toDateString()),
            showUnder : true
        }
    }
    showPanelUnder = debounce((event)=>{
        if(!this.state.showUnder){
            this.setState({
                showUnder : true
            })
        }
    })
    componentDidMount(){
        const calendar = document.querySelector('.calendar-panel');
        const input = document.querySelector('.input');
        if(!calendar || !input){
            return;
        }
        const isShowUnder = canShowPanelUnder(calendar,input);
        if(!isShowUnder){
            this.setState({
                showUnder : false
            })
        }
        console.log(this)
        window.addEventListener('scroll',this.showPanelUnder);
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
        }
        this.setState({
            date
        });
    }
    render(){
        const {handlePickDate} = this.props;
        const {date,showUnder} = this.state;
        return (
            <div className={`calendar-panel ${(showUnder)?'under-input':'above-input'}`}>
                <CalendarHeader date={date} handleCalendarChange={this.handleCalendarChange}></CalendarHeader>
                <CalendarBody date={date} handlePickDate={handlePickDate}></CalendarBody>
            </div>
        );
    }
}

class CalendarBody extends Component{
    render(){
        const {date,handlePickDate} = this.props;
        const dateArray = getRangeDate(date);
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
                    <CalendarDate  date={date} dateArray={dateArray} handlePickDate={handlePickDate}></CalendarDate>
                </table>
            </div>
        );
    }
}
class CalendarHeader extends Component{

    render(){
        const {date,handleCalendarChange} = this.props;
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

function getRangeDate(date){
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
        let items = {
            year : temDate.getFullYear(),
            month : temDate.getMonth()+1,
            date : temDate.getDate()
        }
        calendar.push(items);
        d++;
    }
    return calendar;
}
// function getRangeDate(year,month,date){
//     let calendar = [];
//     let tem = new Date(year,month-1,date);
//     let dat = tem.toDateString() === "Invalid Date" ? new Date() : tem ;
//     dat.setDate(1);
//     let day = dat.getDay();
//     dat.setDate(1-day);
//     let y = dat.getFullYear();
//     let m = dat.getMonth()+1;
//     let d = dat.getDate();
//     for(let i = 0;i<42;i++){
//         let temDate = new Date(y,m,d);
//         let items = {
//             month : temDate.getMonth(),
//             date : temDate.getDate()
//         }
//         calendar.push(items);
//         d++;
//     }
//     return calendar;
// }