import React from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon, Avatar } from 'antd';
import './CreateAdminAccounts.scss';

import { _requestToServer } from '../../../../../../services/exec';
import { POST, PUT } from '../../../../../../const/method';
import { API_CONTROLLER_ROLES, REGISTRATION_ADMINS, ADMIN_ACCOUNTS } from '../../../../../../services/api/private.api';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { TYPE } from '../../../../../../const/type';
import { IApiFunctions } from '../../../../../../models/api-controller';
import { IRole } from '../../../../../../models/roles';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { routeLink, routePath } from '../../../../../../const/break-cumb';
import { IAppState } from '../../../../../../redux/store/reducer';
import { IAdminAccount } from '../../../../../../models/admin-accounts';

interface ICreateAdminAccountsState {
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    contactEmail?: string;
    type?: string;
    id?: string;
    type_cpn?: string;
    role_detail?: any;
    value?: any;
    api_controller?: Array<IApiFunctions>;
    list_roles?: Array<IRole>,
    roleID?: number,
    role_name?: string,
    admin_account_detail?: IAdminAccount,
    loading_content_img?: boolean,
    loading?: boolean,
    avatarUrl?: string;
    avatar?: any;
}

interface ICreateAdminAccountsProps extends StateProps, DispatchProps {
    match: any;
    history: any;
    getListAdminAccounts?: Function;
    getListRoles?: Function;
    getAdminAccountDetail?: (id?: string) => any;
}

class CreateAdminAccounts extends React.Component<ICreateAdminAccountsProps, ICreateAdminAccountsState> {
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
            type_cpn: TYPE.CREATE,
            value: null,
            roleID: null,
            admin_account_detail: null,
            loading: false,
            loading_content_img: false,
            avatar: null,
        }
    }

    static getDerivedStateFromProps(nextProps?: ICreateAdminAccountsProps, prevState?: ICreateAdminAccountsState) {
        if (nextProps.match.params.id && nextProps.match.params.id !== prevState.id) {
            nextProps.getAdminAccountDetail(nextProps.match.params.id);
           
            return {
                id: nextProps.match.params.id,
                type_cpn: TYPE.FIX
            }
        }

        if (nextProps.admin_account_detail && nextProps.admin_account_detail !== prevState.admin_account_detail) {
            let { admin_account_detail } = nextProps;

            if (prevState.id === localStorage.getItem("userID")) {
                localStorage.setItem("avatarUrl", nextProps.admin_account_detail.avatarUrl);
            }

            return {
                admin_account_detail,
                username: admin_account_detail.username,
                firstName: admin_account_detail.firstName,
                lastName: admin_account_detail.lastName,
                password: admin_account_detail.password,
                contactEmail: admin_account_detail.email,
                role_name: admin_account_detail.role && admin_account_detail.role.name,
                roleID: admin_account_detail.role && admin_account_detail.role.id
            }
        };

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
        let { username, type_cpn, id, password, lastName, firstName, contactEmail, roleID } = this.state;
        let body = null;

        if (type_cpn === TYPE.FIX) {
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
                contactEmail: contactEmail.trim(),
                roleID,
            }
        }

        if (username && lastName && firstName && contactEmail && roleID) {
            await _requestToServer(
                type_cpn === TYPE.CREATE ? POST : PUT,
                (type_cpn === TYPE.CREATE ? REGISTRATION_ADMINS : ADMIN_ACCOUNTS)
                + (type_cpn === TYPE.CREATE ? '' : `/${id}/profile`),
                body
            ).then((res: any) => {
                if (res) {
                    this.props.history.push(routeLink.ADMIN_ACCOUNTS + routePath.LIST);
                }
            });
        }
    };

    updateApiControllerAdminAccounts = async () => {
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
            ADMIN_ACCOUNTS + `/${id}/avatar`,
            formData,
        ).then(
            (res: any) => {
                if (res) {
                    this.props.getAdminAccountDetail(id);
                }
            }
        ).finally(
            () => this.setState({loading_content_img: false})
        )

    };

    render() {
        let {
            username,
            type_cpn,
            password,
            firstName,
            lastName,
            contactEmail,
            role_name,
            roleID,
            id,
            admin_account_detail,
            loading_content_img
        } = this.state;

        let {
            list_roles
        } = this.props;

        let is_disable = username && lastName && firstName && contactEmail && roleID;
        return (
            <>
                <div>
                    <h5>
                        {type_cpn === TYPE.CREATE ? 'Thêm tài khoản admins mới' : 'Sửa tài khoản admins'}
                    </h5>
                    <Divider orientation="left">Chi tiết tài khoản admins</Divider>
                    {
                        type_cpn === TYPE.FIX ?
                            <InputTitle
                                title="Ảnh đại diện"
                                placeholder="ex: không có dấu cách"
                                widthInput="400px"
                                value={username}
                                style={{ padding: "10px 30px" }}
                                children={
                                    <div>
                                        <div>
                                            <Avatar
                                                shape={'square'}
                                                src={admin_account_detail && admin_account_detail.avatarUrl}
                                                size={100}
                                                alt='Ảnh'
                                            />
                                        </div>
                                        <div>
                                            <input
                                                id="imgContent"
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={
                                                    (event: any) => {
                                                        this.uploadFileToServer(event.target.files[0])
                                                    }
                                                }
                                            />
                                            <label
                                                className='upload-img-content'
                                                htmlFor="imgContent"
                                            >
                                                {!loading_content_img ? <Icon type="upload" /> :
                                                    <Icon type="loading" style={{ color: "blue" }} />}
                                                Upload
                                            </label>
                                        </div>
                                    </div>
                                }
                            /> : ''
                    }
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tên tài khoản admins"
                        placeholder="ex: không có dấu cách"
                        widthInput="400px"
                        value={username}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ username: event })}
                    />
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tên tài khoản admins"
                        placeholder="ex: không có dấu cách"
                        widthInput="400px"
                        value={username}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ username: event })}
                    />
                    {
                        type_cpn !== TYPE.FIX ?
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
                    <InputTitle
                        type={TYPE.SELECT}
                        title="Loại tài khoản admins"
                        placeholder="ex: Quản lý, Sinh viên, SUPER_ADMINS, .v.v."
                        widthInput="400px"
                        value={role_name}
                        list_value={list_roles.map((item?: IRole) => ({ label: item.name, value: item.id }))}
                        style={{ padding: "10px 30px" }}
                        onChange={
                            (event: any) => this.onChoseRoleID(event)
                        }
                    />
                    {
                        type_cpn === TYPE.FIX ?
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
                        icon={type_cpn === TYPE.CREATE ? "plus" : "check"}
                        style={{ float: "right", margin: "10px 5px" }}
                        onClick={this.createNewData}
                        disabled={!is_disable}
                    >
                        {type_cpn === TYPE.CREATE ? " Tạo tài khoản admins mới" : "Sửa thông tin tài khoản admins"}
                    </Button>
                    {
                        type_cpn === TYPE.FIX ?
                            <Button
                                type="primary"
                                icon="check"
                                style={{ float: "right", margin: "10px 5px" }}
                                onClick={() => {
                                    _requestToServer(
                                        PUT,
                                        ADMIN_ACCOUNTS + `/${id}/password`,
                                        {
                                            newPassword: password
                                        }
                                    ).then(
                                        (res: any) => {
                                            if (res) {
                                                this.props.history.push(routeLink.ADMIN_ACCOUNTS + routePath.LIST)
                                            }
                                        }
                                    )
                                }}
                                disabled={!is_disable}
                            >
                                Đổi mật khẩu
                            </Button>
                            : ''
                    }
                    <Button
                        type="danger"
                        icon="left"
                        style={{ float: "left", margin: "10px 5px" }}
                        onClick={
                            () => this.props.history.push(routeLink.ADMIN_ACCOUNTS + routePath.LIST)
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
    getAdminAccountDetail: (id?: string) => dispatch({ type: REDUX_SAGA.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNT_DETAIL, id }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    list_roles: state.Roles.items,
    admin_account_detail: state.AdminAccountDetail
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateAdminAccounts)