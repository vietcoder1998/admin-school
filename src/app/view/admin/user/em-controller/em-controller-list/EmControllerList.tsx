import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Button, Table, Icon, Popconfirm, Col, Select, Row, Input, Tooltip, Avatar } from 'antd';
import './EmControllerList.scss';
import { timeConverter } from '../../../../../../common/utils/convertTime';
import { IAppState } from '../../../../../../redux/store/reducer';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { _requestToServer } from '../../../../../../services/exec';
import { DELETE, PUT } from '../../../../../../common/const/method';
import { USER_CONTROLLER } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../common/const/type';
import { IptLetterP } from '../../../../layout/common/Common';
import { IEmController, IEmControllerFilter } from '../../../../../../redux/models/em-controller';
import { Link } from 'react-router-dom';
import { routeLink, routePath } from '../../../../../../common/const/break-cumb';
import { IRegion } from '../../../../../../redux/models/regions';

interface IEmControllerListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    getListEmControllers: Function;
    getAnnoucementDetail: Function;
};

interface IEmControllerListState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    show_modal?: boolean;
    loading?: boolean;
    value_type?: string;
    id?: string;
    loading_table?: boolean;
    body?: IEmControllerFilter;
    list_user_controller?: Array<IEmController>;
    profileVerified_state?: string;
};

class EmControllerList extends PureComponent<IEmControllerListProps, IEmControllerListState> {
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
            profileVerified_state: null,
            body: {
                employerName: null,
                taxCode: null,
                regionID: null,
                profileVerified: null,
                ids: []
            },
            list_user_controller: []
        };
    }

    editToolAction = () => {
        let { id } = this.state;
        return <>
            <Tooltip title='Xem hồ sơ nhà tuyển dụng' >
                <Icon
                    style={{ padding: "5px 10px" }}
                    type={"search"}
                />
            </Tooltip>
            <Tooltip title='Xem danh sách chi nhánh' >
                <Link to={routeLink.EM_BRANCHES + routePath.LIST + `/${id}`} target='_blank' >
                    <Icon
                        style={{ padding: "5px 10px" }}
                        type={"container"}
                    />
                </Link>
            </Tooltip>
            <Tooltip title='Chứng thực nhà tuyển dụng' >
                <Icon
                    style={{ padding: "5px 10px" }}
                    type={"safety-certificate"}
                />
            </Tooltip>
            <Popconfirm
                placement="topRight"
                title={"Xóa khỏi danh sách"}
                onConfirm={() => this.createRequest(TYPE.DELETE)}
                okType={'danger'}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Icon style={{ padding: "5px 10px" }} type="delete" theme="twoTone" twoToneColor="red" />
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
            dataIndex: 'logoUrl',
            className: 'action',
            key: 'logoUrl',
            width: 60,
        },
        {
            title: 'Tên nhà tuyển dụng',
            dataIndex: 'employerName',
            className: 'action',
            key: 'employerName',
            width: 240,
        },

        {
            title: 'Chứng thực hồ sơ',
            dataIndex: 'profileVerified',
            className: 'action',
            key: 'profileVerified',
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 160,
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

    static getDerivedStateFromProps(nextProps?: IEmControllerListProps, prevState?: IEmControllerListState) {
        if (nextProps.list_user_controller && nextProps.list_user_controller !== prevState.list_user_controller) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];
            nextProps.list_user_controller.forEach((item: IEmController, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    employerName: item.employerName ? item.employerName : '',
                    logoUrl: <Avatar size="large" shape="square" src={item.logoUrl} icon="shop" />,
                    profileVerified: item.profileVerified ? 'true' : 'false',
                    createdDate: item.createdDate !== -1 ? timeConverter(item.createdDate, 1000) : '',
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
        await this.searchEmControllers();
    };

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchEmControllers();
    };

    searchEmControllers = async () => {
        let { pageIndex, pageSize, body } = this.state;
        await this.props.getListEmControllers(pageIndex, pageSize, body);
    };

    createRequest = async (type?: string) => {
        let { id, profileVerified_state } = this.state;
        let method = null;
        let api = USER_CONTROLLER;
        switch (type) {
            case TYPE.DELETE:
                method = DELETE;
                break;
            case TYPE.BAN:
                method = PUT;
                api = api + `/profileVerified/${profileVerified_state === 'true' ? 'false' : 'true'}`
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
                if (res) { this.searchEmControllers() }
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
            list_regions
        } = this.props
        return (
            <Fragment>
                <div className="common-content">
                    <h5>
                        Quản lí nhà tuyển dụng
                        <Button
                            icon="filter"
                            onClick={() => this.searchEmControllers()}
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
                            <IptLetterP value={"Tên nhà tuyển dụng"}  >
                                <Input
                                    placeholder='ex: works'
                                    onChange={
                                        (event: any) => this.onChangeFilter(event.target.value, TYPE.EM_CONTROLLER.employerName)
                                    }
                                    onKeyDown={
                                        (event: any) => {
                                            if (event.keyCode === 13) {
                                                this.searchEmControllers()
                                            }
                                        }
                                    }
                                />
                            </IptLetterP>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <IptLetterP value={"Tỉnh thành"} />
                            <Select
                                showSearch
                                defaultValue="Tất cả"
                                style={{ width: "100%" }}
                                onChange={(event: any) => this.onChangeFilter(event, TYPE.EM_CONTROLLER.regionID)}
                            >
                                <Select.Option value={null}>Tất cả</Select.Option>
                                {
                                    list_regions && list_regions.length >= 1 ?
                                        list_regions.map((item: IRegion, index: number) =>
                                            <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
                                        ) : null
                                }
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                            <IptLetterP value={"Trạng thái chứng thực"} />
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                defaultValue="Tất cả"
                                onChange={(event?: any) => this.onChangeFilter(event, TYPE.EM_CONTROLLER.profileVerified)}
                            >
                                <Select.Option key="1" value={null}>Tất cả</Select.Option>
                                <Select.Option key="2" value={TYPE.TRUE}>Đang chứng thực</Select.Option>
                                <Select.Option key="3" value={TYPE.FALSE}>Không chứng thực</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <div className="table-operations">
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 710 }}
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
            </Fragment >
        )
    }
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListEmControllers: (pageIndex: number, pageSize: number, body?: IEmController) =>
        dispatch({ type: REDUX_SAGA.EM_CONTROLLER.GET_EM_CONTROLLER, pageIndex, pageSize, body }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    list_user_controller: state.EmControllers.items,
    list_regions: state.Regions.items,
    totalItems: state.EmControllers.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EmControllerList);