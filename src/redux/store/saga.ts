import { all } from 'redux-saga/effects';
import { PendingJobsWatcher } from '../sagas/pending-jobs';
import { JobNameWatcher } from '../sagas/job-names';
import { AnnouTypesWatcher } from '../sagas/annou-types';
import { AnnouncementsWatcher } from '../sagas/announcements';
import { AnnouncementDetailWatcher } from '../sagas/announcement-detail';
import { TypeSchoolsWatcher } from '../sagas/type-schools';
import { RegionsWatcher } from '../sagas/regions';
import { SkillsWatcher } from '../sagas/skills';
import { LanguagesWatcher } from '../sagas/languages';
import { MajorsWatcher } from '../sagas/majors';
import { JobGroupsWatcher } from '../sagas/job-groups';
import { BranchesWatcher } from '../sagas/branches';
import { RolesWatcher } from '../sagas/roles';
import { ApiControllerWatcher } from '../sagas/api-controller';
import { RoleDetailWatcher } from '../sagas/role-detail';
import { ApiControllerRolesWatcher } from '../sagas/api-controller-roles';
import { AdminAccountsWatcher } from '../sagas/admin-accounts';
import { MajorJobNamesWatcher } from '../sagas/major-job-names';
import { AnnouCommentsWatcher } from '../sagas/annou-comments';
import { PendingJobDetailWatcher } from '../sagas/pending-job-detail';
import { EmBranchesWatcher } from '../sagas/em-branches';
import { EmployersWatcher } from '../sagas/employers';
import { UserControllersWatcher } from '../sagas/user-controller';
import { EmControllersWatcher } from '../sagas/em-controller';
import { SchoolsWatcher } from '../sagas/schools';
import { StudentsWatcher } from '../sagas/students';
import { StudentDetailWatcher } from '../sagas/student-detail';

import { EmControllerDetailWatcher } from '../sagas/em-controller-detail';
import { JobAnnouncementsWatcher } from '../sagas/job-announcements';
import { JobAnnouncementDetailWatcher } from '../sagas/job-announcement-detail';
import { SchoolDetailWatcher } from '../sagas/school-detail';
import { CandidateDetailWatcher } from '../sagas/candidates-detail';
import { CandidatesWatcher } from '../sagas/candidates';
import { AdminAccountDetailWatcher } from '../sagas/admin-account-detail';
import { ApplyJobsWatcher } from '../sagas/apply-jobs';
import { ApplyCansWatcher } from '../sagas/apply-cans';
import { JobServiceWatcher } from '../sagas/job-services';
import { JobSuitableCandidatesWatcher } from '../sagas/job-suitable-candidate';


export default function* rootSaga() {
    yield all([
        PendingJobsWatcher(),
        JobNameWatcher(),
        AnnouTypesWatcher(),
        AnnouncementsWatcher(),
        AnnouncementDetailWatcher(),
        TypeSchoolsWatcher(),
        RegionsWatcher(),
        SkillsWatcher(),
        LanguagesWatcher(),
        MajorsWatcher(),
        JobGroupsWatcher(),
        BranchesWatcher(),
        RolesWatcher(),
        ApiControllerWatcher(),
        RoleDetailWatcher(),
        ApiControllerRolesWatcher(),
        AdminAccountsWatcher(),
        MajorJobNamesWatcher(),
        AnnouCommentsWatcher(),
        PendingJobDetailWatcher(),
        EmBranchesWatcher(),
        EmployersWatcher(),
        AdminAccountsWatcher(),
        UserControllersWatcher(),
        EmControllersWatcher(),
        EmControllerDetailWatcher(),
        SchoolsWatcher(),
        StudentsWatcher(),
        JobAnnouncementsWatcher(),
        JobAnnouncementDetailWatcher(),
        SchoolDetailWatcher(),
        CandidateDetailWatcher(),
        CandidatesWatcher(),
        StudentDetailWatcher(),
        AdminAccountDetailWatcher(),
        ApplyJobsWatcher(),
        ApplyCansWatcher(),
        JobServiceWatcher(),
        JobSuitableCandidatesWatcher()
    ])
} 