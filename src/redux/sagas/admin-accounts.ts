import { IAdminAccounts } from '../models/admin-accounts';
import { POST } from '../../common/const/method';
import { takeEvery, put, call } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_ACCOUNTS } from '../../services/api/private.api';

function* getListAdminAccountsData(action: any) {
    let res = yield call(callAdminAccounts, action);
    let data: IAdminAccounts = res.data;
    if (res.code === 200) {
        data = res.data
    }
    yield put({
        type: REDUX.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNTS,
        data
    });
}

function callAdminAccounts(action: any) {
    try {
        let pageIndex;
        let pageSize;
        let body = {
            firstName: null,
            lastName: null,
            roleID: null,
            roleType: null,
            ids: null
        };

        if (action.pageIndex) {
            pageIndex = action.pageIndex;
        }

        if (action.pageSize) {
            pageSize = action.pageSize;
        }

        if (action.body) {
            body = action.body
        }

        return _requestToServer(
            POST, ADMIN_ACCOUNTS + '/query',
            body,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize: pageSize ? pageSize : 10
            },
            undefined, undefined, false
        )
    } catch (e) {
        throw e;
    }

}

export function* AdminAccountsWatcher() {
    yield takeEvery(
        REDUX_SAGA.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNTS,
        getListAdminAccountsData)
}