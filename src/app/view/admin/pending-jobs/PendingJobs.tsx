import React, { PureComponent, Fragment } from 'react'
import './PendingJobs.scss';
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import PendingJobsList from './pendin-jobs-list/PendingJobsList';
const Switch = require("react-router-dom").Switch;


interface IPendingJobsProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

function PendingJobs(props?: IPendingJobsProps) {
    let { path } = props.match;
    return (
        <Fragment >
            <Switch>
                <ErrorBoundaryRoute exact path={`${path}/list`} component={PendingJobsList} />
                {/* <ErrorBoundaryRoute exact path={`${path}/create`} component={} /> */}
                {/* <ErrorBoundaryRoute exact path={`${path}/fix/:id`} component={PendingJobsCreate} /> */}
            </Switch>
        </Fragment>
    )
}

export default PendingJobs;