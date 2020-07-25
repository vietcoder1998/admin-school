import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../services/exec';
import {WORKING_TOOLS} from '../../../../../services/api/private.api';
import {POST} from '../../../../../const/method';
import {REDUX_SAGA} from '../../../../../const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../const/type';
import {IJobGroup} from '../../../../../models/job-groups';
import { routePath, routeLink } from '../../../../../const/break-cumb';

interface IState {
    name?: string;
    listJobGroups?: Array<IJobGroup>;
    jobGroupName?: string;
    jobGroupID?: number;
    listData?: Array<{ label: string, value: number }>
}

interface IProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListWorkingTools: Function;
}

class CreateWorkingTools extends PureComponent<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: undefined,
            jobGroupID: 0,
            jobGroupName: undefined,
        }
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.listJobGroups !== prevState.listJobGroups) {
        }
        return { loadingTable: false };
    }

    createNewData = async () => {
        let {name} = this.state;
        if (name) {
            await _requestToServer(
                POST, WORKING_TOOLS,
                {
                    name: name.trim(),
                }
            ).then(res => {
                this.props.getListWorkingTools();
                this.props.history.push(routeLink.WORKING_TOOL + routePath.LIST);
            })
        }
    };

    onChange = (event: any) => {
        this.setState({name: event})
    };

    render() {
        let {name} = this.state;
        return (
            <>
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
                <Button
                    type="primary"
                    icon="plus"
                    style={{float: "right", margin: "10px 5px"}}
                    onClick={this.createNewData}
                    disabled={!name}
                >
                    Tạo  mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to={routePath.WORKING_TOOL + routePath.CREATE}>
                        <Icon type="close"/>
                        Hủy
                    </Link>
                </Button>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListWorkingTools: () => dispatch({type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES})
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    listJobGroups: state.JobGroups.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateWorkingTools)