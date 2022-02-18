import "./RegisteredEvents.css"
import { connect } from 'react-redux'
import UpcomingEventCard from '../UpcomingEventCards/UpcomingEventCard'

function RegisteredEvents({ events }) {
    return (
        <>
            <div className="container" >
                {
                    events && events.length > 0 ?
                        <div className="row py-4">
                            {events.map((event, index) => {
                                return <UpcomingEventCard key={index} eventDetails={event.eventObjec} click={true} />
                            })}
                        </div>
                        :
                        <div className="row py-4 text-center">
                            <h3>You have not registered to an event yet.</h3>
                        </div>
                }
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(RegisteredEvents)