import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { TYPE } from '../../../../../../const/type';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { DELETE } from '../../../../../../const/method';
import { _requestToServer } from '../../../../../../services/exec';
import { IRole } from '../../../../../../models/roles';
import { ROLES } from '../../../../../../services/api/private.api';
import { routeLink, routePath } from '../../../../../../const/break-cumb';

interface ListRolesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListRoles: Function;
}

interface ListRolesState {
    list_roles: Array<IRole>,
    loadingTable: boolean;
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
            loadingTable: false,
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

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.list_roles && nextProps.list_roles !== prevState.list_roles) {
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
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
                loadingTable: false
            }
        }
        return { loadingTable: false };
    }


    EditContent = (
        <>
            <Icon
                key="edit"
                className='test'
                style={{ padding: 5, margin: 2 }}
                type="edit"
                theme="twoTone"
                onClick={() => this.toFixRoles()}
            />
            <Icon
                className='test'
                style={{ padding: 5, margin: 2 }}
                type="delete"
                theme="twoTone"
                twoToneColor="red"
                onClick={() => this.toggleModal(TYPE.DELETE)}
            />
        </>
    );

    toFixRoles = () => {
        let id = localStorage.getItem('id_role');
        this.props.history.push(routeLink.ROLES_ADMIN + routePath.FIX + `/${id}`);
    };

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        this.setState({ openModal: !openModal });
        if (type) {
            this.setState({ type })
        }
    };

    columns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'index',
            key: 'index',
            fixed: 'left',
            className: 'action',
        },
        {
            title: 'Tên Roles',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            className: 'action',

        },
        {
            title: 'Loại quyền',
            dataIndex: 'type',
            key: 'type',
            width: 250,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 100,
            fixed: 'right',
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        this.props.getListRoles(event.current - 1, event.pageSize)
    };

    editRoles = async () => {
        let id = localStorage.getItem('id_role');
        this.props.history.push(`/admin/role-admins/roles/fix/${id}`)
    };

    removeRoles = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, ROLES,
            [id],
        ).then(res => {
            this.props.getListRoles();
            this.toggleModal();
        })
    };

    render() {
        let { data_table, loadingTable, openModal, name, type } = this.state;
        let { totalItems } = this.props;
        return (
            <>
                <ModalConfig
                    title={type === TYPE.EDIT ? "Sửa quyền" : "Xóa quyền"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => {
                        this.setState({ openModal: !openModal })
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
                            onChange={(event: any) => this.setState({ name: event })}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóaquyền : {name}</div>
                    }
                </ModalConfig>
                <div>

                </div>
                <Row>
                    <Col md={2} lg={0} xl={2} xxl={4} />
                    <Col md={20} lg={24} xl={20} xxl={16}>
                        <h5>
                            Danh sách quyền
                             <Button
                                onClick={() => {
                                }}
                                type="primary"
                                style={{
                                    float: "right",
                                }}
                            >
                                <Link to={routeLink.ROLES_ADMIN + routePath.CREATE}>
                                    <Icon type="plus" />
                                 Thêm mới
                                </Link>
                            </Button>
                        </h5>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={data_table}
                            scroll={{ x: 650 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
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
                    </Col>
                    <Col md={2} lg={0} xl={2} xxl={4} />
                </Row>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListRoles: (pageIndex: number, pageSize: number) => dispatch({ type: REDUX_SAGA.ROLES.GET_ROLES, pageIndex, pageSize })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_roles: state.Roles.items,
    totalItems: state.Roles.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListRoles)