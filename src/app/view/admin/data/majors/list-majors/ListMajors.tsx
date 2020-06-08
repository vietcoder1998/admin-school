import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Row, Col, Input, Modal, Select, Tooltip } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { IMajor } from '../../../../../../models/majors';
import { Link } from 'react-router-dom';
import { IBranches, IBranch } from '../../../../../../models/branches';
import { MAJORS } from '../../../../../../services/api/private.api';
import { DELETE, PUT, GET } from '../../../../../../const/method';
import { _requestToServer } from '../../../../../../services/exec';
import { TYPE } from '../../../../../../const/type';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { routeLink, routePath } from '../../../../../../const/break-cumb';
import findIdWithValue from '../../../../../../utils/findIdWithValue';

interface ListMajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListMajors: (pageIndex?: number, pageSize?: number, name?: string, branchID?: number) => any;
    getListBranches: (pageIndex?: number, pageSize?: number, name?: string) => any;
}

interface ListMajorsState {
    list_majors: Array<IMajor>,
    list_branch?: Array<IBranches>,
    loadingTable: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    search?: string;
    id?: string;
    branchName?: string;
    branchID?: number;
    type: string;
    brnSearch?: number;
    openModal: boolean;
    list_data: Array<{ label: string, value: number }>;
    name?: string;
    loading?: boolean;
}

const { Option } = Select;

class ListMajors extends PureComponent<ListMajorsProps, ListMajorsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_majors: [],
            loadingTable: true,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            list_branch: [],
            id: undefined,
            branchName: undefined,
            brnSearch: undefined,
            branchID: undefined,
            type: TYPE.EDIT,
            openModal: false,
            list_data: [],
            search: undefined,
            loading: false,
        };
    };

    async componentDidMount() {
        let { pageIndex, pageSize, search, brnSearch } = this.state;
        await this.props.getListMajors(pageIndex, pageSize, search, brnSearch);
    };

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {

        if (nextProps.list_majors !== prevState.list_majors) {
            let data_table: any = [];
            let params = (new URL(window.location.href)).searchParams;
            let pageIndex = parseInt(params.get('pageIndex'));
            let pageSize = parseInt(params.get('pageSize'));
            let name = params.get('name');
            let branchID = params.get('branchID');

            nextProps.list_majors.forEach((item: any, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    branchName: item.branch ? item.branch.name : "Khác",
                    branchID: item.branch ? item.branch.id : null,
                    id: item.id
                });
            });

            return {
                list_majors: nextProps.list_majors,
                data_table,
                loadingTable: false,
                pageIndex,
                pageSize,
                search: name,
                brnSearch: branchID ? branchID: null
            }
        }

        if (nextProps.list_branches !== prevState.list_branches) {
            let list_data: any = [];
            nextProps.list_branches.forEach((item: any) => list_data.push({ value: item.id, label: item.name }));
            return {
                list_branches: nextProps.list_branches,
                list_data,
            }
        }

        return { loadingTable: false };
    };


    EditContent = (id?: string) => {
        return (
            <>
                <Tooltip title={"Thay đổi công việc nhóm"} >
                    <Link
                        to={routeLink.MAJORS +
                            `/${id}` +
                            routePath.JOB_NAMES +
                            routePath.LIST}
                    >
                        <Icon
                            className='test'
                            type="unordered-list"
                            style={{ padding: 5, margin: 2 }}
                        />
                    </Link>
                </Tooltip>
                <Icon
                    className='test'
                    key="edit"
                    style={{ padding: 5, margin: 2 }}
                    type="edit"
                    theme="twoTone"
                    onClick={() => this.toggleModal(TYPE.EDIT)}
                />
                <Icon
                    className='test'
                    key="delete"
                    style={{ padding: 5, margin: 2 }}
                    type="delete"
                    theme="twoTone"
                    twoToneColor="red"
                    onClick={() => this.toggleModal(TYPE.DELETE)}
                />
            </>
        )
    };

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        if (type) {
            this.setState({ type })
        }
        this.setState({ openModal: !openModal })
    };

    choseMajor = async (event: any) => {
        await this.getMajorDetail();
    };

    getMajorDetail = async () => {
        let { id } = this.state;
        await _requestToServer(
            GET, MAJORS + `/${id}`,
            undefined,
            undefined, undefined, undefined, false, false
        ).then((res: any) => {
            if (res) {
                this.setState({ branchID: res.data.branch.id })
            }
        })
    };

    handleChoseMajor = (id: number) => {
        let { list_data } = this.state;
        list_data.forEach(item => {
            if (item.value === id) {
                this.setState({ branchName: item.label })
            }
        });
        this.setState({ branchID: id })
    };

    columns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'index',
            fixed: 'left',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên chuyên ngành',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            className: 'action',

        }, {
            title: 'Thuộc nhóm ngành',
            dataIndex: 'branchName',
            key: 'branchName',
            width: 200,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            dataIndex: 'id',
            className: 'action',
            width: 150,
            fixed: 'right',
            render: (id?: string) => this.EditContent(id),
        },
    ];

    setPageIndex = async (event: any) => {
        let { search, brnSearch } = this.state;
        this.props.history.push({
            search: `?pageIndex=${event.current - 1}&pageSize=${event.pageSize}`
        })
        await this.setState({ loadingTable: true });
        this.props.getListMajors(event.current - 1, event.pageSize, search, brnSearch)
    };

    editMajor = async () => {
        let { name, id, branchID, pageIndex, pageSize, search, brnSearch } = this.state;
        if (name) {
            await _requestToServer(
                PUT, MAJORS + `/${id}`,
                {
                    name: name.trim(),
                    branchID: branchID
                }
            ).then((res: any) => {
                this.props.getListMajors(pageIndex, pageSize, search, brnSearch);
                this.toggleModal();
            })
        }
    };

    removeMajor = async () => {
        let { id, pageIndex, pageSize, search, brnSearch } = this.state;
        await this.setState({ loading: true })
        await _requestToServer(
            DELETE, MAJORS,
            [id]
        ).then((res: any) => {
            this.props.getListMajors(pageIndex, pageSize, search, brnSearch);
            this.setState({ loading: false })
            this.toggleModal();
        })
    };

    render() {
        let {
            data_table,
            loadingTable,
            type,
            openModal,
            list_data,
            name,
            branchName,
            pageIndex,
            search,
            loading,
            brnSearch
        } = this.state;
        let { totalItems, list_branches } = this.props;
        return (
            <>
                <Modal
                    cancelText={"Hủy"}
                    okText={"Hoàn thành"}
                    title="Thay đổi chuyên ngành"
                    visible={openModal}
                    onOk={() => type === TYPE.EDIT ? this.editMajor() : this.removeMajor()}
                    onCancel={() => this.toggleModal()}
                    confirmLoading={loading}
                    destroyOnClose={true}
                >
                    {type === TYPE.EDIT ? (
                        <>
                            <InputTitle
                                type={TYPE.INPUT}
                                title="Sửa tên ngành "
                                placeholder="Thay đổi tên"
                                value={name}
                                widthInput={"250px"}
                                style={{ padding: "10px 0px" }}
                                onChange={(event: any) => this.setState({ name: event })}
                            />
                            <InputTitle
                                type={TYPE.SELECT}
                                title="Chọn chuyên ngành "
                                placeholder="Chọn chuyên ngành "
                                value={branchName}
                                widthSelect={'250px'}
                                listValue={list_data}
                                style={{ padding: "10px 0px" }}
                                onSearch={(event: any) => this.props.getListBranches(0, 0, event)}
                                onChange={this.handleChoseMajor}
                            />
                        </>
                    ) : <div>Bạn chắc chắn muốn xóa chuyên ngành này: {name}</div>}
                </Modal>
                <Row>
                    <Col md={2} lg={0} xl={3} xxl={6} />
                    <Col md={20} lg={24} xl={18} xxl={12}>
                        <h5>
                            Danh sách chuyên ngành
                                <Button
                                type="primary"
                                style={{
                                    float: "right",
                                }}
                            >
                                <Link to={routeLink.MAJORS + routePath.CREATE}>
                                    <Icon type="plus" />
                                         Thêm mới
                                    </Link>
                            </Button>
                            <Button
                                type="primary"
                                style={{
                                    float: "right",
                                    marginRight: 10
                                }}
                                onClick={() => {
                                    this.props.getListMajors(0, 0, search, brnSearch)
                                }}
                            >
                                <Icon type="filter" />
                                    Lọc
                                </Button>
                        </h5>
                        <Row>
                            <Col sm={12} md={12} lg={8} xl={8} xxl={8}>
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    value={search}
                                    onChange={(event: any) => {
                                        this.setState({ search: event.target.value });
                                    }}
                                    suffix={
                                        search &&
                                            search.length > 0 ?
                                            <Icon
                                                type={"close-circle"}
                                                theme={"filled"}
                                                onClick={
                                                    () => this.setState({ search: null })
                                                }
                                            /> : <Icon type={"search"} />
                                    }
                                />
                            </Col>
                            <Col sm={12} md={12} lg={8} xl={8} xxl={8}>
                                <Select
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    showSearch
                                    onSearch={() => this.props.getListBranches(0)}
                                    onChange={(event: any) => this.setState({ brnSearch: findIdWithValue(list_branches, event, "name", "id") })}
                                >
                                    <Option value={null} children="Tất cả" />
                                    {
                                        list_branches ? list_branches.map((item?: IBranch, index?: number) => <Option key={item.id} value={item ? item.name : ""} children={item ? item.name : ""} />) : ""
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={data_table}
                            scroll={{ x: 600 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true, defaultCurrent: pageIndex + 1 }}
                            onChange={this.setPageIndex}
                            onRow={(event) => ({
                                onClick: () => {
                                    this.setState({
                                        id: event.key,
                                        branchName: event.branchName,
                                        name: event.name,
                                        branchID: event.branchID
                                    });
                                    localStorage.setItem("major", event.name)
                                },
                            })}
                        />
                    </Col>
                    <Col md={2} lg={0} xl={3} xxl={6} />
                </Row>
            </>
        )
    };
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListMajors: (pageIndex?: number, pageSize?: number, name?: string, branchID?: number) => dispatch({
        type: REDUX_SAGA.MAJORS.GET_MAJORS,
        pageIndex,
        pageSize,
        name,
        branchID
    }),
    getListBranches: (pageIndex?: number, pageSize?: number, name?: string) => dispatch({
        type: REDUX_SAGA.BRANCHES.GET_BRANCHES,
        pageIndex,
        pageSize,
        name
    })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_majors: state.Majors.items,
    list_branches: state.Branches.items,
    totalItems: state.Majors.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListMajors)