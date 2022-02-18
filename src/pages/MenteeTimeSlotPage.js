import React, { useEffect, useState } from "react";
import "./MenteeTimeSlotPage.css";
import blueBackground from "../images/Group 537.png";
import axios from "axios";
// import ProfileTab from "../components/ProfileTab/ProfileTab";
import messageIcon from "../images/messageIcon.png";
import callIcon from "../images/callIcon.png";
import reportIcon from "../images/reportIcon.png";
// import MentorRatingTab from "../components/MentorRatingTab/MentorRatingTab";
import MentorAboutMe from "../components/MentorAboutMe/MentorAboutMe";
import MenteeScheduleAppointment from "../components/MenteeScheduleAppointment/MenteeScheduleAppointment";
import MentorUserRating from "../components/MentorUserRating/MentorUserRating";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import PageLoader from "../components/PageLoader/PageLoader";
function MenteeTimeSlotPage({ currentUser }) {
  const [mentorInfo, setMentorInfo] = useState({});
  const [mentorTimeSlot, setMentorTimeSlot] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [date, setDate] = useState(moment().format("YYYY-MM-D"));
  let { id } = useParams();
  const [componentLoading, setComponentLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setComponentLoading(true)
      if (currentUser) {
        await axios.post(`${process.env.REACT_APP_SAVE_TIMESLOT}`, {
          mentorId: id,
          date: `${date}`
        }, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }).then((response) => {
          setMentorTimeSlot(response.data.model);
        }).catch((err) => {
          console.log(err);
        });
      }
      setComponentLoading(false)
    }
    fetchData()
  }, [date])


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await axios.get(`${process.env.REACT_APP_GET_MENTOR_FOR_EVENTS}/${id}`)
        .then((response) => {
          console.log(response.data.model);
          setMentorInfo(response.data.model);
        })
        .catch((err) => {
          console.log(err);
        });
      await axios
        .post(
          `${process.env.REACT_APP_SAVE_TIMESLOT}`,
          {
            mentorId: id,
            // date:'2021-6-21'
            date: `${date}`,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        )
        .then((response) => {
          console.log("Time Slot", response.data);
          setMentorTimeSlot(response.data.model);
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    };

    if (currentUser !== null) {
      loadData();
    } else {
      history.push(`/login/mentee-timeslot/${id}`);
    }
  }, []);

  if (loading) {
    return <PageLoader />
  } else {
    return (
      <div className="">
        <Header />
        <div className='container' style={{ paddingTop: "7em" }}>
          <div className="menteeTimeSlotPageTop">
            <img src={blueBackground} alt="" />
          </div>
          <div className="">
            <div className="">
              {/* <ProfileTab info={mentorInfo} /> */}
              <div className="menteeTimeSlotPageContainerLeftButtonRows">
                <div className="menteeTimeSlotPageContainerLeftButton">
                  <img src={messageIcon} alt="" />
                  <p>{mentorInfo.chatRatePerMin} k mins</p>
                </div>
                <div className="menteeTimeSlotPageContainerLeftButton">
                  <img src={callIcon} alt="" />
                  <p>{mentorInfo.callRatePerMin} k mins</p>
                </div>
                <div className="menteeTimeSlotPageContainerLeftButton">
                  <img src={reportIcon} alt="" />
                  <p>0 Reports</p>
                </div>
              </div>
            </div>

            <div className="menteeTimeSlotPageContainerRight">
              <MentorAboutMe
                info={mentorInfo.coverLine}
                edit={false}
              />
              <MenteeScheduleAppointment
                mentorTimeSlot={mentorTimeSlot}
                currentDate={date}
                setCurrentDate={setDate}
                componentLoading={componentLoading}
              />
              <div className="row pt-3">
                {mentorInfo.reviews.length !== 0 && (
                  mentorInfo.reviews.map((review, i) => (
                    <div className="col-12 col-lg-6 pb-3 pb-lg-auto">
                      <MentorUserRating name={review.menteeName} profilePhoto={review.menteePhotoUrl} rating={review.rating} review={review.review} key={i} />
                    </div>
                  )))
                }

              </div>
              {/* <MentorUserRating name='Saroj' rating={3} review='Very Good Mentor'/>  */}
            </div>
          </div>
          {/* <MentorRatingTab/> */}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});
export default connect(mapStateToProps)(MenteeTimeSlotPage);
