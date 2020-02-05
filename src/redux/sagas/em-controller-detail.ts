import { GET } from './../../const/method';
// import { POST } from '../../const/method';
import { EM_CONTROLLER } from '../../services/api/private.api';
import { IEmControllerDetail } from './../../models/em-controller-detail';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListEmControllerDetailData(action: any) {
    let res = yield call(callEmControllerDetail, action);
    let data: IEmControllerDetail = {

    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.EM_CONTROLLER.GET_EM_CONTROLLER_DETAIL,
        data
    });
}

function callEmControllerDetail(action: any) {
    try {

        return _requestToServer(
            GET, EM_CONTROLLER + `/${action.id}/profile`,
            action.body ? action.body : undefined,
            undefined,
            undefined, 
            undefined, 
            false, 
            false
        )
    } catch (e) {
        throw e;
    };
}

export function* EmControllerDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.EM_CONTROLLER.GET_EM_CONTROLLER_DETAIL,
        getListEmControllerDetailData
    )
}