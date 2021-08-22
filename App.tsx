import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import ToolNavbar from './navigation/ToolNavbar';
import Gestures from './components/drawing/Gestures';
import { MemoizedDrawingCanvas } from './components/drawing/DrawingCanvas';
import DrawingProvider from './components/context/DrawingContext';
import DocumentNavbar from './navigation/DocumentNavbar';
import ModalArea from './components/tools/ModalArea';

// import useCachedResources from './hooks/useCachedResources';
// import useColorScheme from './hooks/useColorScheme';
// import Navigation from './navigation';

export default function App() {
		return (
			<>
			<SafeAreaView style={[styles.safeArea, {flex: 0, borderBottomColor: '#ddd', borderBottomWidth: 1}]} />
			<SafeAreaView style={[styles.safeArea, {flex: 1}]}>
				<DrawingProvider>
					<ModalArea />
					<View style={styles.canvas}>
						<DocumentNavbar />
						<Gestures>
							<MemoizedDrawingCanvas />
						</Gestures>
					</View>
					<ToolNavbar />
				</DrawingProvider>
				<StatusBar style="dark" />
			</SafeAreaView>
			</>
		);
	//}
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#fff'
	},
	container: {
        flex: 1,
        backgroundColor: '#fff',
    },
	canvas: {
		flex: 1,
		backgroundColor: '#ddd',
		overflow: 'hidden',
	}
});
