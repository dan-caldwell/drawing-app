import React, { useContext } from 'react';
import { View, Text, Modal, StyleSheet, TextInput } from 'react-native';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Input from '../utility-components/Input';
import { ICON_MARGIN } from 'drawing-app/constants/Layout';

// Keep the ModalId type in this file since this is where all the modals are defined
export type ModalId = 'CanvasSettings';

const ModalArea: React.FC = () => {
    const { openModal, canvasSize } = useContext(DrawingContext);

    // Contains all of the modals
    const modals = {
        CanvasSettings: (
            <View>
                <Text>Canvas Size</Text>
                <View style={styles.row}>
                    <Text>Width </Text><Input keyboardType="numeric" value={canvasSize.get.width.toString()} onChangeText={(value: string) => canvasSize.set({
                        width: Number(value),
                        height: Number(canvasSize.get.height)
                    })} />
                </View>
                <View style={styles.row}>
                    <Text>Height </Text><Input keyboardType="numeric" value={canvasSize.get.height.toString()} onChangeText={(value: string) => canvasSize.set({
                        width: Number(canvasSize.get.width),
                        height: Number(value),
                    })} />
                </View>
            </View>
        ),
    }

    // Set the active modal
    // If no modal, set it to the empty modal
    const activeModal = openModal.get ? modals[openModal.get] : "";

    return (
        <Modal 
            visible={!!openModal.get}
            transparent={true}
            onRequestClose={() => openModal.set(null)}
        >
            <TouchableWithoutFeedback onPress={() => openModal.set(null)} style={styles.centeredView}>
                <TouchableWithoutFeedback style={styles.modalView} onPress={() => {}}>
                    {activeModal}
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
    row: {
        flexDirection: "row",
        alignItems: "center"
    }
});