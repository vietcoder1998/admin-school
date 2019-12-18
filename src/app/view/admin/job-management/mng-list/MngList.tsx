import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../common/const/actions';
import { Button, Table, Icon, Select, Row, Col, DatePicker, Rate, Tabs, List, Avatar, Skeleton, Checkbox, Popconfirm, message, Tooltip, Drawer } from 'antd';
import { timeConverter, momentToUnix } from '../../../../../common/utils/convertTime';
import './MngList.scss';
import { TYPE } from '../../../../../common/const/type';
import { Link } from 'react-router-dom';
import { IptLetter } from '../../../layout/common/Common';
import { ModalConfig } from '../../../layout/modal-config/ModalConfig';
import { _requestToServer } from '../../../../../services/exec';
import { DELETE, PUT } from '../../../../../common/const/method';
import { ANNOUNCEMENT_DETAIL, ANNOU_COMMENTS } from '../../../../../services/api/private.api';
import { IAnnouCommentsBody, IAnnouComment } from '../../../../../redux/models/annou-comments';
import { IAppState } from '../../../../../redux/store/reducer';
import Loading from '../../../layout/loading/Loading';
import { IDrawerState } from '../../../../../redux/models/mutil-box';

let { Option } = Select;
const { TabPane } = Tabs;

let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <img src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} />
    } else {
        return <div style={{ width: "60px", height: "60px", padding: "20px 0px" }}>
            <Icon type="area-chart" />
        </div>
    }
};

interface IMngListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    getListTypeManagement: Function;
    getListAnnouncements: Function;
    getAnnouncementDetail: Function;
    getListAnnouComment: Function;
    handleDrawer: (drawerState?: IDrawerState) => any;
}

interface IJobMmgtable {
    table_columns: {
        key?: string;
        index: number;
        title: string;
        admin: string;
        modifyAdmin: string;
        createdDate: string;
        lastModified: string;
        imageUrl: any;
        hidden: string;
        announcementType: string;
        render: JSX.Element;
    }
};

interface IMngListState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    employerID?: string;
    target?: string;
    jobNameID?: string;
    jobId?: string;
    show_modal?: boolean;
    pendingJob?: any;
    message?: string;
    list_annou_types?: Array<any>;
    value_type?: string;
    announcementTypeID?: number;
    createdDate?: number;
    adminID?: string;
    hidden?: boolean;
    list_announcements?: Array<any>;
    id?: string;
    loading_table?: boolean;
    open_config_modal?: boolean;
    initLoading?: boolean;
    loading?: boolean;
    data?: Array<any>;
    list?: Array<any>;
    loadingMore?: boolean;
    count?: number;
    body?: IAnnouCommentsBody;
    pageIndexAC?: number;
    pageSizeAC?: number;
    tabKey: number;
    list_remove: Array<string | number>;
    tab_key: string;
};

class MngList extends PureComponent<IMngListProps, IMngListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            target: undefined,
            list_annou_types: [],
            announcementTypeID: undefined,
            createdDate: undefined,
            adminID: undefined,
            hidden: undefined,
            list_announcements: [],
            id: "",
            loading_table: true,
            initLoading: false,
            loading: false,
            data: [],
            loadingMore: false,
            count: 5,
            pageIndex: 0,
            pageSize: 10,
            pageIndexAC: 0,
            pageSizeAC: 5,
            body: {
                rating: null,
                userID: null,
                userType: null,
                createdDate: null,
                lastModified: null
            },
            tabKey: 1,
            list_remove: [],
            tab_key: "1",
        }
    };


    toFixJob = () => {
        let id = localStorage.getItem('id_mgm');
        this.props.history.push(`/admin/job-management/fix/${id}`);
    };

    deleteAnnouncements = async () => {
        _requestToServer(
            DELETE, ANNOUNCEMENT_DETAIL,
            [localStorage.getItem("id_mgm")],
        ).then((res: any) => {
            this.searchAnnouncement();
        });

        this.toggleModalConfig();
    };

    columns = [
        {
            title: '#',
            width: 20,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: 'left',
        },
        {
            title: 'Ảnh đại diện',
            width: 80,
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            className: "action"
        },
        {
            title: 'Tiêu đề',
            width: 200,
            dataIndex: 'title',
            key: 'jobTitle',
        },

        {
            title: 'Người viết',
            dataIndex: 'admin',
            className: 'action',
            key: 'admin',
            width: 110,
        },
        {
            title: 'Người sửa',
            dataIndex: 'modifyAdmin',
            key: 'modifyAdmin',
            width: 110,
        },

        {
            title: 'Trạng thái',
            dataIndex: 'hidden',
            className: 'action',
            key: 'hidden',
            width: 100,
        },
        {
            title: 'Loại bài viết',
            dataIndex: 'announcementType',
            className: 'action',
            key: 'announcementType',
            width: 100,
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 100,
        },
        {
            title: 'Lần sửa cuối',
            dataIndex: 'lastModified',
            className: 'action',
            key: 'lastModified',
            width: 100,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            dataIndex: 'operation',
            fixed: 'right',
            className: 'action',
            width: 160,
        },
    ];

    onToggleModal = () => {
        let { show_modal } = this.state;
        if (!show_modal) {
            let id = localStorage.getItem("id_mgm");
            this.props.getAnnouncementDetail(id);
        }
        this.getData();
        this.setState({ show_modal: !show_modal, pageSizeAC: 5, tab_key: "1", list_remove: [] });
    };

    static getDerivedStateFromProps(nextProps: IMngListProps, prevState: IMngListState) {
        if (nextProps.list_annou_types !== prevState.list_annou_types) {
            return {
                list_annou_types: nextProps.list_annou_types,
                value_type: "Tất cả",
                announcementTypeID: null
            }
        };

        if (nextProps.list_announcements !== prevState.list_announcements) {
            let { pageIndex, pageSize, pageIndexAC, pageSizeAC, body } = prevState;
            let data_table: any = [];
            nextProps.list_announcements.forEach((item: any, index: number) => {
                const EditJob = (item?: any) => (
                    <>
                        <Tooltip
                            title="Xem bài viết"
                            placement="topLeft"
                        >
                            <Icon
                                type="search"
                                style={{ padding: "5px 10px" }}
                                onClick={async () => {
                                    await nextProps.handleDrawer();
                                    setTimeout(() => {
                                        nextProps.getAnnouncementDetail(item.id);
                                        nextProps.getListAnnouComment(pageIndexAC, pageSizeAC + 5, item.id, body)
                                    }, 250)
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            title={"Chi tiết bài viết(sửa)"}
                        >
                            <Link to={`/admin/job-management/fix/${item.id}`} target='_blank'>
                                <Icon type="edit" style={{ padding: "5px 10px" }} theme="twoTone" />
                            </Link>
                        </Tooltip>

                        <Tooltip
                            title={!item.hidden ? "Ẩn bài đăng" : "Hiện bài đăng"}
                        >
                            <Icon type={item.hidden ? "eye" : "eye-invisible"} style={{ padding: "5px 10px" }} onClick={async () =>
                                await _requestToServer(
                                    PUT,
                                    ANNOUNCEMENT_DETAIL + `/${item.id}/hidden/${!item.hidden}`,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    false,
                                ).then(
                                    (res: any) => {
                                        if (res) {
                                            message.success("Thành công", 3);
                                            nextProps.getListAnnouncements(prevState.pageIndex, prevState.pageSize, prevState.body)
                                        }
                                    }
                                )
                            } />
                        </Tooltip>
                        <Popconfirm
                            title="Bạn chắc chắn muốn xóa bài đăng"
                            placement="topRight"
                            onConfirm={async () => {
                                await _requestToServer(
                                    DELETE,
                                    ANNOUNCEMENT_DETAIL,
                                    [item.id],
                                    undefined,
                                    undefined,
                                    undefined,
                                    false,
                                ).then(
                                    (res: any) => {
                                        if (res) {
                                            message.success("Xóa thành công", 3);
                                            nextProps.getListAnnouncements(prevState.pageIndex, prevState.pageSize, prevState.body)
                                        }
                                    }
                                )
                            }}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Icon key="delete" type="delete" style={{ padding: "5px 10px" }} theme="twoTone" twoToneColor="red" />
                        </Popconfirm>
                    </>
                );

                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    title: item.title,
                    admin: item.admin ? (item.admin.firstName + " " + item.admin.lastName) : "",
                    modifyAdmin: item.modifyAdmin ? (item.modifyAdmin.firstName + " " + item.modifyAdmin.lastName) : "",
                    createdDate: timeConverter(item.createdDate, 1000),
                    lastModified: item.lastModified !== -1 ? timeConverter(item.lastModified, 1000) : "",
                    imageUrl: <ImageRender src={item.imageUrl} alt="Ảnh đại diện" />,
                    hidden: !item.hidden ? "Hiện" : "Ẩn",
                    announcementType: item.announcementType.name,
                    operation: EditJob(item)
                });
            });
            return {
                list_announcements: nextProps.list_annou_types,
                data_table,
                loading_table: false,
            };
        }
        return null;
    };

    getData = async () => {
        let { pageIndexAC, pageSizeAC, body } = this.state;
        let id = localStorage.getItem("id_mgm");
        await this.props.getListAnnouComment(pageIndexAC, pageSizeAC + 5, id, body);
        await this.setState({ loadingMore: false, pageSizeAC: pageSizeAC + 5 });
    };

    async componentDidMount() {
        await this.searchAnnouncement();
    };

    onLoadMore = async () => {
        await this.setState({
            loadingMore: true,
        });
        await this.getData();
    };


    handleId = (event: any) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchAnnouncement();
    };

    searchAnnouncement = async () => {
        let {
            pageIndex,
            pageSize,
            createdDate,
            adminID,
            announcementTypeID,
            hidden,
            target,
        } = this.state;

        await this.props.getListAnnouncements(
            pageIndex,
            pageSize,
            {
                createdDate,
                adminID,
                announcementTypeID,
                hidden,
                target
            }
        );
    };

    onChangeTarget = (event: any) => {
        this.setState({ target: event });
        this.props.getListTypeManagement({ target: event });
    };

    onChangeJobName = (event: any) => {
        this.setState({ jobNameID: event })
    };

    onChangeType = (event: any) => {
        let { list_annou_types } = this.state;
        if (event === null) {
            this.setState({ announcementTypeID: undefined, value_type: undefined })
        } else if (list_annou_types) {
            list_annou_types.forEach(item => {
                if (item.id === event) {
                    this.setState({ value_type: item.name, announcementTypeID: item.id })
                }
            })
        }
    };

    onChangeCreatedDate = (event: any) => {
        this.setState({ createdDate: momentToUnix(event) })
    };

    onChangeHidden = (event: any) => {
        let { hidden } = this.state;
        switch (event) {
            case 0:
                hidden = true;
                break;
            case -1:
                hidden = false;
                break;
            default:
                hidden = undefined;
                break;
        }
        this.setState({ hidden })
    };

    toggleModalConfig = () => {
        let { open_config_modal } = this.state;
        let id = localStorage.getItem("id_mgm");
        if (!open_config_modal) {
            this.props.getAnnouncementDetail(id);
            this.getData();
        }
        this.setState({ open_config_modal: !open_config_modal });
    };

    removeComment = async () => {
        let id = localStorage.getItem("id_mgm");
        let { list_remove } = this.state;
        await _requestToServer(
            DELETE, ANNOU_COMMENTS + `/${id}/comments`, list_remove
        )

        await this.onToggleModal();
        await this.getData();
    }

    loadMore = () => {
        let { loadingMore, pageSizeAC } = this.state;
        let { totalComments } = this.props;

        if (pageSizeAC > totalComments)
            return;
        return (
            < div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button loading={loadingMore} onClick={this.onLoadMore}>loading more</Button>
            </div >)
    };

    onClickCheckBox = (event: boolean, id: string | number) => {
        let { list_remove } = this.state;
        if (event) {
            list_remove.push(id);
        } else {
            list_remove.forEach((item: string | number, index: number) => {
                if (item === id) {
                    list_remove.splice(index, 1);
                }
            })
        };

        this.setState({ list_remove });
    };

    render() {
        let {
            data_table,
            list_annou_types,
            value_type,
            loading_table,
            open_config_modal,
            initLoading,
            loadingMore,
            tab_key,
            list_remove
        } = this.state;

        let {
            annoucement_detail,
            totalItems,
            list_annou_comment,
            open_drawer
        } = this.props;
        return (
            <>
                <Drawer
                    visible={open_drawer}
                    width={"50vw"}
                    title={"Xem trước bài viết"}
                    onClose={() => this.props.handleDrawer({ open_drawer: false })}
                    destroyOnClose={true}
                >
                    {
                        annoucement_detail.id ?
                            <Tabs activeKey={tab_key} onChange={(event: any) => this.setState({ tab_key: event })}>
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type="search" />
                                            Thông tin bài viết
                                </span>
                                    }
                                    style={{
                                        overflowY: "auto"
                                    }}
                                    key={"1"}
                                >
                                    <h5>{annoucement_detail.title}</h5>
                                    <div className="annou-edit-modal">
                                        <p>
                                            <Icon type="user" />
                                            <IptLetter
                                                value={" " + annoucement_detail.admin.firstName + " " + annoucement_detail.admin.lastName} />
                                        </p>
                                        <p>
                                            <Icon type="calendar" />
                                            <IptLetter value={timeConverter(annoucement_detail.createdDate, 1000)} />
                                        </p>
                                        <Rate disabled defaultValue={4} />
                                        <div className="content-edit" dangerouslySetInnerHTML={{ __html: annoucement_detail.content }} />
                                    </div>
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <Icon type="message" />
                                            Quản lý nhận xét
                                        </span>
                                    }
                                    key={"2"}
                                >
                                    <List
                                        itemLayout="vertical"
                                        className="demo-loadmore-list"
                                        loading={initLoading}
                                        loadMore={this.loadMore()}
                                        dataSource={list_annou_comment}
                                        renderItem={(item: IAnnouComment) => {
                                            let sub_title = "";
                                            switch (item.userType) {
                                                case TYPE.CANDIDATE:
                                                    sub_title = "Ứng viên"
                                                    break;
                                                case TYPE.EMPLOYER:
                                                    sub_title = "Nhà tuyển dụng"
                                                    break;
                                                case TYPE.STUDENT:
                                                    sub_title = "Sinh viên"
                                                    break;
                                                case TYPE.SCHOOL:
                                                    sub_title = "Trường"
                                                    break;
                                                case TYPE.PUBLIC:
                                                    sub_title = "Khách"
                                                    break;
                                                default:
                                                    break;
                                            }

                                            return (
                                                <List.Item
                                                    extra={
                                                        <Checkbox onChange={(event: any) => this.onClickCheckBox(event.target.checked, item.id)} />
                                                    }
                                                >
                                                    <Skeleton avatar title={false} loading={loadingMore} active>
                                                        <List.Item.Meta
                                                            avatar={
                                                                <Avatar icon="user" style={{ marginTop: 5, border: "solid #1890ff 2px" }} src={item.avatarUrl} />
                                                            }
                                                            title={<span>{item.name}</span>}
                                                            description={sub_title}
                                                        />
                                                        <div className="content-list" >
                                                            <Rate key={item.id} disabled defaultValue={item.rating} style={{ fontSize: 12 }} /><span >{item.comment}</span>
                                                        </div>
                                                    </Skeleton>
                                                </List.Item>
                                            )
                                        }}
                                    />
                                </TabPane>
                            </Tabs>
                            : <Loading />}
                    <div>
                        <Button
                            key="back"
                            icon="left"
                            onClick={() => this.props.handleDrawer({ open_drawer: false })}
                        >
                            Thoát
                        </Button>,
                        <Button
                            key="remove"
                            type="danger"
                            icon="delete"
                            style={{ display: tab_key === "2" ? "block" : "none", float: "right" }}
                            onClick={() => { this.removeComment() }}
                            disabled={list_remove.length === 0}
                        >
                            Xóa các bình luận
                        </Button>
                    </div>
                </Drawer>
                <ModalConfig
                    title={"Xoá bài viết"}
                    namebtn1="Hủy"
                    namebtn2={"Xóa"}
                    isOpen={open_config_modal}
                    toggleModal={() => {
                        this.setState({ open_config_modal: !open_config_modal })
                    }}
                    handleOk={async () => this.deleteAnnouncements()}
                    handleClose={async () => this.toggleModalConfig()}
                >
                    <div>
                        Bạn muốn xóa bài viết: <IptLetter value={annoucement_detail.title} />
                    </div>
                </ModalConfig>
                <div className="common-content">


                    <h5>
                        Quản lý bài viết
                        <Button
                            onClick={() => this.searchAnnouncement()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 5px"
                            }}
                        >
                            <Icon type="filter" />
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => this.searchAnnouncement()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 5px"
                            }}
                        >
                            <Link to='/admin/job-management/create'>
                                <Icon type="plus" />
                                Tạo bài viết mới
                            </Link>
                        </Button>
                    </h5>
                    <div className="table-operations">
                        <Row>
                            <Col xs={24} sm={12} md={6} lg={5} xl={6} xxl={6}>
                                <p>
                                    <IptLetter value={"Chọn loại đối tượng"} />
                                </p>
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={this.onChangeTarget}
                                >
                                    <Option value={undefined}>Tất cả</Option>
                                    <Option value={TYPE.SCHOOL}>Nhà trường</Option>
                                    <Option value={TYPE.EMPLOYER}>Nhà tuyển dụng</Option>
                                    <Option value={TYPE.CANDIDATE}>Ứng viên</Option>
                                    <Option value={TYPE.STUDENT}>Học sinh </Option>
                                    <Option value={TYPE.PUBLIC}>Public</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={6} lg={5} xl={6} xxl={6}>
                                <p>
                                    <IptLetter value={"Chọn loại bài đăng"} />
                                </p>
                                <Select
                                    showSearch
                                    placeholder="Tất cả"
                                    optionFilterProp="children"
                                    style={{ width: "100%" }}
                                    value={value_type}
                                    onChange={this.onChangeType}
                                >
                                    <Option value={undefined}>Tất cả</Option>
                                    {
                                        list_annou_types &&
                                        list_annou_types.map((item, index) => <Option key={index}
                                            value={item.id}>{item.name}</Option>)
                                    }
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={14} xl={12} xxl={8}>
                                <p>
                                    <IptLetter value={"Chọn thời gian đăng bài"} />
                                </p>
                                <DatePicker
                                    placeholder="ex: 02/05/2019"
                                    defaultValue={undefined}
                                    onChange={this.onChangeCreatedDate}
                                    format={'DD/MM/YYYY'}
                                />

                                <Select
                                    showSearch
                                    style={{ margin: "0px 10px" }}
                                    defaultValue={"Trạng thái"}
                                    onChange={this.onChangeHidden}
                                >
                                    <Option value={undefined}>Tất cả</Option>
                                    <Option value={0}>Đã ẩn</Option>
                                    <Option value={-1}>Hiện</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 1000 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => {
                                    }, // click row
                                    onMouseEnter: (event) => {
                                        localStorage.setItem('id_mgm', record.key)
                                    }, // mouse enter row
                                };
                            }}
                        />
                    </div>
                </div>
            </>
        )
    }
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListTypeManagement: (data: any) => dispatch({ type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES, data }),
    getListAnnouncements: (pageIndex: number, pageSize: number, body: any) => dispatch({
        type: REDUX_SAGA.ANNOUNCEMENTS.GET_ANNOUNCEMENTS,
        pageIndex,
        pageSize,
        body
    }),
    getAnnouncementDetail: (id: string) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, id }),
    getListAnnouComment: (
        pageIndex: number,
        pageSize: number,
        id: string | number,
        body: IAnnouCommentsBody
    ) =>
        dispatch({ type: REDUX_SAGA.ANNOU_COMMENTS.GET_ANNOU_COMMENTS, pageIndex, pageSize, id, body }),
    handleDrawer: (drawerState: IDrawerState) => dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),

});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    list_annou_types: state.AnnouTypes.items,
    list_announcements: state.Announcements.items,
    annoucement_detail: state.AnnouncementDetail.data,
    totalItems: state.Announcements.totalItems,
    list_annou_comment: state.AnnouComments.items,
    open_drawer: state.MutilBox.drawerState.open_drawer,
    totalComments: state.AnnouComments.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MngList);