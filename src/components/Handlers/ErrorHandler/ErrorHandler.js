import React from 'react'
import useRedirect from '../../Redirect/Redirect';

const useHandleError = (location) => {
    // const [message, setMessage]=useState('')
    const redirectWithLogin = useRedirect(location)
    const handleError = (code, message = "page") => {
        switch (code) {
            case 400:
                return <div className='d-flex flex-column align-items-center'>
                    <p className="fs-5">{code}</p>
                    <div className='d-flex flex-column '>
                        <p className='fs-6'>Possible causes:</p>
                        <p className="fs-6">- You entered an incorrect value in a form.</p>
                        <p className="fs-6">- Bad Request on our side (in this case please contact support).</p>
                    </div>
                </div>
            case 401:
                redirectWithLogin()
                break
            case 403:
                return <div className='text-center'>
                    <p className="fs-5">{code}</p>
                    <p className="fs-6">You are not authorized to access this page.</p>
                </div>
            case 404:
                return <div className='text-center'>
                    <p className="fs-5">{code}</p>
                    <p className="fs-6">This {message} does not exist.</p>
                </div>
            case 405:
                return <div className='text-center'>
                    <p className="fs-5">{code}</p>
                    <p className="fs-6">Incorrect method was used. Please report this page on support.</p>
                </div>
            case 409:
                return <div className='text-center'>
                    <p className="fs-5">{code}</p>
                    <p className="fs-6">Error occurred on server side.</p>
                </div>
            case 415:
                return <div className='text-center'>
                    <p className="fs-5">{code}</p>
                    <p className="fs-6">Wrong payload format was sent to server. Please contact support.</p>
                </div>
            case 500:
                return <div className='text-center'>
                    <p className="fs-5">{code}</p>
                    <p className="fs-6">Error occurred on server side.</p>
                </div>
            case 503:
                return <div className='text-center'>
                    <p className="fs-5">503</p>
                    <p className="fs-6">Server is not avaiable at the moment. Please try later.</p>
                </div>
            default: return <div className='text-center'>
                {/* <p className="fs-5">{code}</p> */}
                <p className="fs-6">{message}</p>
            </div>
        }


    }
    return { handleError }
}

export default useHandleError

/*
400 Bad Request: This is generally an input error, the most common instance being invalid user input (such as a malformed email address).
401 Unauthorized: Use this error code when a user is either trying to access something without being logged in, or trying to access something they shouldn't (such as another user's data or admin functionality).
403 Forbidden: The difference between this and 400 can be subtle, but a 403 error generally means that the server understood the request (it's not an input error) but will not fulfill it. An example of this might be the entry of an expired coupon code.
404 Not Found: The most well-known of all the error codes, this simply means that the requested resource could not be found (either because of a malformed URL or a deleted or moved resource).
409 Conflict: While mostly meant to refer to versioning conflicts (two users trying to write to the same resource), this can also be used to indicate uniqueness constraints (e.g. "email has already been taken").
500 Internal Server Error: This is the generic "something has gone wrong, but we don't know what error." It's the catch-all.
503 Unavailable: The server is experiencing an outage, either planned or unplanned.
 */
