import { GET } from './../../const/method';
import { EVENT_SCHOOLS } from '../../services/api/private.api';
import IEventDetail from '../../models/event-detail';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListEventDetailData(action: any) {
    let res = yield call(callEventDetail, action);
    let data: IEventDetail = {};

    console.log(res.data)

    if (res) {
        data = res.data
    };

    yield put({
        type: REDUX.EVENT_SCHOOLS.GET_EVENT_DETAIL,
        data
    });
}

function callEventDetail(action: any) {
    try {
        let res = _requestToServer(
            GET,
            EVENT_SCHOOLS + `/${action.id}`,
            action.body ? action.body : null,
            undefined,
            undefined,
            undefined,
            false,
            false
        )
        return res

    } catch (error) {
        throw error;
    }
};

export function* EventDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.EVENT_SCHOOLS.GET_EVENT_DETAIL,
        getListEventDetailData
    );
}