import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {MAJORS} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../const/method';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../const/type';
import {IMajor} from '../../../../../../models/majors';

interface CreateMajorsState {
    name?: string;
    listBranches?: Array<IMajor>;
    branchName?: string;
    branchID?: number;
    listData?: Array<{ label: string, value: number }>
}

interface CreateMajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListMajors: Function;
}

class CreateMajors extends PureComponent<CreateMajorsProps, CreateMajorsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            branchID: 0,
            listBranches: [],
            branchName: undefined,
        }
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.listBranches !== prevState.listBranches) {
            let listData: any = [];
            nextProps.listBranches.forEach((item: any) => listData.push({value: item.id, label: item.name}));
            return {
                listBranches: nextProps.listBranches,
                listData,
            }
        }

        return { loadingTable: false };
    }

    createNewData = async () => {
        let {name, branchID} = this.state;
        if (name) {
            await _requestToServer(
                POST, MAJORS,
                {
                    name: name.trim(),
                    branchID
                }
            ).then(res => {
                this.props.getListMajors();
                this.props.history.push('/admin/data/majors/list');
            })
        }
    };

    onChange = (event: any) => {
        this.setState({name: event})
    };

    handleChoseMajor = (id: number) => {
        let {listData} = this.state;
        if (listData) {
            listData.forEach(item => {
                if (item.value === id) {
                    this.setState({branchName: item.label});
                }
            });
            this.setState({branchID: id});
        }
    };


    render() {
        let {name, listData, branchID, branchName} = this.state;
        return (
            <>
                <div>
                    <h5>Thêm chuyên ngành mới</h5>
                    <Divider orientation="left">Chi tiết chuyên ngành</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên chuyên ngành mới"
                    placeholder="Nhập tên chuyên ngành"
                    value={name}
                    widthInput="300px"
                    style={{padding: "10px 0px"}}
                    onChange={(event: any) => this.setState({name: event})}
                />
                <InputTitle
                    type={TYPE.SELECT}
                    title="Chọn nhóm ngành"
                    placeholder="Chọn nhóm ngành"
                    value={branchName}
                    listValue={listData}
                    style={{padding: "10px 0px"}}
                    onChange={this.handleChoseMajor}
                    onSearch={(event) =>this.props.getListMajors(0, 10, event)}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{float: "right", margin: "10px 5px"}}
                    onClick={this.createNewData}
                    disabled={!name ||  !branchID}
                >
                    Tạo mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/majors/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>

                </Button>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListMajors: (pageIndex?: number, pageSize?: number, name?: string) => dispatch({type: REDUX_SAGA.MAJORS.GET_MAJORS, pageIndex , pageSize , name})
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    listBranches: state.Branches.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateMajors)