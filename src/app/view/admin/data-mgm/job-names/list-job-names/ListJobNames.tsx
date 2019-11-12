import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { IJobName } from '../../../../../../redux/models/job-type';
import { Link } from 'react-router-dom';
import { ConfigModal } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from './../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { JOB_NAMES } from '../../../../../../services/api/private.api';
import { DELETE, PUT, GET } from '../../../../../../common/const/method';
import { TYPE } from '../../../../../../common/const/type';
import { IJobGroup } from '../../../../../../redux/models/job-groups';
import { ADMIN_HOST } from '../../../../../../environment/dev';

interface ListJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

interface ListJobNamesState {
    list_job_names: Array<IJobName>,
    list_job_groups?: Array<IJobGroup>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    openModal?: boolean;
    name?: string;
    jobGroupID?: number;
    id?: string;
    type?: string;
    jobGroupName?: string;
    list_data: Array<{ label: string, value: number }>
}

class ListJobNames extends PureComponent<ListJobNamesProps, ListJobNamesState> {
    constructor(props) {
        super(props);
        this.state = {
            list_job_names: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            openModal: false,
            name: "",
            jobGroupID: null,
            id: "",
            type: TYPE.EDIT,
            list_job_groups: [],
            jobGroupName: null,
            list_data: []
        }
    }

    async componentDidMount() {
        await this.props.getListJobNames(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_job_names !== prevState.list_job_names) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_job_names.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                    jobGroupName: item.jobGroup.name
                });
            })

            return {
                list_job_names: nextProps.list_job_names,
                data_table,
                loading_table: false
            }
        };

        if (nextProps.list_job_groups !== prevState.list_job_groups) {
            let list_data = []
            nextProps.list_job_groups.forEach(item => list_data.push({ value: item.id, label: item.name }))
            return {
                list_job_groups: nextProps.list_job_groups,
                list_data,
            }
        };
        return null;
    }

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        if (type) {
            this.setState({ type })
        }
        this.setState({ openModal: !openModal })
    }

    EditContent: JSX.Element = (
        <div>
            <Icon key="delete" style={{ padding: "5px 10px" }} type="delete" onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" onClick={() => this.toggleModal(TYPE.EDIT)} />
        </div>
    )

    columns = [
        {
            title: '#',
            width: 150,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Loại công việc',
            dataIndex: 'name',
            key: 'name',
            width: 500,
            className: 'action',

        },
        {
            title: 'Thuộc nhóm công việc',
            dataIndex: 'jobGroupName',
            key: 'jobGroupName',
            width: 500,
            className: 'action',

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

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true });
        await this.props.getListJobNames(event.current - 1);
    };

    choseJob = event => {
        this.setState({ id: event.key, name: event.name, jobGroupName: event.jobGroupName });
        this.getJobDetail(event.key);
    }

    getJobDetail = async  id => {
        await _requestToServer(
            GET,
            null,
            JOB_NAMES + `/${id}`,
            ADMIN_HOST,
            null,
            null,
        ).then(res => {
            if (res && res.code === 200) {
                this.setState({jobGroupID: res.data.jobGroup.id})
            }
        })
    }

    handleChoseJobGroup = (id) => {
        let { list_data } = this.state;
        list_data.forEach(item => {
            if (item.value === id) {
                this.setState({ jobGroupName: item.label })
            }
        });
        this.setState({ jobGroupID: id })
    }

    editjobNames = async () => {
        let { name, id, jobGroupID } = this.state;
        name = name.trim();
        await _requestToServer(
            PUT,
            { name, jobGroupID },
            JOB_NAMES + `/${id}`,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListJobNames(0);
                this.toggleModal();
            }
        })
    }

    removejobNames = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE,
            [id],
            JOB_NAMES,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListJobNames(0);
                this.toggleModal();
            }
        })
    }

    render() {
        let { data_table, loading_table, openModal, type, name, jobGroupName, list_data } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <div>
                    <h5>
                        Danh sách tên công việc
                        <Button
                            onClick={() => { }}
                            type="primary"
                            size="default"
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
                    <ConfigModal
                        namebtn1={"Hủy"}
                        namebtn2={"Hoàn thành"}
                        title="Thay đổi công việc"
                        isOpen={openModal}
                        handleOk={() => type === TYPE.EDIT ? this.editjobNames() : this.removejobNames()}
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
                                    onChange={event => this.setState({ name: event })}
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

                    </ConfigModal>
                    <Table
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table} scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: totalItems }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRowClick={this.choseJob}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListJobNames: (pageIndex, pageSize) => dispatch({
        type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES, pageIndex, pageSize
    })
})

const mapStateToProps = (state, ownProps) => ({
    list_job_names: state.JobNames.items,
    list_job_groups: state.JobGroups.items,
    totalItems: state.JobNames.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListJobNames)