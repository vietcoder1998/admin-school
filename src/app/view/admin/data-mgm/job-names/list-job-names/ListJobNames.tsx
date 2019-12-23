import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { IJobName } from '../../../../../../redux/models/job-type';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { JOB_NAMES } from '../../../../../../services/api/private.api';
import { DELETE, PUT, GET } from '../../../../../../const/method';
import { TYPE } from '../../../../../../const/type';
import { IJobGroup } from '../../../../../../redux/models/job-groups';
import { IAppState } from '../../../../../../redux/store/reducer';

interface IListJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

interface IListJobNamesState {
    list_job_names: Array<IJobName>,
    list_job_groups?: Array<IJobGroup>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal?: boolean;
    name?: string;
    jobGroupID?: number;
    id?: string;
    type?: string;
    jobGroupName?: string;
    list_data: Array<{ label: string, value: number }>
}

class ListJobNames extends PureComponent<IListJobNamesProps, IListJobNamesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_job_names: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            id: undefined,
            name: undefined,
            type: TYPE.EDIT,
            list_job_groups: [],
            jobGroupID: undefined,
            jobGroupName: undefined,
            list_data: []
        }
    }

    async componentDidMount() {
        await this.props.getListJobNames(0, 10);
    }

    static getDerivedStateFromProps(nextProps?: IListJobNamesProps, prevState?: IListJobNamesState) {
        if (nextProps.list_job_names !== prevState.list_job_names) {
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_job_names.forEach((item?: IJobName, index?: any) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    jobGroupName: item && item.jobGroup ? item.jobGroup.name : ''
                });
            });

            return {
                list_job_names: nextProps.list_job_names,
                data_table,
                loading_table: false
            }
        }

        if (nextProps.list_job_groups !== prevState.list_job_groups) {
            let list_data: any = [];
            nextProps.list_job_groups.forEach((item: any) => list_data.push({ value: item.id, label: item.name }));
            return {
                list_job_groups: nextProps.list_job_groups,
                list_data,
            }
        }
        return { loading_table: false };
    }

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        if (type) {
            this.setState({ type })
        }
        this.setState({ openModal: !openModal })
    };

    EditContent: JSX.Element = (
        <div>
            <Icon
                className='test'
                key="delete"
                style={{ padding: 5, margin: 2 }}
                type="delete"
                theme="twoTone"
                twoToneColor="red"
                onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon
                className='test'
                key="edit"
                style={{ padding: 5, margin: 2 }}
                type="edit"
                theme="twoTone"
                onClick={() => this.toggleModal(TYPE.EDIT)} />
        </div>
    );

    columns = [
        {
            title: '#',
            width: 150,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: false,
        },
        {
            title: 'Loại công việc',
            dataIndex: 'name',
            key: 'name',
            width: 500,
            className: 'action',
            fixed: false,
        },
        {
            title: 'Thuộc nhóm công việc',
            dataIndex: 'jobGroupName',
            key: 'jobGroupName',
            width: 500,
            className: 'action',
            fixed: false,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 200,
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
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
        let { list_data } = this.state;
        list_data.forEach(item => {
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
        let { data_table, loading_table, openModal, type, name, jobGroupName, list_data } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment>
                <div>
                    <h5>
                        Danh sách tên công việc
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
                                Thêm loại công việc mới
                            </Link>
                        </Button>
                    </h5>
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
                            <Fragment>
                                <InputTitle
                                    type={TYPE.INPUT}
                                    title="Sửa tên công việc"
                                    widthLabel="120px"
                                    placeholder="Thay đổi tên"
                                    value={name}
                                    widthInput={"250px"}
                                    style={{ padding: "0px 20px" }}
                                    onChange={(event: any) => this.setState({ name: event })}
                                />
                                <InputTitle
                                    type={TYPE.SELECT}
                                    title="Chọn nhóm công việc"
                                    placeholder="Chọn nhóm công việc"
                                    list_value={list_data}
                                    value={jobGroupName}
                                    style={{ padding: "0px 20px" }}
                                    onChange={this.handleChoseJobGroup}
                                />
                            </Fragment>
                        ) : <div>Bạn chắc chắn muốn xóa loại công việc này: {name}</div>}
                    </ModalConfig>
                    <Table
                        // @ts-ignore
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table}
                        scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: totalItems, showSizeChanger: true }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRow={(event: any) => ({ onClick: () => this.choseJobName(event) })}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListJobNames: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES, pageIndex, pageSize
    })
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    list_job_names: state.JobNames.items,
    list_job_groups: state.JobGroups.items,
    totalItems: state.JobNames.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListJobNames)