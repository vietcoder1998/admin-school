import { MAJORS } from './../../services/api/private.api';
import { IMajors } from './../models/majors';
import { authHeaders } from './../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListMajorsData(action) {
    let res = yield call(callMajors, action);
    if (res.code === 200) {
        let data: IMajors = res.data;
        yield put({
            type: REDUX.MAJORS.GET_MAJORS,
            data
        });
    }
}

function callMajors(action) {
    var pageIndex;
    var pageSize;
    if (action.pageIndex) {
        pageIndex = action.pageIndex;
    }

    if (action.pageSize) {
        pageSize = action.pageSize;
    }

    return _requestToServer(
        GET,
        null,
        MAJORS,
        ADMIN_HOST,
        authHeaders,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 10
        }
    )
}

export function* MajorsWatcher() {
    yield takeEvery(
        REDUX_SAGA.MAJORS.GET_MAJORS,
        getListMajorsData
    )
}