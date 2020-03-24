import { MAJORS } from './../../services/api/private.api';
import { IMajorJobNames } from './../../models/major-job-names';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListMajorJobNamesData(action: any) {
    let res = yield call(callMajorJobNames, action);
    let data: IMajorJobNames = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.MAJOR_JOB_NAMES.GET_MAJOR_JOB_NAMES,
        data
    });
}

function callMajorJobNames(action: any) {
    let id;
    try {
        if (action.id) {
            id = action.id
        }
        return _requestToServer(
            GET, MAJORS + `/${id}/jobNames`,
            undefined,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0
            }, undefined, undefined, false, false
        );
    } catch (e) {
        throw e;
    };
};

export function* MajorJobNamesWatcher() {
    yield takeEvery(
        REDUX_SAGA.MAJOR_JOB_NAMES.GET_MAJOR_JOB_NAMES,
        getListMajorJobNamesData
    )
}