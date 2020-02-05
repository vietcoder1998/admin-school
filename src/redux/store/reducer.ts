import { ApplyCans } from './../reducers/apply-cans';
import { ApplyJobs } from './../reducers/apply-jobs';
import { AdminAccountDetail } from './../reducers/admin-account-detail';
import { StudentDetail } from './../reducers/student-detail';
import { SchoolsDetail } from './../reducers/school-detail';
import { JobAnnouncementDetail } from './../reducers/job-announcement-detail';
import { JobAnnouncements } from './../reducers/job-announcements';
import { EmployerDetail } from './../reducers/em-controller-detail';
import { Students } from './../reducers/students';
import { Schools } from './../reducers/schools';
import { EmControllers } from './../reducers/em-controller';
import { UserControllers } from './../reducers/user-controller';
import { Employers } from './../reducers/employers';
import { EmBranches } from './../reducers/em-branches';
import { PendingJobDetail } from './../reducers/pending-job-detail';
import { MutilBox } from './../reducers/mutil-box';
import { AnnouComments } from './../reducers/annou-comments';
import { MajorJobNames } from './../reducers/major-job-names';
import { AdminAccounts } from './../reducers/admin-accounts';
import { ApiControllerRoles } from '../reducers/api-controller-roles';
import { RoleDetail } from '../reducers/role-detail';
import { ApiController } from '../reducers/api-controller';
import { Roles } from '../reducers/roles';
import { Branches } from '../reducers/branches';
import { JobGroups } from '../reducers/job-groups';
import { Majors } from '../reducers/majors';
import { Skills } from '../reducers/skills';
import { TypeSchools } from '../reducers/type-school';
import { Regions } from '../reducers/regions';
import { Languages } from '../reducers/languages';
import { PendingJobs } from '../reducers/pending-jobs';
import { JobNames } from '../reducers/job-names';
import { AnnouTypes } from '../reducers/annou-types';
import { Announcements } from '../reducers/announcements';
import { AnnouncementDetail } from '../reducers/announcement-detail';
import { Candidates } from '../reducers/candidates';
import { CandidateDetail } from '../reducers/candidates-detail';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    PendingJobs,
    JobNames,
    AnnouTypes,
    Announcements,
    AnnouncementDetail,
    Languages,
    Regions,
    TypeSchools,
    Skills,
    Majors,
    JobGroups,
    Branches,
    Roles,
    ApiController,
    RoleDetail,
    ApiControllerRoles,
    AdminAccounts,
    MajorJobNames,
    AnnouComments,
    MutilBox,
    PendingJobDetail,
    EmBranches,
    Employers,
    UserControllers,
    EmControllers,
    EmployerDetail,
    Schools,
    Students,
    JobAnnouncements,
    JobAnnouncementDetail,
    SchoolsDetail,
    Candidates,
    CandidateDetail,
    StudentDetail,
    AdminAccountDetail,
    ApplyJobs,
    ApplyCans
});

export type IAppState = ReturnType<typeof rootReducer>;
export default rootReducer;