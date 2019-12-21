import { SCHOOLS } from './../../services/api/private.api';
import { ISchoolDetail } from '../models/school-detail';
import { GET } from '../../common/const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../common/const/actions'

function* getListSchoolDetailData(action: any) {
    let res = yield call(callSchoolDetail, action);
    let data: ISchoolDetail = {}

    if (res) {
        data = res.data;
        yield put({
            type: REDUX.SCHOOLS.GET_SCHOOL_DETAIL,
            data
        });
    }
}

function callSchoolDetail(action: any) {

    if (action.id) {
        try {
            let res = _requestToServer(
                GET,
                SCHOOLS + `/${action.id}/profile`,
                undefined,
                undefined,
                undefined,
                undefined,
                false,
                false,
            ) 

            return res;
        } catch (e) {
            throw e
        }
    }
}

export function* SchoolDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.SCHOOLS.GET_SCHOOL_DETAIL,
        getListSchoolDetailData
    )
}