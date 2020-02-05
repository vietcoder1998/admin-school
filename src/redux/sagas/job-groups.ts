import { JOB_GROUPS } from '../../services/api/private.api';
import { IJobGroups } from './../../models/job-groups';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListJobGroupsData(action: any) {
    let res = yield call(callJobGroups, action);
    let data: IJobGroups = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.JOB_GROUPS.GET_JOB_GROUPS,
        data
    });
}

function callJobGroups(action: any) {
    try {
        return _requestToServer(
            GET, JOB_GROUPS,
            null,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
                name: action.name
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e;
    }
}

export function* JobGroupsWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_GROUPS.GET_JOB_GROUPS,
        getListJobGroupsData
    )
}