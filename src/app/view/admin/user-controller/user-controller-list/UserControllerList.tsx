import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Button, Table, Icon, Modal, Tooltip, Popconfirm, Col, Select, Row, Input } from 'antd';
import './UserControllerList.scss';
import { Link } from 'react-router-dom';
import { routeLink, routePath } from '../../../../../common/const/break-cumb';
import { IUserController } from '../../../../../redux/models/user-controller';
import { timeConverter } from '../../../../../common/utils/convertTime';
import { IAppState } from '../../../../../redux/store/reducer';
import { REDUX_SAGA } from '../../../../../common/const/actions';
import { _requestToServer } from '../../../../../services/exec';
import { DELETE } from '../../../../../common/const/method';
import { USER_CONTROLLER } from '../../../../../services/api/private.api';
import { TYPE } from '../../../../../common/const/type';
import { IptLetterP } from '../../../layout/common/Common';

interface IUserControllerListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    getListUserControllers: Function;
    getAnnoucementDetail: Function;
};

interface IUserControllerListState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    show_modal?: boolean;
    loading?: boolean;
    value_type?: string;
    id?: string;
    loading_table?: boolean;
    body?: IUserController;
    list_user_controller?: Array<IUserController>
};

class UserControllerList extends PureComponent<IUserControllerListProps, IUserControllerListState> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            show_modal: false,
            loading: false,
            id: null,
            loading_table: true,
            body: {
                username: null,
                email: null,
                activated: null,
                createdDate: null,
                lastActive: null,
                banned: null,
            },
            list_user_controller: []
        };
    }

    editToolAction = () => {
        let { id } = this.state;
        return <>
            <Tooltip
                title={"Xem chi tiết"}
            >
                <Link to={routeLink.USER_CONTROLLER + routePath.DETAIL + `/${id}`} target="_blank">
                    <Icon
                        style={{ padding: "5px 10px", color: "" }}
                        type="search"
                    />
                </Link>
            </Tooltip>
            <Popconfirm
                placement="topRight"
                title={"Xóa khỏi danh sách"}
                onConfirm={(event: any) => this.createRequest()}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Icon style={{ padding: "5px 10px" }} type="delete" theme="twoTone" twoToneColor="red" />
            </Popconfirm>
            <Popconfirm
                placement="topRight"
                title={"Chặn người dùng này"}
                onConfirm={(event: any) => this.createRequest()}
                okText="Chặn"
                cancelText="Hủy"
            >
                <Icon style={{ padding: "5px 10px" }} type="stop" theme="twoTone" twoToneColor="red" />
            </Popconfirm>
        </>
    };

    columns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: 'left',
        },

        {
            title: 'Tên tài khoản',
            dataIndex: 'username',
            className: 'action',
            key: 'username',
            width: 200,
        },
        {
            title: 'Thư điện tử',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: 'Trạng thái cấm',
            dataIndex: 'banned',
            className: 'action',
            key: 'banned',
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 100,
        },
        {
            title: 'Đăng nhập cuối',
            dataIndex: 'lastActive',
            className: 'action',
            key: 'lastActive',
            width: 100,
        },

        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            width: 200,
            render: () => this.editToolAction()
        },
    ];

    onToggleModal = () => {
        let { show_modal } = this.state;
        this.setState({ show_modal: !show_modal });
    };

    static getDerivedStateFromProps(nextProps?: IUserControllerListProps, prevState?: IUserControllerListState) {
        if (nextProps.list_user_controller && nextProps.list_user_controller !== prevState.list_user_controller) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];
            nextProps.list_user_controller.forEach((item: IUserController, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    username: item.username ? item.username : '',
                    email: item.email ? item.email : '',
                    banned: item.banned ? item.banned : "",
                    lastActive: item.lastActive !== -1 ? timeConverter(item.lastActive, 1000) : null,
                    createdDate: timeConverter(item.createdDate, 1000),
                });
            })
            return {
                list_user_controller: nextProps.list_user_controller,
                data_table,
                loading_table: false,
            }
        } return null;
    };

    async componentDidMount() {
        await this.searchUserControllers();
    };

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchUserControllers();
    };

    searchUserControllers = async () => {
        let { pageIndex, pageSize, body } = this.state;
        await this.props.getListUserControllers(pageIndex, pageSize, body);
    };

    createRequest = async (type?: string) => {
        let { id } = this.state;
        let method = null;
        switch (type) {
            case TYPE.DELETE:

                break;
            case TYPE.BAN:

                break;

            default:
                break;
        }
        await _requestToServer(
            DELETE,
            USER_CONTROLLER + '/saved',
            [id],
            undefined,
            undefined,
            undefined,
            true,
            false,
        ).then(
            (res: any) => {
                if (res) { this.searchUserControllers() }
            }
        )
    }

    onChangeFilter = (value?: any, type?: string) => {
        let { body } = this.state;
        switch (value) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
            default:
                break;
        }
        body[type] = value;
        this.setState(body);
    }

    render() {
        let {
            data_table,
            loading_table,
        } = this.state;

        let {
            totalItems,
        } = this.props
        return (
            <Fragment>
                <div className="common-content">
                    <h5>
                        Quản lí ứng viên
                        <Button
                            icon="filter"
                            onClick={() => this.searchUserControllers()}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </h5>
                    <Row>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <IptLetterP value={"Tên tài khoản"} style={{}} >
                                <Input
                                    placeholder='ex: works'
                                    onChange={
                                        (event: any) => this.onChangeFilter(event.target.value, TYPE.USER_CONTROLLER.username)
                                    }
                                    onKeyDown={
                                        (event: any) => {
                                            if (event.keyCode === 13) {
                                                this.searchUserControllers()
                                            }
                                        }
                                    }
                                />
                            </IptLetterP>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <IptLetterP value={"Địa chỉ Email"} style={{}} >
                                <Input
                                    placeholder='ex: works'
                                    onChange={
                                        (event: any) => this.onChangeFilter(event.target.value, TYPE.USER_CONTROLLER.email)
                                    }
                                    onKeyDown={
                                        (event: any) => {
                                            if (event.keyCode === 13) {
                                                this.searchUserControllers()
                                            }
                                        }
                                    }
                                />
                            </IptLetterP>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <IptLetterP value={"Trạng thái hoạt động"} />
                            <Select
                                showSearch
                                placeholder="Tất cả"
                                optionFilterProp="children"
                                style={{ width: "100%" }}
                            >
                                <Select.Option key="1" value={undefined}>Tất cả</Select.Option>
                                <Select.Option key="3" value={TYPE.TRUE}>Đang hoạt động</Select.Option>
                                <Select.Option key="4" value={TYPE.FALSE}>Không hoạt động</Select.Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <IptLetterP value={"Trạng thái cấm"} />
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                defaultValue="Tất cả"
                                onChange={(event?: any) => this.onChangeFilter(event, TYPE.USER_CONTROLLER.banned)}
                            >
                                <Select.Option key="1" value={undefined}>Tất cả</Select.Option>
                                <Select.Option key="2" value={TYPE.PENDING}>Đang bị cấm</Select.Option>
                                <Select.Option key="3" value={TYPE.REJECTED}>Không bị cấm</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <div className="table-operations">
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 1050 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record: any, rowIndex: any) => {
                                return {
                                    onClick: () => {
                                        this.setState({ id: record.key })
                                    }, // mouse enter row
                                };
                            }}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListUserControllers: (pageIndex: number, pageSize: number, body?: IUserController) =>
        dispatch({ type: REDUX_SAGA.USER_CONTROLLER.GET_USER_CONTROLLER, pageIndex, pageSize, body }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    list_user_controller: state.UserControllers.items,
    totalItems: state.UserControllers.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserControllerList);