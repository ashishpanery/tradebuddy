import { Header, Footer } from "../components"
export default function HandleInvalidRoute() {
    return <>
        <Header />
        <div className="d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
            <main className="p-2 fs-5 pt-5 mt-5 text-center">
                URL does not exist. Please make sure you typed the correct URL.
            </main>
            <Footer />

        </div>
    </>

}

