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
        AdminAccountsWatcher()
    ])
} 