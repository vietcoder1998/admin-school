import { ROLES } from '../../services/api/private.api';
import { IRoles } from '../models/roles';
import { authHeaders } from '../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getRoleDetailData(action) {
    let res = yield call(callRolesDetail, action);
    if (res.code === 200) {
        let data: IRoles = res.data;
        console.log("ok")
        yield put({
            type: REDUX.ROLES.GET_ROLE_DETAIL,
            data
        });
    };
}

function callRolesDetail(action) {
    let rid;
    if (action.rid) {
        rid = action.rid;
    }

    return _requestToServer(
        GET,
        null,
        ROLES + (rid ? `/${rid}` : ''),
        ADMIN_HOST,
        authHeaders,
    )
}

export function* RoleDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.ROLES.GET_ROLE_DETAIL,
        getRoleDetailData
    )
}