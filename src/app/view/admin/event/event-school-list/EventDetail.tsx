import React from 'react';
import { timeConverter } from '../../../../../utils/convertTime';
import { Icon, Avatar } from 'antd';
import IEventDetail from './../../../../../models/event-detail';

export default function EventDetail(props?: IEventDetail) {
    return (
        <div className='event-detail'>
            <img src={props.bannerUrl} style={{ width: '100%', height: 'auto' }} alt='Ảnh sự kiện' />
            <h6 style={{ marginTop: 20 }}>
                <Avatar size={"large"} style={{ marginRight: 5 }} src={props.school ? props.school.logoUrl : ""} />
                {props.school ? props.school.name : ""}
            </h6>
            <p>
                Địa chỉ:  {props.school ? props.school.address : ""}
            </p>
            <p>
                <Icon type={'calendar'} />  {timeConverter(props.createdDate, 1000) + " - " + timeConverter(props.finishedDate, 1000)}
            </p>
            <div className="test" style={{ padding: "10px 15px", color: "black", backgroundColor: 'white' }}>
                {props.description}
            </div>
        </div>
    )
};