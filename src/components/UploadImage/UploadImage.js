import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import "./UploadImage.css"
import { updatePhoto } from '../../react-redux/reducers/allActions'
import { connect } from 'react-redux'
import { PaginationLoader } from '../Spinner/Spinner'

function UploadImage({ currentUser, photoID, uploadBtnID, imageText, value, setOnChange, width = '100%', height = 'auto', borderRadius = '0%', isPublic = false }) {
    const [loading, setLoading] = useState(false)
    const inputFile = useRef(null)

    useEffect(() => {
        const fileRef = document.getElementById(uploadBtnID)
        fileRef.addEventListener("change", async () => {
            setLoading(true)
            const imgLink = await uploadFile(fileRef.files[0])
            if (imgLink) {
                setOnChange(imgLink)
                updatePhoto(imgLink)
                setLoading(false)
            }
        })
    }, [])

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
            .then(resp => { return resp.data.model.link }).catch(err => {
                setLoading(false)
                console.log(err)
                // alert(err.message)
                return

            })
    }

    const showCamera = () => {
        let elem = document.getElementById(photoID)
        if (elem)
            elem.style.display = "block"
    }

    const hideCamera = () => {
        let elem = document.getElementById(photoID)
        if (elem)
            elem.style.display = "none"
    }
    return (
        <div className="uploadImage"
            style={{
                background: `${value === '' || value === null ? process.env.REACT_APP_DEFAULT_BANNER_IMG : value}`,
                pointerEvents: (isPublic === true) && "none"
            }}
        >
            <input id={uploadBtnID} type='file' ref={inputFile} accept="image/*" style={{ display: 'none' }} />
            <div onMouseEnter={showCamera} onMouseLeave={hideCamera} style={{
                backgroundImage: `url(${value})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                width: width,
                height: height,
                borderRadius: borderRadius,
                border: `${borderRadius === '50%' ? '5px solid #fff' : ''}`,
                boxShadow: `${borderRadius === '50%' ? '0 4px 4px rgba(0,0,0,0.4)' : 'none'}`,
            }} className={`text-white py-5 d-flex justify-content-center align-items-center cursor-pointer`} onClick={onButtonClick}>
                <span className="me-3 text-black">{imageText}</span>
                {
                    loading ?
                        <PaginationLoader /> :
                        <div style={{ display: "none" }} id={`${photoID}`}>
                            <svg id="" xmlns="http://www.w3.org/2000/svg" width="48" height="48" stroke="black" strokeWidth=".1px" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                            </svg>
                        </div>
                }
            </div>
        </div>
    )

}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
const mapDispatchToProps = (dispatch) => ({
    updatePhoto: (photo) => dispatch(updatePhoto(photo))
})
export default connect(mapStateToProps, mapDispatchToProps)(UploadImage)
