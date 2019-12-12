import { IAnnouncements } from '../models/announcements';
import { POST } from '../../common/const/method';
import { ANNOUNCEMENTS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListAnnouncementsData(action: any) {
    let res = yield call(callAnnouncements, action);

    let data: IAnnouncements = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.ANNOUNCEMENTS.GET_ANNOUNCEMENTS,
        data
    });
}

function callAnnouncements(action: any) {
    try {
        if (action.body) {
            return _requestToServer(
                POST, ANNOUNCEMENTS,
                {
                    adminID: action.body.adminID,
                    hidden: action.body.hidden,
                    createdDate: action.body.createdDate,
                    target: action.body.target,
                    announcementTypeID: action.body.announcementTypeID,
                },
                {
                    pageIndex: action.pageIndex ? action.pageIndex : 0,
                    pageSize: action.pageSize ? action.pageSize : 10
                },
                undefined, undefined, false, false
            )
        }
    } catch (e) {
        throw e;
    }
}

export function* AnnouncementsWatcher() {
    yield takeEvery(
        REDUX_SAGA.ANNOUNCEMENTS.GET_ANNOUNCEMENTS,
        getListAnnouncementsData
    )
}