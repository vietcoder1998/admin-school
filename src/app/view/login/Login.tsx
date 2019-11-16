import React, { PureComponent } from 'react'
import { Col, Row, Icon, Form, Input, Button, Checkbox } from 'antd';
import './Login.scss';
import LoginImage from '../../../assets/image/login-image.jpg';
import { loginUser } from '../../../services/login';

interface LoginState {
    email?: string;
    exactly?: boolean;
    is_loading?: boolean;
    err_msg?: string;
    password?: string;
    username?: string;
    show_password?: boolean;
}

interface LoginProps {
    form?: any
}

class Login extends PureComponent<LoginProps, LoginState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            exactly: false,
            is_loading: true,
            err_msg: "",
            password: '',
            username: '',
            show_password: false,
        }
    }

    createRequest = async () => {
        let { password, username } = this.state;
        loginUser({username, password});
    };

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any) => {
            if (!err) {
                this.createRequest()
            }
        });
    };

    render() {
        let { err_msg, password, username, show_password } = this.state;
        const { getFieldDecorator } = this.props.form;
        let icon = {
            color: "red",
            type: "close"
        };
        let exactly = false;

        if (username && password && username.length > 1 && password.length >= 6) {
            icon.color = "greenyellow";
            icon.type = "check";
            exactly = true;
        }

        return (
            <div className='all-content'>
                <div className="login">
                    <img src={LoginImage}
                        style={{
                            position: "fixed",
                            minHeight: "100vh",
                            minWidth: "100vw",
                            width: "100vw",
                            top: "0px",
                            left: "0px"
                        }}
                        alt="login"
                    />
                    <Row>
                        <Col xs={0} sm={4} md={6} lg={7} xl={8} xxl={8}/>
                        <Col xs={24} sm={16} md={12} lg={10} xl={8} >
                            <div className="r-p-content test">
                                <div className='msg-noti'>
                                    <h3 className="login-form-title">ĐĂNG NHẬP</h3>
                                    <Form onSubmit={this.handleSubmit} className="login-form" style={{marginTop: 35}}>
                                        <p>Tên đăng nhập</p>
                                        <Form.Item>
                                            {getFieldDecorator('username', {
                                                rules: [{ required: true, message: 'Nhập tên đăng nhập' }],
                                            })(
                                                <Input
                                                    prefix={
                                                        <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                                                    }
                                                    maxLength={160}
                                                    size="large"
                                                    type="text"
                                                    placeholder="Tên đăng nhập"
                                                    onChange={
                                                        event => this.setState({ username: event.target.value })
                                                    }
                                                    onPressEnter={
                                                        (event) => { if (exactly) { this.handleSubmit(event) } }
                                                    }
                                                />,
                                            )}
                                        </Form.Item>
                                        <p>Mật khẩu</p>
                                        <Form.Item>
                                            {getFieldDecorator('password', {
                                                rules: [{ required: true, message: 'Nhập mật khẩu' }],
                                            })(
                                                <Input
                                                    prefix={
                                                        <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                                                    }
                                                    size="large"
                                                    placeholder="Mật khẩu"
                                                    type={show_password ? "text" : "password"}
                                                    maxLength={160}
                                                    onChange={event => this.setState({ password: event.target.value })}
                                                    suffix={
                                                        <Icon
                                                            type={show_password ? "eye-invisible" : "eye"}
                                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                                            onClick={() => this.setState({ show_password: !show_password })}
                                                        />
                                                    }
                                                />,
                                            )}
                                        </Form.Item>
                                    </Form>
                                    {exactly ? "" : <p>{err_msg}</p>}
                                </div>
                                <p className='a_c login-button'>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        className="login-form-button"
                                        style={{ width: "100%" }}
                                        onClick={this.handleSubmit}
                                    >
                                        Đăng nhập
                                    </Button>
                                </p>
                            </div>
                        </Col>
                        <Col xs={0} sm={4} md={6} lg={7} xl={8}/>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Form.create()(Login)
