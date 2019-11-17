import React from 'react';
import {Button, Icon} from 'antd';

export interface IConfigModalProps {
    toggleModal: Function;
    handleClose?: Function;
    handleOk?: Function;
    children?: any;
    style?: any;
    param?: any;
    namebtn1?: string;
    namebtn2?: string;
    title?: string;
    isOpen?: boolean;
}

export interface IConfigModalState {
    toggleTo?: boolean;
}

export class ModalConfig extends React.Component<IConfigModalProps, IConfigModalState> {
    state: IConfigModalState = {toggleTo: true};
    closeModal = () => {
        let {isOpen} = this.props;
        if (isOpen) {
            this.props.toggleModal()
        }
    };

    componentDidMount() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.closeModal()
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (event && event.target === document.querySelector("div.modal-config-bg")) {
                this.closeModal()
            }
        })
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", () => {
        });
        document.removeEventListener("mousedown", () => {
        });
    }

    render() {
        let {
            children,
            namebtn1,
            namebtn2,
            style,
            title,
            isOpen,
        } = this.props;
        return (
            <React.Fragment>
                <div
                    className={`modal-config-bg${isOpen ? " " : " none"}`}
                    style={{...style}}
                    onKeyPress={event => {
                        if (event.keyCode === 27) {
                            this.closeModal()
                        }
                    }}
                />
                <div
                    className={`modal-config${isOpen ? " active" : " none-active"}`}

                >
                    <div className="header b_b">
                        <h6>
                            {title}
                            <Icon type="close" style={{float: "right"}} onClick={() => this.props.toggleModal()}/>
                        </h6>
                    </div>
                    <div className="modal-config-body">
                        {children ? children : null}
                    </div>
                    <div className="footer b_t">
                        <Button
                            type="danger"
                            onClick={() => this.props.handleClose ? this.props.handleClose() : undefined}
                        >
                            <Icon type="close"/>
                            {namebtn1}
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => this.props.handleOk ? this.props.handleOk() : undefined}
                        >
                            <Icon type="check"/>
                            {namebtn2}
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        )
    };
}