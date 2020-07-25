import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, DatePicker, Rate, Tabs, List, Avatar, Skeleton, Checkbox, Popconfirm, message, Tooltip, Drawer } from 'antd';
import { timeConverter, momentToUnix } from '../../../../../utils/convertTime';
import './AnnouncementList.scss';
import { TYPE } from '../../../../../const/type';
import { Link } from 'react-router-dom';
import { IptLetter } from '../../../layout/common/Common';
import { ModalConfig } from '../../../layout/modal-config/ModalConfig';
import { _requestToServer } from '../../../../../services/exec';
import { DELETE, PUT } from '../../../../../const/method';
import { ANNOUNCEMENT_DETAIL, ANNOU_COMMENTS } from '../../../../../services/api/private.api';
import { IAnnouCommentsBody, IAnnouComment } from '../../../../../models/annou-comments';
import { IAppState } from '../../../../../redux/store/reducer';
import Loading from '../../../layout/loading/Loading';
import { IDrawerState } from '../../../../../models/mutil-box';
import { routeLink, routePath } from '../../../../../const/break-cumb';

let { Option } = Select;
const { TabPane } = Tabs;

let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <Avatar shape={'square'} src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} />
    } else {
        return <div style={{ width: "60px", height: "60px", padding: "20px 0px" }}>
            <Icon type="file-image" style={{ fontSize: 20 }} />
        </div>
    }
};

interface IAnnouncementListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    location?: any;
    getListTypeManagement: Function;
    getListAnnouncements: Function;
    getAnnouncementDetail: Function;
    getListAnnouComment: Function;
    handleDrawer: (drawerState?: IDrawerState) => any;
}

interface IAnnouncementListState {
    dataTable?: Array<any>;
    search?: any;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    employerID?: string;
    target?: string;
    jobNameID?: string;
    jobId?: string;
    showModal?: boolean;
    pendingJob?: any;
    message?: string;
    listAnnouTypes?: Array<any>;
    valueType?: string;
    announcementTypeID?: number;
    createdDate?: number;
    adminID?: string;
    hidden?: boolean;
    listAnnoucements?: Array<any>;
    id?: string;
    loadingTable?: boolean;
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

class AnnouncementList extends PureComponent<IAnnouncementListProps, IAnnouncementListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            target: undefined,
            listAnnouTypes: [],
            announcementTypeID: undefined,
            createdDate: undefined,
            adminID: undefined,
            hidden: undefined,
            listAnnoucements: [],
            id: "",
            loadingTable: true,
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
            className: "action",
            key: 'title',
        },
        {
            title: 'Nội dung rút gọn',
            width: 400,
            dataIndex: 'previewContent',
            key: 'previewContent',
        },
        {
            title: 'Người viết',
            dataIndex: 'admin',
            className: 'action',
            key: 'admin',
            width: 150,
        },
        {
            title: 'Người sửa',
            dataIndex: 'modifyAdmin',
            key: 'modifyAdmin',
            width: 150,
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
            width: 100,
        },
    ];

    onToggleModal = () => {
        let { showModal } = this.state;
        if (!showModal) {
            let id = localStorage.getItem("id_mgm");
            this.props.getAnnouncementDetail(id);
        }
        this.getData();
        this.setState({ showModal: !showModal, pageSizeAC: 5, tab_key: "1", list_remove: [] });
    };

    static getDerivedStateFromProps(nextProps: IAnnouncementListProps, prevState: IAnnouncementListState) {
        if (nextProps.listAnnouTypes !== prevState.listAnnouTypes) {
            return {
                listAnnouTypes: nextProps.listAnnouTypes,
                valueType: "Tất cả",
                announcementTypeID: null
            }
        };

        if (nextProps.listAnnoucements !== prevState.listAnnoucements) {
            let { pageIndex, pageSize, pageIndexAC, pageSizeAC, body } = prevState;
            let dataTable: any = [];
            nextProps.listAnnoucements.forEach((item: any, index: number) => {
                const EditJob = (item?: any) => (
                    <>
                        <Tooltip
                            title="Xem bài viết"
                            placement="topLeft"
                        >
                            <Icon
                                className='test'
                                type="search"
                                style={{ padding: 5, margin: 2 }}
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
                            <Link to={routeLink.ANNOUCEMENT + routePath.FIX + `/${item.id}`} target='_blank'>
                                <Icon
                                    className='test'
                                    type="edit"
                                    style={{ padding: 5, margin: 2 }}
                                    theme="twoTone"
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip
                            title={!item.hidden ? "Ẩn bài đăng" : "Hiện bài đăng"}
                        >
                            <Icon
                                className='test'
                                type={item.hidden ? "eye" : "eye-invisible"}
                                style={{ padding: 5, margin: 2 }}
                                onClick={async () =>
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
                            okType={"danger"}
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
                            <Icon
                                className='test'
                                key="delete"
                                type="delete"
                                style={{
                                    padding: 5, margin: 2
                                }}
                                theme="twoTone"
                                twoToneColor="red"
                            />
                        </Popconfirm>
                    </>
                );

                dataTable.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    title: item.title,
                    previewContent: item.previewContent,
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
                listAnnoucements: nextProps.listAnnoucements,
                dataTable,
                loadingTable: false,
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
        await this.setState({
            pageIndex: event.current - 1,
            loadingTable: true,
            pageSize: event.pageSize
        });
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

        await this.setState({ loadingTable: true });
        await setTimeout(() => {
            this.props.getListAnnouncements(
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
        }, 250);

    };

    onChangeTarget = (event: any) => {
        this.setState({ target: event });
        this.props.getListTypeManagement({ target: event });
        this.searchAnnouncement();
    };

    onChangeJobName = (event: any) => {
        this.setState({ jobNameID: event });
        this.searchAnnouncement();
    };

    onChangeFilter = async (event: any) => {
        let { listAnnouTypes } = this.state;
        if (event === null) {
            this.setState({ announcementTypeID: undefined, valueType: undefined, })
        } else if (listAnnouTypes) {
            listAnnouTypes.forEach(item => {
                if (item.id === event) {
                    this.setState({
                        valueType: item.name,
                        announcementTypeID: item.id,
                    });
                    this.searchAnnouncement();
                }
            })
        }
    };

    onChangeCreatedDate = (event: any) => {
        this.setState({ createdDate: momentToUnix(event) });
        this.searchAnnouncement();
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
        this.setState({ hidden });
        this.searchAnnouncement();
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
            dataTable,
            listAnnouTypes,
            valueType,
            loadingTable,
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
            openDrawer
        } = this.props;
        return (
            <>
                <Drawer
                    visible={openDrawer}
                    width={"50vw"}
                    title={"Xem trước bài viết"}
                    onClose={() => this.props.handleDrawer({ openDrawer: false })}
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
                            onClick={() => this.props.handleDrawer({ openDrawer: false })}
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
                        Danh sách bài viết ({totalItems})
                        <Button
                            onClick={() => this.searchAnnouncement()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 5px"
                            }}
                        >
                            <Link to={routeLink.ANNOUCEMENT + routePath.CREATE}>
                                <Icon type="plus" />
                                Tạo mới
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
                                    <Option value={TYPE.STUDENT}>Sinh viên </Option>
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
                                    value={valueType}
                                    onChange={this.onChangeFilter}
                                >
                                    <Option value={undefined}>Tất cả</Option>
                                    {
                                        listAnnouTypes &&
                                        listAnnouTypes.map((item, index) => <Option key={index}
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
                            loading={loadingTable}
                            dataSource={dataTable}
                            locale={{ emptyText: 'Không có dữ liệu' }}
                            scroll={{ x: 1450 }}
                            bordered={true}
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

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
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

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    listAnnouTypes: state.AnnouTypes.items,
    listAnnoucements: state.Announcements.items,
    annoucement_detail: state.AnnouncementDetail.data,
    totalItems: state.Announcements.totalItems,
    list_annou_comment: state.AnnouComments.items,
    openDrawer: state.MutilBox.drawerState.openDrawer,
    totalComments: state.AnnouComments.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementList);