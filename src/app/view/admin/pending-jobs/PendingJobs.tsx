import React, {  } from 'react'
import './PendingJobs.scss';
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import PendingJobsList from './pending-jobs-list/PendingJobsList';
import PendingJobsCreate from './pending-jobs-create/PendingJobsCreate';
import { routePath } from '../../../../const/break-cumb';
import JobAnnouncementsList from './job-announcements-list/JobAnnouncementsList';
import JobAnnouncementsApply from './job-announcements-apply/JobAnnouncementsApply';
const Switch = require("react-router-dom").Switch;


interface IPendingJobsProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

function PendingJobs(props?: IPendingJobsProps) {
    let { path } = props.match;
    return (
        < >
            <Switch>
                <ErrorBoundaryRoute exact path={`${path}/list`} component={PendingJobsList} />
                <ErrorBoundaryRoute exact path={`${path}/create`} component={PendingJobsCreate} />
                <ErrorBoundaryRoute exact path={`${path + routePath.JOB_ANNOUNCEMENTS + routePath.APPLY}/:id`} component={JobAnnouncementsApply} />
                <ErrorBoundaryRoute exact path={`${path + routePath.JOB_ANNOUNCEMENTS + routePath.LIST}`} component={JobAnnouncementsList} />
            </Switch>
        </>
    )
}

export default PendingJobs;