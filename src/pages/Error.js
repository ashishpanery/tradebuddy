import crash from "../images/crash.png"
import { Header, Footer } from "../components"
export default function Error() {
    return (
        <>
            <header>
                <Header />
            </header>
            <div className="text-center pt-5 mt-5">
                <img src={crash} alt="crash" style={{ maxWidth: "15em", minWidth: "10em" }} />
                <p className="fs-5 text-center p-3" style={{ minHeight: "100vh" }} >We crashed!... Try visiting us again in sometime.</p>
            </div>
            <Footer />
        </>

    )
}
