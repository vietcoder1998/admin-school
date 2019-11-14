import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon } from 'antd';
import { InputTitle } from './../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { REGIONS } from '../../../../../../services/api/private.api';
import { POST } from '../../../../../../common/const/method';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { authHeaders } from '../../../../../../services/auth';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { Link } from 'react-router-dom';
import { TYPE } from '../../../../../../common/const/type';

interface CreateRegionsState {
    name?: string;
}

interface CreateRegionsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListRegions: Function;
}

class CreateRegions extends PureComponent<CreateRegionsProps, CreateRegionsState> {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }
    }

    createNewData = async () => {
        let { name } = this.state;
        await _requestToServer(
            POST,
            { name: name.trim() },
            REGIONS,
            ADMIN_HOST,
            authHeaders,
            null,
            true,
        ).then(res => {
            if (res.code === 200) {
                this.props.getListRegions();
                this.props.history.push('/admin/data/regions/list');
            }
        })
    }

    onChange = (event) => {
        this.setState({ name: event })
    }

    render() {
        let { name } = this.state;
        let is_name = name.trim() !== "" ? true : false
        return (
            <Fragment >
                <div>
                    <h5>Thêm tỉnh thành mới</h5>
                    <Divider orientation="left" >Chi tiết tỉnh thành</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên tỉnh thành mới"
                    placeholder="Nhập tên tỉnh thành"
                    widthInput="400px"
                    value={name}
                    style={{ padding: "10px 30px" }}
                    onChange={event => this.setState({ name: event })}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{ float: "right", margin: "10px 5px" }}
                    onClick={this.createNewData}
                    disabled={!is_name}
                >
                    Tạo tỉnh thành mới
                </Button>
                <Button
                    type="danger"
                    style={{ float: "right", margin: "10px 5px" }}
                >
                    <Link to='/admin/data/regions/list'>
                        <Icon type="close" />
                        Hủy
                    </Link>

                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListRegions: () => dispatch({ type: REDUX_SAGA.REGIONS.GET_REGIONS })
})

const mapStateToProps = (state, ownProps) => ({
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateRegions)