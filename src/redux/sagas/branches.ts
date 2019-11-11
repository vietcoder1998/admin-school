import { BRANCHES } from '../../services/api/private.api';
import { IBranches } from '../models/branches';
import { authHeaders } from '../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListBranchesData(action) {
    let res = yield call(callBranches, action);

    if (res.code === 200) {
        let data: IBranches = res.data;
        yield put({
            type: REDUX.BRANCHES.GET_BRANCHES,
            data
        });
    }
}

function callBranches(action) {
    var pageIndex;
    var pageSize;
    if (action.pageIndex) {
        pageIndex = action.pageIndex;
    }

    if (action.pageSize) {
        pageSize = action.pageSize;
    }

    return _requestToServer(
        GET,
        null,
        BRANCHES,
        ADMIN_HOST,
        authHeaders,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 0
        }
    )
}

export function* BranchesWatcher() {
    yield takeEvery(
        REDUX_SAGA.BRANCHES.GET_BRANCHES,
        getListBranchesData
    )
}