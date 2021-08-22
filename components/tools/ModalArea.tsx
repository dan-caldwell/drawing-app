import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import Modal from 'drawing-app/components/utility-components/Modal';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';

// Keep the ModalId type in this file since this is where all the modals are defined
export type ModalId = 'CanvasAreaModal' | 'EmptyModal';

const ModalArea: React.FC = () => {
    const { openModal } = useContext(DrawingContext);

    // Contains all of the modals
    const modals = {
        EmptyModal: (
            <View></View>
        ),
        CanvasAreaModal: (
            <View>
                <Text>Canvas area modal</Text>
            </View>
        ),
    }

    // Set the active modal
    // If no modal, set it to the empty modal
    const activeModal = openModal.get ? modals[openModal.get] : modals.EmptyModal;

    return (
        <Modal id={openModal.get}>
            {activeModal}
        </Modal>
    )
}

export default ModalArea;