import { all } from 'redux-saga/effects';
import { PendingJobsWatcher } from '../sagas/pending-jobs';
import { JobNameWatcher } from '../sagas/job-name';
import { TypeManagementWatcher } from '../sagas/type-management';
import { AnnouncementsWatcher } from '../sagas/announcements';
import { AnnouncementDetailWatcher } from '../sagas/announcement-detail';
import { TypeSchoolsWatcher } from '../sagas/type-schools';
import { RegionsWatcher } from '../sagas/regions';
import { SkillsWatcher } from '../sagas/skills';

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
    ])
} 