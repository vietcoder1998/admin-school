import React, { PureComponent,  } from 'react'
import { connect } from 'react-redux';
import { Icon, Button, Select, Divider } from 'antd';
import { REDUX_SAGA } from '../../../../../../../const/actions';
import { IJobName } from '../../../../../../../redux/models/job-type';
import { Link } from 'react-router-dom';
import { InputTitle } from '../../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../../services/exec';
import { MAJORS } from '../../../../../../../services/api/private.api';
import { PUT } from '../../../../../../../const/method';
import { TYPE } from '../../../../../../../const/type';
import { IJobGroup } from '../../../../../../../redux/models/job-groups';

const { Option } = Select;

interface ListMajorJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListMajorJobNames: Function;
    getListJobNames: Function;
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
    list_opntion?: JSX.Element;
    list_major_job_names?: Array<IJobName>
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
            list_data: [],
            list_major_job_names: []
        }
    }

    componentDidMount() {
        this.props.getListMajorJobNames(0, 10, this.props.match.params.id);
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.list_major_job_names && nextProps.list_major_job_names !== prevState.list_major_job_names) {
            let data_table: any = [];
            let list_id: Array<string> = [];
            let list_name: Array<string> = [];
            nextProps.list_major_job_names.forEach((item: any, index: any) => {
                list_id.push(item.id);
                list_name.push(item.name)
            });

            return {
                list_job_names: nextProps.list_job_names,
                data_table,
                loading_table: false,
                list_id,
                list_name,
                list_major_job_names: nextProps.list_major_job_names
            }
        }

        if (nextProps.list_job_names !== prevState.list_job_names) {
            return {
                list_job_names: nextProps.list_job_names,
            }
        }

        if (nextProps.match.params.id !== undefined && nextProps.match.params.id !== prevState.id) {
            nextProps.getListMajorJobNames(0, 10, nextProps.match.params.id);
            nextProps.getListJobNames(0, 0);
            return {
                id: nextProps.match.params.id
            }
        }
        return { loading_table: false };
    }

    list_option = () => {
        let { list_job_names } = this.props;
        return list_job_names.map((item, index) => (<Option key={item.id + index} value={item.name}> {item.name}</Option>))
    }

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        if (type) {
            this.setState({ type })
        }
        this.setState({ openModal: !openModal })
    };

    onChangeData = async (event?: any) => {
        await this.setState({ list_name: event })
        await this.handleChangeListId(event);
    }

    handleChangeListId = async (event: any) => {
        let { list_job_names } = this.props;
        let { list_name } = this.state;
        let list_id = [];
        await list_name.forEach((item: string) => {
            list_job_names.forEach((element: IJobName) => {
                if (element.name === item) {
                    list_id.push(element.id)
                }
            });

        })

        await this.setState({ list_id })
    }

    onSearchJob = (name: string | null) => {
        this.props.getListJobNames(0, 10, name);
    };

    createNewData = async () => {
        let { list_id } = this.state;
        let { id } = this.props.match.params
        await _requestToServer(
            PUT, MAJORS + `/${id}/jobNames`, list_id
        )
        await this.props.getListMajorJobNames(0, 10, id);
    }

    render() {
        let {
            list_name,
        } = this.state;
        return (
            <>
                <div>
                    <h5>
                        {localStorage.getItem("name_major")}
                        <Button
                            onClick={async () => {
                                await this.createNewData();
                                await this.props.history.push('/admin/data/majors/list');
                            }}
                            style={{
                                float: "right",
                                marginLeft: "5px",
                                background: "greenyellow"
                            }}
                        >

                            <Icon type="check" />
                            Lưu
                        </Button>
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to={`/admin/data/job-names/create`}>
                                <Icon type="plus" />
                                Thêm loại công việc mới
                            </Link>
                        </Button>
                    </h5>
                    <Divider
                        orientation="left"
                    >
                        Danh sách các công việc thuộc chuyên ngành
                    </Divider>
                    <InputTitle
                        title="Chọn tên công việc"
                    >
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="Nhập tên công việc"
                            style={{ width: '100%', margin: "10px 0px" }}
                            value={list_name}
                            onSearch={(event: any) => this.onSearchJob(event)}
                            onChange={(event: any) => this.onChangeData(event)}
                        >
                            {this.list_option()}
                        </Select>
                    </InputTitle>

                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListMajorJobNames: (pageIndex: number, pageSize: number, id: string | number) => dispatch({
        type: REDUX_SAGA.MAJOR_JOB_NAMES.GET_MAJOR_JOB_NAMES, pageIndex, pageSize, id
    }),
    getListJobNames: (pageIndex: number, pageSize: number, name: string | null, id: number | string | undefined) => dispatch({
        type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES, pageIndex, pageSize, name, id
    })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_major_job_names: state.MajorJobNames.items,
    list_job_names: state.JobNames.items,
    totalItems: state.MajorJobNames.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListMajorJobNames)