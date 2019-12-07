import React, { Fragment } from 'react'
import './PendingJobs.scss';
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import PendingJobsList from './pending-jobs-list/PendingJobsList';
import PendingJobsCreate from './pending-jobs-create/PendingJobsCreate';
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
                <ErrorBoundaryRoute exact path={`${path}/create`} component={PendingJobsCreate} />
            </Switch>
        </Fragment>
    )
}

export default PendingJobs;