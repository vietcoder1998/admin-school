import React, { } from 'react'
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import PendingJobsList from './pending-jobs-list/PendingJobsList';
import PendingJobsCreate from './pending-jobs-create/PendingJobsCreate';
import { routePath } from '../../../../const/break-cumb';
import JobAnnouncementsList from './job-announcements-list/JobAnnouncementsList';
import JobAnnouncementsApply from './job-announcements-apply/JobAnnouncementsApply';
const Switch = require("react-router-dom").Switch;


interface IProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

function Jobs(props?: IProps) {
    let { path } = props.match;
    return (
        < >
            <Switch>
                <ErrorBoundaryRoute exact path={`${path + routePath.PENDING_JOBS}/list`} component={PendingJobsList} />
                <ErrorBoundaryRoute exact path={`${path + routePath.PENDING_JOBS}/create`} component={PendingJobsCreate} />
                <ErrorBoundaryRoute exact path={`${path + routePath.PENDING_JOBS}/fix/:id`} component={PendingJobsCreate} />
                <ErrorBoundaryRoute exact path={`${path + routePath.PENDING_JOBS}/copy/:id`} component={PendingJobsCreate} />
                <ErrorBoundaryRoute exact path={`${path + routePath.JOB_ANNOUNCEMENTS + routePath.APPLY}/:id`} component={JobAnnouncementsApply} />
                <ErrorBoundaryRoute exact path={`${path + routePath.JOB_ANNOUNCEMENTS + routePath.LIST}`} component={JobAnnouncementsList} />
            </Switch>
        </>
    )
}

export default Jobs;