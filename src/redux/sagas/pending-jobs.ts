import {POST} from '../../common/const/method';
import {PENDING_JOBS_API} from '../../services/api/private.api';
import {takeEvery, put, call,} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'
import {IPendingJobs} from "../models/pending-job";


function* getListPendingJobsData(action: any) {
    let res = yield call(callPendingJobs, action);

    let data: IPendingJobs = {
        list_jobs: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data.list_jobs = res.data.items;
        data.pageIndex = res.data.pageIndex;
        data.pageSize = res.data.pageSize;
        data.totalItems = res.data.totalItems;

        yield put({
            type: REDUX.PENDING_JOBS.GET_PENDING_JOBS,
            data
        });
    }
}

function callPendingJobs(action: any) {
    return _requestToServer(
        POST, PENDING_JOBS_API,
        {
            employerID: action.body.employerID,
            state: action.body.state,
            jobType: action.body.jobType,
            jobNameID: action.body.jobNameID,
        },
        {
            pageIndex: action.body.pageIndex,
            pageSize: 10
        },
    )
}

export function* PendingJobsWatcher() {
    yield takeEvery(
        REDUX_SAGA.PENDING_JOBS.GET_PENDING_JOBS,
        getListPendingJobsData
    )
}