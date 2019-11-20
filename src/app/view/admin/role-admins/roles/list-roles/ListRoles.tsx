import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Icon, Table, Button} from 'antd';
import {Link} from 'react-router-dom';
import {ModalConfig} from '../../../../layout/modal-config/modal-config';
import {TYPE} from '../../../../../../common/const/type';
import {REDUX_SAGA} from '../../../../../../common/const/actions';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {DELETE} from '../../../../../../common/const/method';
import {_requestToServer} from '../../../../../../services/exec';
import {IRole} from '../../../../../../redux/models/roles';
import {ROLES} from '../../../../../../services/api/private.api';

interface ListRolesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListRoles: Function;
}

interface ListRolesState {
    list_roles: Array<IRole>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListRoles extends PureComponent<ListRolesProps, ListRolesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_roles: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            name: "",
            id: "",
            type: TYPE.EDIT,
        }
    }

    async componentDidMount() {
        await this.props.getListRoles(0, 10);
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_roles !== prevState.list_roles) {
            let data_table: any = [];
            let {pageIndex, pageSize} = prevState;
            nextProps.list_roles.forEach((item: any, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    type: item.type
                });
            });

            return {
                list_roles: nextProps.list_roles,
                data_table,
                loading_table: false
            }
        }
        return null;
    }


    EditContent = (
        <div>
            <Icon style={{padding: "5px 10px"}} type="delete" theme="twoTone" twoToneColor="red"
                  onClick={() => this.toggleModal(TYPE.DELETE)}/>
            <Icon key="edit" style={{padding: "5px 10px"}} type="edit" theme="twoTone"
                  onClick={() => this.toFixRoles()}/>
        </div>
    );

    toFixRoles = () => {
        let id = localStorage.getItem('id_role');
        this.props.history.push(`/admin/role-admins/roles/fix/${id}`);
    };

    toggleModal = (type?: string) => {
        let {openModal} = this.state;
        this.setState({openModal: !openModal});
        if (type) {
            this.setState({type})
        }
    };

    columns = [
        {
            title: '#',
            width: 150,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên Roles',
            dataIndex: 'name',
            key: 'name',
            width: 755,
            className: 'action',

        },
        {
            title: 'Loại quyền',
            dataIndex: 'type',
            key: 'type',
            width: 755,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 300,
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize});
        this.props.getListRoles(event.current - 1, event.pageSize)
    };

    editRoles = async () => {
        let id = localStorage.getItem('id_role');
        this.props.history.push(`/admin/role-admins/roles/fix/${id}`)
    };

    removeRoles = async () => {
        let {id} = this.state;
        await _requestToServer(
            DELETE, ROLES,
            [id],
        ).then(res => {
            this.props.getListRoles();
            this.toggleModal();
        })
    };

    render() {
        let {data_table, loading_table, openModal, name, type} = this.state;
        let {totalItems} = this.props;
        return (
            <Fragment>
                <ModalConfig
                    title={type === TYPE.EDIT ? "Sửa quyền" : "Xóa quyền"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => {
                        this.setState({openModal: !openModal})
                    }}
                    handleOk={async () => type === TYPE.EDIT ? this.editRoles() : this.removeRoles()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên quyền"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tênquyền"
                            onChange={(event: any) => this.setState({name: event})}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóaquyền : {name}</div>
                    }
                </ModalConfig>
                <div>
                    <h5>
                        Danh sáchquyền
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to='/admin/role-admins/roles/create'>
                                <Icon type="plus"/>
                                Thêm quyền mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table}
                        scroll={{x: 1000}}
                        bordered
                        pagination={{total: totalItems, showSizeChanger: true}}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {
                                }, // click row
                                onMouseEnter: (event) => {
                                    localStorage.setItem('id_role', record.key)
                                }, // mouse enter row
                            };
                        }}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListRoles: (pageIndex: number, pageSize: number) => dispatch({type: REDUX_SAGA.ROLES.GET_ROLES, pageIndex, pageSize})
});

const mapStateToProps = (state: any, ownProps: any) => ({
    list_roles: state.Roles.items,
    totalItems: state.Roles.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListRoles)