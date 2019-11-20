import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {ANNOU_TYPES} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../common/const/method';
import {REDUX_SAGA} from '../../../../../../common/const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../common/const/type';

interface CreateAnnouTypesState {
    name?: string;
}

interface CreateAnnouTypesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListAnnouTypes: Function;
}

class CreateAnnouTypes extends PureComponent<CreateAnnouTypesProps, CreateAnnouTypesState> {
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
                POST, ANNOU_TYPES,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListAnnouTypes();
                this.props.history.push('/admin/data/annou-types/list');
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
                    <h5>Thêm nhóm bài viết  mới</h5>
                    <Divider orientation="left">Chi tiết nhóm bài viết </Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên nhóm bài viết  mới"
                    placeholder="Nhập tên nhóm bài viết "
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
                    Tạo nhóm bài viết  mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/annou-types/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>
                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListAnnouTypes: () => dispatch({type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES})
});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnnouTypes)