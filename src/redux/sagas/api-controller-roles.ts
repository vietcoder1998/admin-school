import { API_CONTROLLER_ROLES } from '../../services/api/private.api';
import { IApiController } from '../models/api-controller';
import { authHeaders } from '../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListApiControllerRolesData(action) {
    let res = yield call(callApiControllerRoles, action);
    if (res.code === 200) {
        let data: IApiController = res.data;
        yield put({
            type: REDUX.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES,
            data
        });
    }
}

function callApiControllerRoles(action) {
    let id: number;
    if (action.id) {
        id = action.id
    }
    return _requestToServer(
        GET,
        null,
        API_CONTROLLER_ROLES+ (id ? `/${id}/apis`: ''),
        ADMIN_HOST,
        authHeaders,
        null
    )
}

export function* ApiControllerRolesWatcher() {
    yield takeEvery(
        REDUX_SAGA.API_CONTROLLER_ROLES.GET_API_CONTROLLER_ROLES,
        getListApiControllerRolesData
    )
}