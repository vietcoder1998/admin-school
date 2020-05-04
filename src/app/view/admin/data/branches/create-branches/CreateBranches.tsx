import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {BRANCHES} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../const/method';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../const/type';

interface CreateBranchesState {
    name?: string;
}

interface CreateBranchesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListBranches: Function;
}

class CreateBranches extends PureComponent<CreateBranchesProps, CreateBranchesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: undefined
        }
    }

    createNewData = async () => {
        let {name} = this.state;
        if (name) {
            await _requestToServer(
                POST, BRANCHES,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListBranches();
                this.props.history.push('/admin/data/branches/list');
            })
        }
    };

    onChange = (event: any) => {
        this.setState({name: event})
    }

    render() {
        let {name} = this.state;
        return (
            <>
                <div>
                    <h5>Thêm nhóm ngành mới</h5>
                    <Divider orientation="left">Chi tiết nhóm ngành</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên nhóm ngành mới"
                    placeholder="ex: Xây dựng, Cầu đường"
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
                    Tạo nhóm ngành mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/branches/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>
                </Button>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListBranches: () => dispatch({type: REDUX_SAGA.BRANCHES.GET_BRANCHES})
});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateBranches)