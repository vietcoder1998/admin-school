import { POST } from '../../const/method';
import { EM_CONTROLLER } from '../../services/api/private.api';
import { IEmControllers } from './../../models/em-controller';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListEmControllersData(action: any) {
    let res = yield call(callEmControllers, action);
    let data: IEmControllers = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.EM_CONTROLLER.GET_EM_CONTROLLER,
        data
    });
}

function callEmControllers(action: any) {
    try {
        let pageIndex;
        let pageSize;
        if (action.pageIndex) {
            pageIndex = action.pageIndex;
        }

        if (action.pageSize) {
            pageSize = action.pageSize;
        }

        return _requestToServer(
            POST, EM_CONTROLLER + `/query`,
            action.body ? action.body : undefined,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize: pageSize ? pageSize : 10,
                sortBy: 'e.createdDate',
                sortType: 'desc'
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e;
    };
}

export function* EmControllersWatcher() {
    yield takeEvery(
        REDUX_SAGA.EM_CONTROLLER.GET_EM_CONTROLLER,
        getListEmControllersData
    )
}