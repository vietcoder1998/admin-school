import React from 'react';
import moment from 'moment';

export const Titlelabel = (props) => {
    return <label className="title-label">{" " + props.value + " "}</label>
}

export const IptLetter = (props) => {
    return <span className="important-letter">{" " + props.value + " "}</span>
}

export const FirstLetter = (props) => {
    return <span className="first-letter">{" " + props.value + " "}</span>
}

export const IconLabel = (props) => {
    return <div className="icon_label">{props.icon}</div>
}

export function Loading() {
    return (
        <div className='loading'>
            Loadding...
        </div>
    )
}

export function Timer(props) {
    return (
        <label className='timer'>
            {props.value && moment(props.value).format('DD/MM/YYYY')}
        </label>
    )
}

export interface IListOfIconProps {
    list_icon: Array<any>;
    _choseIcon: Function;
}

export interface IListOfIconState {
}

export class ListIcon extends React.PureComponent<IListOfIconProps, IListOfIconState> {
    render() {
        let { list_icon } = this.props;
        let newListIcon = list_icon.map((item, index) =>
            <span key={index} onClick={() => this.props._choseIcon(item)}>
                <IconLabel  {...item} />
            </span>
        )
        return (
            <div >
                {newListIcon}
            </div>
        )
    }
}