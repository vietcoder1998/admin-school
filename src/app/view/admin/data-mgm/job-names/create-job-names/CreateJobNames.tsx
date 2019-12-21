import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {JOB_NAMES} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../common/const/method';
import {REDUX_SAGA} from '../../../../../../common/const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../common/const/type';
import {IJobGroup} from '../../../../../../redux/models/job-groups';

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
    constructor(props: any) {
        super(props);
        this.state = {
            name: undefined,
            jobGroupID: 0,
            jobGroupName: undefined,
            list_job_groups: []
        }
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_job_groups !== prevState.list_job_groups) {
            let list_data: any = [];
            nextProps.list_job_groups.forEach((item: any) => list_data.push({value: item.id, label: item.name}));
            return {
                list_job_groups: nextProps.list_job_groups,
                list_data,
            }
        }
        return null;
    }

    createNewData = async () => {
        let {name, jobGroupID} = this.state;
        if (name) {
            await _requestToServer(
                POST, JOB_NAMES,
                {
                    name: name.trim(),
                    jobGroupID
                }
            ).then(res => {
                this.props.getListJobNames();
                this.props.history.push('/admin/data/job-names/list');
            })
        }
    };

    onChange = (event: any) => {
        this.setState({name: event})
    };

    handleChoseJobGroup = (id: number) => {
        let {list_data} = this.state;
        if (list_data) {
            list_data.forEach(item => {
                if (item.value === id) {
                    this.setState({jobGroupName: item.label})
                }
            });
            this.setState({jobGroupID: id});
        }
    };

    render() {
        let {name, list_data, jobGroupName} = this.state;
        return (
            <Fragment>
                <div>
                    <h5>Thêm công việc mới</h5>
                    <Divider orientation="left">Chi tiết công việc</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên công việc mới"
                    placeholder="Nhập tên công việc"
                    value={name}
                    widthInput="400px"
                    style={{padding: "10px 30px"}}
                    onChange={(event: any) => this.setState({name: event})}
                />
                <InputTitle
                    type={TYPE.SELECT}
                    title="Chọn nhóm công việc"
                    placeholder="Chọn nhóm công việc"
                    value={jobGroupName}
                    list_value={list_data}
                    style={{padding: "10px 30px"}}
                    onChange={this.handleChoseJobGroup}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{float: "right", margin: "10px 5px"}}
                    onClick={this.createNewData}
                    disabled={!name || !jobGroupName}
                >
                    Tạo công việc mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/job-names/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>

                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListJobNames: () => dispatch({type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES})
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_job_groups: state.JobGroups.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateJobNames)