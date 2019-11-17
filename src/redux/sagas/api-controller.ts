import { API_CONTROLLER } from '../../services/api/private.api';
import { IApiController } from '../models/api-controller';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListApiControllerData(action: any) {
    let res = yield call(callApiController, action);
    if (res.code === 200) {
        let data: IApiController = res.data;
        yield put({
            type: REDUX.API_CONTROLLER.GET_API_CONTROLLER,
            data
        });
    }
}

function callApiController(action: any) {
    return _requestToServer(
        GET, API_CONTROLLER,
        undefined,
        undefined, undefined, undefined, false, false
    )
}

export function* ApiControllerWatcher() {
    yield takeEvery(
        REDUX_SAGA.API_CONTROLLER.GET_API_CONTROLLER,
        getListApiControllerData
    )
}