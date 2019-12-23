import { IRoleDetail } from './../models/role-detail';
import { ROLES } from '../../services/api/private.api';
import { GET } from '../../const/method';
import { takeEvery, put, call } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getRoleDetailData(action: any) {
    let res = yield call(callRolesDetail, action);
    let data: IRoleDetail = {
        data: {}
    };

    if (res.code === 200) {
        data = res.data;
    }

    yield put({
        type: REDUX.ROLES.GET_ROLE_DETAIL,
        data
    });
};

function callRolesDetail(action: any) {
    try {
        let rid;
        if (action.rid) {
            rid = action.rid;
        };

        return _requestToServer(
            GET, ROLES + (rid ? `/${rid}` : ''),
            undefined,
            undefined, undefined, undefined, false, false
        );
    } catch (e) {
        throw e;
    };
};

export function* RoleDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.ROLES.GET_ROLE_DETAIL,
        getRoleDetailData
    );
};