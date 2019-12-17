import moment from 'moment';

export const timeConverter = (value?: any, number?: number, format?: string) => {
    let time;

    if (value === -1) {
        return
    }
    if (number) {
        time = moment.unix(value / number).format(format ? format : " HH:mm DD/MM/YYYY");
    } else {
        time = moment(value, format ? format : " HH:mm DD/MM/YYYY");
    }
    return time;
};

export const momentToUnix = (value: any) => {
    return moment(value).unix();
};