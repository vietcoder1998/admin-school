import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon } from 'antd';
import { InputTitle } from './../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { TYPE_SCHOOLS } from '../../../../../../services/api/private.api';
import { POST } from '../../../../../../common/const/method';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { authHeaders } from '../../../../../../services/auth';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { Link } from 'react-router-dom';
import { TYPE } from '../../../../../../common/const/type';

interface CreateTypeSchoolsState {
    name?: string;
}

interface CreateTypeSchoolsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListTypeSchools: Function;
}

class CreateTypeSchools extends PureComponent<CreateTypeSchoolsProps, CreateTypeSchoolsState> {
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
            TYPE_SCHOOLS,
            ADMIN_HOST,
            authHeaders,
            null,
            true,
        ).then(res => {
            if (res.code === 200) {
                this.props.getListTypeSchools();
                this.props.history.push('/admin/data/type-schools/list');
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
                    <h5>Thêm loại trường mới</h5>
                    <Divider orientation="left" >Chi tiết loại trường</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên loại trường mới"
                    placeholder="Nhập tên loại trường"
                    value={name}
                    style={{ padding: "10px 30px" }}
                    widthInput="350px"
                    onChange={event => this.setState({ name: event })}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{ float: "right", margin: "10px 5px" }}
                    onClick={this.createNewData}
                    disabled={!is_name}
                >
                    Tạo loại trường mới
                </Button>
                <Button
                    type="danger"
                    style={{ float: "right", margin: "10px 5px" }}
                >
                    <Link to='/admin/data/languages/list'>
                        <Icon type="close" />
                        Hủy
                    </Link>

                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListTypeSchools: () => dispatch({ type: REDUX_SAGA.TYPE_SCHOOLS.GET_TYPE_SCHOOLS })
})

const mapStateToProps = (state, ownProps) => ({
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateTypeSchools)