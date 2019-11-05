import * as moment from 'moment';

export const timeConverter = (value?: any, number?: number) => {
    let time;
    if (!number) {
        time = moment(value, "DD/MM/YYYY");
    } else {
        time = moment.unix( value / number).format("DD/MM/YYYY");
    }
    return time;
}

export const momentToUnix = (value) => {
    return moment(value).unix();
}