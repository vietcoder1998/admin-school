import { Majors } from './../reducers/majors';
import { Skills } from './../reducers/skills';
import { TypeSchools } from './../reducers/type-school';
import { Regions } from './../reducers/regions';
import { Languages } from './../reducers/languages';
import { combineReducers } from 'redux';
import {PendingJobs} from '../reducers/pending-jobs';
import {JobNames} from '../reducers/job-names';
import {TypeManagement} from '../reducers/type-management';
import {Announcements} from '../reducers/announcements';
import {AnnouncementDetail} from '../reducers/announcement-detail';


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
    Majors
})

export default myReducer