import React from 'react';
import ListMajors from '../app/view/admin/data/majors/list-majors/ListMajors';
import EventSchoolList from '../app/view/admin/event/event-school-list/EventSchoolList';
import AnnouncementList from '../app/view/admin/announcement/announcement-list/AnnouncementList';
import ListAdminAccounts from '../app/view/admin/roles-admin/admin-accounts/list-admin-accounts/ListAdminAccounts';
import ListRoles from '../app/view/admin/roles-admin/roles/list-roles/ListRoles';
import UserControllerList from '../app/view/admin/user/user-controller/user-controller-list/UserControllerList';
import EmControllerList from '../app/view/admin/user/em-controller/em-controller-list/EmControllerList';
import SchoolsList from '../app/view/admin/user/schools/schools-list/SchoolsList';
import StudentsList from '../app/view/admin/user/students/students-list/StudentsList';
// import EmSchool from '../app/view/admin/connect/em-school';
import ListLanguages from '../app/view/admin/data/languages/list-languages/ListLanguages';
import ListRegions from '../app/view/admin/data/regions/list-regions/ListRegions';
import ListJobNames from '../app/view/admin/data/job-names/list-job-names/ListJobNames';
import ListTypeSchools from '../app/view/admin/data/type-schools/list-type-schools/ListTypeSchools';
import ListSkills from '../app/view/admin/data/skills/list-skills/ListSkills';
import ListJobGroups from '../app/view/admin/data/job-groups/list-job-groups/ListJobGroups';
import ListBranches from '../app/view/admin/data/branches/list-branches/ListBranches';
import ListAnnouTypes from '../app/view/admin/data/annou-types/list-annou-types/ListAnnouTypes';
import ListWorkingTools from '../app/view/admin/data/working-tools/List';
import ListConnectEmSchool from '../app/view/admin/connect/em-school/List';
import JobAnnouncementsList from '../app/view/admin/jobs/job-announcements-list/JobAnnouncementsList';
import DefaultBanner from '../app/view/layout/common/DefaultBanner';
import PendingJobsList from '../app/view/admin/jobs/pending-jobs-list/PendingJobsList';
import PendingJobsCreate from '../app/view/admin/jobs/pending-jobs-create/PendingJobsCreate';


const routeDetail = [
    { route: '/admin/data/majors/list', component: <ListMajors /> },
    { route: '/admin/event/list', component: <EventSchoolList /> },
    { route: '/admin/announcements/list', component: <AnnouncementList /> },
    { route: '/admin/role/admin-accounts/list', component: <ListAdminAccounts /> },
    { route: '/admin/role/role-admins/list', component: <ListRoles /> },
    { route: '/admin/user/user-controller/list', component: <UserControllerList /> },
    { route: '/admin/user/em-controller/list', component: <EmControllerList /> },
    { route: '/admin/user/schools/list', component: <SchoolsList /> },
    { route: '/admin/user/students/list', component: <StudentsList /> },
    { route: '/admin/connect/em-school/list', component: <ListConnectEmSchool /> },
    { route: '/admin/data/languages/list', component: <ListLanguages /> },
    { route: '/admin/data/majors/list', component: <ListMajors /> },
    { route: '/admin/data/regions/list', component: <ListRegions /> },
    { route: '/admin/data/job-names/list', component: <ListJobNames /> },
    { route: '/admin/data/schools/list', component: <ListTypeSchools /> },
    { route: '/admin/data/skills/list', component: <ListSkills /> },
    { route: '/admin/data/job-groups/list', component: <ListJobGroups /> },
    { route: '/admin/data/branches/list', component: <ListBranches /> },
    { route: '/admin/data/annou-types/list', component: <ListAnnouTypes /> },
    { route: '/admin/data/working-tools/list', component: <ListWorkingTools /> },
    { route: '/admin/jobs/list', component: <JobAnnouncementsList /> },
    { route: '/admin/jobs/pending-jobs/list', component: <PendingJobsList /> },
    { route: '/admin/jobs/pending-jobs/create', component: <PendingJobsCreate /> },
    { route: '/', component: <DefaultBanner /> },
    { route: null, component: <DefaultBanner /> },
]

export default function rtCpn(props) {
    let cpn;
    let route = props.route;
    routeDetail.forEach(item => { if (item.route === route) { cpn = item.component; } })
    return cpn;
}