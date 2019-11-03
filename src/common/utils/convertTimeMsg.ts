import moment from 'moment';
export const msgConvertTime = (seconds: number): string => {
    let timeConvert = new Date(seconds * 1000);
    let hours = timeConvert.getHours();
    let mins = timeConvert.getMinutes();
    let day = timeConvert.getDay();
    let month = timeConvert.getMonth();
    let year = timeConvert.getFullYear();

    let nowTime = new Date();
    let nowDay = nowTime.getDay();
    let nowMonth = nowTime.getMonth();
    let nowYear = nowTime.getFullYear();

    let yearReturn = ' ';
    let dayReturn = ' ';
    let monthReturn = ' '

    let stringReturn = '';
    if (nowYear !== year) {
        yearReturn = year + ' ';
        monthReturn = 'Th ' + month + ' ';
        dayReturn = day + ' ';
    }

    if (nowYear === year && nowMonth !== month) {
        monthReturn = 'Th ' + month + ' ';
        dayReturn = day + ' ';
    }

    if (nowYear === year && nowMonth === month && nowDay !== day) {
        monthReturn = 'Th ' + month + ' ';
        dayReturn = day + ' ';
    }

    stringReturn = dayReturn + monthReturn + yearReturn + hours + ':' + mins;

    return stringReturn;
}

export const timeExactly = (seconds: number): string =>{
    return moment(seconds).toDate().format("ss:mm:HH DD/MM/YY")
}