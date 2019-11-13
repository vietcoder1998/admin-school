import { API_CONTROLLER } from '../../services/api/private.api';
import { IApiController } from '../models/api-controller';
import { authHeaders } from '../../services/auth';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'
import { ADMIN_HOST } from '../../environment/dev';

function* getListApiControllerData(action) {
    let res = yield call(callApiController, action);
    if (res.code === 200) {
        let data: IApiController = res.data;
        yield put({
            type: REDUX.API_CONTROLLER.GET_API_CONTROLLER,
            data
        });
    }
}

function callApiController(action) {
    let { rid } = action.rid
    return _requestToServer(
        GET,
        null,
        API_CONTROLLER,
        ADMIN_HOST,
        authHeaders,
        rid ? rid : null
    )
}

export function* ApiControllerWatcher() {
    yield takeEvery(
        REDUX_SAGA.API_CONTROLLER.GET_API_CONTROLLER,
        getListApiControllerData
    )
}