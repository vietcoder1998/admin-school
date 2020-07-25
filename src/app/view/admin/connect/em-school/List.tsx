import React from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA } from '../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Avatar, Menu, Tooltip, Popconfirm, Dropdown } from 'antd';
import { timeConverter } from '../../../../../utils/convertTime';
import { TYPE } from '../../../../../const/type';
import { IptLetterP } from '../../../layout/common/Common';
import { IAppState } from '../../../../../redux/store/reducer';
import { IRegion } from '../../../../../models/regions';
import { DELETE, PUT } from '../../../../../const/method';
import { CONNECT_EM_SCHOOL } from '../../../../../services/api/private.api';
import { _requestToServer } from '../../../../../services/exec';
import { IConnectEmSchool, IConnectEmSchoolFilter } from '../../../../../models/connect-em-school';
import { ISchoolsFilter, ISchool } from '../../../../../models/schools';
import { Link } from 'react-router-dom';
import Search from 'antd/lib/input/Search';

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

const Label = (props: any) => {
    let value = "";
    switch (props.type) {
        case TYPE.PENDING:
            value = "Đang chờ";
            break;
        case TYPE.ACCEPTED:
            value = "Đã chấp nhận";
            break;
        case TYPE.REJECTED:
            value = "Đã từ chối";
            break;
        case TYPE.PARTTIME:
            value = "Bán thời gian";
            break;
        case TYPE.FULLTIME:
            value = "Toàn thời gian";
            break;
        case TYPE.INTERNSHIP:
            value = "Thực tập sinh";
            break;
    }

    if (props.type) {
        return < >{value}</>
    }
    return
};


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
                hasRequest: true,
                state: null,
            },
            typeCpn: null,
            state: null,
        };
    };

    EditToolAction = (state) => (
        <>
            <Dropdown
                overlay={this.menu}
                trigger={["click"]}
            >
                <Tooltip title="Đổi trạng thái kết nối">
                    <Button
                        style={{ marginTop: -5 }}
                    >
                        {this.state.loading ? <Icon type={"loading"} /> : state}
                    </Button>
                </Tooltip>

            </Dropdown>
            <Popconfirm
                placement="topRight"
                title={"Xóa kết nối"}
                onConfirm={() => this.createRequest(TYPE.DELETE)}
                okType={'danger'}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Icon
                    className='test'
                    style={{
                        padding: 6,
                        margin: 2
                    }}
                    type="delete"
                    theme="twoTone"
                    twoToneColor="red"
                />
            </Popconfirm>
        </>)

    EmployerName = (data: any) =>
        (
            <Tooltip
                title={(data.profileVerified ? "Đã" : "Chưa") + " xác thực"}
            >
                <Link to={"abc"} >
                    {data.employerName}

                </Link>
                <Icon
                    type={"safety"}
                    style={{ color: data.profileVerified ? "green" : "red" }}
                />
            </Tooltip>
        )

    menu = (
        <Menu onClick={async (event) => {
            await this.setState({ state: event.key });
            await this.createRequest(TYPE.PUT)
        }}>
            <Menu.Item key={TYPE.PENDING}>
                Đang chờ
          </Menu.Item>
            <Menu.Item key={TYPE.ACCEPTED}>
                Chấp nhận
          </Menu.Item>
            <Menu.Divider />
            <Menu.Item key={TYPE.REJECTED} style={{ color: "red" }}>
                Từ chối
            </Menu.Item>
        </Menu>
    );

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
            dataIndex: 'employerNameObject',
            className: 'action',
            key: 'employerNameObject',
            render: this.EmployerName,
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
            dataIndex: 'state',
            className: 'action',
            render: this.EditToolAction,
            width: 180
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
                    phone: employer.phone ? employer.phone : '',
                    email: employer.email ? employer.email : '',
                    address: employer.address ? employer.address : "",
                    region: employer.region ? employer.region.name : "",
                    createdDate: item.createdDate === -1 ? "" : timeConverter(item.createdDate, 1000, "DD/MM/YYYY"),
                    state: <Label type={item.state} />
                });
            })
            return {
                listFindConnectEmSchool: nextProps.listFindConnectEmSchool,
                dataTable,
            }
        }

        return { loadingTable: false }
    };

    async componentDidMount() {
        await this.props.getListSchools(0, 10, null);
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.searchConnectEmSchool();
    };

    searchConnectEmSchool = async () => {
        let { body, pageIndex, pageSize } = this.state;
        await this.setState({ loadingTable: true })
        await setTimeout(() => {
            this.props.getListConnectEmSchool(pageIndex, pageSize, body);
        }, 250);
    };

    onChangeFilter = (event: any, param?: string) => {
        let { body } = this.state;
        let { listRegions, listSchools } = this.props;
        let value: any = event;

        switch (event) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
        }

        switch (param) {
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

        if (param !== TYPE.EM_SCHOOL_FILTER.name) {
            this.searchConnectEmSchool();
        }
    };

    createRequest = async (type?: string) => {
        let { id, body, state } = this.state;
        let method, newBody = null;

        let api = CONNECT_EM_SCHOOL(body.id);
        await this.setState({ loading: true, loadingTable: true });
        switch (type) {
            case TYPE.DELETE:
                method = DELETE;
                api += '/request';
                newBody = [id];
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
            newBody ? newBody : body,
            undefined,
            undefined,
            undefined,
            true,
            false,
        ).then(
            () => this.searchConnectEmSchool()
        ).finally(
            () => this.setState({ loading: false, loadingTable: false })
        )
    };

    searchFilter = async () => {   // change index to 0 when start searching
        await this.setState({
            pageIndex: 0,
            loadingTable: true,
        });
        this.searchConnectEmSchool();
    };

    render() {
        let {
            dataTable,
            loadingTable,
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
                        Danh sách kết nối doanh nghiệp - nhà trường ({totalItems})
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
                            <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6} >
                                <IptLetterP value={"Tên doanh nghiệp"} />
                                <Search
                                    style={{ width: "100%" }}
                                    placeholder={"Nhập tên doanh nghiệp ..."}
                                    onPressEnter={this.searchConnectEmSchool}
                                    onChange={(event: any) => this.onChangeFilter(event.target.value, TYPE.EM_SCHOOL_FILTER.name)}
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
                                <IptLetterP value={"Loại chi nhánh"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_SCHOOL_FILTER.headquarters)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Chính </Option>
                                    <Option value={TYPE.FALSE}>Khác</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tình trạng kết nối"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_SCHOOL_FILTER.state)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.PENDING}>Đang chờ </Option>
                                    <Option value={TYPE.ACCEPTED}>Đã chấp nhận</Option>
                                    <Option value={TYPE.REJECTED}>Đã chấp nhận</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={dataTable}
                            locale={{ emptyText: 'Không có dữ liệu' }}
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