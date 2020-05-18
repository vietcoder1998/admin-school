import { IEventJobs } from '../../models/event-jobs';
import { POST } from '../../const/method';
import { EVENT_SCHOOLS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListEventJobssData(action: any) {
    let res = yield call(callEventJobss, action);

    let data: IEventJobs = {
        items: [],
        pageIndex: 0,
        pageSize: 10,
        totalItems: 0,
    };

    if (res) {
        data = res.data
    };

    yield put({
        type: REDUX.EVENT_SCHOOLS.GET_LIST_EVENT_JOBS,
        data
    });
}

function callEventJobss(action: any) {

    let body = {
        adminID: null,
        hidden: null,
        createdDate: null,
        EventJobsTypeID: null
    }

    if (action.body) {
        body = action.body;
    }

    try {
        let res = _requestToServer(
            POST,
            EVENT_SCHOOLS + '/jobs/query',
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

export function* EventJobsListWatcher() {
    yield takeEvery(
        REDUX_SAGA.EVENT_SCHOOLS.GET_LIST_EVENT_JOBS,
        getListEventJobssData
    )
}