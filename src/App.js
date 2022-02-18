import "./App.css";
import { connect } from "react-redux"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  PublicProfile,
  VerifyAccount,
} from "./components";
import {
  AboutUs,
  LandingPage,
  MentorPage,
  // MenteeTimeSlotPage,
  LoginPage,
  ConfirmPay,
  Sessions,
  MenteeProfile,
  JoinCall,
  PaymentWindow,
  EventPage,
  PrivacyPolicy,
  TermsAndConditions,
  ReviewPage,
  ContactUs,
  MyEvents,
  Events,
  Services,
  Consult,
  CareerAdvice,
  SynkUp,
  MockInterview,
  ResumeReview,
  MeetUps,
  RefundsAndCancellation,
  MentorApplicationForm,
  Success,
  Dashboard,
  TimeSlot,
  EditPersonalEvent,
  Registrations,
  EventSuccess,
  MentorSessions,
  Portal,
  MentorLandingPage,
  ResetPassword,
  // MentorAppFormSuccess,
  Orders,
  Bootcamp,
  BootCampPage,
  HandleInvalidRoute,
  MyCourses,
  EditPersonalCourse,
  CourseSuccess,
  Courses,
  CoursePage,
  CourseLecture,
  CourseSubscriptions,
  MentorDatatable,
  EventDatatable,
  MenteeDatatable,
  SessionDatatable,
  OrderDatatable,
  CourseDatatable,
  CourseRegistrationDatatable,
  QueryDatatable,
  BootcampRegistrationDatatable
} from "./pages";

function App({ currentUser }) {
  return (
    <Router>
      <Switch>
        <Route path='/my-events'>
          <MyEvents />
        </Route>
        <Route path='/about-us'>
          <AboutUs />
        </Route>
        <Route path='/contact-us'>
          <ContactUs />
        </Route>
        <Route path='/review-page/:mentorId'>
          <ReviewPage />
        </Route>
        <Route path='/terms-of-use'>
          <TermsAndConditions />
        </Route>
        <Route path='/events/:id/:title'>
          <EventPage />
        </Route>
        <Route path='/events'>
          <Events />
        </Route>
        <Route path='/join-call/:mentorId'>
          <JoinCall />
        </Route>
        <Route path='/payment-window'>
          <PaymentWindow />
        </Route>
        <Route path='/profile/:id'>
          <MenteeProfile />
        </Route>

        <Route path='/profile/:id/:name'>
          <MenteeProfile />
        </Route>
        <Route path="/confirm-pay/:id/:date/:time">
          <ConfirmPay />
        </Route>
        {/* <Route path="/mentee-timeslot/:id">
          <MenteeTimeSlotPage />
        </Route> */}
        <Route path="/sessions">
          <Sessions />
        </Route>
        {/* <Route path='/mentorAppFormSuccess'>
          <MentorAppFormSuccess />
        </Route> */}
        <Route path="/mentor-list">
          <MentorPage />
        </Route>
        <Route exact path="/become-mentor">
          <MentorLandingPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path='/privacy-policy'>
          <PrivacyPolicy />
        </Route>
        <Route path="/success">
          <Success />
        </Route>
        <Route path='/consult'>
          <Consult />
        </Route>
        <Route exact path='/services'>
          <Services />
        </Route>
        <Route path='/synk-up'>
          <SynkUp />
        </Route>
        <Route path='/career-advice'>
          <CareerAdvice />
        </Route>
        <Route path='/mock-interviews'>
          <MockInterview />
        </Route>
        <Route path='/resume-review'>
          <ResumeReview />
        </Route>
        <Route path='/meet-ups'>
          <MeetUps />
        </Route>
        <Route path="/become-mentor/register_application_form">
          <MentorApplicationForm />
        </Route>
        <Route path='/cancellation-&-refunds'>
          <RefundsAndCancellation />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/timeslot">
          <TimeSlot />
        </Route>
        <Route path="/edit_personal_event/:eventID">
          <EditPersonalEvent />
        </Route>
        <Route path="/edit_personal_course/:courseID">
          <EditPersonalCourse />
        </Route>
        <Route path="/registrations/:eventID">
          <Registrations />
        </Route>
        <Route path="/subscriptions/:courseID">
          <CourseSubscriptions />
        </Route>
        <Route path="/registrant/:id">
          <PublicProfile />
        </Route>
        <Route path="/mentor_sessions">
          <MentorSessions />
        </Route>
        <Route path="/event_success/:msg">
          <EventSuccess />
        </Route>
        <Route path="/course_success/:msg">
          <CourseSuccess />
        </Route>
        <Route path="/portal">
          <Portal />
        </Route>
        <Route path="/mentor_datatable">
          <MentorDatatable />
        </Route>
        <Route path="/mentee_datatable">
          <MenteeDatatable />
        </Route>
        <Route path="/event_datatable">
          <EventDatatable />
        </Route>
        <Route path="/session_datatable">
          <SessionDatatable />
        </Route>
        <Route path="/order_datatable">
          <OrderDatatable />
        </Route>
        <Route exact path="/course_datatable">
          <CourseDatatable />
        </Route>
        <Route exact path="/courseList_datatable">
          <CourseRegistrationDatatable />
        </Route>
        <Route exact path="/registeredBootcampList_datatable">
          <BootcampRegistrationDatatable />
        </Route>
        <Route path="/query_datatable">
          <QueryDatatable />
        </Route>
        <Route path="/reset-password/verify">
          <ResetPassword />
        </Route>
        <Route path="/verifyemail/:code">
          <VerifyAccount />
        </Route>
        <Route path="/" exact>
          <LandingPage />
        </Route>
        <Route path="/orders" >
          <Orders />
        </Route>
        <Route path="/services/bootcamp/:param" >
          <BootCampPage />
        </Route>
        <Route path="/services/bootcamp" >
          <Bootcamp />
        </Route>
        <Route exact path="/courses" >
          <Courses />
        </Route>
        <Route exact path="/courses/:course_ID/:lec_index/:LecTitle" >
          <CourseLecture />
        </Route>
        <Route exact path="/courses/:course_ID/:courseTitle" >
          <CoursePage />
        </Route>
        <Route path="/my-courses" >
          <MyCourses />
        </Route>
        <Route path="*">
          <HandleInvalidRoute />
        </Route>
      </Switch>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(App)
