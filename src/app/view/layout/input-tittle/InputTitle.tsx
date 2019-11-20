import { Input, Select, } from "antd";
import React from 'react';
import { TYPE } from "../../../../common/const/type";

let { Option } = Select;

interface IInputitleProps {
    title?: string;
    widthLabel?: string;
    widthComponent?: string;
    value?: string;
    list_value?: Array<{ label?: string, value?: any }>;
    type?: string;
    widthInput?: string;
    defaultValue?: string;
    placeholder?: string;
    children?: any;
    style?: any;
    widthSelect?: string;
    onChange?: Function;

}

interface INewSelect {
    list_value?: Array<{ label?: string, value?: string }>;
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    widthSelect?: string;
    onChange?: Function;
}

interface INewInput {
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    widthInput?: string;
    onChange?: Function;
}

export const NewInput = (props: INewInput) => {
    let { defaultValue, value, placeholder, onChange, widthInput } = props;

    return (
        <Input
            placeholder={placeholder}
            defaultValue={defaultValue}
            style={{ width: widthInput ? widthInput : "auto" }}
            value={value}
            onChange={event => onChange? onChange(event.target.value) : undefined}
            maxLength={220}
        />)
};

export const NewSelect = (props: INewSelect) => {
    let { placeholder, list_value, value, onChange, widthSelect, defaultValue } = props;
    return (
        <Select
            showSearch
            placeholder={placeholder}
            optionFilterProp="children"
            style={{ width: widthSelect ? widthSelect : "200px" }}
            value={value}
            defaultValue={defaultValue}
            onChange={event => onChange? onChange(event) : undefined}
        >
            {
                list_value &&
                    list_value.length > 0 ?
                    list_value.map(
                        (item, index) => <Option key={index} value={item.value}>{item.label}</Option>
                    ) : null
            }
        </Select>
    )
};

export const InputTitle = (props: IInputitleProps) => {
    let {
        defaultValue,
        value,
        list_value,
        placeholder,
        children,
        onChange,
        style,
        widthInput,
        widthSelect,
    } = props;
    let ComponentReturn;
    const defaultStyle = {
    };
    switch (props.type) {
        case TYPE.INPUT:
            ComponentReturn = (
                <NewInput
                    widthInput={widthInput}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChange={onChange ? onChange : () => { }}
                />);
            break;

        case TYPE.SELECT:
            ComponentReturn = (
                <NewSelect
                    value={value}
                    defaultValue={defaultValue}
                    list_value={list_value}
                    placeholder={placeholder}
                    onChange={(event: any) => props.onChange? props.onChange(event) : undefined}
                    widthSelect={widthSelect}
                />
            );
            break;
        default:
            ComponentReturn = null;
            break;
    }

    try {
        return (
            <div
                className="input-title"
                style={{ ...defaultStyle, ...style }}
            >
                <div
                    className="title-inside"
                    style={{
                        fontWeight: 550,
                        fontFamily: "IBMPlexSanLights",
                        lineHeight: "30px",
                        width: !props.widthLabel ? "150px" : props.widthLabel
                    }}
                >
                    {props.title}
                </div>
                {children ? children : ComponentReturn}
            </div>)
    } catch (err) {
        return (<span>bug</span>)
    }
};