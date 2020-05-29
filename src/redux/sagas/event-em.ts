import { IEventEms } from '../../models/event-em';
import { POST } from '../../const/method';
import { SCHOOLS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import { IEventEmsFilter } from './../../models/event-em';

function* getListEventEmssData(action: any) {
    let res = yield call(callEventEmss, action);

    let data: IEventEms = {
        items: [],
        pageIndex: 0,
        pageSize: 10,
        totalItems: 0,
    };

    if (res) {
        data = res.data
    };

    yield put({
        type: REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_EM,
        data
    });
}

function callEventEmss(action: any) {

    let body: IEventEmsFilter = {
        
    }

    if (action.body) {
        body = action.body;
    }

    try {
        let res = _requestToServer(
            POST,
            SCHOOLS + `${action.sid}events/${action.eid}/employers/query`,
            body,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 10
            },
            null,
            undefined,
            false,
            false
        )

        return res
    } catch (e) {
        throw e
    }
}

export function* EventEmsListWatcher() {
    yield takeEvery(
        REDUX_SAGA.EVENT_SCHOOLS.GET_LIST_EVENT_EM,
        getListEventEmssData
    )
}