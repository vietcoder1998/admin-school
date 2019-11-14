import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { _requestToServer } from '../../../../../../services/exec';
import { POST, GET, PUT } from '../../../../../../common/const/method';
import { ROLES } from '../../../../../../services/api/private.api';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { authHeaders } from '../../../../../../services/auth';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { TYPE } from '../../../../../../common/const/type';

interface CreateRolesState {
    name?: string;
    type?: string;
    id?: string;
    type_cpn?: string;
    role_detail?: any;
}

interface CreateRolesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListRoles: Function;
    getRoleDetail: Function;
}

class CreateRoles extends PureComponent<CreateRolesProps, CreateRolesState> {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            type: '',
            id: "",
            type_cpn: TYPE.CREATE,
            role_detail: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.id && nextProps.match.params.id !== prevState.id) {
            nextProps.getRoleDetail(nextProps.match.params.id);
            return {
                id: nextProps.match.params.id,
                type_cpn: TYPE.EDIT
            }
        }

        if (nextProps.role_detail !== prevState.role_detail) {
            return {
                name: nextProps.role_detail.name,
                type: nextProps.role_detail.type,
                role_detail: nextProps.role_detail
            }
        }

        return {
            type_cpn: TYPE.CREATE
        }
    }

    createNewData = async () => {
        let { name, type, type_cpn, id } = this.state;
        await _requestToServer(
            type_cpn === TYPE.CREATE ? POST : PUT,
            { name: name.trim(), type: type.trim().toUpperCase() },
            ROLES + (type_cpn === TYPE.CREATE ? "" : `/${id}`),
            ADMIN_HOST,
            authHeaders,
            null,
            true,
        ).then(res => {
            if (res.code === 200) {
                this.props.getListRoles();
                this.props.history.push('/admin/role-admins/roles/list');
            }
        })
    }

    onChange = (event) => {
        this.setState({ name: event })
    }

    createData = () => {

    }

    render() {
        let { name, type, type_cpn } = this.state;
        let is_name = name && name.trim() !== "" && type && type.trim() !== "" ? true : false;
        let new_type = type ? type = type.toUpperCase() : "";
        return (
            <Fragment >
                <div>
                    <h5>
                        {type_cpn === TYPE.CREATE ? 'Thêm quyền mới' : 'Sửa quyền'}
                    </h5>
                    <Divider orientation="left" >Chi tiết quyền</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên quyền mới"
                    placeholder="Nhập tên quyền"
                    widthInput="400px"
                    value={name}
                    style={{ padding: "10px 30px" }}
                    onChange={event => this.setState({ name: event })}
                />

                <InputTitle
                    type={TYPE.INPUT}
                    title="Loại quyền"
                    placeholder="ex: ADMINS, CANDIDATES, SUPER_ADMINS, ..."
                    widthInput="400px"
                    value={new_type}
                    style={{ padding: "10px 30px" }}
                    onChange={event => this.setState({ type: event })}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{ float: "right", margin: "10px 5px" }}
                    onClick={this.createNewData}
                    disabled={!is_name}
                >
                    {type_cpn === TYPE.CREATE ? " Tạo quyền mới" : "Sửa thông tin quyền"}

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
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getRoleDetail: (rid) => dispatch({ type: REDUX_SAGA.ROLES.GET_ROLE_DETAIL, rid }),
    getListRoles: () => dispatch({ type: REDUX_SAGA.ROLES.GET_ROLES })
})

const mapStateToProps = (state, ownProps) => ({
    role_detail: state.RoleDetail.data
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoles)