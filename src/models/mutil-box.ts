export interface IModalState {
    title?: string,
    openModal?: boolean,
    children?: any,
    type_modal?: string,
    msg?: any,
}

export interface IDrawerState {
    title?: string,
    msg?: string,
    openDrawer?: boolean,
    type_drawer?: any,
    children?: string,
}

// export interface IMapState {
//     marker: {
//         lat?: number,
//         lng?: number,
//     },
//     location?: string,
// }

export interface IMutilBox {
    modalState?: IModalState,
    drawerState?: IDrawerState,
    // mapState?: IMapState,
    loading?: boolean,
}
