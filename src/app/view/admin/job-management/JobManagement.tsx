import React, { PureComponent, Fragment } from 'react'
import './JobManagement.scss';
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import MngList from './mng-list/MngList';
import MngCreate from './mng-create/MngCreate';
const Switch = require("react-router-dom").Switch;

interface JobManagementState {
    show_menu: boolean;
    to_logout: boolean;
}

interface JobManagementProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getJobNames: Function;
    getTypeManagement: Function;
}

class JobManagement extends PureComponent<JobManagementProps, JobManagementState> {
    constructor(props) {
        super(props);
        this.state = {
            show_menu: true,
            to_logout: false,
        }
    }

    render() {
        let { path } = this.props.match;
        return (
            <Fragment >
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={MngList} />
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={MngCreate} />
                </Switch>
            </Fragment>
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