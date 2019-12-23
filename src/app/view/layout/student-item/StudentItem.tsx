import React from 'react';
import { IptLetter, Timer } from '../common/Common';
import { Icon, Avatar, Tooltip } from 'antd';
import { IStudent } from '../../../../redux/models/students';
import './StudentItem.scss';
import { TYPE } from '../../../../const/type';
import { routeLink, routePath } from '../../../../const/break-cumb';
import { Link } from 'react-router-dom';
import { _requestToServer } from '../../../../services/exec';
import { PUT } from '../../../../const/method';

//@ts-ignore
import SystemAvatar from '../../../../assets/image/icon-app-uv.png';

interface INotiItemProps {
    item?: IStudent,
    getListNoti?: () => any;
    setSeen?: (id?: string) => any;
}

export default function NotiItem(props: INotiItemProps) {
    let { item } = props;
    let avatar = SystemAvatar;
    let type_icon = "user";
    let link_to = null;
    let avatar_to = null;

    // async function createRequest() {
    //     await _requestToServer(
    //         PUT,
    //         STUDEN + `/${item.id}/seen/${!item.seen}`,
    //         undefined,
    //         undefined,
    //         undefined,
    //         EMPLOYER_HOST,
    //         false,
    //         true
    //     ).then(
    //         (res: any) => {
    //             setSeenHere(!seen);
    //         }
    //     )
    // }

    return (
        <div className='noti-info test'>
            <div key={item.id}
                className='li-info '
            >
                {
                   <Link to={avatar_to} target="_blank">
                        <div className='img-logo-noti'>
                            <Avatar src={avatar} alt='type noti' style={{ width: "50px", height: "50px" }} icon={type_icon} />
                        </div>
                    </Link>
                }

                <div className='data-noti'>
                    <div><IptLetter value={'Thông tin sinh viên'} style={{ padding: 0 }} /></div>
                    {link_to ?
                        <Link to={link_to} target="_blank">
                            <div className="content_li-info link_to">
                                fasf
                            </div>
                        </Link> :
                        <div className="content_li-info">
                            dfasdf
                        </div>
                    }
                    <Icon type={'solution'}/>
                    <Timer style={{ margin: 0, padding: 0 }} value={item.createdDate} />
                </div>
            </div>
        </div>
    )
}