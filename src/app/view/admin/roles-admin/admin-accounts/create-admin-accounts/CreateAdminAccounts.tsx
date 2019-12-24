import React, { PureComponent, Component, } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import './CreateAdminAccounts.scss';

import { _requestToServer } from '../../../../../../services/exec';
import { POST, PUT } from '../../../../../../const/method';
import { API_CONTROLLER_ROLES, REGISTRATION_ADMINS } from '../../../../../../services/api/private.api';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { TYPE } from '../../../../../../const/type';
import { IApiFunctions } from '../../../../../../redux/models/api-controller';
import { IRole } from '../../../../../../redux/models/roles';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { routeLink, routePath } from '../../../../../../const/break-cumb';
import { IAppState } from '../../../../../../redux/store/reducer';
import { IAdminAccount } from '../../../../../../redux/models/admin-accounts';

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
    admin_account_detail?: IAdminAccount
}

interface ICreateAdminAccountsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
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
            list_value: [],
            roleID: null,
            admin_account_detail: null
        }
    }

    static getDerivedStateFromProps(nextProps?: ICreateAdminAccountsProps, prevState?: ICreateAdminAccountsState) {
        if (nextProps.match.params.id && nextProps.match.params.id !== prevState.id) {
            nextProps.getAdminAccountDetail(nextProps.match.params.id);
            return {
                id: nextProps.match.params.id,
                type_cpn: TYPE.FIX
            }
        };

        if (nextProps.admin_account_detail && nextProps.admin_account_detail !== prevState.admin_account_detail) {
            let { admin_account_detail, list_roles } = nextProps;
            let map_roles = list_roles.filter((item?: IRole) => item.id === admin_account_detail.roleID);

            return {
                admin_account_detail,
                username: admin_account_detail.username,
                firstName: admin_account_detail.firstName,
                lastName: admin_account_detail.lastName,
                password: admin_account_detail.password,
                contactEmail: admin_account_detail.email,
                role_name: map_roles[0] && map_roles[0].name
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
        if (username && password && lastName && firstName && contactEmail && roleID) {
            await _requestToServer(
                type_cpn === TYPE.CREATE ? POST : PUT,
                REGISTRATION_ADMINS + (type_cpn === TYPE.CREATE ? '' : `/${id}`),
                {
                    username: username.trim(),
                    password: password.trim(),
                    lastName: lastName.trim(),
                    firstName: firstName.trim(),
                    contactEmail: contactEmail.trim(),
                    roleID,
                }
            ).then((res: any) => {
                this.props.getListAdminAccounts();
                this.props.history.push(routeLink.ADMIN_ACCOUNTS + routePath.LIST);
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

    render() {
        let {
            username,
            type_cpn,
            password,
            firstName,
            lastName,
            contactEmail,
            role_name,
            roleID
        } = this.state;

        let {
            list_roles
        } = this.props;

        let is_disable = username && password && lastName && firstName && contactEmail && roleID;
        return (
            <>
                <div>
                    <h5>
                        {type_cpn === TYPE.CREATE ? 'Thêm tài khoản admins mới' : 'Sửa tài khoản admins'}
                    </h5>
                    <Divider orientation="left">Chi tiết tài khoản admins</Divider>
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
                        type_cpn !== TYPE.FIX ? <InputTitle
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
                        value={firstName}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ firstName: event })}
                    />
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tên"
                        placeholder="ex: Tùng"
                        widthInput="400px"
                        value={lastName}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ lastName: event })}
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
                        list_value={list_roles.map((item?: IRole) => ({label: item.name, value: item.id}))}
                        style={{ padding: "10px 30px" }}
                        onChange={
                            (event: any) => this.onChoseRoleID(event)
                        }
                    />
                    <Button
                        type="primary"
                        icon="plus"
                        style={{ float: "right", margin: "10px 5px" }}
                        onClick={this.createNewData}
                        disabled={!is_disable}
                    >
                        {type_cpn === TYPE.CREATE ? " Tạo tài khoản admins mới" : "Sửa thông tin tài khoản admins"}
                    </Button>
                    <Button
                        type="danger"
                        style={{ float: "right", margin: "10px 5px" }}
                    >
                        <Link to={routeLink.ADMIN_ACCOUNTS + routePath.LIST}>
                            <Icon type="close" />
                            Hủy
                        </Link>
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