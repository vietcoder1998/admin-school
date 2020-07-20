import { STUDENTS } from '../../services/api/private.api';
import { IStudents } from './../../models/students';
import { POST } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListStudentsData(action: any) {
    let res = yield call(callStudents, action);
    let data: IStudents = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res) {
        data = res.data;
        console.log(data)
    }

    yield put({
        type: REDUX.STUDENTS.GET_STUDENTS,
        data
    });
}

function callStudents(action: any) {
    try {
        if (action.body) {
            // console.log(action.body)
            console.log(action.pageIndex)
            return _requestToServer(
                POST, STUDENTS + '/query',
                action.body ? action.body : undefined,
                {
                    pageIndex: action.pageIndex ? action.pageIndex : 0,
                    pageSize: action.pageSize ? action.pageSize : 5,
                    sortBy: "s.createdDate",
                    sortType: "desc"
                },
                undefined, undefined, false, false
            )
        }
    } catch (e) {
        throw e;
    }
}

export function* StudentsWatcher() {
    yield takeEvery(
        REDUX_SAGA.STUDENTS.GET_STUDENTS,
        getListStudentsData
    )
}


