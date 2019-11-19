import {ROLES} from '../../services/api/private.api';
import {IAdminAccounts} from '../models/admin-accounts';
import {GET} from '../../common/const/method';
import {takeEvery, put, call} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'

function* getListAdminAccountsData(action: any) {
    let res = yield call(callAdminAccounts, action);
    if (res.code === 200) {
        let data: IAdminAccounts = res.data;
        yield put({
            type: REDUX.ROLES.GET_ROLES,
            data
        });
    }
}

function callAdminAccounts(action: any) {
    var pageIndex;
    var pageSize;
    if (action.pageIndex) {
        pageIndex = action.pageIndex;
    }

    if (action.pageSize) {
        pageSize = action.pageSize;
    }

    return _requestToServer(
        GET, ROLES,
        null,
        {
            pageIndex: pageIndex ? pageIndex : 0,
            pageSize: pageSize ? pageSize : 10
        },
        undefined, undefined, false, false
    )
}

export function* AdminAccountsWatcher() {
    yield takeEvery(
        REDUX_SAGA.ROLES.GET_ROLES,
        getListAdminAccountsData)
}