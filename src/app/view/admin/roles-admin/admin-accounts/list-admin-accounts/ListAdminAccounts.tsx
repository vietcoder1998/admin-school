import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Avatar, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { TYPE } from '../../../../../../const/type';
// import { REDUX_SAGA } from '../../../../../../const/actions';
import { DELETE } from '../../../../../../const/method';
import { _requestToServer } from '../../../../../../services/exec';
import { ADMIN } from '../../../../../../services/api/private.api';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { IAppState } from '../../../../../../redux/store/reducer';
import { IAdminAccount } from '../../../../../../models/admin-accounts';
import { timeConverter } from '../../../../../../utils/convertTime';
import { routeLink, routePath } from '../../../../../../const/break-cumb';

interface IListAdminAccountsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListAdminAccounts: Function;
}

interface IListAdminAccountsState {
    loadingTable: boolean;
    list_admin_accounts: Array<IAdminAccount>;
    dataTable: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    email?: string;
    id?: string;
    type?: string;
}

class ListAdminAccounts extends PureComponent<IListAdminAccountsProps, IListAdminAccountsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loadingTable: true,
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            email: "",
            id: "",
            type: TYPE.EDIT,
            list_admin_accounts: []
        }
    }

    async componentDidMount() {
        await this.props.getListAdminAccounts(0, 10);
    }

    static getDerivedStateFromProps(nextProps: IListAdminAccountsProps, prevState: IListAdminAccountsState) {
        if (nextProps.list_admin_accounts && nextProps.list_admin_accounts !== prevState.list_admin_accounts) {
            let dataTable: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_admin_accounts.forEach((item: IAdminAccount, index: number) => {
                dataTable.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    avatarUrl: <Avatar shape="square" src={item.avatarUrl} icon="user" style={{ width: 50, height: 50 }} />,
                    email: item.email,
                    username: item.username,
                    lastName: item.lastName,
                    firstName: item.firstName,
                    createdDate: item.createdDate ? timeConverter(item.createdDate, 1000, "HH:mm DD/MM/YYYY") : "",
                    lastActive: item.lastActive ? timeConverter(item.lastActive, 1000, "HH:mm DD/MM/YYYY") : "",
                    role: item.role ? item.role.name : "Chưa có"
                });
            });

            return {
                list_rolist_admin_accountsles: nextProps.list_admin_accounts,
                dataTable,
                loadingTable: false
            }
        }
        return { loadingTable: false };
    }


    EditContent = () => {
        let { id } = this.state;
        return (
            <>
                <Link to={routeLink.ADMIN_ACCOUNTS + routePath.FIX + `/${id}`}>
                    <Icon
                        key="edit"
                        className='test'
                        style={{ padding: 5, margin: 2 }}
                        type="edit"
                        theme="twoTone"
                    />
                </Link>
                <Popconfirm
                    title="Xóa tài khoản admin"
                    onConfirm={this.removeAdminAccounts}
                    okText="Xóa"
                    cancelText="Hủy"
                    okType="danger"
                    placement="topRight"
                >
                    <Icon
                        className='test'
                        style={{ padding: 5, margin: 2 }}
                        type="delete"
                        theme="twoTone"
                        twoToneColor="red"
                    />
                </Popconfirm>

            </>
        );
    }


    columns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Ảnh',
            dataIndex: 'avatarUrl',
            key: 'avatarUrl',
            width: 60,
            className: 'action',
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            width: 150,
            className: 'action',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 150,
            className: 'action',
        },
        {
            title: 'Họ',
            dataIndex: 'lastName',
            key: 'lastName',
            width: 150,
            className: 'action',

        },
        {
            title: 'Tên',
            dataIndex: 'firstName',
            key: 'firstName',
            width: 150,
            className: 'action',

        },
        {
            title: 'Quyền',
            dataIndex: 'role',
            key: 'role',
            width: 100,
            className: 'action',
        },
        {
            title: 'Đăng nhập cuối',
            dataIndex: 'lastActive',
            key: 'lastActive',
            width: 140,
            className: 'action',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 140,
            className: 'action',
        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 80,
            fixed: 'right',
            render: () => this.EditContent(),
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        this.props.getListAdminAccounts(event.current - 1, event.pageSize)
    };

    editAdminAccounts = async () => {
        let id = localStorage.getItem('id_role');
        this.props.history.push(`/admin/role-admins/roles/fix/${id}`)
    };

    removeAdminAccounts = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, ADMIN,
            [id],
        ).then(res => {
            this.props.getListAdminAccounts();
        })
    };

    render() {
        let { dataTable, loadingTable } = this.state;
        let { totalItems } = this.props;
        return (
            <>
                <div>
                    <h5>
                        Danh sách admin ({totalItems})
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            <Link to={routeLink.ADMIN_ACCOUNTS + routePath.CREATE}>
                                <Icon type="plus" />
                                Thêm mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        // @ts-ignore
                        columns={this.columns}
                        loading={loadingTable}
                        dataSource={dataTable}
                        locale={{ emptyText: 'Không có dữ liệu' }}
                        scroll={{ x: 1150 }}
                        bordered
                        pagination={{ total: totalItems, showSizeChanger: true }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {
                                }, // click row
                                onMouseEnter: (event) => {
                                    this.setState({ id: record.key })
                                }, // mouse enter row
                            };
                        }}
                    />
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListAdminAccounts: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNTS,
        pageIndex,
        pageSize
    })
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    list_admin_accounts: state.AdminAccounts.items,
    totalItems: state.AdminAccounts.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListAdminAccounts)