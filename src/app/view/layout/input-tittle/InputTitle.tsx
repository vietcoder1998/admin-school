import { Input, Select, } from "antd";
import React from 'react';

let { Option } = Select;

interface IInputitleProps {
    title?: string;
    widthLabel?: string;
    widthComponent?: string;
    value?: string;
    list_value?: Array<{ label?: string, value?: string }>;
    type?: string;
    onChange?: Function;
    defaultValue?: string;
    placeholder?: string;
}

interface INewSelect {
    list_value?: Array<{ label?: string, value?: string }>;
    onChange?: Function;
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    widthComponent?: string;
}

interface INewInput {
    value?: string;
    onChange?: Function;
    placeholder?: string;
    defaultValue?: string;
    widthComponent?: string;
}

export const NewInput = (props: INewInput) => {
    let { defaultValue, onChange, value } = props;
    return <Input defaultValue={defaultValue} value={value} onChange={event => onChange(event.target.value)} />
}

export const NewSelect = (props: INewSelect) => {
    let { placeholder, list_value, widthComponent } = props;
    return (
        <Select
            showSearch
            placeholder={placeholder}
            optionFilterProp="children"
            style={{ width: widthComponent ? widthComponent : "200px" }}
            onChange={event => props.onChange(event)}
        >
            {/* <Option value={null} >Tất cả</Option> */}
            {
                list_value && list_value.length > 0 ? list_value.map((item, index) => <Option key={index} value={item.value}>{item.label}</Option>) : null
            }
        </Select>
    )
}

export const InputTitle = (props: IInputitleProps) => {
    let { defaultValue, value, list_value, placeholder, onChange, widthComponent } = props;
    let ComponentReturn;
    switch (props.type) {
        case "INPUT":
            ComponentReturn = (
                <NewInput
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    widthComponent={widthComponent}
                />);
            break;

        case "SELECT":
            ComponentReturn = (
                <NewSelect
                    value={value}
                    defaultValue={defaultValue}
                    list_value={list_value}
                    placeholder={placeholder}
                    onChange={onChange}
                    widthComponent={widthComponent}
                />
            );
            break;
        default:
            ComponentReturn = (
                <NewInput
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChange={onChange}
                />);
            break;
    }

    return (
        <div
            className="input-title"
            style={{
                display: "flex",
                margin: "20px 0px",
                width: "auto"
            }}
        >
            <span
                className="title-inside"
                style={{
                    width: props.widthLabel,
                    fontWeight: 550,
                    fontFamily: "IBMPlexSanLights",
                    margin: "0px",
                    lineHeight: "30px"
                }}
            >
                {props.title}
            </span>
            {ComponentReturn}
        </div>)
}