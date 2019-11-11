import { Branches } from './../reducers/branches';
import { JobGroups } from './../reducers/job-groups';
import { Majors } from './../reducers/majors';
import { Skills } from './../reducers/skills';
import { TypeSchools } from './../reducers/type-school';
import { Regions } from './../reducers/regions';
import { Languages } from './../reducers/languages';
import { PendingJobs } from '../reducers/pending-jobs';
import { JobNames } from '../reducers/job-names';
import { TypeManagement } from '../reducers/type-management';
import { Announcements } from '../reducers/announcements';
import { AnnouncementDetail } from '../reducers/announcement-detail';
import { combineReducers } from 'redux';


const myReducer = combineReducers({
    PendingJobs,
    JobNames,
    TypeManagement,
    Announcements,
    AnnouncementDetail,
    Languages,
    Regions,
    TypeSchools,
    Skills,
    Majors,
    JobGroups,
    Branches
})

export default myReducer