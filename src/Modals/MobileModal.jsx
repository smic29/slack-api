import './MobileModal.css';
import { useData } from '../Context/DataProvider';
import { useEffect } from 'react';
import UserBox from '../Components/Navigation/UserBox';
import CreateChannel from '../Components/Channels/CreateChannel';
import ChannelMemberList from '../Components/ChannelMemberList';

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
            case 'createChannel':
                return <CreateChannel />
            case 'channelMembers':
                return <ChannelMemberList />
            default:
                return null;
        }
    }

    return (
        <div className='mobile-modal-overlay'
        style={{background: modalPosition.top.includes('%') 
        ? 'rgba(0,0,0,0.4)' 
        : 'transparent'} }>
            <div className='mobile-modal-content-box'
            style={modalPosition}>
                <RenderModalContent />
            </div>
        </div>
    )
}

export default MobileModal