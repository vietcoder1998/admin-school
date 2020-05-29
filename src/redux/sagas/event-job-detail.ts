import { GET } from './../../const/method';
import { EVENT_SCHOOLS } from './../../services/api/private.api';
import { IEventJobDetail } from '../../models/event-job-detail';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import { routePath } from '../../const/break-cumb';

function* getEventJobDetailData(action: any) {
    let res = yield call(callEventJobDetail, action);
    let data: IEventJobDetail = {
    };
    if (res) {
        data = res.data;
        yield put({
            type: REDUX.EVENT_SCHOOLS.GET_EVENT_JOB_DETAIL,
            data
        });
    }
}

function callEventJobDetail(action: any) {
    try {
        let res = _requestToServer(
            GET,
            EVENT_SCHOOLS + routePath.JOBS + `/${action.id}`,
            undefined,
            undefined,
            undefined,
            undefined,
            false,
        )

        return res
    } catch (e) {
        throw e
    }
}

export function* EventJobDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.EVENT_SCHOOLS.GET_EVENT_JOB_DETAIL,
        getEventJobDetailData
    )
}