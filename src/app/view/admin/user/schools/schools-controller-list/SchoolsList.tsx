import React, { PureComponent,  } from 'react'
import { connect } from 'react-redux';
import {
    Button,
    Table,
    Icon,
    Popconfirm,
    // Col, 
    // Select, 
    // Row, 
    // Input, 
    Tooltip,
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

    editToolAction = () => {
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
            title: 'Thư điện tử',
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
            title: 'Số lượng học sinh',
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
            render: () => this.editToolAction()
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
        await this.searchSchoolss();
    };

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchSchoolss();
    };

    searchSchoolss = async () => {
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
                if (res) { this.searchSchoolss() }
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
        switch (value) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
            default:
                break;
        }
        body[type] = value;
        this.setState({ body });
    }

    render() {
        let {
            data_table,
            loading_table,
        } = this.state;

        let {
            totalItems,
            school_detail
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
                        Quản lý nhà trường
                        <Button
                            icon="filter"
                            onClick={() => this.searchSchoolss()}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </h5>
                    <div className="table-operations">
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 800 }}
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