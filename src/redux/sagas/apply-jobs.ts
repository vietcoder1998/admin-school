import { POST } from './../../const/method';
import { APPLY_JOB } from '../../services/api/private.api';
import { IApplyJobs } from './../../models/apply-jobs';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListApplyJobsData(action: any) {
    let res = yield call(callApplyJobs, action);
    let data: IApplyJobs = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.APPLY_JOB.GET_APPLY_JOB,
        data
    });
}

function callApplyJobs(action: any) {
    try {
        return _requestToServer(
            POST, APPLY_JOB ,
            {
                jobID: action.id ? action.id : null
            },
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
            },
            undefined, undefined, undefined, false
        )
    } catch (e) {
        throw e
    }

}

export function* ApplyJobsWatcher() {
    yield takeEvery(
        REDUX_SAGA.APPLY_JOB.GET_APPLY_JOB,
        getListApplyJobsData
    )
}