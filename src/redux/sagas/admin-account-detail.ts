import { IAdminAccount } from './../../models/admin-accounts-detail';
import { GET } from './../../const/method';
import { takeEvery, put, call } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import { ADMIN_ACCOUNTS } from '../../services/api/private.api';

function* getAdminAccountDetailData(action: any) {
    let res = yield call(callAdminAccountDetail, action);
    let data: IAdminAccount = {};
    if (res.code === 200) {
        data = res.data
    }

    if (action.id === localStorage.getItem("userID")) {
        console.log("true")
        localStorage.setItem("avatarUrl", data.avatarUrl)
    }
    
    yield put({
        type: REDUX.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNT_DETAIL,
        data
    });
};

function callAdminAccountDetail(action: any) {
    try {
        if (action.id) {
            return _requestToServer(
                GET, ADMIN_ACCOUNTS + `/${action.id}/profile`,
                undefined,
                undefined,
                undefined, undefined, false
            )
        }
    } catch (e) {
        throw e;
    }
};

export function* AdminAccountDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNT_DETAIL,
        getAdminAccountDetailData)
}