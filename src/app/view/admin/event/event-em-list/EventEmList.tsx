import CropImage from '../../../layout/crop-image/CropImage';
import React, { PureComponent } from 'react';
import { _requestToServer } from '../../../../../services/exec';
import {
    Avatar,
    Button,
    Col,
    Icon,
    Drawer,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    Tooltip
} from 'antd';
import { connect } from 'react-redux';
import { DELETE, PUT } from '../../../../../const/method';
import {  SCHOOLS } from '../../../../../services/api/private.api';
import { IAppState } from '../../../../../redux/store/reducer';
import { IEventEm } from './../../../../../models/event-em';
import { IEventEmFilter } from '../../../../../models/event-em';
import { IptLetterP } from '../../../layout/common/Common';
import { timeConverter } from '../../../../../utils/convertTime';
import { REDUX_SAGA } from '../../../../../const/actions';
import { sendFileHeader } from '../../../../../services/auth';
import { TYPE } from '../../../../../const/type';

let { Option } = Select;

let ImageRender = (props?: { src?: string }) => {
    return <img src={props.src}
        alt='banner event'
        style={{ width: 200, height: 80, margin: 0 }}
    />
};

interface IProps extends StateProps, DispatchProps {
    match?: any;
    getListEventEm: Function;
    getListEmBranches: Function;
    getTypeManagement: Function;
    getEventJobDetail: (id?: string, schoolEventID?: string) => any;
    getJobServiceEvent: Function;
    handleDrawer: Function;
    handleModal: Function;
    getListJobSuitableCandidate: Function;
    history: any;
};

interface IState {
    dataTable?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    employerID?: string;
    opmd?: boolean;
    loading?: boolean;
    message?: string;
    listEmBranches?: Array<any>;
    valueType?: string;
    announcementTypeID?: number;
    createdDate?: number;
    adminID?: string;
    hidden?: boolean;
    listEventEm?: Array<any>;
    id?: string;
    sid?: string;
    loadingTable?: boolean;
    body?: IEventEmFilter;
    ojd?: boolean;
    jid?: string;
    eid?: string;
    opdr?: boolean;
    newBanner?: any;
    bannerPriority?: string;
    priority?: string;
};


class EventEmList extends PureComponent<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            employerID: null,
            opmd: false,
            loading: false,
            message: null,
            listEmBranches: [],
            valueType: null,
            createdDate: null,
            adminID: null,
            hidden: false,
            listEventEm: [],
            id: null,
            sid: null,
            loadingTable: true,
            body: {
                bannerPriority: null,
                priority: null,
                createdDate: null,
                shuffle: null,
            },
            ojd: false,
            jid: null,
            eid: null,
            bannerPriority: null,
            priority: null,
        };
    }

    columns = [
        {
            title: '#',
            width: 30,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: 'left',
        },
        {
            title: 'Tên nhà tuyển dụng',
            width: 200,
            dataIndex: 'employerName',
            key: 'employerName',
            fixed: 'left'
        },

        {
            title: 'Logo',
            dataIndex: 'logoUrl',
            key: 'logoUrl',
            width: 80,
            className: 'action',
        },
        {
            title: 'Banner',
            dataIndex: 'banner',
            className: 'action',
            key: 'banner',
            width: 230,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 100,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            className: 'action',
            key: 'address',
            width: 270,
        },
        {
            title: 'Khu vực',
            dataIndex: 'region',
            className: 'action',
            key: 'region',
            width: 80,
        },
        {
            title: 'Mail',
            dataIndex: 'email',
            className: 'action',
            key: 'email',
            width: 100,
        },
        {
            title: 'Logo Priority',
            dataIndex: 'priority',
            className: 'action',
            key: 'priority',
            width: 80,
        },
        {
            title: 'Banner Priority',
            dataIndex: 'bannerPriority',
            className: 'action',
            key: 'bannerPriority',
            width: 80,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            dataIndex: 'operation',
            render: (id) => this.EditToolTip(id),
            width: 80,
        }
    ];

    deleteEvent = async (id) => {
        const { eid, sid } = this.state;
        _requestToServer(
            DELETE,
            SCHOOLS +
            `/${sid}/events/${eid}/employers`
            ,
            [id],
        ).then((res: any) => {
            this.searchEventEm();
        });
    };

    onToggleModal = () => {
        let { opmd } = this.state;
        this.setState({ opmd: !opmd });
    };

    EditToolTip = (id?: string) => {
        let { employerID } = this.state;
        return (
            <>
                <Tooltip placement="top" title={"Xem chi tiết(sửa)"}>
                    <Icon
                        className="f-ic"
                        type="edit"
                        theme="twoTone"
                        twoToneColor="green"
                        onClick={() => this.setState({ opdr: true })}
                    />
                </Tooltip>
                <Tooltip
                    title={"Sửa Banner"}
                    placement={"topRight"}
                >
                    <Icon
                        type={"tool"}
                        className="f-ic"
                        style={{

                            color: 'blue'
                        }}
                        onClick={
                            async () => await this.setState({
                                opmd: true
                            })
                        }
                    />
                </Tooltip>
                <Tooltip placement="topRight" title={"Xóa nhà tuyển dụng"}>
                    <Popconfirm
                        title="Bạn có chắc chắc xóa nhà tuyển dụng này"
                        onConfirm={() => this.deleteEvent(employerID)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType='danger'
                        children={
                            <Icon
                                type={"delete"}
                                className="f-ic"
                                style={{
                                    color: "red"
                                }}
                            />
                        }
                    />
                </Tooltip>
            </>
        )
    }

    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        if (
            nextProps.listEventEm &&
            nextProps.listEventEm !== prevState.listEventEm
        ) {
            let { pageIndex, pageSize } = prevState;
            let dataTable = [];
            let url_string = window.location.href;
            let url = new URL(url_string);
            let eid = url.searchParams.get("eid");
            let sid = url.searchParams.get("sid");
            let body = prevState.body;

            nextProps.listEventEm.forEach((item: IEventEm, index: number) => {
                console.log(item.bannerUrl);
                dataTable.push({
                    key: item.id,
                    employerID: item.employer ? item.employer.id : null,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    employerName: item.employer ? item.employer.employerName : "",
                    region: item.employer ? item.employer.region.name : "",
                    logoUrl: item.employer ?
                        <Avatar
                            shape="square"
                            size={40}
                            src={item.employer.logoUrl}
                            icon="shop"
                        /> : "",
                    address: item.employer ? item.employer.address : "",
                    email: item.employer ? item.employer.email : "",
                    createdDate: timeConverter(item.employer ? item.employer.createdDate : "", 1000),
                    phone: item.employer ? item.employer.phone : "",
                    profileVerified: item.employer ? item.employer.profileVerified : "",
                    bannerPriority: item.bannerPriority,
                    priority: item.priority,
                    banner: <ImageRender src={item.bannerUrl} />,
                    operation: { id: item.id, employerID: item.employer.id },
                    data: item.employer ? item.employer.id : ''
                });
            })

            return {
                listEventEm: nextProps.listEventEm,
                dataTable,
                loadingTable: false,
                body,
                eid,
                sid,
            }
        }

        return null;
    };

    async componentDidMount() {
        await this.searchEventEm();
    };

    uploadBanner = () => {
        let { newBanner, eid, sid } = this.state;
        let formData = new FormData();
        formData.append("banner", newBanner, "banner.jpg");

        _requestToServer(
            PUT,
            SCHOOLS + `/${sid}/events/${eid}/bannerUrl`,
            formData,
            undefined,
            sendFileHeader,
            undefined,
            true,
            false
        )

        this.onToggleModal();
        setTimeout(() => {
            this.requeryData()
        }, 250);
    }

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.searchEventEm();
    };

    searchEventEm = async () => {
        let { body, pageIndex, pageSize, sid, eid } = this.state;
        await this.props.getListEventEm(body, pageIndex, pageSize, sid, eid);
    };

    onChangeType = (event: any, param?: string) => {
        let { body } = this.state;
        let value: any = event;
        switch (param) {
            case TYPE.JOB_FILTER.jobNameIDs:
                value = [value];
                break;
            default:
                break;
        }

        switch (event) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
            default:
                break;
        }

        body[param] = value;
        this.setState({ body });
    };

    createRequest = async (type?: string) => {
        let { sid, eid, employerID, priority, bannerPriority } = this.state;
        await this.setState({ loading: true });
        switch (type) {
            case TYPE.EVENT_EM_FILER.priority:
                await _requestToServer(
                    PUT,
                    SCHOOLS + `/${sid}/events/${eid}/employers/${employerID}/priority/${priority}`,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    true,
                    false
                ).then((res: any) => {
                    if (res) {
                        this.requeryData()
                    }
                }).finally(
                    () => this.setState({
                        loading: false
                    })
                );
                break;

            case TYPE.EVENT_EM_FILER.bannerPriority:
                await _requestToServer(
                    PUT,
                    SCHOOLS + `/${sid}/events/${eid}/employers/${employerID}/banner/priority/${bannerPriority}`,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    true,
                    false
                ).then((res: any) => {
                    if (res) {
                        this.requeryData()
                    }
                }).finally(
                    () => this.setState({
                        loading: false
                    })
                );
                break;
            default:
                break;
        };
    };

    requeryData = async () => {
        await this.searchEventEm();
        await this.props.handleModal();
    };

    uploadToServer = (event) => {
        this.setState({ newBanner: event.blobFile })
    };

    render() {
        let {
            dataTable,
            loadingTable,
            newBanner,
            opmd,
            priority,
            bannerPriority,
            opdr
        } = this.state;

        let {
            totalItems,
        } = this.props;


        return (
            <>
                <Drawer
                    title="Thay đổi trạng thái "
                    placement="right"
                    closable={false}
                    onClose={() => this.setState({ opdr: false })}
                    visible={opdr}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                >
                    <Row>
                        <Col span={24}>
                            <IptLetterP value={"Logo priority"} />
                            <Select
                                showSearch
                                placeholder="Tất cả"
                                defaultValue="Tất cả"
                                optionFilterProp="children"
                                style={{ width: "100%" }}
                                value={priority}
                                onChange={(event: any) => this.setState({ priority: event })}
                            >
                                <Option value={TYPE.TOP}>TOP</Option>
                                <Option value={TYPE.NORMAL}>NORMAL</Option>
                            </Select>
                            <Button
                                type={"primary"}
                                children={"Kích hoạt"}
                                style={{ margin: 5 }}
                                onClick={() => this.createRequest("priority")}
                            />
                        </Col>
                        <Col span={24} >
                            <IptLetterP value={"Banner Priority"} />
                            <Select
                                showSearch
                                defaultValue="Tất cả"
                                placeholder="Tất cả"
                                optionFilterProp="children"
                                style={{ width: "100%" }}
                                value={bannerPriority}
                                onChange={(event: any) => this.setState({ bannerPriority: event })}
                            >
                                <Option value={TYPE.TOP}>NORMAL</Option>
                                <Option value={TYPE.NORMAL}>TOP</Option>
                            </Select>
                            <Button
                                type={"primary"}
                                children={"Kích hoạt"}
                                style={{ margin: 5 }}
                                onClick={() => this.createRequest("bannerPriority")}
                            />
                        </Col>
                    </Row>

                </Drawer>
                <Modal
                    visible={opmd}
                    title={"Workvn thông báo"}
                    destroyOnClose={true}
                    width="60vw"
                    onCancel={() => {
                        this.setState({ message: null, loading: false, opmd: false });
                        this.props.handleModal();
                    }}
                    footer={[
                        <Button
                            key="cancel"
                            type="danger"
                            children="Đóng"
                            onClick={() => {
                                this.setState({
                                    loading: false,
                                    opmd: false
                                });

                                this.props.handleModal()
                            }}
                        />,
                        newBanner ? <Button
                            key={"ok"}
                            onClick={
                                () => {
                                    this.uploadBanner();
                                    this.onToggleModal()
                                }
                            }
                            type={"primary"}
                            icon={"tool"}
                            children={
                                "Cập nhật banner"
                            }
                        /> : ""
                    ]}
                    children={<CropImage uploadToServer={this.uploadToServer} />}
                />

                <div className="common-content">
                    <h5>
                        Quản lý nhà tuyển dụng sự kiện nhà trường {`(${totalItems})`}
                        <Tooltip title="Lọc tìm kiếm" >
                            <Button
                                onClick={() => this.requeryData()}
                                type="primary"
                                style={{
                                    float: "right",
                                    margin: "0px 10px",
                                    padding: "10px",
                                    borderRadius: "50%",
                                    height: "45px",
                                    width: "45px"
                                }}
                                icon={loadingTable ? "loading" : "filter"}
                            />
                        </Tooltip>
                    </h5>
                    <div className="table-operations">
                        <Row >
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Logo priority"} />
                                <Select
                                    showSearch
                                    placeholder="Tất cả"
                                    defaultValue="Tất cả"
                                    optionFilterProp="children"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeType(event, TYPE.EVENT_EM_FILER.priority)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TOP}>TOP</Option>
                                    <Option value={TYPE.NORMAL}>NORMAL</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Banner Priority"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    placeholder="Tất cả"
                                    optionFilterProp="children"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeType(event, TYPE.EVENT_EM_FILER.bannerPriority)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TOP}>TOP</Option>
                                    <Option value={TYPE.NORMAL}>NORMAL</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={dataTable}
                            scroll={{ x: 1430 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record: any, rowIndex: any) => {
                                return {
                                    onClick: (event: any) => {
                                        this.setState({
                                            id: record.key,
                                            employerID: record.employerID,
                                            bannerPriority: record.bannerPriority,
                                            priority: record.priority
                                        })
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
    getListEventEm: (body: IEventEmFilter, pageIndex: number, pageSize: number, sid?: string, eid?: string) =>
        dispatch({ type: REDUX_SAGA.EVENT_SCHOOLS.GET_LIST_EVENT_EM, body, pageIndex, pageSize, sid, eid }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    listEventEm: state.EventEms.items,
    listJobNames: state.JobNames.items,
    totalItems: state.EventEms.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventEmList);