import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
// import { REDUX_SAGA } from '../../../../common/const/actions';
// import { Button, Table, Icon, Select, Row, Col } from 'antd';
// import { timeConverter } from '../../../../common/utils/convertTime';
import './JobManagement.scss';

// let { Option } = Select;

interface AdminProps extends StateProps, DispatchProps {
}

interface AdminState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    employerID?: string;
    jobType?: string;
    jobNameID?: string;
}


class JobManagement extends PureComponent<AdminProps, AdminState> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    searchJob = () => {
    }

    onChangeState = (event) => {
        this.setState({ state: event })
    }

    onChangeJobName = (event) => {
        this.setState({ jobType: event })
    }

    onChangeEmployer = (event) => {
        this.setState({ employerID: event })
    }

    onChangeJobName = (event) => {
        this.setState({ jobNameID: event })
    }


    render() {
        return (
            <div>
                Quản lí bài đăng
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

const mapStateToProps = (state, ownProps) => ({
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobManagement)