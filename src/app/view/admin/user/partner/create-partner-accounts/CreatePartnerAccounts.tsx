import React from 'react'
import { connect } from 'react-redux';
import { Divider, Button } from 'antd';
import './CreatePartnerAccounts.scss';

import { _requestToServer } from '../../../../../../services/exec';
import { POST, PUT } from '../../../../../../const/method';
import { API_CONTROLLER_ROLES,PARTNER } from '../../../../../../services/api/private.api';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { TYPE } from '../../../../../../const/type';
import { IApiFunctions } from '../../../../../../models/api-controller';
import { IRole } from '../../../../../../models/roles';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { routeLink, routePath } from '../../../../../../const/break-cumb';
import { IAppState } from '../../../../../../redux/store/reducer';
import { IPartnerAccount } from '../../../../../../models/partner';

interface ICreatePartnerAccountsState {
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    contactEmail?: string;
    type?: string;
    id?: string;
    typeCpn?: string;
    role_detail?: any;
    value?: any;
    api_controller?: Array<IApiFunctions>;
    list_roles?: Array<IRole>,
    roleID?: number,
    role_name?: string,
    admin_account_detail?: IPartnerAccount,
    loading_content_img?: boolean,
    loading?: boolean,
    avatarUrl?: string;
    avatar?: any;
}

interface ICreatePartnerAccountsProps extends StateProps, DispatchProps {
    match: any;
    history: any;
    getListPartnerAccounts?: Function;
    getListRoles?: Function;
    getPartnerAccountDetail?: (id?: string) => any;
}

class CreatePartnerAccounts extends React.Component<ICreatePartnerAccountsProps, ICreatePartnerAccountsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            password: null,
            id: null,
            firstName: null,
            lastName: null,
            contactEmail: null,
            type: "",
            typeCpn: TYPE.CREATE,
            value: null,
            roleID: null,
            admin_account_detail: null,
            loading: false,
            loading_content_img: false,
            avatar: null,
        }
    }

    static getDerivedStateFromProps(nextProps?: ICreatePartnerAccountsProps, prevState?: ICreatePartnerAccountsState) {
        if (nextProps.match.params.id && nextProps.match.params.id !== prevState.id) {
            nextProps.getPartnerAccountDetail(nextProps.match.params.id);
           
            return {
                id: nextProps.match.params.id,
                typeCpn: TYPE.FIX
            }
        }

        return null;
    }

    onChoseRoleID = (id: number) => {
        let { list_roles } = this.props;
        list_roles.forEach(item => {
            if (item.id === id) {
                this.setState({
                    roleID: id,
                    role_name: item.name
                })
            }
        })
    }

    createNewData = async () => {
        let { username, typeCpn, id, password, lastName, firstName, contactEmail, roleID } = this.state;
        let body = null;

        if (typeCpn === TYPE.FIX) {
            body = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: contactEmail.trim(),
                roleID
            }
        } else {
            body = {
                username: username.trim(),
                password: password.trim(),
                lastName: lastName.trim(),
                firstName: firstName.trim(),
                email: contactEmail.trim(),
            }
        }

        if (username && lastName && firstName && contactEmail && password) {
            await _requestToServer(
                typeCpn === TYPE.CREATE ? POST : PUT,
                (typeCpn === TYPE.CREATE ? PARTNER : PARTNER)
                + (typeCpn === TYPE.CREATE ? '/registration/email' : `/${id}/profile`),
                body
            ).then((res: any) => {
                if (res) {
                    this.props.history.push(routeLink.PARTNER + routePath.LIST);
                }
            });
        }
    };

    updateApiControllerPartnerAccounts = async () => {
        let { id, value } = this.state;
        await _requestToServer(
            PUT, API_CONTROLLER_ROLES + `/${id}/apis`,
            value
        );
    };

    onChange = (event: any) => {
        this.setState({ username: event })
    };

    onChangeApiController = (value: any) => {
        let new_value = value;
        let map_arr: any = [];
        new_value.forEach((item: any) => {
            if (Array.isArray(item)) {
                item.forEach(value_item => {
                    map_arr.push(value_item);
                });
            } else {
                map_arr.push(item)
            }
        });

        this.setState({ value: map_arr });
    };

    uploadFileToServer = (file?: Blob) => {
        let {id} = this.state;
        this.setState({ loading_content_img: true });
        let formData = new FormData();
        formData.append('avatar', file);
        _requestToServer(
            PUT,
            PARTNER + `/${id}/avatar`,
            formData,
        ).then(
            (res: any) => {
                if (res) {
                    this.props.getPartnerAccountDetail(id);
                }
            }
        ).finally(
            () => this.setState({loading_content_img: false})
        )

    };

    render() {
        let {
            username,
            typeCpn,
            password,
            firstName,
            lastName,
            contactEmail,
            // role_name,
            // roleID,
            // id,
            // admin_account_detail,
            // loading_content_img
        } = this.state;

        let is_disable = username && lastName && firstName && contactEmail && password;
        return (
            <>
                <div>
                    <h5>
                        {typeCpn === TYPE.CREATE ? 'Thêm tài khoản cộng tác viên mới' : 'Sửa tài khoản cộng tác viên'}
                    </h5>
                    <Divider orientation="left">Chi tiết tài khoản cộng tác viên</Divider>
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tên tài khoản "
                        placeholder="ex: không có dấu cách"
                        widthInput="400px"
                        value={username}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ username: event })}
                    />
                    {
                        typeCpn !== TYPE.FIX ?
                            <InputTitle
                                type={TYPE.INPUT}
                                title="Mật khẩu"
                                placeholder="yêu cầu: trên 6 kí tự"
                                widthInput="400px"
                                value={password}
                                style={{ padding: "10px 30px" }}
                                onChange={(event: any) => this.setState({ password: event })}
                            /> : ''
                    }
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Họ (đệm)"
                        placeholder="ex: Trần Thanh"
                        widthInput="400px"
                        value={lastName}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ lastName: event })}
                    />
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tên"
                        placeholder="ex: Tùng"
                        widthInput="400px"
                        value={firstName}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ firstName: event })}
                    />
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Email"
                        placeholder="ex: workvns@gmail.com"
                        widthInput="400px"
                        value={contactEmail}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ contactEmail: event })}
                    />
                    {
                        typeCpn === TYPE.FIX ?
                            <>
                                <Divider orientation="left">Đổi mật khẩu</Divider>
                                <InputTitle
                                    type={TYPE.INPUT}
                                    title="Mật khẩu mới"
                                    placeholder="yêu cầu: trên 6 kí tự"
                                    widthInput="400px"
                                    value={password}
                                    style={{ padding: "10px 30px" }}
                                    onChange={(event: any) => this.setState({ password: event })}
                                />
                            </>
                            : ''
                    }
                    <Button
                        type="primary"
                        icon={typeCpn === TYPE.CREATE ? "plus" : "check"}
                        style={{ float: "right", margin: "10px 5px" }}
                        onClick={this.createNewData}
                        disabled={!is_disable}
                    >
                        {typeCpn === TYPE.CREATE ? " Tạo mới" : "Sửa thông tin"}
                    </Button>
                    {/* {
                        typeCpn === TYPE.FIX ?
                            <Button
                                type="primary"
                                icon="check"
                                style={{ float: "right", margin: "10px 5px" }}
                                onClick={() => {
                                    _requestToServer(
                                        PUT,
                                        PARTNER + `/${id}/password`,
                                        {
                                            newPassword: password
                                        }
                                    ).then(
                                        (res: any) => {
                                            if (res) {
                                                this.props.history.push(routeLink.PARTNER + routePath.LIST)
                                            }
                                        }
                                    )
                                }}
                                disabled={!is_disable}
                            >
                                Đổi mật khẩu
                            </Button>
                            : ''
                    } */}
                    <Button
                        type="danger"
                        icon="left"
                        style={{ float: "left", margin: "10px 5px" }}
                        onClick={
                            () => this.props.history.push(routeLink.PARTNER + routePath.LIST)
                        }
                    >
                        Hủy
                    </Button>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListRoles: () => dispatch({ type: REDUX_SAGA.ROLES.GET_ROLES }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    list_roles: state.Roles.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreatePartnerAccounts)