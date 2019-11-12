import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon } from 'antd';
import { InputTitle } from './../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { MAJORS } from '../../../../../../services/api/private.api';
import { POST } from '../../../../../../common/const/method';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { authHeaders } from '../../../../../../services/auth';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { Link } from 'react-router-dom';
import { TYPE } from '../../../../../../common/const/type';
import { IMajor } from '../../../../../../redux/models/majors';

interface CreateMajorsState {
    name?: string;
    list_branches?: Array<IMajor>;
    branchName?: string;
    branchID?: number;
    list_data?: Array<{ label: string, value: number }>
}

interface CreateMajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListMajors: Function;
}

class CreateMajors extends PureComponent<CreateMajorsProps, CreateMajorsState> {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            branchID: 0,
            list_branches: [],
            branchName: null,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_branches !== prevState.list_branches) {
            let list_data = []
            nextProps.list_branches.forEach(item => list_data.push({ value: item.id, label: item.name }))
            return {
                list_branches: nextProps.list_branches,
                list_data,
            }
        }

        return null;
    }

    createNewData = async () => {
        let { name, branchID } = this.state;
        await _requestToServer(
            POST,
            { name: name.trim(), branchID },
            MAJORS,
            ADMIN_HOST,
            authHeaders,
            null,
            true,
        ).then(res => {
            if (res.code === 200) {
                this.props.getListMajors();
                this.props.history.push('/admin/data/majors/list');
            }
        })
    }

    onChange = (event) => {
        this.setState({ name: event })
    }

    handleChoseMajor = (id) => {
        let { list_data } = this.state;
        list_data.forEach(item => {
            if (item.value === id) {
                this.setState({ branchName: item.label });
            }
        });
        this.setState({ branchID: id });
    }


    render() {
        let { name, list_data, branchID, branchName } = this.state;
        let is_exactly = name.trim() !== "" && branchID ? true : false
        return (
            <Fragment >
                <div>
                    <h5>Thêm nhóm ngành mới</h5>
                    <Divider orientation="left" >Chi tiết nhóm ngành</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên nhóm ngành mới"
                    placeholder="Nhập tên nhóm ngành"
                    value={name}
                    widthInput="300px"
                    style={{ padding: "0px 20px" }}
                    onChange={event => this.setState({ name: event })}
                />
                <InputTitle
                    type={TYPE.SELECT}
                    title="Chọn nhóm ngành"
                    placeholder="Chọn nhóm ngành"
                    value={branchName}
                    list_value={list_data}
                    style={{ padding: "0px 20px" }}
                    onChange={this.handleChoseMajor}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{ float: "right", margin: "10px 5px" }}
                    onClick={this.createNewData}
                    disabled={!is_exactly}
                >
                    Tạo nhóm ngành mới
                </Button>
                <Button
                    type="danger"
                    style={{ float: "right", margin: "10px 5px" }}
                >
                    <Link to='/admin/data/majors/list'>
                        <Icon type="close" />
                        Hủy
                    </Link>

                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListMajors: () => dispatch({ type: REDUX_SAGA.MAJORS.GET_MAJORS })
})

const mapStateToProps = (state, ownProps) => ({
    list_branches: state.Branches.items,
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateMajors)