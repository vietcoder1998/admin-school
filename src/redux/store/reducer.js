import { combineReducers } from 'redux';
import {PendingJobs} from './../reducers/pending-jobs';
import {JobName} from '../reducers/job-name';
import {TypeManagement} from '../reducers/type-management';
import {Announcements} from '../reducers/announcements';
import {AnnouncementDetail} from '../reducers/announcement-detail';


const myReducer = combineReducers({
    PendingJobs,
    JobName,
    TypeManagement,
    Announcements,
    AnnouncementDetail
})

export default myReducer