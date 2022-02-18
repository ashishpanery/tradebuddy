const fetchTableBody = (type, dataList, updateData, updateDataStatus) => {
    switch (type) {
        case "mentor":
            // 
            return <tbody>
                {
                    dataList.map((mentor, index) => {
                        const { id, name, phoneNumber, emailAddress, currentCompany, designation, totalExperienceYears, linkedinProfile, status } = mentor
                        return <tr key={id} id={`mentorRow${index}`}>
                            <td>{name ? <a style={{ color: "black" }} target="_blank" rel="noreferrer" href={`/profile/${id}/${name.split(" ").join("-")}`}>{name}</a> : "-"}</td>
                            <td>{emailAddress ? emailAddress : "-"}</td>
                            <td>{phoneNumber ? phoneNumber : "-"}</td>
                            <td>{currentCompany ? currentCompany : "-"}</td>
                            <td>{designation ? designation : "-"}</td>
                            <td className='text-center'>{totalExperienceYears ? totalExperienceYears : "-"}</td>
                            <td>{linkedinProfile ? <a href={linkedinProfile}>Link</a> : "-"}</td>
                            <td id={`${id}${index}`} className={`text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`}>
                                {status}
                            </td>
                            <td>
                                <div>
                                    <button id={`APPROVED${index}`} onClick={(e) => updateData("approve", mentor, e, index, status)} className={`admin_action_btn btn-outline-success  me-auto ${status === "APPROVED" ? 'invisible' : null}`}>Approve</button>
                                    <button id={`DELETED${index}`} onClick={(e) => updateData("delete", mentor, e, index, status)} className="admin_action_btn btn-outline-danger  mx-2 text-center">Delete</button>
                                    <button id={`DECLINED${index}`} onClick={(e) => updateData("decline", mentor, e, index, status)} className={`admin_action_btn btn-outline-dark  ms-auto ${status === "DECLINED" ? "invisible" : null}`} >Decline</button>
                                </div>
                            </td>
                        </tr>
                    })}
            </tbody>
        // 
        case "mentee":
            return <tbody>
                {
                    dataList.map((mentee, index) => {
                        if (mentee === null) {
                            return <h1>No data avaiable</h1>
                        }
                        const { id,
                            name,
                            phoneNumber,
                            currentCompany,
                            designation,
                            totalExperienceYears,
                            linkedinProfile,
                            emailAddress
                        } = mentee
                        return <tr key={id} id={`menteeRow${index}`}>
                            <td>{name ? <a style={{ color: "black" }} href={`/profile/${id}/${name.split(' ').join("-")}`}>{name}</a> : "-"}</td>
                            <td>{emailAddress ? emailAddress : "-"}</td>
                            <td>{phoneNumber ? phoneNumber : "-"}</td>
                            <td>{currentCompany ? currentCompany : "-"}</td>
                            <td>{designation ? designation : "-"}</td>
                            <td className='text-center'>{totalExperienceYears ? totalExperienceYears : "-"}</td>
                            <td>{linkedinProfile ? <a href={linkedinProfile}>Link</a> : "-"}</td>
                            {/* <button id={`DELETED${index}`} onClick={() => deleteMentee(mentee, index)} className="admin_action_btn btn-outline-danger  mx-2 text-center">Delete</button> */}
                            <button id={`DELETED${index}`} onClick={(e) => updateData(mentee, index)} className="admin_action_btn btn-outline-danger py-2 mt-2 text-center">Delete</button>

                        </tr>
                    })
                }
            </tbody>
        case "event":
            return <tbody>{
                dataList.map((event, index) => {
                    const { id, eventTitle, lectureList, status } = event
                    return <tr key={id} id={`eventRow${index}`}>
                        <td>{eventTitle ? eventTitle : "-"}</td>
                        <td className='text-center'>{lectureList.length}</td>
                        <td className={`cursor-pointer text-blue`} onClick={() => window.location.assign(`/events/${id}/${eventTitle.split(" ").join("-")}`)}>Open Event Details</td>
                        <td className={`cursor-pointer text-blue`} onClick={() => window.location.assign(`/edit_personal_event/${id}`)}>Modify</td>
                        <td id={`${id}${index}`} className={`text-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`}>{status}</td>
                        <td>
                            <div>
                                <div>
                                    <button id={`APPROVED${index}`} onClick={(e) => updateData("approve", event, e, index, status)} className={`admin_action_btn btn-outline-success  me-auto ${status === "APPROVED" ? 'invisible' : null}`}>Approve</button>
                                    {/* <button id={`DELETED${index}`} onClick={(e) => updateEvent("delete", event, e, index, status)} className="admin_action_btn btn-outline-danger  mx-2 text-center">Delete</button> */}
                                    <button id={`DECLINED${index}`} onClick={(e) => updateData("decline", event, e, index, status)} className={`admin_action_btn btn-outline-dark  ms-auto ${status === "DECLINED" ? "invisible" : null}`} >Decline</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                })
            }
            </tbody>
        case "session":
            return <tbody>
                {
                    dataList.map((session, index) => {
                        if (session === null) {
                            return <h1>No data avaiable</h1>
                        }
                        const { id: session_id, startTime, status, sessionAmout, mentorId, menteeId } = session
                        return <tr>
                            <td>{session_id ? session_id : '-'}</td>
                            <td className='cursor-pointer' onClick={() => window.location.assign(`/profile/${mentorId}`)}>{mentorId ? mentorId : '-'}</td>
                            <td className='cursor-pointer' onClick={() => window.location.assign(`/profile/${menteeId}`)}>{menteeId ? menteeId : '-'}</td>
                            <td>{startTime ? startTime : '-'}</td>
                            <td id={`${session_id}${index}`}
                                className={
                                    `text-${status === "REQUEST_PENDING" ?
                                        'warning'
                                        :
                                        status === "ACCEPTED" ?
                                            'success'
                                            :
                                            status === "STARTED" ?
                                                'info'
                                                :
                                                status === "COMPLETED" ?
                                                    'success'
                                                    :
                                                    'danger'
                                    }`
                                }>
                                {status ? status : '-'}

                            </td>
                            <td className='text-center'>{sessionAmout ? sessionAmout : "0"}</td>
                            <td>
                                <div className='d-flex gap-2'>
                                    <button id={`REQUEST_PENDING${index}`} onClick={(e) => updateDataStatus("REQUEST_PENDING", session_id, e, index, status)} className={`admin_action_btn btn-outline-warning   ${status === "REQUEST_PENDING" ? 'invisible' : null}`}>Pend</button>
                                    <button id={`ACCEPTED${index}`} onClick={(e) => updateDataStatus("ACCEPTED", session_id, e, index, status)} className={`admin_action_btn btn-outline-success ${status === "ACCEPTED" && "invisible"}`} >Accept</button>
                                    <button id={`STARTED${index}`} onClick={(e) => updateDataStatus("STARTED", session_id, e, index, status)} className={`admin_action_btn btn-outline-info ${status === "STARTED" && "invisible"}`} >Start</button>
                                    <button id={`COMPLETED${index}`} onClick={(e) => updateDataStatus("COMPLETED", session_id, e, index, status)} className={`admin_action_btn btn-outline-success ${status === "COMPLETED" && "invisible"}`} >Complete</button>
                                    <button id={`CANCELLED${index}`} onClick={(e) => updateDataStatus("CANCELLED", session_id, e, index, status)} className={`admin_action_btn btn-outline-danger ${status === "CANCELLED" && "invisible"}`} >Cancel</button>
                                </div>
                            </td>
                        </tr>
                    })
                }

            </tbody>
        case "order":
            return <tbody>
                {
                    dataList.length > 0 ?
                        dataList.map(order => {
                            const { orderId, menteeId, orderType, amount, date, status } = order
                            return <tr>
                                <td>{orderId}</td>
                                <td className='cursor-pointer' onClick={() => window.location.assign(`/profile/${menteeId}`)}>{menteeId}</td>
                                <td>{orderType}</td>
                                <td className='text-center'>{amount}</td>
                                <td>{date ? date : '-'}</td>
                                <td className={`fw-bold ${status === "SUCCESS" ? 'text-success' : 'text-danger'}`}>{status}</td>
                            </tr>

                        })
                        :
                        <p className='pt-2'>Order list is empty</p>
                }

            </tbody>
        case "course":
            return <tbody>
                {
                    dataList.map((course, index) => {
                        const { id, mentorId, title, lectureList, free, fee, status } = course
                        return <tr>
                            <td className='cursor-pointer' onClick={() => window.location.assign(`/profile/${mentorId}`)}>{mentorId}</td>
                            <td className='cursor-pointer' onClick={() => window.location.assign(`/courses/${id}/${title.split(" ").join("-")}`)}>{title ? title : "-"}</td>
                            <td className='text-center'>{lectureList ? lectureList.length : "-"}</td>
                            <td className='text-center'>{free ? "Yes" : "No"}</td>
                            <td className='text-center'>{free ? "NA" : fee}</td>
                            <td id={`${id}${index}`} className={`${status === "PENDING" ? 'text-warning' : status === "APPROVED" && "text-success"}`} >{status}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button id={`APPROVED${index}`} onClick={(e) => updateData("approve", course, e, index, status)} className={`btn btn-outline-success p-2  ${status === "APPROVED" ? 'invisible' : null}`}>Approve</button>
                                    <button id={`DECLINED${index}`} onClick={(e) => updateData("decline", course, e, index, status)} className={`btn btn-outline-dark p-2 ${status === "DECLINED" ? "invisible" : null}`} >Decline</button>
                                </div>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        case "courseRegistration":
            return <tbody>
                {
                    dataList.map((course, index) => {
                        const { menteeId, menteeName, menteeEmail, contentType, orderDate, amount, paymentStatus } = course
                        return <tr>
                            <td className='cursor-pointer' onClick={() => window.location.assign(`/profile/${menteeId}`)}>{menteeName ? menteeName : "-"}</td>
                            <td>{menteeEmail ? menteeEmail : "-"}</td>
                            <td >{contentType}</td>
                            <td >{orderDate ? orderDate : '-'}</td>
                            <td className='text-center' >{amount}</td>
                            <td className={`${paymentStatus === "PAYMENT_PENDING" ? 'text-warning' : paymentStatus === "PAYMENT_SUCCESS" ? "text-success" : "text-danger"}`} >{paymentStatus}</td>
                            {/* <td><label id={id} className={`badge badge-outline-${status === `APPROVED` ? 'success' : status === 'DECLINED' ? 'dark' : 'warning'}`}>{status}</label></td> */}
                        </tr>
                    })
                }
            </tbody>
        case "query":
            return <tbody>
                {
                    dataList.map((query, index) => {
                        const { id, name, mobile, email, message, status } = query
                        return <tr>
                            <td>{name ? <a style={{ color: "black" }} target="_blank" rel="noreferrer" href={`/profile/${id}`}>{name}</a> : "-"}</td>
                            <td>{email ? email : "-"}</td>
                            <td>{mobile ? mobile : "-"}</td>
                            <td>{message}</td>
                            <td id={`${id}${index}`} className={`text-${status === `CLOSED` ? 'success' : 'warning'}`}>{status}
                            </td>
                            <td>
                                <div className='d-flex gap-2'>
                                    <button id={`OPEN${index}`} onClick={(e) => updateData("OPEN", query, e, index)} className={`admin_action_btn btn-outline-warning ${status === "OPEN" ? 'invisible' : null}`}>Re-open</button>
                                    <button id={`CLOSED${index}`} onClick={(e) => updateData("CLOSED", query, e, index)} className={`admin_action_btn btn-outline-success  ${status === "CLOSED" ? "invisible" : null}`} >Close</button>
                                </div>
                            </td>
                        </tr>
                    })
                }

            </tbody>
        case "bootcampRegistration":
            return <tbody>
                {
                    dataList.map((registeredBootcamp, index) => {
                        const { id, menteeId, menteeName, programId, mobile, email, status } = registeredBootcamp
                        console.log({ registeredBootcamp })
                        return <tr>
                            <td>{programId ? programId : "-"}</td>
                            <td>{menteeName ? <a style={{ color: "black", textDecoration: "none" }} target="_blank" rel="noreferrer" href={`/profile/${menteeId}`}>{menteeName}</a> : "-"}</td>
                            <td>{email ? email : "-"}</td>
                            <td>{mobile ? mobile : "-"}</td>
                            <td id={`${id}${index}`} className={`text-${status === `CLOSED` ? 'success' : status === "IN_TOUCH" ? "dark" : 'warning'} `}>{status}
                            </td>
                            <td>
                                <div className='d-flex gap-2'>
                                    <button id={`OPEN${index}`} onClick={(e) => updateDataStatus("OPEN", id, e, index, status)} className={`admin_action_btn btn-outline-warning ${status === "OPEN" ? 'invisible' : null}`}>Re-open</button>
                                    <button id={`IN_TOUCH${index}`} onClick={(e) => updateDataStatus("IN_TOUCH", id, e, index, status)} className={`admin_action_btn btn-outline-dark ${status === "IN_TOUCH" ? 'invisible' : null}`}>In Touch</button>
                                    <button id={`CLOSED${index}`} onClick={(e) => updateDataStatus("CLOSED", id, e, index, status)} className={`admin_action_btn btn-outline-success  ${status === "CLOSED" ? "invisible" : null}`} >Close</button>
                                </div>
                            </td>
                        </tr>
                    })
                }

            </tbody>

        default: return
    }




}

export default fetchTableBody