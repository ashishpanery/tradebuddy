import React, { useEffect, useState } from 'react'
import './MenteeProfileForm.css'
import { FaWindowClose } from "react-icons/fa";
import axios from 'axios';
import { connect } from 'react-redux';
import Select from "react-select"
import UploadImage from '../UploadImage/UploadImage';


function MenteeProfileForm5({ closeForm, menteeProfileData, updateData, currentUser }) {
    const [paymentMode, setPaymentMode] = useState('')
    const [name, setName] = useState('')
    const [accNumber, setAccNumber] = useState('')
    const [IFSCCode, setIFSCCode] = useState('')
    const [panNumber, setPanNumber] = useState('')
    const [panImageUrl, setPanImageUrl] = useState('')

    let defaultValue
    if (menteeProfileData.paymentProfile) {
        if (menteeProfileData.paymentProfile.paymentMode)
            defaultValue = { value: menteeProfileData.paymentProfile.paymentMode, label: menteeProfileData.paymentProfile.paymentMode }
    }

    useEffect(() => {
        if (menteeProfileData.paymentProfile) {
            if (menteeProfileData.paymentProfile.paymentMode)
                setPaymentMode({ value: menteeProfileData.paymentProfile.paymentMode, label: menteeProfileData.paymentProfile.paymentMode })
        }
    }, [])

    const savePaymentDetails = async () => {
        var temp = {}
        temp.accountHolderFullName = name
        temp.accountNumber = accNumber
        temp.ifscCode = IFSCCode
        temp.panCard = panNumber
        temp.panPhotoUrl = panImageUrl
        temp.paymentMode = paymentMode.value
        const reqObj = { ...menteeProfileData, paymentProfile: temp }

        await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
            ...reqObj

        }, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        }).then((response => {
            console.log("Adding Successful in Form 5", response)
            updateData(response.data.model)
            closeForm(false)
        }))

    }

    useEffect(() => {
        if (menteeProfileData.paymentProfile) {
            var data = menteeProfileData.paymentProfile
            setName(data.accountHolderFullName)
            setAccNumber(data.accountNumber)
            setIFSCCode(data.ifscCode)
            setPanNumber(data.panCard)
            setPanImageUrl(data.panPhotoUrl)
        }
    }, [])

    const options = [
        { value: "Donate My Payments", label: "Donate My Payments" },
        { value: "Bank Account Transfer", label: "Bank Account Transfer" },
        { value: "No Payment", label: "No Payment" }
    ]



    return (
        <div className='menteeProfileFormBackground container-fluid'>
            <div className='menteeProfileForm container'>
                <h2 className="mb-4 fs-2 w-75">Fill in your payment details here:</h2>
                <div className="d-flex justify-content-center">
                    {
                        menteeProfileData.paymentProfile ?
                            <UploadImage
                                photoID="panImageID"
                                uploadBtnID="panPhotoBtnID"
                                width="200px"
                                height='200px'
                                imageText={`${menteeProfileData.paymentProfile.panPhotoUrl ? '' : 'Upload Pan Photo'}`}
                                value={panImageUrl}
                                setOnChange={setPanImageUrl}
                            />
                            :
                            <UploadImage
                                photoID={"panImageID"}
                                uploadBtnID="panPhotoBtnID"
                                imageText='Upload PAN Photo'
                                value={panImageUrl}
                                setOnChange={setPanImageUrl}
                                width="200px"
                                height='200px'
                            />
                    }

                </div>
                <div className='mb-3 menteeProfileFormInput'>
                    <label htmlFor="name" className="text-capitalize">Account holder's full name:</label>
                    <input type="text" placeholder="Your Name here" id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className='mb-3 menteeProfileFormInput'>
                    <label className="text-capitalize" htmlFor="account_number">Account number:</label>
                    <input type="text" placeholder="Your Account Number here" id="account_number" value={accNumber} onChange={e => setAccNumber(e.target.value)} />
                </div>
                <div className='mb-3 menteeProfileFormInput'>
                    <label className="text-capitalize" htmlFor="ifsc_code">IFSC Code:</label>
                    <input type="text" placeholder="Your IFSC code here" id="ifsc_code" value={IFSCCode} onChange={e => setIFSCCode(e.target.value)} />
                </div>
                <div className='mb-3 menteeProfileFormInput'>
                    <label className="text-capitalize" htmlFor="pan_number">PAN number:</label>
                    <input type="text" placeholder="Your PAN number here" id="pan_number" value={panNumber} onChange={e => setPanNumber(e.target.value)} />
                </div>
                <div className='mb-3 menteeProfileFormInput'>
                    <label htmlFor="name">Preferred Payment Mode:</label>
                    <Select
                        options={options}
                        defaultValue={defaultValue}
                        onChange={setPaymentMode}
                        classNamePrefix="react_select_companyList"
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: 'rgba(46,175,180,.6)',
                                primary: `var(--mentor_theme)`,
                            },
                        })}
                    />
                </div>
                <div className="text-center pt-2">
                    <button className="btn " onClick={savePaymentDetails}>Save Details</button>
                </div>
                <FaWindowClose className='menteeProfileFormCloseIcon' onClick={() => {
                    closeForm(false)
                }} />
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})
export default connect(mapStateToProps)(MenteeProfileForm5)