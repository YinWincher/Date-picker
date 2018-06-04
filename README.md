# data-picker

###[demo](https://yinwincher.github.io/date-picker/)

### 单个日期选择器

| 参数    |     说明 |   类型 |默认值|
| :-------- | --------:| :------: |:------: |
| disabledDate|   不可选择的日期|  func(date)  | null |
|showToday | 是否展示“今天”按钮| bool | false|
|onChange | 时间发生变化的回调|func(date)|null|
|placeholder | 输入框提示文字|string | '请选择日期'|

![](单个日期选择器.png)
```javascript
<DatePicker
    disabledDate={disabledDate}
    showToday={true}
    onChange={onChange}
    placeholder={'选择日期'}
/>
```

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
![](范围日期选择器.png)
