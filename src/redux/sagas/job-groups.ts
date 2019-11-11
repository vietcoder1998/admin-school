import { JOB_GROUPS } from '../../services/api/private.api';
import { IJobGroups } from '../models/job-groups';
import { authHeaders } from '../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListJobGroupsData(action) {
    let res = yield call(callJobGroups, action);

    if (res.code === 200) {
        let data: IJobGroups = res.data;
        yield put({
            type: REDUX.JOB_GROUPS.GET_JOB_GROUPS,
            data
        });
    }
}

function callJobGroups(action) {
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
        JOB_GROUPS,
        ADMIN_HOST,
        authHeaders,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 0
        }
    )
}

export function* JobGroupsWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_GROUPS.GET_JOB_GROUPS,
        getListJobGroupsData
    )
}