import { IAnnouncements } from './../models/announcements';
import { POST } from './../../common/const/method';
import { ANNOUNCEMENTS } from './../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { authHeaders } from '../../services/auth';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListAnnouncementsData(action) {
    let res = yield call(callAnnouncements, action);

    let data: IAnnouncements = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    }

    if (res.code === 200) {
        data.items = res.data.items;
        data.pageIndex = res.data.pageIndex;
        data.pageSize = res.data.pageSize;
        data.totalItems = res.data.totalItems;
        yield put({
            type: REDUX.ANNOUNCEMENTS.GET_ANNOUNCEMENTS,
            data
        });
    }
}

function callAnnouncements(action) {
    return _requestToServer(
        POST,
        {
            adminID: action.body.adminID,
            hidden: action.body.hidden,
            createdDate: action.body.createdDate,
            target: action.body.target,
            announcementTypeID: action.body.announcementTypeID,
        },
        ANNOUNCEMENTS,
        ADMIN_HOST,
        authHeaders,
        {
            pageIndex: action.pageIndex ? action.pageIndex : 0,
            pageSize: action.pageSize ? action.pageSize : 10
        }
    )
}

export function* AnnouncementsWatcher() {
    yield takeEvery(
        REDUX_SAGA.ANNOUNCEMENTS.GET_ANNOUNCEMENTS,
        getListAnnouncementsData
    )
}