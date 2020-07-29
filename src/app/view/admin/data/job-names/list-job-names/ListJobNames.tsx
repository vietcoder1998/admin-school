import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Row, Col } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { IJobName } from '../../../../../../models/job-type';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { JOB_NAMES } from '../../../../../../services/api/private.api';
import { DELETE, PUT, GET } from '../../../../../../const/method';
import { TYPE } from '../../../../../../const/type';
import { IJobGroup } from '../../../../../../models/job-groups';
import { IAppState } from '../../../../../../redux/store/reducer';
import Search from 'antd/lib/input/Search';
import { IptLetterP } from '../../../../layout/common/Common';

interface IListJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: (pageIndex?: number, pageSize?: number, name?: string) => any;
    getListMajors: (pageIndex?: number, pageSize?: number, name?: string) => any;
}

interface IListJobNamesState {
    listJobNames: Array<IJobName>,
    listJobGroups?: Array<IJobGroup>,
    loadingTable: boolean;
    dataTable: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal?: boolean;
    jobGroupID?: number;
    id?: string;
    type?: string;
    name?: string;
    jobGroupName?: string;
    listData: Array<{ label: string, value: number }>;
    search?: string;
}

class ListJobNames extends PureComponent<IListJobNamesProps, IListJobNamesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            listJobNames: [],
            loadingTable: true,
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            id: undefined,
            name: undefined,
            type: TYPE.EDIT,
            listJobGroups: [],
            jobGroupID: undefined,
            jobGroupName: undefined,
            listData: [],
        }
    }

    async componentDidMount() {
        await this.props.getListJobNames(0, 10);
    }

    static getDerivedStateFromProps(nextProps?: IListJobNamesProps, prevState?: IListJobNamesState) {
        if (nextProps.listJobNames !== prevState.listJobNames) {
            let dataTable: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.listJobNames.forEach((item?: IJobName, index?: any) => {
                dataTable.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    jobGroupName: item && item.jobGroup ? item.jobGroup.name : ''
                });
            });

            return {
                listJobNames: nextProps.listJobNames,
                dataTable,
                loadingTable: false
            }
        }

        if (nextProps.listJobGroups !== prevState.listJobGroups) {
            let listData: any = [];
            nextProps.listJobGroups.forEach((item: any) => listData.push({ value: item.id, label: item.name }));
            return {
                listJobGroups: nextProps.listJobGroups,
                listData,
            }
        }
        return { loadingTable: false };
    }

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        if (type) {
            this.setState({ type })
        }
        this.setState({ openModal: !openModal })
    };

    EditContent: JSX.Element = (
        <>
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
            title: 'Loại công việc',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            className: 'action',
            fixed: false,
        },
        {
            title: 'Thuộc nhóm công việc',
            dataIndex: 'jobGroupName',
            key: 'jobGroupName',
            width: 250,
            className: 'action',
            fixed: false,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 100,
            fixed: 'right',
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.props.getListJobNames(event.current - 1, event.pageSize);
    };

    choseJobName = (event: any) => {
        this.setState({ id: event.key, name: event.name, jobGroupName: event.jobGroupName });
        this.getJobNameDetail(event.key);
    };

    getJobNameDetail = async (id: number) => {
        await _requestToServer(
            GET, JOB_NAMES + `/${id}`,
            undefined,
            undefined, undefined, undefined, false, false
        ).then((res: any) => {
            if (res) {
                this.setState({ jobGroupID: res.data.jobGroup.id })
            }
        })
    };

    handleChoseJobGroup = (id: number) => {
        let { listData } = this.state;
        listData.forEach(item => {
            if (item.value === id) {
                this.setState({ jobGroupName: item.label })
            }
        });
        this.setState({ jobGroupID: id })
    };

    editJobNames = async () => {
        let { name, id, jobGroupID } = this.state;
        if (name) {
            await _requestToServer(
                PUT, JOB_NAMES + `/${id}`,
                {
                    name: name.trim(),
                    jobGroupID
                }
            ).then((res: any) => {
                this.props.getListJobNames(0);
                this.toggleModal();
            })
        }
    };

    removeJobNames = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, JOB_NAMES,
            [id]
        ).then((res: any) => {
            this.props.getListJobNames(0);
            this.toggleModal();
        })
    };

    render() {
        let {
            dataTable,
            loadingTable,
            openModal,
            type,
            name,
            jobGroupName,
            listData,
            pageIndex,
            pageSize,
            search,
        } = this.state;
        let { totalItems } = this.props;
        return (
            <>
                <ModalConfig
                    namebtn1={"Hủy"}
                    namebtn2={"Hoàn thành"}
                    title="Thay đổi công việc"
                    isOpen={openModal}
                    handleOk={() => type === TYPE.EDIT ? this.editJobNames() : this.removeJobNames()}
                    handleClose={this.toggleModal}
                    toggleModal={this.toggleModal}
                >
                    {type === TYPE.EDIT ? (
                        <>
                            <InputTitle
                                type={TYPE.INPUT}
                                title="Sửa tên công việc"
                                widthLabel="120px"
                                placeholder="Thay đổi tên"
                                value={name}
                                widthInput={"250px"}
                                style={{ padding: 10 }}
                                onChange={(event: any) => this.setState({ name: event })}
                            />
                            <InputTitle
                                type={TYPE.SELECT}
                                title="Chọn nhóm công việc"
                                placeholder="Chọn nhóm công việc"
                                listValue={listData}
                                value={jobGroupName}
                                style={{ padding: "10px 20px" }}
                                widthSelect={'250px'}
                                onSearch={(event?: any) => this.props.getListMajors(0, 0, event)}
                                onChange={this.handleChoseJobGroup}
                            />
                        </>
                    ) : <div>Bạn chắc chắn muốn xóa loại công việc này: {name}</div>}
                </ModalConfig>
                <Row>
                    <Col md={0} lg={0} xl={1} xxl={4} />
                    <Col md={24} lg={24} xl={22} xxl={16} >
                        <h5>
                            Danh sách loại công việc ({totalItems})
                        <Button
                                onClick={() => {
                                }}
                                type="primary"
                                style={{
                                    float: "right",
                                }}
                            >

                                <Link to='/admin/data/job-names/create'>
                                    <Icon type="plus" />
                                Thêm mới
                            </Link>
                            </Button>
                        </h5>
                        <Row>
                            <Col sm={12} md={8} lg={8} xl={8} xxl={8}>
                                <IptLetterP value="Tên công việc" />
                                <Search
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    value={search}
                                    onChange={(event: any) => this.setState({ search: event.target.value })}
                                    onPressEnter={(event: any) => this.props.getListJobNames(pageIndex, pageSize, search)}
                                />
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={dataTable}
                            locale={{ emptyText: 'Không có dữ liệu' }}
                            scroll={{ x: 650 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(event: any) => ({ onClick: () => this.choseJobName(event) })}
                        />
                    </Col>

                    <Col md={2} lg={0} xl={1} xxl={4} />
                </Row>

            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListJobNames: (pageIndex: number, pageSize: number, name?: string) => dispatch({
        type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES, pageIndex, pageSize, name
    }),
    getListMajors: (pageIndex: number, pageSize: number, name?: string) => dispatch({
        type: REDUX_SAGA.MAJORS.GET_MAJORS, pageIndex, pageSize, name
    })
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    listJobNames: state.JobNames.items,
    listJobGroups: state.JobGroups.items,
    totalItems: state.JobNames.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListJobNames)