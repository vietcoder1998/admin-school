import { IPendingJobs } from './../../common/models/pending-job';
import { POST } from './../../common/const/method';
import { PENDING_JOBS_API } from './../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { authHeaders } from '../../services/auth';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';


function* getListPendingJobsData(action) {
    let res = yield call(callPendingJobs, action);

    let data: IPendingJobs = {
        list_jobs: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    }

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

function callPendingJobs(action) {
    return _requestToServer(
        POST,
        {
            employerID: action.body.employerID,
            state: action.body.state,
            jobType: action.body.jobType,
            jobNameID: action.body.jobNameID,
        },
        PENDING_JOBS_API,
        ADMIN_HOST,
        authHeaders,
        { pageIndex: action.body.pageIndex, pageSize: 10 },
    )
}

export function* PendingJobsWatcher() {
    yield takeEvery(
        REDUX_SAGA.PENDING_JOBS.GET_PENDING_JOBS,
        getListPendingJobsData
    )
}