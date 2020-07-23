import React from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Avatar, Menu, Tooltip, Popconfirm, Input, Dropdown } from 'antd';
import { timeConverter } from '../../../../../utils/convertTime';
import { TYPE } from '../../../../../const/type';
import { IptLetterP } from '../../../layout/common/Common';
import { IAppState } from '../../../../../redux/store/reducer';
import { IRegion } from '../../../../../models/regions';
import { DELETE, PUT } from '../../../../../const/method';
import { CONNECT_EM_SCHOOL } from '../../../../../services/api/private.api';
import { _requestToServer } from '../../../../../services/exec';
import { IConnectEmSchool, IConnectEmSchoolFilter } from '../../../../../models/connect-em-school';
import { ISchools, ISchoolsFilter, ISchool } from '../../../../../models/schools';
import { Link } from 'react-router-dom';

let { Option } = Select;
let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <Avatar shape="square" src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} icon="user" />
    } else {
        return <div style={{ width: 50, height: 50 }}>
            <Icon type="file-image" style={{ fontSize: 20 }} />
        </div>
    }
};

const menu = (
    <Menu >
        <Menu.Item key={TYPE.PENDING}>
            Đang chờ
      </Menu.Item>
        <Menu.Item key={TYPE.ACCEPTED}>
            Đã kết nối
      </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={TYPE.REJECTED}>>
        Từ chối
          </Menu.Item>
    </Menu>
);


interface IProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    handleModal?: Function;
    getListConnectEmSchool?: Function;
    getTypeManagement?: Function;
    getAnnoucements?: Function;
    getAnnoucementDetail?: Function;
    getConnectEmSchoolDetail?: Function;
    getListSchools?: Function;
};

interface IState {
    dataTable?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    typeCpn?: string;
    employerID?: string;
    showModal?: boolean;
    loading?: boolean;
    typeManagement?: Array<any>;
    announcementTypeID?: number;
    birthday?: number;
    adminID?: string;
    hidden?: boolean;
    listFindConnectEmSchool?: Array<any>;
    id?: string;
    loadingTable?: boolean;
    body?: IConnectEmSchoolFilter;
    typeView?: string;
    school?: ISchool
    state?: string;
};

class ConnectEmSchoolList extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            showModal: false,
            loading: false,
            announcementTypeID: null,
            birthday: null,
            adminID: null,
            hidden: false,
            listFindConnectEmSchool: [],
            id: null,
            loadingTable: true,
            body: {
                name: null,
                regionID: null,
                headquarters: null,
                hasRequest: null,
                state: null,
            },
            typeCpn: null,
            state: null,
        };
    };

    EditToolAction = (state) => (
        <>
            <Popconfirm
                placement="topRight"
                title={"Xóa"}
                onConfirm={() => this.createRequest(TYPE.DELETE)}
                okType={'danger'}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Icon
                    className='test'
                    style={{
                        padding: 5,
                        margin: 2
                    }}
                    type="delete"
                    theme="twoTone"
                    twoToneColor="red"
                />
            </Popconfirm>
        </>)


    EmployerName = (data: any) => {
        return (
            <Tooltip
                title={(data.profileVerified ? "Đã" : "Chưa") + " xác thực"}
            >
                <Link >
                    {data.employerName}
                    abbbbbbbb
                    <Icon
                        type={"safety"}
                        style={{ color: data.profileVerified ? "green" : "red" }}
                    />
                </Link>
            </Tooltip>
        )
    }

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
            title: 'Ảnh',
            width: 30,
            dataIndex: 'avatarUrl',
            className: 'action',
            key: 'avatarUrl',
        },
        {
            title: 'Tên công ty',
            dataIndex: 'employerName',
            className: 'action',
            key: 'employerName',
            // render: (employerName) => this.EmployerName(employerName),
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            className: 'action',
            key: 'email',
            width: 100,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            className: 'action',
            key: 'phone',
            width: 100,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 200,
        },
        {
            title: 'Tỉnh thành',
            dataIndex: 'region',
            className: 'action',
            key: 'region',
            width: 75,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 75,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            render: (state) => this.EditToolAction(state),
            width: 140
        },
    ];

    onToggleModal = () => {
        let { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    static getDerivedStateFromProps(nextProps?: IProps, prevState?: IState) {
        if (nextProps.listFindConnectEmSchool && nextProps.listFindConnectEmSchool !== prevState.listFindConnectEmSchool) {
            let { pageIndex, pageSize } = prevState;
            let dataTable = [];
            nextProps.listFindConnectEmSchool.forEach((item: IConnectEmSchool, index: number) => {
                let { employer } = item;

                dataTable.push({
                    key: employer.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    avatarUrl: <ImageRender src={employer.logoUrl} alt="Ảnh đại diện" />,
                    employerNameObject: {
                        employerName: employer.employerName,
                        profileVerified: employer.profileVerified
                    },
                    employerName: employer.employerName,
                    phone: employer.phone ? employer.phone : '',
                    email: employer.email ? employer.email : '',
                    address: employer.address ? employer.address : "",
                    region: employer.region ? employer.region.name : "",
                    createdDate: item.createdDate === -1 ? "" : timeConverter(item.createdDate, 1000, "DD/MM/YYYY"),
                    state: item.state
                });
            })
            return {
                listFindConnectEmSchool: nextProps.listFindConnectEmSchool,
                dataTable,
                loadingTable: false,
            }
        }

        return { loadingTable: false }
    };

    async componentDidMount() {
        // await this.searchConnectEmSchool();
        await this.props.getListSchools(0, 10, null);
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.searchConnectEmSchool();
    };

    searchConnectEmSchool = async () => {
        let { body, pageIndex, pageSize } = this.state;
        await this.props.getListConnectEmSchool(pageIndex, pageSize, body);
    };

    onChangeFilter = (event: any, param?: string) => {
        let { body } = this.state;
        let { listRegions, listSchools } = this.props;
        let value: any = event;

        switch (param) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
            case TYPE.EM_SCHOOL_FILTER.id:
                if (value) {
                    let data = listSchools.filter(
                        (item: ISchool, index: number) => (item.name === event)
                    );

                    if (data.length > 0) {
                        value = data[0].id
                    }
                }
                break;
            case TYPE.EM_SCHOOL_FILTER.regionID:
                if (value) {
                    let data = listRegions.filter(
                        (item: IRegion, index: number) => (item.name === event)
                    );
                    if (data.length > 0) {
                        value = data[0].id
                    }
                }
                break;
            default:
                break;
        };

        body[param] = value;
        this.setState({ body });
    };

    EmployerName = (employerName?: string, profileVerified?: boolean) => (
        <Link></Link>
    )

    createRequest = async (type?: string) => {
        let { id, body, state } = this.state;
        let method = null;
        let api = CONNECT_EM_SCHOOL(body.id);

        await this.setState({ loading: true });

        switch (type) {
            case TYPE.DELETE:
                method = DELETE;
                break;
            case TYPE.PUT:
                method = PUT;
                api += `/${id}/request/reply/${state}`
                break;
            default:
                break;
        };

        await _requestToServer(
            method,
            api,
            body,
            undefined,
            undefined,
            undefined,
            true,
            false,
        ).then(
            (res: any) => {
                if (res) {
                    this.searchConnectEmSchool();
                }
            }
        ).finally(
            () => this.setState({ openDrawer: false, loading: false })
        )
    };

    searchFilter = async () => {   // change index to 0 when start searching
        await this.setState({
            pageIndex: 0,
        });
        this.searchConnectEmSchool();
    };

    render() {
        let {
            dataTable,
            loadingTable,
            school
        } = this.state;

        let {
            listRegions,
            totalItems,
            listSchools
        } = this.props;

        return (
            <>

                <div className="common-content">
                    <h5>
                        Danh sách kết nối doanh nghiệp - nhà trường
                        <Button
                            onClick={() => this.searchFilter()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 10px",
                            }}
                            icon={loadingTable ? "loading" : "filter"}
                            children={"Lọc ứng viên"}
                        />
                    </h5>
                    <div className="table-operations">
                        <Row >
                            <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6} >
                                <IptLetterP value={"Tên nhà trường"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_SCHOOL_FILTER.id)}
                                    onSearch={(event: any) => { this.props.getListSchools(0, 10, { name: event }) }}
                                >
                                    {
                                        listSchools && listSchools.map((item?: ISchool, i?: any) =>
                                            (<Option key={item.id} value={item.name}>{item.name} </Option>)
                                        )
                                    }
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tìm việc"} />
                                <Input
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_SCHOOL_FILTER.name)}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tỉnh thành"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_SCHOOL_FILTER.regionID)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    {
                                        listRegions && listRegions.length >= 1 ?
                                            listRegions.map((item: IRegion, index: number) =>
                                                <Option key={index} value={item.name}>{item.name}</Option>
                                            ) : null
                                    }
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Chi nhánh chuyển dụng"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_SCHOOL_FILTER.headquarters)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Chính </Option>
                                    <Option value={TYPE.FALSE}>Khsc</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tình trạng kết nối"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_SCHOOL_FILTER.hasRequest)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Đã có </Option>
                                    <Option value={TYPE.FALSE}>Chưa có </Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={dataTable}
                            scroll={{ x: 1100 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record: any, rowIndex: any) => {
                                return {
                                    onClick: (event: any) => {
                                    }, // click row
                                    onMouseEnter: (event) => {
                                        this.setState({ id: record.key });
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
    getListConnectEmSchool: (pageIndex: number, pageSize: number, body: IConnectEmSchoolFilter) =>
        dispatch({ type: REDUX_SAGA.CONNECT_EM_SCHOOL.GET_CONNECT_EM_SCHOOL, pageIndex, pageSize, body }),
    getListSchools: (pageIndex: number, pageSize: number, body: ISchoolsFilter) =>
        dispatch({ type: REDUX_SAGA.SCHOOLS.GET_SCHOOLS, pageIndex, pageSize, body }),
    getConnectEmSchoolDetail: (id?: string) =>
        dispatch({ type: REDUX_SAGA.CANDIDATES.GET_CANDIDATE_DETAIL, id }),
    handleModal: (modalState: IModalState) =>
        dispatch({ type: REDUX.HANDLE_MODAL, modalState }),
    handleDrawer: (drawerState: IDrawerState) =>
        dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    listFindConnectEmSchool: state.ConnectEmSchools.items,
    listRegions: state.Regions.items,
    totalItems: state.ConnectEmSchools.totalItems,
    listSkills: state.Skills.items,
    listJobNames: state.JobNames.items,
    listLanguages: state.Languages.items,
    listSchools: state.Schools.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectEmSchoolList);