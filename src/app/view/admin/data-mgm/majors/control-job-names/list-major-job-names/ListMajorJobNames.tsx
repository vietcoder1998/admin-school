import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Select } from 'antd';
import { REDUX_SAGA } from '../../../../../../../common/const/actions';
import { IJobName } from '../../../../../../../redux/models/job-type';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../../services/exec';
import { MAJORS } from '../../../../../../../services/api/private.api';
import { DELETE, PUT, GET } from '../../../../../../../common/const/method';
import { TYPE } from '../../../../../../../common/const/type';
import { IJobGroup } from '../../../../../../../redux/models/job-groups';
import { IptLetter } from '../../../../../layout/common/Common';

const { Option } = Select;

interface ListMajorJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListMajorJobNames: Function;
}

interface ListMajorJobNamesState {
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
    list_id?: Array<string>
    list_name?: any;
    list_data?: Array<{ label?: string, value?: any }>
}

class ListMajorJobNames extends PureComponent<ListMajorJobNamesProps, ListMajorJobNamesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_job_names: [],
            loading_table: false,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            id: null,
            name: undefined,
            type: TYPE.EDIT,
            list_job_groups: [],
            jobGroupID: undefined,
            jobGroupName: undefined,
            list_id: [],
            list_name: [],
            list_data: []
        }
    }

    componentDidMount() {
        this.props.getListMajorJobNames(0, 10, this.props.match.params.id);
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_major_job_names && nextProps.list_major_job_names !== prevState.list_major_job_names) {
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_major_job_names.forEach((item: any, index: any) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    jobGroupName: item.jobGroup.name
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

        if (nextProps.list_job_names !== prevState.list_job_names) {
            return {
                list_job_names: nextProps.list_job_names,
            }
        }


        if (nextProps.match.params.id !== undefined && nextProps.match.params.id !== prevState.id) {
            nextProps.getListMajorJobNames(0, 10, nextProps.match.params.id);
            nextProps.getListMajor(0, 0);
            return {
                id: nextProps.match.params.id
            }
        }
        return null;
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
            <Icon key="delete" style={{ padding: "5px 10px" }} type="delete" theme="twoTone" twoToneColor="red"
                onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" theme="twoTone"
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

    onChangeData = (event?: any) => {
       this.setState({list_id: event})
    }

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.props.getListMajorJobNames(event.current - 1, event.pageSize);
    };

    choseJobName = (event: any) => {
        this.setState({ id: event.key, name: event.name, jobGroupName: event.jobGroupName });
        this.getJobNameDetail(event.key);
    };

    getJobNameDetail = async (id: number) => {
        await _requestToServer(
            GET, MAJORS + `/${id}/jobNames`,
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

    handleChoseJobId = (event?: any) => {
        let { list_id } = this.state;
        list_id.forEach((item, index) => {
            if (item === event) {
                list_id.push(event);
            }
        })
        this.setState({ list_id });
    }

    editMajorJobNames = async () => {
        let { name, id, jobGroupID } = this.state;
        if (name) {
            await _requestToServer(
                PUT, MAJORS + `/${id}/jobNames`,
                {
                    name: name.trim(),
                    jobGroupID
                }
            ).then((res: any) => {
                this.props.getListMajorJobNames(0);
                this.toggleModal();
            })
        }
    };

    removeMajorJobNames = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, MAJORS + `/${id}/jobNames`,
            [id]
        ).then((res: any) => {
            this.props.getListMajorJobNames(0);
            this.toggleModal();
        })
    };

    createNewData = async () => {
        let {list_id} = this.state;
        let {id} = this.props.match.params
        await _requestToServer(
            PUT, MAJORS + `/${id}/jobNames`, list_id
        )
        await this.props.getListMajorJobNames(0, 10, id);
        await this.setState({list_id: []});
    }

    render() {
        let { data_table, loading_table, openModal, type, name, jobGroupName, list_data, id, list_job_names, list_name, list_id } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment>
                <ModalConfig
                    namebtn1={"Hủy"}
                    namebtn2={"Hoàn thành"}
                    title="Thay đổi công việc"
                    isOpen={openModal}
                    handleOk={() => type === TYPE.EDIT ? this.editMajorJobNames() : this.removeMajorJobNames()}
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
                <div>
                    <h5>
                        {localStorage.getItem("name_major")}
                        <Button
                            onClick={() => {
                                this.createNewData()
                            }}
                            type="danger"
                            style={{
                                float: "right",
                                marginLeft: "5px"
                            }}
                        >

                            <Icon type="check" />
                            Xác nhận
                        </Button>
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to={`/admin/data/major/${id}/job-names/create`}>
                                <Icon type="plus" />
                                Thêm loại công việc mới
                            </Link>
                        </Button>
                    </h5>
                    <p style={{ margin: "none!important" }}>
                        <IptLetter value="Chọn tên công việc" />
                    </p>
                    <Select
                        mode="multiple"
                        placeholder="Nhập tên công việc"
                        style={{ width: '400px', margin: "10px 0px" }}
                        onChange={(event: string) => this.onChangeData(event)}
                    >
                        {
                            list_job_names.map((item, index) => (<Option key={item.id} value={item.id}> {item.name}</Option>))
                        }
                    </Select>
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

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListMajorJobNames: (pageIndex: number, pageSize: number, id: string | number) => dispatch({
        type: REDUX_SAGA.MAJOR_JOB_NAMES.GET_MAJOR_JOB_NAMES, pageIndex, pageSize, id
    }),
    getListJobNames: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES, pageIndex, pageSize
    })
});

const mapStateToProps = (state: any, ownProps: any) => ({
    list_major_job_names: state.MajorJobNames.items,
    list_job_groups: state.JobGroups.items,
    list_job_names: state.JobNames.items,
    totalItems: state.MajorJobNames.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListMajorJobNames)