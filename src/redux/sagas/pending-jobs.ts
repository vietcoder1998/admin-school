import { POST } from '../../const/method';
import { PENDING_JOBS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import { IPendingJobs } from "../models/pending-jobs";


function* getListPendingJobsData(action: any) {
    let res = yield call(callPendingJobs, action);

    let data: IPendingJobs = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data;
    };

    yield put({
        type: REDUX.PENDING_JOBS.GET_PENDING_JOBS,
        data
    });
};

function callPendingJobs(action: any) {
    try {
        return _requestToServer(
            POST, PENDING_JOBS,
            action.body,
            {
                pageIndex: action.body.pageIndex,
                pageSize: action.body.pageSize
            },
            undefined, undefined, false, false
        );
    } catch (e) {
        throw e;
    };
};

export function* PendingJobsWatcher() {
    yield takeEvery(
        REDUX_SAGA.PENDING_JOBS.GET_PENDING_JOBS,
        getListPendingJobsData
    )
};