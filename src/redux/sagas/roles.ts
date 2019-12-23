import { ROLES } from '../../services/api/private.api';
import { IRoles } from '../models/roles';
import { GET } from '../../const/method';
import { takeEvery, put, call } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListRolesData(action: any) {
    let res = yield call(callRoles, action);
    let data: IRoles = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data;
    };

    yield put({
        type: REDUX.ROLES.GET_ROLES,
        data
    });
}

function callRoles(action: any) {
    try {
        let pageIndex;
        let pageSize;
        if (action.pageIndex) {
            pageIndex = action.pageIndex;
        };

        if (action.pageSize) {
            pageSize = action.pageSize;
        };

        return _requestToServer(
            GET, ROLES,
            null,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize: pageSize ? pageSize : 10
            },
            undefined, undefined, false, false
        );
    } catch (e) {
        throw e;
    };
};

export function* RolesWatcher() {
    yield takeEvery(
        REDUX_SAGA.ROLES.GET_ROLES,
        getListRolesData)
}