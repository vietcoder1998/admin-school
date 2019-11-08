import {  GET } from './../../common/const/method';
import { ANNOUNCEMENT_DETAIL } from './../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { authHeaders } from '../../services/auth';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListAnnouncementDetailData(action) {
    let res = yield call(callAnnouncementDetail, action);
    if (res.code === 200) {
        console.log(res.data.data)
        yield put({
            type: REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL,
            data: res.data
        });
    }
}

function callAnnouncementDetail(action) {
    let id = "";
    if (action.id) {
        id = action.id;
    }
    return _requestToServer(
        GET,
        null,
        ANNOUNCEMENT_DETAIL + `/${id}`,
        ADMIN_HOST,
        authHeaders,
    )
}

export function* AnnouncementDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL,
        getListAnnouncementDetailData
    )
}