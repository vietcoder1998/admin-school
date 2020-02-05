import { GET } from './../../const/method';
import { STUDENTS } from '../../services/api/private.api';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'
import IStudentDetail from './../../models/student-detail';

function* getStudentDetailData(action: any) {
    let res = yield call(callStudents, action);
    let data: IStudentDetail = {
    };

    if (res) {
        data = res.data;
    }

    yield put({
        type: REDUX.STUDENTS.GET_STUDENT_DETAIl,
        data
    });
}

function callStudents(action: any) {
    try {
        if (action.id) {
            return _requestToServer(
                GET, STUDENTS +`/${action.id}/profile`,
                undefined,
                undefined,
                undefined, undefined, false, false
            )
        }
    } catch (e) {
        throw e;
    }
}

export function* StudentDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.STUDENTS.GET_STUDENT_DETAIl,
        getStudentDetailData
    )
}