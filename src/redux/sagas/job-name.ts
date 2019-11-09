import { IJobNames } from './../models/job-type';
import { noInfoHeader } from '../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { PUBLIC_HOST } from '../../environment/dev';
import { JOB_NAME } from '../../services/api/public.api';


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
            type: REDUX.JOB_NAME.GET_JOB_NAME,
            data
        });
    }
}

function callJobName(action) {
    return _requestToServer(
        GET,
        null,
        JOB_NAME,
        PUBLIC_HOST,
        noInfoHeader,
        { pageIndex: 0, pageSize: 0 },
    )
}

export function* JobNameWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_NAME.GET_JOB_NAME,
        getListJobNameData
    )
}