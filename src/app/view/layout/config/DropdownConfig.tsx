import React from 'react';
import { Icon } from 'antd';
import './DropdownConfig.scss';
import randomID from '../../../../common/utils/randomID';

export interface IDropdownConfigProps {
    children?: any;
    style?: any;
    param?: any;
    title?: string;
    iconColor?: string;
}
export interface IDropdownConfigState {
    toggleTo?: boolean;
    isOpen?: boolean;
}

export interface IOp {
    label?: string;
    value?: string;
    icon?: string;
    iconColor?: string;
    onClick?: () => void;
}

export class OptionConfig extends React.PureComponent<IOp, IDropdownConfigState> {
    state: IDropdownConfigState = { toggleTo: true, isOpen: false };
    toggle = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    };
    render() {
        let {
            label,
            icon,
            iconColor
        } = this.props;

        return (
            <div key={randomID(16)} className="children-dropdown " onClick={() => this.toggle()}>
                <li>
                    {icon ? <Icon type={icon} style={{color: iconColor ? iconColor: "gray"}} /> : null}
                    <span>{label}</span>
                </li>
            </div>
        )
    };
}

export class DropdownConfig extends React.PureComponent<IDropdownConfigProps, IDropdownConfigState> {
    state: IDropdownConfigState = { toggleTo: true, isOpen: false };
    closeDropdown = () => { let { isOpen } = this.state; if (isOpen) { this.setState({ isOpen: false }) } };
    toggleDropdown = () => {
        let { isOpen } = this.state;
        this.setState({ isOpen: !isOpen })
    };
    render() {
        let {
            children,
            param,
            iconColor
        } = this.props;

        let { isOpen } = this.state;
        return (
            <React.Fragment>
                <span style={{ padding: "5px" }} onClick={this.toggleDropdown}>
                    {param}
                    <Icon type={isOpen ? "up" : "down"} style={{color: iconColor ? iconColor: "gray"}}/>
                </span>
                <div
                    className={`dropdown-config${isOpen ? " visible" : " hidden"}`}
                    onClick={this.toggleDropdown}
                    onInvalidCapture={() => { console.log("uninvalid") }}
                >
                    {children ? children : null}
                </div>
            </React.Fragment>
        )
    };
}