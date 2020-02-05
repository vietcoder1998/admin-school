import {ILanguages} from './../../models/languages';
import {REDUX} from '../../const/actions';

export const getListLanguages = (data: ILanguages) => ({
    type: REDUX.LANGUAGES.GET_LANGUAGES,
    data
});