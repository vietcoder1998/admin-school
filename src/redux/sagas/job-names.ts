import { JOB_NAMES } from '../../services/api/private.api';
import { IJobNames } from './../../models/job-type';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListJobNameData(action: any) {
    let res = yield call(callJobName, action);
    let data: IJobNames = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.JOB_NAMES.GET_JOB_NAMES,
        data
    });
}

function callJobName(action: any) {
    try {
        return _requestToServer(
            GET, JOB_NAMES,
            null,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
                name: action.name ? action.name : "",
                jobGroupID: action.id ? action.id : undefined,
            }, undefined, undefined, false, false
        )
    } catch (e) {
        throw e
    }
}

export function* JobNameWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES,
        getListJobNameData
    )
}