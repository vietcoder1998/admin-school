import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {TYPE_SCHOOLS} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../const/method';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../const/type';

interface CreateTypeSchoolsState {
    name?: string;
}

interface CreateTypeSchoolsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListTypeSchools: Function;
}

class CreateTypeSchools extends PureComponent<CreateTypeSchoolsProps, CreateTypeSchoolsState> {
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
                POST, TYPE_SCHOOLS,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListTypeSchools();
                this.props.history.push('/admin/data/type-schools/list');
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
                    <h5>Thêm loại trường mới</h5>
                    <Divider orientation="left">Chi tiết loại trường</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên loại trường mới"
                    placeholder="Nhập tên loại trường"
                    value={name}
                    style={{padding: "10px 30px"}}
                    widthInput="350px"
                    onChange={(event: any) => this.setState({name: event})}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{float: "right", margin: "10px 5px"}}
                    onClick={this.createNewData}
                    disabled={name ? false : true}
                >
                    Tạo mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/type-schools/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>

                </Button>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListTypeSchools: () => dispatch({type: REDUX_SAGA.TYPE_SCHOOLS.GET_TYPE_SCHOOLS})
});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateTypeSchools)