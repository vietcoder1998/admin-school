import { EVENT_SCHOOLS } from './../../services/api/private.api';
import { IEventSchools } from './../../models/event-schools';
import { POST } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListEventSchoolsData(action: any) {
    let res = yield call(callEventSchools, action);

    let data: IEventSchools = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_SCHOOLS,
        data
    });
}

function callEventSchools(action: any) {
    try {
        let res = _requestToServer(
            POST,
            EVENT_SCHOOLS + '/query',
            action.body ? action.body : null,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 10,
            },
            undefined,
            undefined,
            false,
            false
        )
        return res

    } catch (error) {
        throw error;
    }
}

export function* EventSchoolsWatcher() {
    yield takeEvery(
        REDUX_SAGA.EVENT_SCHOOLS.GET_LIST_EVENT_SCHOOLS,
        getListEventSchoolsData
    )
}