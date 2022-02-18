import { CSVLink } from 'react-csv';

export default function DownloadCSV({ filename, CSVData }) {
    const csvObject = {
        filename: filename,
        data: CSVData
    }
    return <div className="col-12 col-md-5" style={{ maxWidth: "15em" }}>
        <div className="admin_action_btn download_btn card w-100">
            <CSVLink asyncOnClick={true}
                style={{ textDecoration: "none", color: "white" }} {...csvObject}>Download CSV</CSVLink>
        </div>
    </div>
}