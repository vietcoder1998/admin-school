import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Row, Col, Input, Modal } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { IMajor } from '../../../../../../models/majors';
import { Link } from 'react-router-dom';
import { IBranches } from '../../../../../../models/branches';
import { MAJORS } from '../../../../../../services/api/private.api';
import { DELETE, PUT, GET } from '../../../../../../const/method';
import { _requestToServer } from '../../../../../../services/exec';
import { TYPE } from '../../../../../../const/type';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';


interface ListMajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListMajors: (pageIndex?: number, pageSize?: number, name?: string) => any;
    getListBranches: (pageIndex?: number, pageSize?: number, name?: string) => any;
}

interface ListMajorsState {
    list_majors: Array<IMajor>,
    list_branch?: Array<IBranches>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    search?: string;
    id?: string;
    branchName?: string;
    branchID?: number;
    type: string;
    openModal: boolean;
    list_data: Array<{ label: string, value: number }>;
    name?: string;
}

class ListMajors extends PureComponent<ListMajorsProps, ListMajorsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_majors: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            list_branch: [],
            id: undefined,
            branchName: undefined,
            branchID: undefined,
            type: TYPE.EDIT,
            openModal: false,
            list_data: [],
            search: undefined
        };
    };

    async componentDidMount() {
        await this.props.getListMajors(0, 10);
    };

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.list_majors !== prevState.list_majors) {
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_majors.forEach((item: any, index: number) => {
                console.log(item);
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    branchName: item.branch ? item.branch.name : "Khác",
                    branchID: item.branch ? item.branch.id : null,
                });
            });

            return {
                list_majors: nextProps.list_majors,
                data_table,
                loading_table: false,
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

        return { loading_table: false };
    };


    EditContent = (
        <>
            <Icon
                className='test'
                type="unordered-list"
                style={{ padding: 5, margin: 2 }}
                onClick={() => this.createListJobName()}
            />
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
    );

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

    createListJobName = () => {
        let { id } = this.state;
        this.props.history.push(`/admin/data/majors/${id}/job-names/list`)
    }

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
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên chuyên ngành',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            className: 'action',

        }, {
            title: 'Thuộc nhóm ngành',
            dataIndex: 'branchName',
            key: 'branchName',
            width: 300,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 150,
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        this.props.getListMajors(event.current - 1, event.pageSize)
    };

    editMajor = async () => {
        let { name, id, branchID } = this.state;
        if (name) {
            await _requestToServer(
                PUT, MAJORS + `/${id}`,
                {
                    name: name.trim(),
                    branchID: branchID
                }
            ).then((res: any) => {
                this.props.getListMajors(0);
                this.toggleModal();
            })
        }
    };

    removeMajor = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, MAJORS,
            [id]
        ).then((res: any) => {
            this.props.getListMajors(0);
            this.toggleModal();
        })
    };

    render() {
        let { data_table, loading_table, type, openModal, list_data, name, branchName, pageIndex, pageSize, search } = this.state;
        let { totalItems } = this.props;
        return (
            <>
                <Modal
                    cancelText={"Hủy"}
                    okText={"Hoàn thành"}
                    title="Thay đổi chuyên ngành"
                    visible={openModal}
                    onOk={() => type === TYPE.EDIT ? this.editMajor() : this.removeMajor()}
                    onCancel={()=>this.toggleModal()}
                    destroyOnClose={true}
                >
                    {type === TYPE.EDIT ? (
                        <>
                            <InputTitle
                                type={TYPE.INPUT}
                                title="Sửa tên ngành "
                                widthLabel="120px"
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
                                list_value={list_data}
                                style={{ padding: "10px 0px" }}
                                onSearch={(event: any) => this.props.getListBranches(0, 0, event)}
                                onChange={this.handleChoseMajor}
                            />
                        </>
                    ) : <div>Bạn chắc chắn muốn xóa chuyên ngành này: {name}</div>}
                </Modal>
                <div>
                    <h5>
                        Danh sách chuyên ngành
                        <Button
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            <Link to='/admin/data/majors/create'>
                                <Icon type="plus" />
                                Thêm chuyên ngành mới
                            </Link>
                        </Button>
                    </h5>
                    <Row>
                        <Col sm={12} md={12} lg={8} xl={8} xxl={8}>
                            <Input
                                placeholder="Tất cả"
                                style={{ width: "100%" }}
                                value={search}
                                onChange={(event: any) => this.setState({ search: event.target.value })}
                                onPressEnter={(event: any) => this.props.getListMajors(pageIndex, pageSize, search)}
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
                    </Row>
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
                        onRow={(event) => ({
                            onMouseEnter: () => {
                                this.setState({ id: event.key, branchName: event.branchName , name: event.name, branchID: event.branchID});
                            }
                        })}
                    />
                </div>
            </>
        )
    };
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListMajors: (pageIndex?: number, pageSize?: number, name?: string) => dispatch({
        type: REDUX_SAGA.MAJORS.GET_MAJORS,
        pageIndex,
        pageSize,
        name
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