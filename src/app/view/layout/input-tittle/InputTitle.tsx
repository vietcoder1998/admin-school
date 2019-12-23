import { Input, Select, } from "antd";
import React, { CSSProperties } from 'react';
import { TYPE } from "../../../../const/type";
import randomID from "../../../../utils/randomID";
import TextArea from "antd/lib/input/TextArea";

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
    rows?: number;
    widthSelect?: string;
    onChange?: Function;
    onSearch?: Function;
}

interface INewSelect {
    list_value?: Array<{ label?: string, value?: string }>;
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    widthSelect?: string;
    onChange?: Function;
    onSearch?: Function;
    style?: CSSProperties;
}

interface INewInput {
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    widthInput?: string;
    onChange?: Function;
}

interface INewNewTextArea {
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    widthInput?: string;
    onChange?: Function;
    rows?: number;
}

export const NewInput = (props: INewInput) => {
    let { defaultValue, value, placeholder, onChange, widthInput } = props;

    return (
        <Input
            placeholder={placeholder}
            defaultValue={defaultValue}
            style={{ width: widthInput ? widthInput : "auto" }}
            value={value}
            onChange={event => onChange ? onChange(event.target.value) : undefined}
            maxLength={220}
        />)
};

export const NewTextArea = (props: INewNewTextArea) => {
    let { defaultValue, value, placeholder, onChange, widthInput, rows } = props;
    return (
        <TextArea
            placeholder={placeholder}
            defaultValue={defaultValue}
            style={{ width: widthInput ? widthInput : "auto" }}
            value={value}
            onChange={event => onChange ? onChange(event.target.value) : undefined}
            rows={rows ? rows : 2}
            maxLength={220}
        />)
};

export const NewSelect = (props: INewSelect) => {
    let { placeholder, list_value, onChange, widthSelect, defaultValue, style, value, onSearch } = props;

    if (value) {
        return (
            <Select
                showSearch
                placeholder={placeholder}
                optionFilterProp="children"
                value={value}
                defaultValue={defaultValue}
                style={style ? style : { width: widthSelect ? widthSelect : "200px" }}
                onChange={onChange ? (event: any) => onChange(event) : undefined}
                onSearch={onSearch ? (event: any) => onSearch(event) : undefined}
            >
                {
                    list_value &&
                        list_value.length > 0 ?
                        list_value.map(
                            (item, index) => <Select.Option key={randomID(16)} value={item.value}>{item.label}</Select.Option>
                        ) : null
                }
            </Select >)
    } else
        return (
            <Select
                showSearch
                placeholder={placeholder}
                optionFilterProp="children"
                defaultValue={defaultValue}
                style={style ? style : { width: widthSelect ? widthSelect : "200px" }}
                onChange={onChange ? (event: any) => onChange(event) : undefined}
                onSearch={onSearch ? (event: any) => onSearch(event) : undefined}
            >
                {
                    list_value &&
                        list_value.length > 0 ?
                        list_value.map(
                            (item, index) => <Select.Option key={randomID(16)} value={item.value}>{item.label}</Select.Option>
                        ) : null
                }
            </Select >
        );
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
        onSearch,
        rows,
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

        case TYPE.TEXT_AREA:
            ComponentReturn = (
                <NewTextArea
                    widthInput={widthInput}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChange={onChange ? onChange : () => { }}
                    rows={rows}
                />);
            break;

        case TYPE.SELECT:
            ComponentReturn = (
                <NewSelect
                    value={value}
                    defaultValue={defaultValue}
                    list_value={list_value}
                    placeholder={placeholder}
                    onSearch={onSearch ? onSearch : undefined}
                    onChange={(event: any) => props.onChange ? props.onChange(event) : undefined}
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