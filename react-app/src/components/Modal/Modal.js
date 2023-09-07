import "./Modal.css"


function Modal(props) {

    return(
        <div className={`modal ${props.show?'show':''}`} onClick={props.onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <p id="editlist1">Edit List</p>
                    <h4 className="modal-title">{props.title}</h4>
                    <svg className="xbutton" onClick={props.onClose} fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.4143 12L19.7072 5.70706L18.293 4.29285L12.0001
                        10.5857L5.70718 4.29285L4.29297 5.70706L10.5859 12L4.29297
                        18.2928L5.70718 19.7071L12.0001 13.4142L18.293 19.7071L19.7072
                        18.2928L13.4143 12Z" fill="black"></path></svg>
                </div>
                <div className="modal-form">
                    <div className="modal-body">
                        {props.children}
                    </div>
                    <div className="modal-footer">


                    </div>

                </div>
            </div>
        </div>

    )
}

export default Modal
