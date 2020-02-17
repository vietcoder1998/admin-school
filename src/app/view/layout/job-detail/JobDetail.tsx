import React from 'react';
import { Icon, Avatar } from 'antd';
import './JobDetail.scss'
import { convertStringToArray } from '../../../../utils/convertStringToArray';
import { IptLetter, NotUpdate } from '../common/Common';
import { weekDays } from '../../../../utils/day';
import { timeConverter } from '../../../../utils/convertTime';
import { ISkill } from '../../../../models/skills';
import findIdWithValue from '../../../../utils/findIdWithValue';
import { IJobName } from '../../../../models/job-type';
import IJobDetail from '../../../../models/job-detail';

interface IJobDetailProps {
    list_job_skills?: Array<ISkill>,
    job_id?: string,
    list_job_names?: Array<IJobName>
    jobDetail?: IJobDetail;
}

export default function JobDetail(props: IJobDetailProps) {
    let { list_job_skills, jobDetail } = props;
    let [requireSkill, setRequireSkill] = React.useState([]);
    let list_des = jobDetail && convertStringToArray(jobDetail.description);

    React.useState(() => {
        if (jobDetail && jobDetail.requiredSkills && jobDetail.requiredSkills.length > 0) {
            let requireSkill = findIdWithValue(list_job_skills, jobDetail.requiredSkills, "id", "name");
            setRequireSkill(requireSkill);
        }
    });

    return (
        <div className='job-detail'>
            <div className='detail-job b_b'>
                <h6>CHI TIẾT</h6>
                <Avatar src={jobDetail && jobDetail.employerUrl} icon="user"
                    style={{ width: "60px", height: "60px", margin: "20px 0px" }} />
                <ul>
                    <li className='d_j_t'>
                        <IptLetter value={"Tiêu đề:"} />
                        <label>
                            {jobDetail && jobDetail.jobTitle ? jobDetail.jobTitle : "Không có"}
                        </label>
                    </li>
                    <li className='d_j_t'>
                        <IptLetter value={"Tên công việc: "} />
                        <label>
                            {jobDetail && jobDetail.jobName ? jobDetail.jobName : "Không có"}
                        </label>
                    </li>
                    <li className='d_j_t'>
                        <IptLetter value={"Tên nhà tuyển dụng: "} />
                        <label>
                            {jobDetail && jobDetail.employerName ? jobDetail.employerName : "Không có"}
                        </label>
                    </li>
                </ul>
            </div>
            <div className='detail-job b_b'>
                <h6>MÔ TẢ CHUNG</h6>
                <ul>
                    <li className='d_j_t'>
                        <Icon type="solution" style={{ color: 'blue' }} />
                        <IptLetter value={"Loại công việc:"} />
                        <label>
                            {
                                jobDetail &&
                                    jobDetail.jobType ?
                                    jobDetail.jobType
                                    : <NotUpdate />
                            }
                        </label>
                    </li>
                    <li className='d_j_t'>
                        <Icon type="calendar" style={{ color: 'green' }} />
                        <IptLetter value={"Ngày đăng: "} />
                        <label> {jobDetail && timeConverter(jobDetail.createdDate, 1000)}
                        </label>
                    </li>
                    <li className='d_j_t'>
                        <Icon type="calendar" style={{ color: 'red' }} />
                        <IptLetter value={"Ngày hết hạn: "} />
                        <label> {jobDetail && timeConverter(jobDetail.expriratedDate, 1000)}
                        </label>
                    </li>
                </ul>
            </div>
            {/* Description job */}
            <div className='description-job'>
                <h6>MÔ TẢ CÔNG VIỆC</h6>
                {list_des &&
                    list_des !== [] ?
                    list_des.map(
                        (item: any) => (<p key={item.index}>
                            {item.value[0] === '+' || item.value[0] === '\n' ||
                                item.value[0] === '-' || item.value[0] === '=' ? "" : '-'}
                            {item.value}</p>)) :
                    <p>Vui lòng liên hệ chi tiết với nhà tuyển dụng</p>
                }
            </div>
            {/* Time */}
            <div className='time-job b_t'>
                <h6>CA LÀM VIỆC</h6>
                <div>
                    {
                        jobDetail &&
                        jobDetail.shifts &&
                        jobDetail.shifts.map((item: any, index: number) => {
                            let maxSalary = '' + item.maxSalary && item.maxSalary === 0 ? '' : ('-' + item.maxSalary);
                            return (<div key={index} className='time-content b_b'>
                                <p>
                                    <label> Ca số {index + 1} </label>
                                </p>
                                <p>
                                    <Icon type="clock-circle"
                                        style={{ color: 'blue' }} />{' ' + item.startTime + '-' + item.endTime}
                                </p>
                                <p>
                                    <Icon type="dollar" style={{ color: 'rgb(224, 224, 34)' }} />
                                    {item.minSalary ? (
                                        <span>{' ' + item.minSalary ? item.minSalary : maxSalary + '/' + item.unit}  </span>) : " Thỏa thuận"}
                                </p>
                                <div className='week-day'>
                                    {weekDays.map((itemWeek, index) => {
                                        if (item[itemWeek] === true) {
                                            let day = 'T' + (index + 2);
                                            if (index === 6) {
                                                day = 'CN'
                                            }

                                            return (<label key={index} className='time-span'>
                                                {day}
                                            </label>)
                                        }
                                        return ''
                                    })}
                                </div>
                            </div>)
                        })
                    }
                </div>
            </div>
            {/* Skills job */}
            <div className='skills-job-detail '>
                <h6>KỸ NĂNG CÔNG VIỆC</h6>
                <div>
                    {jobDetail &&
                        jobDetail.requiredSkills &&
                        jobDetail.requiredSkills.length > 0 &&
                        requireSkill &&
                        requireSkill.length > 0 ?
                        requireSkill.map(
                            (item: any, index: number) => (
                                <label key={index} className='skills-detail'>{item.name}</label>
                            )) : <p>Ứng viên không cần đòi hỏi chuyên môn</p>
                    }
                </div>
            </div>
        </div>
    )
}