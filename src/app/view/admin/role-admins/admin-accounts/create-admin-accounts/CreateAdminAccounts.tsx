import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
// import {REDUX_SAGA} from '../../../../../../common/const/actions';
import { _requestToServer } from '../../../../../../services/exec';
import { POST, PUT } from '../../../../../../common/const/method';
import { API_CONTROLLER_ROLES, REGISTRATION_ADMINS } from '../../../../../../services/api/private.api';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { TYPE } from '../../../../../../common/const/type';
// import { TreeSelect } from 'antd';
import { IApiFunctions } from '../../../../../../redux/models/api-controller';
import './CreateAdminAccounts.scss';
import { IRole } from '../../../../../../redux/models/roles';
import { REDUX_SAGA } from '../../../../../../common/const/actions';

// const { SHOW_PARENT } = TreeSelect;

interface CreateAdminAccountsState {
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
    list_value?: Array<{ label: string, value: any }>
    list_roles?: Array<IRole>,
    roleID?: number,
    role_name?: string,
}

interface CreateAdminAccountsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListAdminAccounts: Function;
    getListRoles: Function;
}

class CreateAdminAccounts extends PureComponent<CreateAdminAccountsProps, CreateAdminAccountsState> {
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
        }
    }

    componentDidMount() {
        this.props.getListRoles();
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_roles && nextProps.list_roles !== prevState.list_roles) {
            let list_value = nextProps.list_roles.map(item => ({ label: item.name, value: item.id }))
            return {
                list_value,
                list_roles: nextProps.list_roles
            }
        }

        return null;
    }

    onChoseRoleID = (id: number) => {
        let { list_roles } = this.state;
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
        if (username && password && lastName && firstName && contactEmail && roleID ) {
            await _requestToServer(
                type_cpn === TYPE.CREATE ? POST : PUT,
                REGISTRATION_ADMINS + (type_cpn === TYPE.CREATE ? "" : `/${id}`),
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
                this.props.history.push('/admin/role-admins/roles/list');
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
        let { username, type_cpn, password, firstName, lastName, contactEmail, list_value, role_name, roleID } = this.state;
        let is_disable = username  && password && lastName && firstName && contactEmail && roleID
        return (
            <Fragment>
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
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Mật khẩu"
                        placeholder="yêu cầu: trên 6 kí tự"
                        widthInput="400px"
                        value={password}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.setState({ password: event })}
                    />
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
                        list_value={list_value}
                        style={{ padding: "10px 30px" }}
                        onChange={(event: any) => this.onChoseRoleID(event)}
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
                        <Link to='/admin/role-admins/roles/list'>
                            <Icon type="close" />
                            Hủy
                        </Link>
                    </Button>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListRoles: () => dispatch({ type: REDUX_SAGA.ROLES.GET_ROLES })
});

const mapStateToProps = (state: any, ownProps: any) => ({
    list_roles: state.Roles.items
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateAdminAccounts)