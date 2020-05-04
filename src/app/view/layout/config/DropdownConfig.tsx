import React from 'react';
import { Icon } from 'antd';
import './DropdownConfig.scss';

export interface IDropdownConfigProps {
    children?: any;
    style?: any;
    param?: any;
    title?: string;
}
export interface IDropdownConfigState {
    toggleTo?: boolean;
    isOpen?: boolean;
}

export interface IOp {
    label?: string;
    value?: string;
    icon?: string;
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
            icon
        } = this.props;

        return (
            <div className="children-dropdown " onClick={() => this.toggle()}>
                <li>
                    {icon ? <Icon type={icon} /> : null}
                    <span id='df-op'>{label}</span>
                </li>
            </div>
        )
    };
}

export class DropdownConfig extends React.PureComponent<IDropdownConfigProps, IDropdownConfigState> {
    state: IDropdownConfigState = { toggleTo: true, isOpen: false };
    is_lauch = true;
    componentDidMount() {
        window.addEventListener("click", (event: any) => {
            if (this.is_lauch) {
                if (event.target && event.target.className !== "d-tg") {
                    this.setState({ isOpen: false })
                }
            }
        })
    }

    componentWillUnmount() {
        this.is_lauch = false;
        window.removeEventListener("click", () => { });
    }

    closeDropdown = () => { let { isOpen } = this.state; if (isOpen) { this.setState({ isOpen: false }) } };
    toggleDropdown = () => {
        let { isOpen } = this.state;
        this.setState({ isOpen: !isOpen })
    };
    render() {
        let {
            children,
            param
        } = this.props;

        let { isOpen } = this.state;
        return (
            <div className='tg-dr-cf-main'>
                <span className='tg-dr-cf' id='tg-dr-cf' style={{}} onClick={this.toggleDropdown}>
                    <span className="d-tg" style={{ zIndex: 1 }} />
                    {param}
                    <Icon
                        type={isOpen ? 'caret-up' : 'caret-down'}
                        style={{
                            position: "absolute",
                            right: 20,
                            top: 30,
                            fontSize: 15,
                            color: "whitesmoke"
                        }}
                    />
                </span>
                <div
                    id={'dr-cf'}
                    className={`dropdown-config${isOpen ? " visible" : " hidden"}`}
                    onClick={this.toggleDropdown}
                    onInvalidCapture={() => { console.log("uninvalid") }}
                >
                    {children ? children : null}
                </div>
            </div>
        )
    };
}