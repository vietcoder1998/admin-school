import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CreateJobNames from './create-job-names/CreateJobNames';
import ListJobNames from './list-job-names/ListJobNames';

const Switch = require("react-router-dom").Switch;

interface JobNamesState {
    show_menu: boolean;
    to_logout: boolean;
}

interface JobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getJobNames: Function;
    getTypeManagement: Function;
}

class JobNames extends PureComponent<JobNamesProps, JobNamesState> {
    constructor(props) {
        super(props);
        this.state = {
            show_menu: true,
            to_logout: false,
        }
    }

    render() {
        let {path} = this.props.match;
        return (
            <Fragment >
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateJobNames} />
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListJobNames} />
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

export default connect(mapStateToProps, mapDispatchToProps)(JobNames)