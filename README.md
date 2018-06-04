# data-picker

### [demo](https://yinwincher.github.io/date-picker/)

### 单个日期选择器

| 参数    |     说明 |   类型 |默认值|
| :-------- | --------:| :------: |:------: |
| disabledDate|   不可选择的日期|  func(date)  | null |
|showToday | 是否展示“今天”按钮| bool | false|
|onChange | 时间发生变化的回调|func(date)|null|
|placeholder | 输入框提示文字|string | '请选择日期'|


```javascript
<DatePicker
    disabledDate={disabledDate}
    showToday={true}
    onChange={onChange}
    placeholder={'选择日期'}
/>
```
![](https://github.com/YinWincher/data-picker/blob/master/%E5%8D%95%E4%B8%AA%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9.png)


###日期范围选择器

| 参数    |     说明 |   类型 |默认值|
| :-------- | --------:| :------: |:------: |
| disabledDate|   不可选择的日期|  func(date)  | null |
|onChange | 时间发生变化的回调|func(preDate,nextDate)|null|
```javascript
<RangeDatePicker
    disabledDate={disabledDate}
    onChange={onChange}
/>
```

![](https://github.com/YinWincher/data-picker/blob/a77d64f20c17697f2043ee87854f46d0d38254dc/%E8%8C%83%E5%9B%B4%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9.png)
