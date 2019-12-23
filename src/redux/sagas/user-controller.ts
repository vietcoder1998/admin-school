import { POST } from './../../const/method';
import { USER_CONTROLLER } from '../../services/api/private.api';
import { IUserControllers } from '../models/user-controller';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListUserControllersData(action: any) {
    let res = yield call(callUserControllers, action);
    let data: IUserControllers = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.USER_CONTROLLER.GET_USER_CONTROLLER,
        data
    });
}

function callUserControllers(action: any) {
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
            POST, USER_CONTROLLER + `/query`,
            action.body ? action.body : undefined,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize: pageSize ? pageSize : 10
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e;
    };
}

export function* UserControllersWatcher() {
    yield takeEvery(
        REDUX_SAGA.USER_CONTROLLER.GET_USER_CONTROLLER,
        getListUserControllersData
    )
}