//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('screen');
const parkings = [
	{
		id: 1,
		title: 'Parking 1',
		price: 5,
		rating: 4.2,
		spots: 20,
		free: 10,
		location: {
			lat: 37.78835,
			lng: -122.4334,
		},
	},
	{
		id: 2,
		title: 'Parking 2',
		price: 7,
		rating: 3.8,
		spots: 25,
		free: 20,
		location: {
			lat: 37.78845,
			lng: -122.4344,
		},
	},
	{
		id: 3,
		title: 'Parking 3',
		price: 10,
		rating: 4.9,
		spots: 50,
		free: 25,
		location: {
			lat: 37.78815,
			lng: -122.4314,
		},
	}
];

// create a component
class Map extends Component {
	state = {
		hours: {}
	}
	renderHeader() {
		return (
			<View style={styles.header}>
				<Text>Header</Text>
			</View>
		)
	}

	renderParking(item) {
		const { hours } = this.state;
		return (
			<View key={`parking-${item.id}`} style={styles.parking}>
				<View style={{ flex: 1, flexDirection: 'column' }}>
					<Text style={{ fontSize: 16 }}>x {item.spots} {item.title}</Text>
					<View style={{ width: 100, borderRadius: 6, borderColor: 'grey', borderWidth: 0.5, padding: 4 }}>
						<Text style={{ fontSize: 16 }}>05:00 hrs</Text>
					</View>
				</View>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Ionicons name={Platform.OS === 'ios' ? 'ios-pricetag' : 'md-pricetag'}>
							{item.price}
						</Ionicons>
						<Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}>
							{item.rating}
						</Ionicons>
					</View>
					<TouchableOpacity style={styles.buy}>				
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<Text style={{ fontSize: 24, color: 'white' }}>${item.price * 2}</Text>
							<Text style={{ color: 'white' }}>{item.price}x{hours[item.id]} hrs</Text>
						</View>
						<View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ fontSize: 24, color: 'white' }}>></Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	renderParkings() {
		return (
			<ScrollView
				horizontal
				pagingEnabled
				scrollEnabled
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={16}
				snapToAlignment="center"
				style={styles.parkings
			}>
				{parkings.map(parking => this.renderParking(parking))}
			</ScrollView>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				{this.renderHeader()}
				<MapView
					initialRegion={{
						latitude: 37.78825,
						longitude: -122.4324,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
					style={styles.map}
				/>
				{this.renderParkings()}
			</View>
		);
	}
}

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		flex: 0.5,
		justifyContent: 'center',
	},
	map: {
		flex: 3,
	},
	parkings: {
		position: 'absolute',
		right: 0,
		left: 0,
		bottom: 24,
	},
	parking: {
		flexDirection: 'row',
		backgroundColor: 'white',
		borderRadius: 6,
		padding: 12,
		marginHorizontal: 24,
		width: width - (24 * 2),
	},
	buy: {
		flex: 1,
		flexDirection: 'row',
		padding: 12,
		backgroundColor: 'red',
		borderRadius: 6,
	},
});

//make this component available to the app
export default Map;
