import { useSelector } from "react-redux"
import { useState, useRef, useEffect } from 'react'


import { amountFormatter } from "../until/util2"
import styles from './profile.module.css'

const ProfileSection = () => {
    const user = useSelector(state => state.session.user)
    const message = useRef(null)
    const [isModalOn, setIsModalOn] = useState(false)
    const [isModalMessage, setIsModalMessage] = useState(false)
    const [isErrorOccured, setIsErrorOccured] = useState(false)



    let messageTimer = null

    useEffect(() => {
        if(isModalMessage){
            clearTimeout(messageTimer)
            setTimeout(() => {
                message.current.className = `${styles.modalMessage} ${styles.modalMessageOn}`
                messageTimer = setTimeout(closeMessage, 10000)
            })
        }

    }, [isModalMessage, isErrorOccured])

    const closeMessage = () => {
        clearTimeout(messageTimer)
        setIsModalMessage(false)
    }

    return (
        <>

            <div className={styles.mainContainer}>

                <div>
                    <div className={styles.amount}>{amountFormatter(user.totalStock + user.buyingPower)}</div>
                    <div>Total in Tradix</div>
                </div>
            </div>
            {isModalMessage && <div ref={message} className={styles.modalMessage}>
                { isErrorOccured ?
                    <div>
                        <i className="fa-solid fa-circle-check" style={{marginRight: '1rem', color: '#5ac53b'}}></i>
                        Change saved successfully
                    </div>:
                    <div>
                    <i className="fa-solid fa-circle-xmark" style={{marginRight: '1rem', color: '#ec5e2a'}}></i>
                        Something went wrong. Please try again.
                    </div>
                }
                <div className={styles.closeBtn} onClick={() => setIsModalMessage(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </div>
            </div>}
        </>
    )
}

export default ProfileSection
