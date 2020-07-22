import { WORKING_TOOLS } from './../../services/api/private.api';
import  IWorkingTools  from '../../models/working-tools';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListWorkingToolData(action: any) {
    let res = yield call(callWorkingTool, action);
    let data: IWorkingTools = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.WORKING_TOOL.GET_WORKING_TOOLS,
        data
    });
}

function callWorkingTool(action: any) {
    try {
        return _requestToServer(
            GET, WORKING_TOOLS,
            null,
            {
                pageIndex: action.pageIndex ? action.pageIndex : 0,
                pageSize: action.pageSize ? action.pageSize : 0,
                name: action.name ? action.name : "",
                jobGroupID: action.id ? action.id : undefined,
            }, undefined, undefined, false, false
        )
    } catch (e) {
        throw e
    }
}

export function* WorkingToolWatcher() {
    yield takeEvery(
        REDUX_SAGA.WORKING_TOOL.GET_WORKING_TOOLS,
        getListWorkingToolData
    )
}