import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
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
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class JobNames extends PureComponent<JobNamesProps, JobNamesState> {

    render() {
        let {path} = this.props.match;
        return (
            <>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateJobNames}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListJobNames}/>
                </Switch>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobNames)