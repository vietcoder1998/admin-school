import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {Link} from 'react-router-dom';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {_requestToServer} from '../../../../../../services/exec';
import {POST, PUT} from '../../../../../../const/method';
import {ROLES, API_CONTROLLER_ROLES} from '../../../../../../services/api/private.api';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {TYPE} from '../../../../../../const/type';
import {TreeSelect} from 'antd';
import {ITreeParent, renderTreeApi} from '../../../../../../utils/renderTreeApi';
import {IApiFunctions} from '../../../../../../redux/models/api-controller';
import './CreateRoles.scss';

const {SHOW_PARENT} = TreeSelect;

interface CreateRolesState {
    name?: string;
    type?: string;
    id?: string;
    type_cpn?: string;
    role_detail?: any;
    value?: any;
    treeData?: Array<ITreeParent>;
    api_controller?: Array<IApiFunctions>;
}

interface CreateRolesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListRoles: Function;
    getRoleDetail: Function;
    getApiController: Function;
}

class CreateRoles extends PureComponent<CreateRolesProps, CreateRolesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            type: "",
            id: "",
            type_cpn: TYPE.CREATE,
            role_detail: {},
            value: null,
            treeData: []
        }
    }

    componentDidMount() {
        this.props.getApiController();
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.match.params.id && nextProps.match.params.id !== prevState.id) {
            nextProps.getRoleDetail(nextProps.match.params.id);
            nextProps.getApiControllerRoles(nextProps.match.params.id);
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

        if (nextProps.api_controller_roles !== prevState.api_controller_roles) {
            let value = renderTreeApi(nextProps.api_controller_roles).value;
            return {
                value,
                api_controller_roles: nextProps.api_controller_roles
            }
        }

        return { loading_table: false };
    }

    createNewData = async () => {
        let {name, type, type_cpn, id} = this.state;
        if (name && type) {
            await _requestToServer(
                type_cpn === TYPE.CREATE ? POST : PUT,
                ROLES + (type_cpn === TYPE.CREATE ? "" : `/${id}`),
                {
                    name: name.trim(),
                    type: type.trim().toUpperCase()
                }
            ).then((res: any) => {
                this.props.getListRoles();
                this.props.history.push('/admin/role-admins/roles/list');
            });
        }
    };

    updateApiControllerRoles = async () => {
        let {id, value} = this.state;
        await _requestToServer(
            PUT, API_CONTROLLER_ROLES + `/${id}/apis`,
            value
        );
    };

    onChange = (event: any) => {
        this.setState({name: event})
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
        this.setState({value: map_arr});
    };


    render() {
        let {name, type, type_cpn, value} = this.state;
        let {treeData} = this.props;
        let is_name = name !== "" && type !== "";
        let new_type = type ? type = type.toUpperCase() : "";
        const tProps = {
            treeData,
            value,
            onChange: this.onChangeApiController,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: 'Chọn phân quyền',
            style: {
                width: '400px',
            }
        };
        return (
            <Fragment>
                <div>
                    <h5>
                        {type_cpn === TYPE.CREATE ? 'Thêm quyền mới' : 'Sửa quyền'}
                    </h5>
                    <Divider orientation="left">Chi tiết quyền</Divider>
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tên quyền mới"
                        placeholder="ex: nhà tuyển dụng, quản trị viên, .v.v."
                        widthInput="400px"
                        value={name}
                        style={{padding: "10px 30px"}}
                        onChange={(event: any) => this.setState({name: event})}
                    />

                    <InputTitle
                        type={TYPE.SELECT}
                        title="Loại quyền"
                        placeholder="ex: ADMINS, CANDIDATES, SUPER_ADMINS, .v.v."
                        widthInput="400px"
                        value={new_type}
                        list_value={[{label: "ROOT", value: "ROOT"}, {label: "VIEWER", value: "VIEWER"}]}
                        style={{padding: "10px 30px"}}
                        onChange={(event: any) => this.setState({type: event})}
                    />
                    <Button
                        type="primary"
                        icon="plus"
                        style={{float: "right", margin: "10px 5px"}}
                        onClick={this.createNewData}
                        disabled={!is_name}
                    >
                        {type_cpn === TYPE.CREATE ? " Tạo quyền mới" : "Sửa thông tin quyền"}

                    </Button>
                    <Button
                        type="danger"
                        style={{float: "right", margin: "10px 5px"}}
                    >
                        <Link to='/admin/role-admins/roles/list'>
                            <Icon type="close"/>
                            Hủy
                        </Link>
                    </Button>
                </div>
                <div className="api-role-controller"
                     style={{height: "50vh", display: type_cpn === TYPE.EDIT ? "block" : "none"}}>
                    <Divider orientation="left">Cập nhật phân quyền</Divider>
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Loại quyền"
                        placeholder="ex: ADMINS, CANDIDATES, SUPER_ADMINS, ..."
                        widthInput="400px"
                        value={new_type}
                        style={{padding: "10px 30px"}}
                        onChange={(event: any) => this.setState({type: event})}
                    >
                        <div>
                            <TreeSelect {...tProps} />
                        </div>
                    </InputTitle>
                    <Button
                        type="primary"
                        icon="plus"
                        style={{float: "right", margin: "10px 5px"}}
                        onClick={this.updateApiControllerRoles}
                        disabled={!is_name}
                    >
                        Cập nhật phân quyền
                    </Button>
                </div>
                <Button
                    type="danger"
                    style={{float: "left", margin: "10px 5px"}}
                    size='large'
                >
                    <Link to='/admin/role-admins/roles/list'>
                        <Icon type="left"/>
                        Về trang trước
                    </Link>
                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getRoleDetail: (rid: number) => dispatch({type: REDUX_SAGA.ROLES.GET_ROLE_DETAIL, rid}),
    getApiControllerRoles: (id: number) => dispatch({type: REDUX_SAGA.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES, id}),
    getListRoles: () => dispatch({type: REDUX_SAGA.ROLES.GET_ROLES}),
    getApiController: () => dispatch({type: REDUX_SAGA.ROLES.GET_ROLES}),
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    role_detail: state.RoleDetail.data,
    treeData: state.ApiController.treeData,
    api_controller_roles: state.ApiControllerRoles.data,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoles)