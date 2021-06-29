import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ToolNavbar from './navigation/ToolNavbar';
import Gestures from './components/drawing/Gestures';
import DrawingCanvas from './components/drawing/DrawingCanvas';

// import useCachedResources from './hooks/useCachedResources';
// import useColorScheme from './hooks/useColorScheme';
// import Navigation from './navigation';

export default function App() {
	//const isLoadingComplete = useCachedResources();
	//const colorScheme = useColorScheme();

	//if (!isLoadingComplete) {
		//return null;
	//} else {
		return (
			<>
			<SafeAreaView style={{ flex:0, backgroundColor: '#fff' }} />
			<SafeAreaView style={{ flex:1, backgroundColor: '#fff' }}>
				<View style={styles.canvas}>
					<Gestures enabled={true}>
						<DrawingCanvas enabled={false} />
					</Gestures>
				</View>
				<ToolNavbar />
				<StatusBar />
			</SafeAreaView>
			</>
		);
	//}
}

const styles = StyleSheet.create({
	container: {
        flex: 1,
        backgroundColor: '#fff',
    },
	canvas: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
