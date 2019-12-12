import { BRANCHES } from '../../services/api/private.api';
import { IBranches } from '../models/branches';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListBranchesData(action: any) {
    let res = yield call(callBranches, action);
    let data: IBranches = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.BRANCHES.GET_BRANCHES,
        data
    });
}

function callBranches(action: any) {
    try {
        return _requestToServer(
            GET, BRANCHES,
            null,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e
    }

}

export function* BranchesWatcher() {
    yield takeEvery(
        REDUX_SAGA.BRANCHES.GET_BRANCHES,
        getListBranchesData
    )
}