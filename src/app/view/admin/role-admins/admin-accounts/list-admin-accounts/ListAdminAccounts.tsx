import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { TYPE } from '../../../../../../common/const/type';
// import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { DELETE } from '../../../../../../common/const/method';
import { _requestToServer } from '../../../../../../services/exec';
import { ROLES } from '../../../../../../services/api/private.api';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { IAppState } from '../../../../../../redux/store/reducer';
import { IAdminAccount } from '../../../../../../redux/models/admin-accounts';
import { timeConverter } from '../../../../../../common/utils/convertTime';

interface IListAdminAccountsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListAdminAccounts: Function;
}

interface IListAdminAccountsState {
    loading_table: boolean;
    list_admin_accounts: Array<IAdminAccount>;
    data_table: Array<any>;
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
            loading_table: true,
            data_table: [],
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
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_admin_accounts.forEach((item: IAdminAccount, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    avatarUrl: <Avatar shape="square" src={item.avatarUrl} icon="user" /> ,
                    email: item.email,
                    lastName: item.lastName,
                    firstName: item.firstName,
                    createdDate: item.createdDate ? timeConverter(item.createdDate, 1000, "HH:mm DD/MM/YYYY") : "",
                    lastActive: item.lastActive ? timeConverter(item.lastActive, 1000, "HH:mm DD/MM/YYYY") : "",
                    role: item.role ? item.role.name : "Chưa có"
                });
            });

            return {
                list_rolist_admin_accountsles: nextProps.list_admin_accounts,
                data_table,
                loading_table: false
            }
        }
        return null;
    }


    EditContent = (
        <div>
            <Icon className = 'test' style={{ padding: 5, margin: 2 }} type="delete" theme="twoTone" twoToneColor="red"
                onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon key="edit" className = 'test' style={{ padding: 5, margin: 2 }} type="edit" theme="twoTone"
                onClick={() => this.toFixAdminAccounts()} />
        </div>
    );

    toFixAdminAccounts = () => {
        let id = localStorage.getItem('id_role');
        this.props.history.push(`/admin/role-admins/roles/fix/${id}`);
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
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        this.props.getListAdminAccounts(event.current - 1, event.pageSize)
    };

    editAdminAccounts = async () => {
        let id = localStorage.getItem('id_role');
        this.props.history.push(`/admin/role-admins/roles/fix/${id}`)
    };

    removeAdminAccounts = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, ROLES,
            [id],
        ).then(res => {
            this.props.getListAdminAccounts();
            this.toggleModal();
        })
    };

    render() {
        let { data_table, loading_table} = this.state;
        // let { totalItems } = this.props;
        return (
            <Fragment>
                <div>
                    <h5>
                        Danh sách admin
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to='/admin/role-admins/roles/create'>
                                <Icon type="plus" />
                                Thêm admin mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        // @ts-ignore
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table}
                        scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: 20, showSizeChanger: true }}
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

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListAdminAccounts: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNTS,
        pageIndex,
        pageSize
    })
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    list_admin_accounts: state.AdminAccounts.items
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListAdminAccounts)