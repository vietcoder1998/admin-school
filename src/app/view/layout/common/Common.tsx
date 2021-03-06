import React from 'react';
import moment from 'moment';
import { Icon } from 'antd';

export const Titlelabel = (props: any) => {
    return <label className="title-label">{" " + props.value + " "}</label>
};

export const IptLetter = (props: any) => {
    return <span className="important-letter">{" " + props.value + " "}</span>
};

export const IptLetterP = (props: any) => {
    return (
        <div style={props.style ? props.style  : null}>
            <p style={{ marginTop: 10, marginBottom: 0 , width: "100%"}}>
                <span className="important-letter">{props.icon ? <Icon type={props.icon} /> : " "}{" " + (props.value ? props.value : " ") + " "}</span>
            </p>
            {props.children ? props.children : null}
        </div>
    )
};

export const Required = () => <span style={{ color: "red", marginBottom: 5, marginLeft: 2 }}>*</span>

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
};


export const NotUpdate = (props?: { msg?: any, children?: any, warning?: boolean }) => (
    <label style={{ fontStyle: "italic", color: props.warning ? "red" : undefined }}>
        {props.children ? props.children : (props.msg ? props.msg : "Chưa cập nhật")}
    </label>
);