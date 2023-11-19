function Info() {

    return (
        <div className="toast show position-fixed bottom-0 end-0 p-3 mb-3 me-3" role="alert"> 
            <div className="toast-header bg-warning">
                <div className="mx-auto">
                    <i className="material-symbols-outlined me-1 align-middle">info</i>
                    <strong className="align-middle">IMPORTANT</strong>
                </div>
                {/* <button type='button' className="btn-close" data-bs-dismiss="toast"></button> */}
            </div>
            <div className="toast-body">
                Due to Github Pages Limitations. Live Site is unable to complete <code>axios</code> requests. It is recommended to clone the project and use <code>npm start</code>
            </div>
        </div>
    )
}

export default Info;