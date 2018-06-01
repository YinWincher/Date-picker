import React, { Component } from 'react';
import './App.css';
import DatePicker from './component/DatePicker';
import RangeDatePicker from './component/RangeDatePicker';
class App extends Component {
    render() {
        return (
            <div className="App">
                <DatePicker
                    disabledDate={disabledDate}
                    // defaultDate={new Date(2017,10,1)}
                    showToday={true}
                    onChange={onChange}
                    placeholder={'选择日期'}
                />
                <RangeDatePicker
                    onRangeChange={onRangeChange}
                    disabledDate={disabledDate}
                />
            </div>
        );
    }
}
function disabledDate(current){
    //current是一个date对象，为表格的当前值
    return current > new Date(2018,6,10);
}
function onRangeChange(preDate,nexDate){
    console.log('开始',preDate);
    console.log('结束',nexDate);
}
function onChange(date,dateString){
    console.log(date);
}
export default App;
