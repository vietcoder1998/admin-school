import React from 'react';
import { Empty, Avatar, Pagination } from "antd";
import { IJobSuitableCandidate } from "../../../../models/job-suitable-candidate";
import CanProProp from "./../can-pro-pop/CanProProp";

interface IState {

}

interface IProps {
    job_suitable_candidates?: Array<IJobSuitableCandidate>,
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}

export default function JobSuitableCandidate(props?: IProps) {
    let { job_suitable_candidates } = props;
    return (
        <>
            <ul>
                {
                    job_suitable_candidates &&
                        job_suitable_candidates.length > 0 ?
                        job_suitable_candidates.map((item?: IJobSuitableCandidate) => (
                            <li className='test' style={{ padding: '5px 10px', margin: 2 }}>
                                <Avatar src={item.avatarUrl} />
                                <CanProProp data={item}>
                                    {item.lastName + " " + item.firstName}
                                </CanProProp>
                            </li>
                        )
                        ) :
                        <Empty description={"Không có ứng viên nào phù hợp"} />
                }
            </ul>
            <Pagination pageSize={props.pageSize} total={props.totalItems} />
        </>
    )
}