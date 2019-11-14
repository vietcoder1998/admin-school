import { all } from 'redux-saga/effects';
import { PendingJobsWatcher } from '../sagas/pending-jobs';
import { JobNameWatcher } from '../sagas/job-names';
import { TypeManagementWatcher } from '../sagas/type-management';
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

export default function* rootSaga() {
    yield all([
        PendingJobsWatcher(),
        JobNameWatcher(),
        TypeManagementWatcher(),
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
    ])
} 