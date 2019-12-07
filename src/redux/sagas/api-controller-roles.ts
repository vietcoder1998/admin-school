import { API_CONTROLLER_ROLES } from '../../services/api/private.api';
import { IApiController } from '../models/api-controller';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListApiControllerRolesData(action: any) {
    let res = yield call(callApiControllerRoles, action);
    let data: IApiController = {
        data: []
    };

    if (res.code === 200) {
        data = res.data;
    };

    yield put({
        type: REDUX.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES,
        data
    });
}

function callApiControllerRoles(action: any) {
    let id: any;
    if (action.id) {
        id = action.id
    }
    return _requestToServer(
        GET, API_CONTROLLER_ROLES + (id ? `/${id}/apis` : ''),
        null,
        undefined, undefined, undefined, false, false
    )
}

export function* ApiControllerRolesWatcher() {
    yield takeEvery(
        REDUX_SAGA.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES,
        getListApiControllerRolesData
    )
}