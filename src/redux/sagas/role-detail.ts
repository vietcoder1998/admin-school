import {ROLES} from '../../services/api/private.api';
import {IRoles} from '../models/roles';
import {GET} from '../../common/const/method';
import {takeEvery, put, call} from 'redux-saga/effects';
import {_requestToServer} from '../../services/exec';
import {REDUX_SAGA, REDUX} from '../../common/const/actions'

function* getRoleDetailData(action: any) {
    let res = yield call(callRolesDetail, action);
    if (res.code === 200) {
        let data: IRoles = res.data;
        yield put({
            type: REDUX.ROLES.GET_ROLE_DETAIL,
            data
        });
    }
}

function callRolesDetail(action: any) {
    let rid;
    if (action.rid) {
        rid = action.rid;
    }

    return _requestToServer(
        GET, ROLES + (rid ? `/${rid}` : '')
    )
}

export function* RoleDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.ROLES.GET_ROLE_DETAIL,
        getRoleDetailData
    )
}