import { IJobAnnouncements } from '../models/job-announcements';
import { POST } from '../../common/const/method';
import { JOB_ANNOUNCEMENTS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListJobAnnouncementsData(action: any) {
    let res = yield call(callJobAnnouncements, action);
    let data: IJobAnnouncements = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data;
    };

    yield put({
        type: REDUX.JOB_ANNOUNCEMENTS.GET_JOB_ANNOUNCEMENTS,
        data
    });
};

function callJobAnnouncements(action: any) {
    try {
        let body = {};

        if (action.body) {
            body = action.body
        };

        let res = _requestToServer(
            POST,
            JOB_ANNOUNCEMENTS ,
            body,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 10
            },
            undefined,
            undefined,
            false,
            false
        );
        return res
    } catch (error) {
        throw error;
    }

};

export function* JobAnnouncementsWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_ANNOUNCEMENTS.GET_JOB_ANNOUNCEMENTS,
        getListJobAnnouncementsData
    );
};