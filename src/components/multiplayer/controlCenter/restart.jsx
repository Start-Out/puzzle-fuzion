import * as exports from "../../../exports.js"

export default function Restart( {toggle} ) {
    const handleOK = () => {
        toggle()
    }

    const handleCancel = () => {
        toggle()
    }

    const alertText = "Are you sure you want to restart? You'll lose the current game progress"

    return (
        <exports.ConfirmAlert text={alertText} toggle={toggle} onOk={handleOK} onCancel={handleCancel}/>
    )
}