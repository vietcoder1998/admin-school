import { SCHOOLS } from './../../services/api/private.api';
import { ISchools } from '../models/schools';
import { POST } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListSchoolsData(action: any) {
    let res = yield call(callSchools, action);

    let data: ISchools = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.SCHOOLS.GET_SCHOOLS,
        data
    });
}

function callSchools(action: any) {
    try {
        if (action.body) {
            return _requestToServer(
                POST, SCHOOLS,
                {
                    adminID: action.body.adminID,
                    hidden: action.body.hidden,
                    createdDate: action.body.createdDate,
                    target: action.body.target,
                    announcementTypeID: action.body.announcementTypeID,
                },
                {
                    pageIndex: action.pageIndex ? action.pageIndex : 0,
                    pageSize: action.pageSize ? action.pageSize : 10
                },
                undefined, undefined, false, false
            )
        }
    } catch (e) {
        throw e;
    }
}

export function* SchoolsWatcher() {
    yield takeEvery(
        REDUX_SAGA.SCHOOLS.GET_SCHOOLS,
        getListSchoolsData
    )
}