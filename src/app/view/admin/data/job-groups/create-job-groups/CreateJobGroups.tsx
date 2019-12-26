import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {JOB_GROUPS} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../const/method';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../const/type';

interface CreateRegionsState {
    name?: string;
}

interface CreateRegionsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListRegions: Function;
}

class CreateRegions extends PureComponent<CreateRegionsProps, CreateRegionsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: ""
        }
    }

    createNewData = async () => {
        let {name} = this.state;
        if (name) {
            await _requestToServer(
                POST, JOB_GROUPS,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListRegions();
                this.props.history.push('/admin/data/job-groups/list');
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
                    <h5>Thêm nhóm công việc mới</h5>
                    <Divider orientation="left">Chi tiết nhóm công việc</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên nhóm công việc mới"
                    placeholder="Nhập tên nhóm công việc"
                    widthInput="400px"
                    value={name}
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
                    Tạo nhóm công việc mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/job-groups/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>

                </Button>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListRegions: () => dispatch({type: REDUX_SAGA.JOB_GROUPS.GET_JOB_GROUPS})
});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateRegions)