import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	TouchableHighlight,
	ScrollView,
	Platform,
	Dimensions,
	FlatList,
	TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { Button } from 'react-native-elements';
import { globalStyle, defaultNavigator } from './style';
import { logout } from '../modules/auth/auth.service';
import { followAC, unfollowAC, loadProfilePostsAC } from '../modules/profile/profile.reducer';
import { connect } from 'react-redux';
import { getMyProfile, getUserProfile } from '../modules/profile/profile.api';
import { follow, unfollow } from '../modules/profile/profile.api';
import Loading from './Loading';

let { width, height } = Dimensions.get('window');

class Profile extends Component {
	constructor(props) {
		super(props);
	}
	state = {
		profile: null,
		numPosts: 0,
		loading: true,
		username: '',
		following: null,
		userNrFollowers: null,
		userNrFollowings: null
	};

	componentDidMount() {
		this.fetchUserInfo();
		this.startHeaderHeight = 80;
		if (Platform.OS == 'android') {
			this.startHeaderHeight = 60;
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.myNumPosts !== prevProps.myNumPosts && this.state.loading == false) {
			this.fetchUserInfo();
		}
	}

	fetchUserInfo = async () => {
		let usernamePassed;
		usernamePassed = this.props.navigation.getParam('userID', 'local');
		console.log(usernamePassed);

		let profile, length;
		if (usernamePassed == 'local') {
			profile = await getMyProfile();
		} else {
			profile = await getUserProfile(usernamePassed);
		}

		if (profile != null) {
			if (usernamePassed == 'local') {
				if (profile.posts == undefined) length = 0;
				else length = profile.posts.length;
				this.props.loadProfilePosts(length, profile.nrFollowings.number);
			}
			await this.setState({
				profile: profile,
				numPosts: profile.posts.length,
				loading: false,
				username: profile.info.username,
				following: profile.following,
				userNrFollowers: profile.nrFollowers.number,
				userNrFollowings: profile.nrFollowings.number
			});
		}

		return;
	};

	render() {
		if (this.state.loading == false) {
			if (this.state.numPosts !== 0) {
				return (
					<SafeAreaView style={{ flex: 1 }}>
						<View
							style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'flex-start',
								alignItems: 'stretch'
							}}>
							{this.buildHeader()}
							{this.buildProfile()}
							{this.buildPosts()}
						</View>
					</SafeAreaView>
				);
			} else {
				return (
					<SafeAreaView style={{ flex: 1 }}>
						<View
							style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'flex-start',
								alignItems: 'stretch'
							}}>
							{this.buildHeader()}
							{this.buildProfile()}
							<View>
								<Text>No images</Text>
							</View>
						</View>
					</SafeAreaView>
				);
			}
		} else return <Loading />;
	}

	// Builds header of the page
	buildHeader() {
		return (
			// Safe Box for Android
			<View
				style={{
					height: this.startHeaderHeight,
					backgroundColor: 'white',
					borderBottomWidth: 1,
					borderBottomColor: '#dddddd'
				}}>
				<View
					style={{
						height: '90%',
						flexDirection: 'row',
						padding: 10,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'blue'
					}}>
					<Text style={{ flex: 3, textAlign: 'center' }}>Perfil</Text>
					{this.state.username == this.props.loggedUsername ? (
						<MaterialCommunityIcons.Button
							name="logout"
							size={40}
							style={{ flex: 1 }}
							onPress={() => this.props.logout()}
						/>
					) : null}
				</View>
			</View>
		);
	}

	buildProfile() {
		return (
			<View>
				<View
					style={{
						justifyContent: 'flex-start',
						alignItems: 'center',
						flexDirection: 'row',
						paddingVertical: 10,
						marginTop: 20
					}}>
					{this.state.profile.info.avatarData ? (
						<Image
							source={{
								uri:
									'data:' +
									'image/jpeg' +
									';base64,' +
									new Buffer(this.state.profile.info.avatarData)
							}}
							style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50 }}
						/>
					) : (
						<Image
							source={require('../assets/noImage.png')}
							style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50 }}
						/>
					)}
					<View style={{ marginLeft: 10 }}>
						<Text>
							{this.state.profile.info.firstName +
								' ' +
								this.state.profile.info.lastName}
						</Text>
						<Text>{this.state.profile.info.rating}</Text>
					</View>
				</View>
				{this.buildNumbers()}
				{this.buildButtons()}
				{/* <View style={{ borderColor: '#555', borderWidth: 1 }} /> */}
			</View>
		);
	}

	buildNumbers() {
		if (this.state.username != this.props.loggedUsername) {
			return (
				<View style={{ marginLeft: 50, flexDirection: 'row' }}>
					<View
						style={{
							marginTop: 10,
							marginBottom: 20,
							marginHorizontal: 40,
							paddingVertical: 15
						}}>
						<Text
							style={{
								textAlign: 'center',
								color: 'grey',
								fontWeight: 'bold',
								fontSize: 18
							}}>
							{this.state.userNrFollowers} seguidores
						</Text>
					</View>
					<View
						style={{
							marginTop: 10,
							marginBottom: 20,
							marginHorizontal: 40,
							paddingVertical: 15
						}}>
						<Text
							style={{
								textAlign: 'center',
								color: 'grey',
								fontWeight: 'bold',
								fontSize: 18
							}}>
							{this.state.userNrFollowings} a seguir
						</Text>
					</View>
					<View
						style={{
							marginTop: 10,
							marginBottom: 20,
							marginHorizontal: 40,
							paddingVertical: 15
						}}>
						<Text
							style={{
								textAlign: 'center',
								color: 'grey',
								fontWeight: 'bold',
								fontSize: 18
							}}>
							{this.state.nrPosts} posts
						</Text>
					</View>
				</View>
			);
		} else
			return (
				<View style={{ marginLeft: 50, flexDirection: 'row' }}>
					<View>
						<TouchableOpacity
							style={{
								marginTop: 10,
								marginBottom: 20,
								marginHorizontal: 10,
								paddingVertical: 15
							}}>
							<Text
								style={{
									textAlign: 'center',
									color: 'grey',
									fontWeight: 'bold',
									fontSize: 18
								}}
								onPress={() =>
									this.props.navigation.navigate('FollowList', {
										type: 'Followers'
									})
								}>
								{this.state.profile.nrFollowers.number} seguidores
							</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={{
							marginTop: 10,
							marginBottom: 20,
							paddingVertical: 15,
							marginHorizontal: 10
						}}>
						<Text
							style={{
								textAlign: 'center',
								color: 'grey',
								fontWeight: 'bold',
								fontSize: 18
							}}
							onPress={() =>
								this.props.navigation.navigate('FollowList', {
									type: 'Followings'
								})
							}>
							{this.props.myFollowingsNumber} a seguir
						</Text>
					</TouchableOpacity>
					<View
						style={{
							marginTop: 10,
							marginBottom: 20,
							paddingVertical: 15,
							marginHorizontal: 10
						}}>
						<Text
							style={{
								textAlign: 'center',
								color: 'grey',
								fontWeight: 'bold',
								fontSize: 18
							}}>
							{this.props.myNumPosts} posts
						</Text>
					</View>
				</View>
			);
	}

	buildButtons() {
		return (
			<View>
				{this.state.username == this.props.loggedUsername ? (
					<View>
						<TouchableOpacity
							style={{
								marginTop: 10,
								marginBottom: 20,
								marginHorizontal: 40,
								paddingVertical: 15,
								borderRadius: 20,
								borderColor: 'grey',
								borderWidth: 1.5
							}}>
							<Text
								style={{ textAlign: 'center', color: 'grey' }}
								onPress={() =>
									this.props.navigation.navigate('EditProfile', {
										userID: this.state.username
									})
								}>
								{'Edit Profile'}{' '}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								marginTop: 10,
								marginBottom: 20,
								marginHorizontal: 40,
								paddingVertical: 15,
								borderRadius: 20,
								borderColor: 'grey',
								borderWidth: 1.5
							}}>
							<Text
								style={{ textAlign: 'center', color: 'grey' }}
								onPress={() =>
									this.props.navigation.navigate('EditProfile', {
										userID: this.state.username
									})
								}>
								{'Saved Posts'}{' '}
							</Text>
						</TouchableOpacity>
					</View>
				) : this.state.following == false ? (
					<TouchableOpacity
						style={{
							marginTop: 10,
							marginBottom: 20,
							marginHorizontal: 40,
							paddingVertical: 15,
							borderRadius: 20,
							borderColor: 'grey',
							borderWidth: 1.5
						}}>
						<Text
							style={{ textAlign: 'center', color: 'grey' }}
							onPress={() => this.followAction()}>
							{'FOLLOW'}{' '}
						</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={{
							marginTop: 10,
							marginBottom: 20,
							marginHorizontal: 40,
							paddingVertical: 15,
							borderRadius: 20,
							borderColor: 'grey',
							borderWidth: 1.5
						}}>
						<Text
							style={{ textAlign: 'center', color: 'grey' }}
							onPress={() => this.unfollowAction()}>
							{'UNFOLLOW'}{' '}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	}

	buildPosts = () => {
		return (
			<View style={styles.containerImages}>
				<FlatList
					numColumns={3}
					data={this.state.profile.posts}
					renderItem={({ item, index }) => this.renderItem(item, index)}
					keyExtractor={item => item.postid.toString()}
				/>
			</View>
		);
	};

	renderItem = (postInfo, index) => {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					this.props.navigation.navigate('UserPostProfile', {
						postID: postInfo.postid
					});
				}}>
				<View style={styles.gridImgContainer}>
					<Image
						resizeMode="cover"
						style={styles.image}
						source={{
							uri:
								'data:' + 'image/jpeg' + ';base64,' + new Buffer(postInfo.photoData)
						}}
					/>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	followAction = async () => {
		result = await follow(this.state.username);
		if (result == 'OK') {
			this.props.followDispatch();
			this.setState({ following: true, userNrFollowers: this.state.userNrFollowers + 1 });
		}
	};

	unfollowAction = async () => {
		result = await unfollow(this.state.username);
		if (result == 'OK') {
			this.props.unfollowDispatch();
			this.setState({ following: false, userNrFollowers: this.state.userNrFollowers - 1 });
		}
	};
}

function mapStateToProps(store) {
	return {
		loggedUsername: store.auth.loggedUsername,
		myNumPosts: store.profile.numPosts,
		myFollowingsNumber: store.profile.nrFollowings
	};
}

function mapDispatchToProps(dispatch) {
	return {
		logout: () => {
			dispatch(logout());
		},
		followDispatch: () => {
			dispatch(followAC());
		},
		unfollowDispatch: () => {
			dispatch(unfollowAC());
		},
		loadProfilePosts: (nrPosts, nrFollowings) => {
			dispatch(loadProfilePostsAC(nrPosts, nrFollowings));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerImages: {
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'center'
	},
	gridImgContainer: {
		padding: 1,
		backgroundColor: '#CCC'
	},
	profileImage: {
		width: width * 0.2,
		height: width * 0.2,
		borderRadius: width * 0.5,
		borderWidth: 1,
		marginRight: 10
	},
	image: {
		height: width * 0.33,
		width: width * 0.33
	}
});
