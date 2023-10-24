import './MobileModal.css';
import { useData } from '../Context/DataProvider';
import { useEffect } from 'react';
import UserBox from '../Components/Navigation/UserBox';

function MobileModal() {
    const { isModalOpen, setIsModalOpen,
    modalPosition, mobileModal } = useData();

    useEffect(() => {
        const handleOverlayClick = (e) => {
            if (isModalOpen && e.target.classList.contains('mobile-modal-overlay')) {
                setIsModalOpen(false);
            }
        }

        const handleDocumentClick = (e) => {
            handleOverlayClick(e)
        }

        if (isModalOpen) {
            document.addEventListener('click', handleDocumentClick);
        } else {
            document.removeEventListener('click', handleDocumentClick)
        }

        return () => {
            document.removeEventListener('click', handleOverlayClick);
        }
    }, [isModalOpen, setIsModalOpen])

    function RenderModalContent() {
        switch (mobileModal) {
            case 'userIcon':
                return <UserBox />
            default:
                return null;
        }
    }

    return (
        <div className='mobile-modal-overlay'>
            <div className='mobile-modal-content-box'
            style={modalPosition}>
                <RenderModalContent />
            </div>
        </div>
    )
}

// export const handleModalClicks = (e) => {
    
//     const buttonRect = e.target.getBoundingClient();
//     const position = {
//         top: buttonRect.bottom + 'px',
//         left: buttonRect.left + 'px',
//     }

//     setModalPosition(position)
//     setIsModalOpen(true)
// }

export default MobileModal