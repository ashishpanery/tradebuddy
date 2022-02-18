import React, { useState, useRef, useEffect } from 'react'
import './MenteeProfileTab.css'
import officeBag from '../../images/officeBag.png'
import location from '../../images/location.png'
import pencil from '../../images/Pencil Icon.png'
import axios from 'axios'
import { connect } from 'react-redux'
import { updatePhoto } from '../../react-redux/reducers/allActions'
import { useParams } from 'react-router-dom'

function MenteeProfileTab({ menteeProfileData: info, showForm, currentUser, setMenteeProfileData, updatePhoto, edit = true, showOnlyImage = false, isPublic = false }) {
    console.log({ info })
    const [imageLink, setImageLink] = useState(info.photoUrl)
    const [openImgFailedBox, setOpenImgFailedBox] = useState(false)
    const inputFile = useRef(null)
    const { id } = useParams()

    useEffect(() => {
        const fileRef = document.getElementById("menteeImageUploader")
        fileRef.addEventListener("change", async () => {
            const imgLink = await uploadFile(fileRef.files[0]).catch(err => console.log(err))
            if (imgLink) {
                setImageLink(imgLink)
                updatePic(imgLink)
            }
            else (setOpenImgFailedBox(true))
        })
    }, [])

    const updatePic = async (imgLink) => {
        var profilePhotoLink = imgLink;
        console.log("PROFILE", profilePhotoLink)
        const reqObj = { ...info, photoUrl: profilePhotoLink }
        return await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
            ...reqObj
        }, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        })
            .then((updatedProfile) => {
                console.log("updated data ", updatedProfile.data)
                setMenteeProfileData(updatedProfile.data.model)
                updatePhoto(updatedProfile.data.model.photoUrl)
                console.log("PHOTO UPDATED CHECK")
            }).catch((err) => {
                if (err.response) {
                    console.log(err.response)
                }
            })

    }

    const onButtonClick = () => {
        inputFile.current.click();
    };
    const uploadFile = async (file) => {
        let formData = new FormData()
        formData.append("file", file)
        return await axios.post(`${process.env.REACT_APP_UPLOAD_IMAGE}`, formData,
            {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`,
                    'Content-Type': "multipart/form-data;"
                }
            }
        )
            .then(resp => { return resp.data.model.link }).catch(err => console.log(err.message))
    }

    const openEditForm = () => {
        showForm(true)
    }
    const showCamera = () => {
        // if (!id === currentUser.data.id) return
        document.getElementById("uploaderImg").style.display = "inline"
    }
    const hideCamera = () => {
        // if (!id === currentUser.data.id) return
        document.getElementById("uploaderImg").style.display = "none"

    }
    return (
        <>
            {
                showOnlyImage === true
                    ?
                    <div className='menteeProfileTab new_menteeProfileTab position-relative ' >
                        <div className='menteeProfileImage new_menteeProfileImage w-75' >
                            <img className="img_small " src={info.photoUrl} alt='' onMouseEnter={showCamera} onMouseLeave={hideCamera} />
                            {
                                <>
                                    <div id="uploaderImg" style={{ visibility: isPublic === true ? "hidden" : "visible" }} onMouseEnter={showCamera} onMouseLeave={hideCamera}>
                                        <input id="menteeImageUploader" type='file' ref={inputFile} accept="image/*" style={{ display: 'none' }} />
                                        <div className="cursor-pointer profilePicUploadIcon" onClick={onButtonClick}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                                                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                            </svg> </div>
                                    </div>
                                </>
                            }
                            {openImgFailedBox ? <>
                                <div className="alert alert-danger alert-dismissible fade show my-0" role="alert">
                                    <h6 className="my-0">Failed to upload image</h6>
                                    <button onClick={() => setOpenImgFailedBox(false)} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </> : null}
                            <h4 className="pt-3">{info.name}</h4>
                            <p className="fs-6">{info.designation}</p>
                            {/* {
                                isPublic === false ?
                                    <p className="pb-5">Pick a photo from your computer</p>
                                    : null
                            } */}
                        </div>
                    </div>
                    :

                    <>
                        <div className='menteeProfileTab'>
                            <div className='menteeProfileImage' onMouseEnter={showCamera} onMouseLeave={hideCamera}>
                                {/* <img src={imageLink ? imageLink : info.photoUrl} alt='' /> */}
                                <img src={info.photoUrl} alt='' />
                                {
                                    <>
                                        <div id="uploaderImg" style={{ visibility: `${id === currentUser.data.id ? 'visible' : 'hidden'}` }}>
                                            <input id="menteeImageUploader" type='file' ref={inputFile} accept="image/*" style={{ display: 'none' }} />
                                            <div id="" style={{ background: `url(${imageLink ? imageLink : `transparent`})` }} className="text-white py-5 text-center h4 cursor-pointer" onClick={onButtonClick}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                                                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                                </svg> </div>
                                        </div>
                                    </>
                                }
                                {openImgFailedBox ? <>
                                    <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                                        <h6>Failed to upload image</h6>
                                        <button onClick={() => setOpenImgFailedBox(false)} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                </> : null}
                            </div>
                            <div className='menteeProfileTabDetails'>
                                <div className='menteeProfileTabDetailsInfo'>
                                    <h2>{info.name}</h2>
                                    <h3>{info.designation}</h3>
                                    <h3>{info.currentCompany}</h3>
                                </div>
                                <div className='menteeProfileTabCompanyAndPlace'>
                                    <div className='companyLogo'>
                                        <img src={officeBag} alt='' />
                                        <p className="w-50">{info.currentCompany}</p>
                                    </div>
                                    <div className='placeLogo'>
                                        <img src={location} alt='' />
                                        <p className="w-50">{info.city},{info.state},{info.country}</p>
                                    </div>
                                </div>
                            </div>
                            {
                                edit &&
                                <img className='menteeProfileTabPencil' src={pencil} alt='' onClick={openEditForm} />
                            }
                        </div>
                    </>
            }

        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
const mapDispatchToProps = (dispatch) => ({
    updatePhoto: (photo) => dispatch(updatePhoto(photo))
})
export default connect(mapStateToProps, mapDispatchToProps)(MenteeProfileTab)
