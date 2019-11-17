import moment from 'moment';

export const timeConverter = (value?: any, number?: number, format?: string) => {
    let time;
    if (number) {
        time = moment.unix(value / number).format(format? format : "DD/MM/YYYY HH:mm");
    } else {
        time = moment(value, format? format : "DD/MM/YYYY HH:mm");
    }
    return time;
};

export const momentToUnix = (value: any) => {
    return moment(value).unix();
};