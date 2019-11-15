import React, { PureComponent } from 'react'
import { Col, Row, Icon, Form, Input, Button, Checkbox } from 'antd';
import { _requestToServer } from '../../../services/exec';
import './Login.scss';
import { POST } from '../../../common/const/method';
import { OAUTH2_HOST } from '../../../environment/dev';
import { ADMIN_LOGIN } from '../../../services/api/public.api';
import { loginHeaders } from '../../../services/auth';
import LoginImage from '../../../assets/image/login-image.jpg';
import Cookies from 'universal-cookie';

interface LoginState {
    email?: string;
    exactly?: boolean;
    is_loading?: boolean;
    err_msg?: string;
    password?: string;
    username?: string;
}

interface LoginProps {
    form?: any
}

class Login extends PureComponent<LoginProps, LoginState> {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            exactly: false,
            is_loading: true,
            err_msg: "",
            password: null,
            username: null,
        }
    }

    createRequest = async () => {
        let { password, username } = this.state;
        let res = await _requestToServer(
            POST,
            { username, password },
            ADMIN_LOGIN,
            OAUTH2_HOST,
            loginHeaders("worksvn-admin-web", "worksvn-admin-web@works.vn"),
            null,
            false,
            true
        )

        if (res && res.code === 200) {
            let exp = new Date((new Date().getTime() + res.data.accessTokenExpSecstoDate) / 1000)
            let cookie = new Cookies()
            cookie.set("actk", res.data.accessToken, { expires: exp, path: "/" });
            localStorage.setItem("token", res.data.accessToken);
            let last_url = localStorage.getItem("last_url");
            if (last_url) {
                window.location.href = last_url
            } else {
                window.location.href = '/admin/pending-jobs'
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.createRequest()
            }
        });
    };

    render() {
        let { err_msg, password, username } = this.state;
        const { getFieldDecorator } = this.props.form;
        let icon = {
            color: "red",
            type: "close"
        }
        let exactly = false;

        if (username && password && username.length > 1 && password.length >= 6) {
            icon.color = "greenyellow";
            icon.type = "check";
            exactly = true;
        }

        return (

            <div className='all-content'>
                <div
                    className="login"
                >
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
                        <Col xs={0} sm={4} md={6} lg={7} xl={8} xxl={8}  ></Col>
                        <Col xs={24} sm={16} md={12} lg={10} xl={8} >
                            <div className="r-p-content test">
                                <div className='msg-noti '>
                                    <h5 style={{textAlign: "center"}}>Đăng nhập</h5>
                                    <Form onSubmit={this.handleSubmit} className="login-form">
                                        <p>Tên đăng nhập</p>
                                        <Form.Item>
                                            {getFieldDecorator('username', {
                                                rules: [{ required: true, message: 'Vui lòng điền tên đăng nhập' }],
                                            })(
                                                <Input
                                                    prefix={<Icon type="lock"
                                                        style={{ color: 'rgba(0,0,0,.25)' }} />}
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
                                        <p>Mật khẩu mới</p>
                                        <Form.Item>
                                            {getFieldDecorator('password', {
                                                rules: [{ required: true, message: 'Vui lòng điền mật khẩu ' }],
                                            })(
                                                <Input
                                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    size="large"
                                                    placeholder="Mật khẩu"
                                                    type="password"
                                                    maxLength={160}
                                                    onChange={event => this.setState({ password: event.target.value })}
                                                />,
                                            )}
                                        </Form.Item>
                                        <p>
                                            <Checkbox onChange={() => { }} >Tự động đăng nhập</Checkbox>
                                        </p>
                                    </Form>
                                    {exactly ? "" : <p>{err_msg}</p>}
                                </div>
                                <p className='a_c'>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        className="login-form-button"
                                        style={{ width: "100%" }}
                                        onClick={this.handleSubmit}
                                    >
                                        Xác nhận
                                    </Button>
                                </p>
                                <p className='a_c'>
                                    <a href='/'
                                        style={{ textDecoration: "underline" }}
                                    >
                                        Trợ giúp ?
                                    </a>
                                </p>
                            </div>
                        </Col>
                        <Col xs={0} sm={4} md={6} lg={7} xl={8}></Col>
                    </Row>
                </div>
            </div>

        )
    }
}

export default Form.create()(Login)
