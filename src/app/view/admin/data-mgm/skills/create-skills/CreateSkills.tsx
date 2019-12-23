import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {SKILLS} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../const/method';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../const/type';

interface CreateSkillsState {
    name?: string;
}

interface CreateSkillsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListSkills: Function;
}

class CreateSkills extends PureComponent<CreateSkillsProps, CreateSkillsState> {
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
                POST, SKILLS,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                if (res.code === 200) {
                    this.props.getListSkills();
                    this.props.history.push('/admin/data/skills/list');
                }
            })
        }
    };

    onChange = (event: any) => {
        this.setState({name: event})
    };

    render() {
        let {name} = this.state;
        return (
            <Fragment>
                <div>
                    <h5>Thêm kỹ năng mới</h5>
                    <Divider orientation="left">Chi tiết kỹ năng</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên kỹ năng mới"
                    placeholder="Nhập tên kỹ năng"
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
                    disabled={name? true : false}
                >
                    Tạo kỹ năng mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/skills/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>

                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListSkills: () => dispatch({type: REDUX_SAGA.SKILLS.GET_SKILLS})
});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateSkills)