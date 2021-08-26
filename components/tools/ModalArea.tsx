import React, { useContext } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ICON_MARGIN } from 'drawing-app/constants/Layout';
import CanvasSettings from '../modals/CanvasSettings';

// Keep the ModalId type in this file since this is where all the modals are defined
export type ModalId = 'CanvasSettings';

const ModalArea: React.FC = () => {
    const { openModal } = useContext(DrawingContext);

    // Contains all of the modals
    const modals = {
        CanvasSettings,
    }

    // Set the active modal
    // If no modal, set it to the empty modal
    const activeModal = openModal.get ? modals[openModal.get] : () => "";

    return (
        <Modal 
            visible={!!openModal.get}
            transparent={true}
            onRequestClose={() => openModal.set(null)}
        >
            <TouchableWithoutFeedback onPress={() => openModal.set(null)} style={styles.centeredView}>
                <TouchableWithoutFeedback style={styles.modalView} onPress={() => {}}>
                    {activeModal()}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => openModal.set(null)}
                    >
                        <Text>Hide Modal</Text>
                    </TouchableOpacity>
                </TouchableWithoutFeedback>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default ModalArea;

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    modalView: {
        margin: ICON_MARGIN * 2,
        backgroundColor: "white",
        borderRadius: ICON_MARGIN,
        padding: ICON_MARGIN * 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: 'orange'
    },
});