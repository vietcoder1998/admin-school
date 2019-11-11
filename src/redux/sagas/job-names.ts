import { authHeaders } from './../../services/auth';
import { JOB_NAMES } from './../../services/api/private.api';
import { IJobNames } from '../models/job-type';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';


function* getListJobNameData(action) {
    let res = yield call(callJobName, action);
    let data: IJobNames = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    }

    if (res.code === 200) {
       data = res.data;
        yield put({
            type: REDUX.JOB_NAMES.GET_JOB_NAMES,
            data
        });
    }
}

function callJobName(action) {
    return _requestToServer(
        GET,
        null,
        JOB_NAMES,
        ADMIN_HOST,
        authHeaders,
        { pageIndex: 0, pageSize: 0 },
    )
}

export function* JobNameWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES,
        getListJobNameData
    )
}