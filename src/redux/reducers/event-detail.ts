import IEventDetail from '../../models/event-detail';
import { REDUX } from '../../const/actions';

let initState: IEventDetail = {
    id: "",
    school: {
      id: "",
      name: null,
      shortName: "",
      educatedScale: null,
      region: {
        id: null,
        name: ""
      },
      schoolType: {
        id: null,
        name: "",
        priority: null
      },
      email: "",
      phone: "",
      logoUrl: "",
      address: "",
      lat: null,
      lon: null,
      createdDate: null
    },
    name: "",
    description: "",
    bannerUrl: "",
    startedDate: null,
    finishedDate: null,
    createdDate: null
};

export const EventDetail = (state: IEventDetail = initState, action: any): IEventDetail => {
    switch (action.type) {
        case REDUX.EVENT_SCHOOLS.GET_EVENT_DETAIL:
            return {
                ...state,
                ...action.data
            };

        default:
            return state;
    }
};