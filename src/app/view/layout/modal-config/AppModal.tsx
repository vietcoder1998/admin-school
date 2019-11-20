import React from 'react';
import {Button, Modal} from 'antd';

export interface IAppModalProps {
    okText?: string
    onOk: Function;
    notCloseOnOk?: boolean;
    cancelText?: string;
    onCancel?: Function;
    notCloseOnCancel?: boolean;
    changeVisible?: Function;
    visible?: boolean
    title?: string;
    width?: number;
}

export interface IAppModalState {
    loadingOk?: boolean;
}

export class AppModal extends React.PureComponent<IAppModalProps> {
    state: IAppModalState = {loadingOk: false};

    componentDidMount() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                if (this.props.onCancel) {
                    this.props.onCancel();
                }
                if (this.props.changeVisible) {
                    this.props.changeVisible(false);
                }
            }
        });

        document.addEventListener("mousedown", (event) => {
            if (event && event.target === document.querySelector("div.modal-config-bg")) {
                if (this.props.changeVisible) {
                    this.props.changeVisible(false);
                }
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
        let {okText, cancelText, title, visible, width} = this.props;
        let {loadingOk} = this.state;
        return (
            <React.Fragment>
                <Modal title={title}
                       closable={false}
                       visible={visible}
                       width={width}
                       footer={[
                           <Button key="back"
                                   onClick={() => {
                                       if (this.props.onCancel) {
                                           this.props.onCancel();
                                       }
                                       if (!this.props.notCloseOnCancel && this.props.changeVisible) {
                                           this.props.changeVisible(false);
                                       }
                                   }}>
                               {cancelText ? cancelText : 'Hủy bỏ'}
                           </Button>,
                           <Button key="submit"
                                   type="primary" loading={loadingOk}
                                   onClick={() => {
                                       this.setState({loadingOk: true});
                                       if (this.props.onOk) {
                                           this.props.onOk();
                                       }
                                       if (!this.props.notCloseOnOk && this.props.changeVisible) {
                                           this.props.changeVisible(false);
                                       }
                                       this.setState({loadingOk: false})
                                   }}>
                               {okText ? okText : 'Xác nhận'}
                           </Button>,
                       ]}
                >
                </Modal>
            </React.Fragment>
        )
    };
}