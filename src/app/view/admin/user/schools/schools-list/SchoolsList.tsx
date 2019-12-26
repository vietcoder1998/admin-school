import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import {
    Button,
    Table,
    Icon,
    Popconfirm,
    Col,
    Row,
    Input,
    Tooltip,
    Select,
    //  Avatar 
} from 'antd';
import './SchoolsList.scss';
import { timeConverter } from '../../../../../../utils/convertTime';
import { IAppState } from '../../../../../../redux/store/reducer';
import { REDUX_SAGA, REDUX } from '../../../../../../const/actions';
import { _requestToServer } from '../../../../../../services/exec';
import { DELETE, PUT } from '../../../../../../const/method';
import { SCHOOLS } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../const/type';
// import { IptLetterP } from '../../../../layout/common/Common';
import { ISchool, ISchoolsFilter } from '../../../../../../redux/models/schools';
// import { Link } from 'react-router-dom';
import { routeLink, routePath } from '../../../../../../const/break-cumb';
import { IRegion } from '../../../../../../redux/models/regions';
import DrawerConfig from '../../../../layout/config/DrawerConfig';
import { IDrawerState } from '../../../../../../redux/models/mutil-box';
import SchoolInfo from '../../../../layout/school-info/SchoolInfo';
import { IptLetterP } from '../../../../layout/common/Common';

const { Option } = Select

interface ISchoolsListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    location?: any;
    handleDrawer?: (drawerState?: IDrawerState) => any;
    getSchoolDetail?: (id?: string) => any;
    getListSchools: Function;
    getAnnoucementDetail: Function;
};

interface ISchoolsListState {
    data_table?: Array<any>;
    search?: any;
    pageIndex?: number;
    pageSize?: number;
    show_modal?: boolean;
    loading?: boolean;
    value_type?: string;
    id?: string;
    loading_table?: boolean;
    body?: ISchoolsFilter;
    list_schools?: Array<ISchool>;
    educatedScale_state?: string;
};

class SchoolsList extends PureComponent<ISchoolsListProps, ISchoolsListState> {
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
            educatedScale_state: null,
            body: {
                name: null,
                shortName: null,
                educatedScale: null,
                regionID: null,
                schoolTypeID: null,
                email: null,
                employerID: null,
                connected: null,
                createdDate: null
            },
            list_schools: []
        };
    }

    EditToolAction = () => {
        let { id } = this.state;
        return <>
            <Tooltip title='Xem chi tiết trường ' >
                <Icon
                    className='test'
                    style={{ padding: 5, margin: 2 }}
                    type={"search"}
                    onClick={() => {
                        this.props.handleDrawer({ open_drawer: true });
                        setTimeout(() => {
                            this.props.getSchoolDetail(id);
                        }, 500);
                    }}
                />
            </Tooltip>
            <Popconfirm
                placement="topRight"
                title={"Xóa "}
                onConfirm={() => this.createRequest(TYPE.DELETE)}
                okType={'danger'}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Tooltip title='Xóa trường ' >
                    <Icon className='test' style={{ padding: 5, margin: 2 }} type="delete" theme="twoTone" twoToneColor="red" />
                </Tooltip>
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
            title: 'Tên rút gọn',
            dataIndex: 'shortName',
            className: 'action',
            key: 'shortName',
            width: 100,
        },
        {
            title: 'Tên nhà trường',
            dataIndex: 'name',
            className: 'action',
            key: 'name',
            width: 250,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            className: 'action',
            key: 'email',
            width: 250,
        },
        {
            title: 'Số lượng sinh viên',
            dataIndex: 'educatedScale',
            className: 'action',
            key: 'educatedScale',
            width: 150,
        },
        {
            title: 'Tỉnh thành',
            dataIndex: 'region',
            className: 'action',
            key: 'region',
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 150,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            width: 100,
            render: () => this.EditToolAction()
        },
    ];

    onToggleModal = () => {
        let { show_modal } = this.state;
        this.setState({ show_modal: !show_modal });
    };

    static getDerivedStateFromProps(nextProps?: ISchoolsListProps, prevState?: ISchoolsListState) {
        if (nextProps.list_schools && nextProps.list_schools !== prevState.list_schools) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];
            nextProps.list_schools.forEach((item: ISchool, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name ? item.name : '',
                    email: item.email ? item.email : '',
                    shortName: item.shortName ? item.shortName : '',
                    educatedScale: item.educatedScale === -1 ? '' : item.educatedScale,
                    region: item.region && item.region.name,
                    createdDate: item.createdDate !== -1 ? timeConverter(item.createdDate, 1000) : '',
                });
            })
            return {
                list_schools: nextProps.list_schools,
                data_table,
                loading_table: false,
            }
        }

        return { loading_table: false };
    };

    async componentDidMount() {
        await this.searchSchools();
    };

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchSchools();
    };

    searchSchools = async () => {
        let { pageIndex, pageSize, body } = this.state;
        await this.props.getListSchools(pageIndex, pageSize, body);
    };

    createRequest = async (type?: string) => {
        let { id, educatedScale_state } = this.state;
        let method = null;
        let api = SCHOOLS;
        switch (type) {
            case TYPE.DELETE:
                method = DELETE;
                break;
            case TYPE.BAN:
                method = PUT;
                api = api + `/educatedScale/${educatedScale_state === 'true' ? 'false' : 'true'}`
                break;
            default:
                break;
        }
        await _requestToServer(
            method,
            api,
            [id],
            undefined,
            undefined,
            undefined,
            true,
            false,
        ).then(
            (res: any) => {
                if (res) { this.searchSchools() }
            }
        )
    }

    onChangeFilter = (value?: any, type?: string) => {
        let { body } = this.state;
        let { list_regions } = this.props;
        list_regions.forEach((item: IRegion) => { if (item.name === value) { value = item.id } });
        switch (value) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
            default:
                break;
        };

        body[type] = value;
        this.setState({ body });
    }

    render() {
        let {
            data_table,
            loading_table,
            body
        } = this.state;

        let {
            totalItems,
            school_detail,
            list_regions,
        } = this.props
        return (
            <>
                <DrawerConfig width={'50vw'} title={"Thông tin Nhà trường"}>
                    <SchoolInfo data={school_detail} />
                    <Button
                        icon={"left"}
                        onClick={
                            () => {
                                this.props.handleDrawer({ open_drawer: false });
                                this.props.history.push(routeLink.EM_CONTROLLER + routePath.LIST);
                            }
                        }
                    >
                        Thoát
                    </Button>
                </DrawerConfig>
                <div className="common-content">
                    <h5>
                        Danh sách nhà trường
                        <Button
                            icon="filter"
                            onClick={() => this.searchSchools()}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </h5>
                    <div className="table-operations">
                        <Row >
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tên rút gọn"} />
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    value={body.shortName}
                                    onChange={(event: any) => this.onChangeFilter(event.target.value, TYPE.SCHOOLS.shortName)}
                                    onPressEnter={(event: any) => this.searchSchools()}
                                    suffix={
                                        body.shortName &&
                                            body.shortName.length > 0 ?
                                            <Icon
                                                type={"close-circle"}
                                                theme={"filled"}
                                                onClick={
                                                    () => this.onChangeFilter(null, TYPE.SCHOOLS.shortName)
                                                }
                                            /> : <Icon type={"search"} />
                                    }
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Email"} />
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    value={body.email}
                                    onChange={(event: any) => this.onChangeFilter(event.target.value, TYPE.SCHOOLS.email)}
                                    onPressEnter={(event: any) => this.searchSchools()}
                                    suffix={
                                        body.email &&
                                            body.email.length > 0 ?
                                            <Icon
                                                type={"close-circle"}
                                                theme={"filled"}
                                                onClick={
                                                    () => this.onChangeFilter(null, TYPE.SCHOOLS.email)
                                                }
                                            /> : <Icon type={"search"} />
                                    }
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tỉnh thành"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.SCHOOLS.regionID)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    {
                                        list_regions && list_regions.length >= 1 ?
                                            list_regions.map((item: IRegion, index: number) =>
                                                <Option key={index} value={item.name}>{item.name}</Option>
                                            ) : null
                                    }
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Yêu cầu kết nối"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.SCHOOLS.connected)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Đã gửi </Option>
                                    <Option value={TYPE.FALSE}>Chưa gửi</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 1100 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record: any, rowIndex: any) => {
                                return {
                                    onMouseEnter: () => {
                                        this.setState({ id: record.key })
                                    }, // mouse enter row
                                };
                            }}
                        />
                    </div>
                </div>
            </ >
        )
    }
};

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListSchools: (pageIndex: number, pageSize: number, body?: ISchoolsFilter) =>
        dispatch({ type: REDUX_SAGA.SCHOOLS.GET_SCHOOLS, pageIndex, pageSize, body }),
    getSchoolDetail: (id?: string) =>
        dispatch({ type: REDUX_SAGA.SCHOOLS.GET_SCHOOL_DETAIL, id }),
    handleDrawer: (drawerState?: IDrawerState) =>
        dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    list_schools: state.Schools.items,
    list_regions: state.Regions.items,
    school_detail: state.SchoolsDetail,
    totalItems: state.Schools.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SchoolsList);