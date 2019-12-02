import React from 'react';
import moment from 'moment';

export const Titlelabel = (props: any) => {
    return <label className="title-label">{" " + props.value + " "}</label>
};

export const IptLetter = (props: any) => {
    return <span className="important-letter">{" " + props.value + " "}</span>
};

export const FirstLetter = (props: any) => {
    return <span className="first-letter">{" " + props.value + " "}</span>
};

export const IconLabel = (props: any) => {
    return <div className="icon_label">{props.icon}</div>
};

export function Timer(props: any) {
    return (
        <label className='timer'>
            {props.value && moment(props.value).format('DD/MM/YYYY')}
        </label>
    )
}