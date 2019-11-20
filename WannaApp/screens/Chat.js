import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	Image,
	Keyboard,
	Text,
	FlatList,
	Platform,
	TextInput,
	TouchableHighlight,
	SafeAreaView
} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { globalStyle, defaultNavigator } from './style';
import SocketIOClient from 'socket.io-client/dist/socket.io';
import { connect } from 'react-redux';
import { newMessages } from '../modules/chat/chat.reducer';

const isAndroid = Platform.OS == 'android';
let socket;
class Chat extends Component {
	state = {
		messages: [],
		username: null,
		avatarContact: null,
		contact: null,
		text: '',
		room: ''
	};

	constructor(props) {
		super(props);
		const connectionConfig = {
			transports: ['websocket']
		};
		socket = SocketIOClient('https://cbf2d5ca.ngrok.io', connectionConfig);
		socket.on('message', msg => {
			this.onReceivedMessage(msg);
			this.props.newMessagesArrived(msg);
		});
	}

	_keyboardDidShow = e => {
		let keyboardHeight = e.endCoordinates.height;
		this.setState({
			minInputToolbarHeight: keyboardHeight + 5
		});
	};

	_keyboardDidHide = () => {
		this.setState({
			minInputToolbarHeight: 45
		});
	};

	componentWillMount() {
		if (Platform.OS === 'android') {
			this.keyboardDidShowListener = Keyboard.addListener(
				'keyboardDidShow',
				this._keyboardDidShow
			);
			this.keyboardDidHideListener = Keyboard.addListener(
				'keyboardDidHide',
				this._keyboardDidHide
			);
		}
	}

	componentDidMount() {
		// exemplo tarraxo31
		const room = this.state.text.contact + this.state.idPost;

		socket.emit('subscribe', room);

		Keyboard.addListener(isAndroid ? 'keyboardDidShow' : 'keyboardWillShow', e =>
			this.setState({ viewPadding: e.endCoordinates.height - 40 })
		);

		Keyboard.addListener(isAndroid ? 'keyboardDidHide' : 'keyboardWillHide', () =>
			this.setState({ viewPadding: viewPadding })
		);
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			this.keyboardDidShowListener.remove();
			this.keyboardDidHideListener.remove();
		}
	}

	render() {
		return (
			/*
            Fazer View Englobadora da página
            onde o primeiro elemento é o header
            de pesquisa e o segundo elemento
            é o feed que contém as imagens.
            */
			// Safe Box for Iphone
			<SafeAreaView style={{ flex: 1 }}>
				{/* Full Page Box */}
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'stretch'
					}}>
					{this.buildHeader()}
					{/* this.buildWishlist() */}
					{this.renderConversation()}
				</View>
			</SafeAreaView>
		);
	}

	// Builds header of the page
	buildHeader() {
		this.startHeaderHeight = 80;
		if (Platform.OS == 'android') {
			this.startHeaderHeight = 60;
		}
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
					<Text style={{ flex: 3, textAlign: 'center' }}>
						Conversa com o {this.props.contact}
					</Text>
				</View>
			</View>
		);
	}

	renderConversation() {
		return (
			<View style={styles.container}>
				<FlatList
					style={styles.list}
					data={this.state.messages}
					ref={ref => (this.flatList = ref)}
					onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
					onLayout={() => this.flatList.scrollToEnd({ animated: true })}
					renderItem={({ item, index }) => (
						<View
							style={[
								{
									display: 'flex',
									alignItems:
										item.username === 'android' ? 'flex-end' : 'flex-start'
								}
							]}>
							<View
								style={[
									styles.listItemContainer,
									{
										flexDirection:
											item.username === 'android' ? 'row-reverse' : 'row'
									}
								]}>
								<Image
									style={styles.imageStyles}
									source={{ uri: item.user.avatar }}
								/>
								<Text style={styles.listItem}>{item.text}</Text>
							</View>
							<View style={styles.marginBottom} />
						</View>
					)}
				/>
				<View style={{ flexDirection: 'row' }}>
					<TextInput
						style={styles.textInput}
						onChangeText={this.changeTextHandler}
						onSubmitEditing={this.sendMessage}
						value={this.state.text}
						placeholder="Type a message"
						returnKeyType="done"
						returnKeyLabel="done"
						underlineColorAndroid="transparent"
					/>
					<TouchableHighlight
						style={styles.inputButton}
						underlayColor="#fff"
						onPress={this.sendMessage}>
						<Text>Send</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	}

	/**
	 * Save the input values change to state
	 */
	changeTextHandler = text => {
		this.setState({ text: text });
	};

	onReceivedMessage = messagesA => {
		let messageArr = [];
		messagesA.map(item => {
			let messageModel = {
				writer: this.state.contact,
				text: item.message,
				date: new Date()
			};

			messageArr.push(messageModel);
		});

		messageArr.reverse();

		this.setState({ messages: this.state.messages.concat(messageArr) });
	};

	sendMessage = () => {
		let notEmpty = this.state.text.trim().length > 0;

		if (notEmpty) {
			let messageToSend = {
				room: this.state.room,
				message: this.state.text,
				idSender: this.state.username,
				idReceiver: this.state.contact,
				idPost: '31'
			};

			let messageToSave = {
				writer: this.state.username,
				text: this.state.text,
				date: new Date()
			};

			socket.emit('chat-message', messageToSend);

			this.setState({ messages: messages.concat(messageToSave), text: '' });
		}
	};
}

function mapStateToProps(store, ownProps) {
	console.log(store.chat);
	return {
		username: store.auth.username,
		avatarContact: store.chat.avatarContact,
		contact: store.chat.contact,
		room: store.chat.room
	};
}
function mapDispatchToProps(dispatch) {
	return {
		newMessages: msg => {
			dispatch(newMessages(msg));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Chat);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: '#F5FCFF',
		padding: 10,
		paddingTop: 20
	},
	buttonStyle: {
		color: 'red',
		backgroundColor: 'green'
	},
	list: {
		width: '100%'
	},
	listItem: {
		width: 'auto',
		maxWidth: '80%',
		paddingTop: 2,
		paddingBottom: 2,
		fontSize: 14
	},
	marginBottom: {
		height: 5,
		backgroundColor: 'transparent'
	},
	listItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 10,
		backgroundColor: '#fff',
		elevation: 1
	},
	imageStyles: {
		width: 35,
		height: 35,
		borderRadius: 35,
		marginLeft: 10,
		marginRight: 10
	},
	textInput: {
		height: 50,
		paddingRight: 10,
		paddingLeft: 10,
		paddingTop: 15,
		paddingBottom: 15,
		borderColor: 'transparent',
		width: '85%',
		backgroundColor: '#fff',
		borderRadius: 10,
		elevation: 1
	},
	inputButton: {
		display: 'flex',
		height: 50,
		justifyContent: 'center',
		borderRadius: 10,
		alignSelf: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		marginLeft: 10,
		backgroundColor: '#fff',
		elevation: 1
	}
});
