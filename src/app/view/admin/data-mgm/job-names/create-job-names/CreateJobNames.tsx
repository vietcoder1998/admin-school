import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon } from 'antd';
import { InputTitle } from './../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { JOB_NAMES } from '../../../../../../services/api/private.api';
import { POST } from '../../../../../../common/const/method';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { authHeaders } from '../../../../../../services/auth';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { Link } from 'react-router-dom';
import { TYPE } from '../../../../../../common/const/type';
import { IJobGroup } from '../../../../../../redux/models/job-groups';

interface CreateJobNamesState {
    name?: string;
    list_job_groups?: Array<IJobGroup>;
    jobGroupName?: string;
    jobGroupID?: number;
    list_data?: Array<{ label: string, value: number }>
}

interface CreateJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListJobNames: Function;
}

class CreateJobNames extends PureComponent<CreateJobNamesProps, CreateJobNamesState> {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            jobGroupID: null,
            list_job_groups: [],
            jobGroupName: null,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_job_groups !== prevState.list_job_groups) {
            let list_data = []
            nextProps.list_job_groups.forEach(item => list_data.push({ value: item.id, label: item.name }))
            return {
                list_job_groups: nextProps.list_job_groups,
                list_data,
            }
        }

        return null;
    }

    createNewData = async () => {
        let { name, jobGroupID } = this.state;
        await _requestToServer(
            POST,
            { name: name.trim(), jobGroupID },
            JOB_NAMES,
            ADMIN_HOST,
            authHeaders,
            null,
            true,
        ).then(res => {
            if (res.code === 200) {
                this.props.getListJobNames();
                this.props.history.push('/admin/data/job-names/list');
            }
        })
    }

    onChange = (event) => {
        this.setState({ name: event })
    }

    handleChoseJobGroup = (id) => {
        let {list_data} = this.state;
        list_data.forEach(item=>{
            if (item.value===id) {
                this.setState({jobGroupName:item.label})
            }
        });
        this.setState({jobGroupID:id})
    }

    render() {
        let { name, list_data, jobGroupID, jobGroupName } = this.state;
        let is_exactly = name.trim()!=="" && jobGroupID ? true : false
        return (
            <Fragment >
                <div>
                    <h5>Thêm công việc mới</h5>
                    <Divider orientation="left" >Chi tiết công việc</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên công việc mới"
                    placeholder="Nhập tên công việc"
                    value={name}
                    widthInput="400px"
                    style={{ padding: "10px 30px" }}
                    onChange={event => this.setState({ name: event })}
                />
                <InputTitle
                    type={TYPE.SELECT}
                    title="Chọn nhóm công việc"
                    placeholder="Chọn nhóm công việc"
                    value={jobGroupName}
                    list_value={list_data}
                    style={{ padding: "10px 30px" }}
                    onChange={this.handleChoseJobGroup}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{ float: "right", margin: "10px 5px" }}
                    onClick={this.createNewData}
                    disabled={!is_exactly}
                >
                    Tạo công việc mới
                </Button>
                <Button
                    type="danger"
                    style={{ float: "right", margin: "10px 5px" }}
                >
                    <Link to='/admin/data/job-names/list'>
                        <Icon type="close" />
                        Hủy
                    </Link>

                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListJobNames: () => dispatch({ type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES })
})

const mapStateToProps = (state, ownProps) => ({
    list_job_groups: state.JobGroups.items,
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateJobNames)