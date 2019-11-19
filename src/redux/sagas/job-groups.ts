import {JOB_GROUPS} from '../../services/api/private.api';
import {IJobGroups} from '../models/job-groups';
import {GET} from '../../common/const/method';
import {takeEvery, put, call,} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'

function* getListJobGroupsData(action: any) {
    let res = yield call(callJobGroups, action);
    if (res) {
        let data: IJobGroups = res.data;
        yield put({
            type: REDUX.JOB_GROUPS.GET_JOB_GROUPS,
            data
        });
    }
}

function callJobGroups(action: any) {
    return _requestToServer(
        GET, JOB_GROUPS,
        null,
        {
            pageIndex: action.pageIndex ? action.pageIndex : 0,
            pageSize: action.pageSize ? action.pageSize : 0
        },
        undefined, undefined, false, false
    )
}

export function* JobGroupsWatcher() {
    yield takeEvery(
        REDUX_SAGA.JOB_GROUPS.GET_JOB_GROUPS,
        getListJobGroupsData
    )
}