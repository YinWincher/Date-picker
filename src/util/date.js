import {isDate} from "./isType";

export const isSameDate = (date1,date2)=>{
    if(!isDate(date1) && !isDate(date2)){
        throw new Error('not Date');
    }
    return date1.toDateString() === date2.toDateString();
}

export const isSameMonth = (date1,date2)=>{
    if(!isDate(date1) && !isDate(date2)){
        throw new Error('not Date');
    }
    return date1.getMonth() === date2.getMonth();
}
export const isSameYear = (date1,date2)=>{
    if(!isDate(date1) && !isDate(date2)){
        throw new Error('not Date');
    }
    return date1.getFullYear() === date2.getFullYear();
}
export const isNowDate = (date1)=>{
    if(!isDate(date1)){
        throw new Error('not Date');
    }
    return date1.toDateString() === new Date().toDateString();
}
export const getNextMonth = (date)=>{
    if(!isDate(date)){
        return ;
    }
    const next = new Date(date.toDateString());
    next.setMonth(date.getMonth()+1);
    return next;
}

