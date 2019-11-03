import * as moment from 'moment';

export const timeConverter = (value, number) => {
    let time = moment.unix(number ? value / number : value).format("DD/MM/YYYY");
    return time;
}