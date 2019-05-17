import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import MapView from 'react-native-maps';
import Model from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import * as theme from '../theme';

const { Marker } = MapView;
const { height, width } = Dimensions.get('screen');
const parkingsSpots = [
	{
		id: 1,
		title: 'Parking 1',
		price: 5,
		rating: 4.2,
		spots: 20,
		free: 10,
		coordinate: {
			latitude: 37.78735,
			longitude: -122.4334,
		},
		description: `Description about this parking lot
Open year 2018
Secure with CTV`,
	},
	{
		id: 2,
		title: 'Parking 2',
		price: 7,
		rating: 3.8,
		spots: 25,
		free: 20,
		coordinate: {
			latitude: 37.78845,
			longitude: -122.4344,
		},
		description: `Description about this parking lot
Open year 2014
Secure with CTV`,
	},
	{
		id: 3,
		title: 'Parking 3',
		price: 10,
		rating: 4.9,
		spots: 50,
		free: 25,
		coordinate: {
			latitude: 37.78615,
			longitude: -122.4314,
		},
		description: `Description about this parking lot
Open year 2019
Secure with CTV`,
	}
];

// create a component
class ParkingMap extends Component {
	state = {
		hours: {},
		active: null,
		activeModel: null,
	}

	componentDidMount() {
		const { parkings } = this.props;
		const hours = {};

		parkings.map(parking => { hours[parking.id] = 1 });

		this.setState({ hours });
	}

	renderHeader() {
		return (
			<View style={styles.header}>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text style={styles.headerTitle}>Detected location</Text>
					<Text style={styles.headerLocation}>San Francisco, US</Text>
				</View>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
					<TouchableWithoutFeedback>
						<Ionicons name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'} size={theme.SIZES.icon * 1.5} />
					</TouchableWithoutFeedback>
				</View>
			</View>
		)
	}

	renderParking(item) {
		const { hours } = this.state;
		return (
			<TouchableWithoutFeedback key={`parking-${item.id}`} onPress={() => this.setState({ active: item.id })}>
				<View style={[styles.parking, styles.shadow]}>
					<View style={styles.hours}>
						<Text style={styles.hoursTitle}>x {item.spots} {item.title}</Text>
						{/* <Picker
							selectedValue={this.state.hours[item.id]}
							style={{height: 50, width: 100}}
							onValueChange={(itemValue, itemIndex) =>
							this.setState({ ...this.state.hours, hours: { [item.id]: itemValue} })
						}>
							<Picker.Item label="01:00" value="1" />
							<Picker.Item label="02:00" value="2" />
							<Picker.Item label="03:00" value="3" />
							<Picker.Item label="04:00" value="4" />
							<Picker.Item label="05:00" value="5" />
							<Picker.Item label="06:00" value="6" />
						</Picker> */}
						<View style={{ width: 100, borderRadius: 6, borderColor: theme.COLORS.gray, borderWidth: 0.5, padding: 4 }}>
							<Text style={{ fontSize: theme.SIZES.font }}>05:00</Text>
						</View>
					</View>
					<View style={styles.parkingInfoContainer}>
						<View style={styles.parkingInfo}>
							<View style={styles.parkingIcon}>
								<Ionicons name={Platform.OS === 'ios' ? 'ios-pricetag' : 'md-pricetag'} size={theme.SIZES.icon} color={theme.COLORS.gray} />
								<Text>${item.price}</Text>
							</View>
							<View style={styles.parkingIcon}>
								<Ionicons name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'} size={theme.SIZES.icon} color={theme.COLORS.gray} />
								<Text>{item.rating}</Text>
							</View>
						</View>
						<TouchableOpacity style={styles.buy} onPress={() => this.setState({ activeModel: item })}>				
							<View style={styles.buyTotal}>
								<Text style={styles.buyTotalPrice}>${item.price * 2}</Text>
								<Text style={{ color: theme.COLORS.white }}>{item.price}x{hours[item.id]} hrs</Text>
							</View>
							<View style={styles.buyBtn}>
								<Text style={{ fontSize: theme.SIZES.base * 2, color: theme.COLORS.white }}>></Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	renderParkings() {
		return (
			<FlatList
				horizontal
				pagingEnabled
				scrollEnabled
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={16}
				snapToAlignment="center"
				style={styles.parkings}
				data={this.props.parkings}
				keyExtractor={(item, index) => `${item.id}`}
				renderItem={({item}) => this.renderParking(item)}
			/>
		)
	}

	renderModel() {
		const { activeModel, hours } = this.state;
		
		if(!activeModel) return null;

		return (
			<Model
				isVisible
				useNativeDriver
				style={styles.modelContainer}
				backdropColor={theme.COLORS.overlay}
				onBackButtonPress={() => this.setState({ activeModel: null })}
				onBackdropPress={() => this.setState({ activeModel: null })}
				onSwipeComplete={() => this.setState({ activeModel: null })}
			>
				<View style={styles.modal}>
					<View>
						<Text style={{ fontSize: theme.SIZES.font * 1.5 }}>
							{activeModel.title}
						</Text>
					</View>
					<View>
						<Text style={{ color: theme.COLORS.gray }}>
							{activeModel.description}
						</Text>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<Text>{activeModel.price}</Text>
						<Text>{activeModel.rating}</Text>
						<Text>{activeModel.distance}</Text>
						<Text>{activeModel.free}/{activeModel.total}</Text>
					</View>
					<View>
						<Text style={{ textAlign: 'center' }}>Choose your Booking Period:</Text>
					</View>
					<View style={{ justifyContent: 'flex-end' }}>
						<TouchableOpacity style={styles.payBtn}>				
							<Text style={styles.payText}>
								Proceed to pay $20
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Model>
		)
	}

	render() {
		const { currentPosition, parkings } = this.props;
		return (
			<View style={styles.container}>
				{this.renderHeader()}
				<MapView
					initialRegion={currentPosition}
					style={styles.map}
				>
					{parkings.map(parking => (
						<Marker
							kay={`marker-${parking.id}`}
							coordinate={parking.coordinate}	
						>
							<TouchableWithoutFeedback onPress={() => this.setState({ active: parking.id })}>
								<View style={[
									styles.marker,
									styles.shadow,
									this.state.active === parking.id ? style.active : null
								]}>
									<Text style={styles.markerPrice}>${parking.price}</Text>
									<Text style={styles.markerStatus}> ({parking.free}/{parking.spots})</Text>
								</View>
							</TouchableWithoutFeedback>
						</Marker>
					))}
				</MapView>
				{this.renderParkings()}
				{this.renderModel()}
			</View>
		);
	}
}

ParkingMap.defaultProps = {
	currentPosition: {
		latitude: 37.78825,
		longitude: -122.4324,
		latitudeDelta: 0.0122,
		longitudeDelta: 0.0121,
	},
	parkings: parkingsSpots,
}

//make this component available to the app
export default ParkingMap;

// define your styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.COLORS.white,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: theme.SIZES.base * 2,
		paddingTop: theme.SIZES.base * 2.5,
		paddingBottom: theme.SIZES.base * 1.5,
	},
	headerTitle: {
		color: theme.COLORS.gray,
	},
	headerLocation: {
		fontSize: theme.SIZES.font,
		fontWeight: '500',
		paddingVertical: theme.SIZES.base / 3,
	},
	map: {
		flex: 3,
	},
	parkings: {
		position: 'absolute',
		right: 0,
		left: 0,
		bottom: 0,
		paddingBottom: 24,
	},
	parking: {
		flexDirection: 'row',
		backgroundColor: theme.COLORS.white,
		borderRadius: 6,
		padding: 12,
		marginHorizontal: 24,
		width: width - (24 * 2),
	},
	buy: {
		flex: 1,
		flexDirection: 'row',
		padding: 12,
		backgroundColor: theme.COLORS.red,
		borderRadius: 6,
	},
	buyTotal: { 
		flex: 1,
		justifyContent: 'center',
	},
	buyTotalPrice: {
		fontSize: theme.SIZES.base * 2,
		color: theme.COLORS.white,
	},
	buyBtn: {
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	marker: {
		flexDirection: 'row',
		backgroundColor: theme.COLORS.white,
		borderRadius: 24,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderWidth: 1,
		borderColor: theme.COLORS.white,
	},
	markerPrice: {
		color: theme.COLORS.red,
		fontWeight: 'bold',
	},
	markerStatus: {
		color: theme.COLORS.gray,
	},
	shadow: {
		shadowColor: theme.COLORS.black,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.5,
		shadowRadius: 4,
	},
	active: {
		borderColor: theme.COLORS.red,
		// borderWidth: 0.5,
	},
	hours: {
		flex: 1, 
		flexDirection: 'column',
	},
	hoursTitle: { 
		fontSize: theme.SIZES.font,
	},
	parkingInfoContainer: { 
		flex: 1.5,
		flexDirection: 'row',
	},
	parkingInfo: {
		flex: 0.5,
		justifyContent: 'center',
		marginHorizontal: theme.SIZES.base * 2,
	},
	parkingIcon: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	buyTotal: {
		flex: 1,
		justifyContent: 'center',
	},
	modelContainer: {
		margin: 0,
		justifyContent: 'flex-end',
	},
	model: {
		// flex: 1,
		flexDirection: 'column',
		height: height * 0.75,
		padding: theme.SIZES.base * 2,
		backgroundColor: theme.COLORS.white,
		borderTopLeftRadius: theme.SIZES.base,
		borderTopRightRadius: theme.SIZES.base,		
	},
	payBtn: {
		padding: theme.SIZES.base * 1.5,
		backgroundColor: theme.COLORS.red,
		borderRadius: 6,
	},
	payText: {
		fontWeight: '600',
		fontSize: theme.SIZES.base * 1.5,
		color: theme.COLORS.white,
	},
});
