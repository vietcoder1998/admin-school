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
    Avatar
} from 'antd';
import './PartnerList.scss';
import { timeConverter } from '../../../../../../utils/convertTime';
import { IAppState } from '../../../../../../redux/store/reducer';
import { REDUX_SAGA, REDUX } from '../../../../../../const/actions';
import { _requestToServer } from '../../../../../../services/exec';
import { DELETE, PUT } from '../../../../../../const/method';
import { TYPE } from '../../../../../../const/type';
// import { IptLetterP } from '../../../../layout/common/Common';
import { Link } from 'react-router-dom';
import { routeLink, routePath } from '../../../../../../const/break-cumb';
import { IRegion } from '../../../../../../models/regions';
// import DrawerConfig from '../../../../layout/config/DrawerConfig';
import { IDrawerState } from '../../../../../../models/mutil-box';
import { IptLetterP } from '../../../../layout/common/Common';
import { IPartner, IPartnersFilter } from '../../../../../../models/partner';
import { PARTNER } from '../../../../../../services/api/private.api';

const { Option } = Select

interface IPartnerListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    location?: any;
    handleDrawer?: (drawerState?: IDrawerState) => any;
    getPartnerDetail?: (id?: string) => any;
    getListPartner: Function;
    getAnnoucementDetail: Function;
};

interface IPartnerListState {
    data_table?: Array<any>;
    search?: any;
    pageIndex?: number;
    pageSize?: number;
    showModal?: boolean;
    loading?: boolean;
    valueType?: string;
    id?: string;
    loadingTable?: boolean;
    body?: IPartnersFilter;
    listPartners?: Array<any>;
    educatedScaleState?: string;
};

class PartnerList extends PureComponent<IPartnerListProps, IPartnerListState> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            showModal: false,
            loading: false,
            id: null,
            loadingTable: true,
            educatedScaleState: null,
            body: {
                username: null,
                regionID: null,
                email: null,
                createdDate: null,
            },
            listPartners: []
        };
    }

    EditToolAction = () => {
        return <>
            {/* <Tooltip title='Xem chi partner' >
                <Icon
                    className='test'
                    style={{ padding: 5, margin: 2 }}
                    type={"search"}
                    onClick={() => {
                        this.props.handleDrawer({ openDrawer: true });
                        setTimeout(() => {
                            this.props.getPartnerDetail(id);
                        }, 500);
                    }}
                />
            </Tooltip> */}
            <Popconfirm
                placement="topRight"
                title={"Xóa ứng viên"}
                onConfirm={() => this.createRequest(TYPE.DELETE)}
                okType={'danger'}
                okText="Xóa"
                cancelText="Hủy"
                style={{ padding: "10px 5px" }}
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
            title: 'Ảnh đại diện',
            dataIndex: 'avatarUrl',
            className: 'action',
            key: 'avatarUrl',
            width: 100,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            className: 'action',
            key: 'name',
            width: 150,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            className: 'action',
            key: 'gender',
            width: 100,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            className: 'action',
            key: 'email',
            width: 250,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            className: 'action',
            key: 'phone',
            width: 150,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            className: 'action',
            key: 'address',
            width: 250,
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
        let { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    static getDerivedStateFromProps(nextProps?: IPartnerListProps, prevState?: IPartnerListState) {
        if (nextProps.listPartners && nextProps.listPartners !== prevState.listPartners) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];
            nextProps.listPartners.forEach((item: IPartner, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: (item.firstName ? item.firstName : ' ') + " " + (item.lastName ? item.lastName : ''),
                    avatarUrl: <Avatar shape={"square"} size={50} src={item.avatarUrl} />,
                    email: item.email ? item.email : '',
                    phone: item.phone ? item.phone : '',
                    address: item.address ? item.address : '',
                    gender: item.gender === "MALE" ? "Nam" : "Nữ",
                    region: item.region ? item.region.name : "",
                    createdDate: item.createdDate !== -1 ? timeConverter(item.createdDate, 1000) : '',
                });
            })
            return {
                listPartners: nextProps.listPartners,
                data_table,
                loadingTable: false,
            }
        }

        return { loadingTable: false };
    };

    async componentDidMount() {
        await this.searchPartner();
    };

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.searchPartner();
    };

    searchPartner = async () => {
        let { pageIndex, pageSize, body } = this.state;
        await this.props.getListPartner(pageIndex, pageSize, body);
    };

    createRequest = async (type?: string) => {
        let { id, educatedScaleState } = this.state;
        let method = null;
        let api = PARTNER;
        switch (type) {
            case TYPE.DELETE:
                method = DELETE;
                break;
            case TYPE.BAN:
                method = PUT;
                api = api + `/educatedScale/${educatedScaleState === 'true' ? 'false' : 'true'}`
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
                if (res) { this.searchPartner() }
            }
        )
    }

    onChangeFilter = (value?: any, type?: string) => {
        let { body } = this.state;
        let { listRegions } = this.props;

        listRegions.forEach((item: IRegion) => {
            if (item.name === value) { value = item.id }
        });

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
            loadingTable,
        } = this.state;

        let {
            listRegions,
        } = this.props
        return (
            <>
                <div className="common-content">
                    <h5>
                        Danh sách cộng tác viên
                        <Button
                            icon="filter"
                            onClick={() => this.searchPartner()}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            Lọc
                        </Button>
                        <Link to={routeLink.PARTNER + routePath.CREATE}>
                            <Button
                                icon="plus"
                                type="primary"
                                style={{
                                    float: "right",
                                    margin: '0px 5px'
                                }}
                            >
                                Tạo mới
                        </Button>
                        </Link>

                    </h5>
                    <div className="table-operations">
                        <Row >
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tên tài khoản"} />
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event.target.value, TYPE.PARTNER_FILTER.username)}
                                    onPressEnter={(event: any) => this.searchPartner()}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Email"} />
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event.target.value, TYPE.PARTNER_FILTER.email)}
                                    onPressEnter={(event: any) => this.searchPartner()}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tỉnh thành"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.PARTNER_FILTER.regionID)}
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
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={data_table}
                            scroll={{ x: 1400 }}
                            bordered
                            pagination={{ total: 0, showSizeChanger: true }}
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
    getListPartner: (pageIndex: number, pageSize: number, body?: IPartnersFilter) =>
        dispatch({ type: REDUX_SAGA.PARTNER.GET_LIST_PARTNER, pageIndex, pageSize, body }),
    getPartnerDetail: (id?: string) =>
        dispatch({ type: REDUX_SAGA.PARTNER.GET_PARTNER_DETAIL, id }),
    handleDrawer: (drawerState?: IDrawerState) =>
        dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    listPartners: state.Partners.items,
    listRegions: state.Regions.items,
    totalItems: state.Partners,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PartnerList);