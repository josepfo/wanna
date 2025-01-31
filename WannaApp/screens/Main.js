import Inspire from './Inspire';
import Wanted from './Wanted';
import Combine from './Combine';
import Add from './Add';
import Profile from './Profile';
import EditProfile from './EditProfile';
import Filters from './Filters';
import NewFilter from './NewFilter';
import FollowList from './FollowList';
import Comments from './Comments';
import ConversationsList from './ConversationsList';
import Chat from './Chat';
import Purchase from './Purchase';
import UserPostProfile from './UserPostProfile';
import SavedPosts from './SavedPosts';
import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, Image, Animated, Easing } from 'react-native';

const transitionConfig = () => {
	return {
		transitionSpec: {
			duration: 450,
			easing: Easing.out(Easing.poly(4)),
			timing: Animated.timing,
			useNativeDriver: true
		},
		screenInterpolator: sceneProps => {
			const { position, layout, scene, index, scenes } = sceneProps;

			const thisSceneIndex = scene.index;
			const height = layout.initHeight;
			const width = layout.initWidth;

			// We can access our navigation params on the scene's 'route' property
			var thisSceneParams = scene.route.params || {};

			const translateX = position.interpolate({
				inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
				outputRange: [width, 0, 0]
			});

			const translateY = position.interpolate({
				inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
				outputRange: [height, 0, 0]
			});

			const opacity = position.interpolate({
				inputRange: [thisSceneIndex - 1, thisSceneIndex - 0.5, thisSceneIndex],
				outputRange: [0, 1, 1]
			});

			const scale = position.interpolate({
				inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
				outputRange: [4, 1, 1]
			});

			const slideFromRight = { transform: [{ translateX }] };
			const scaleWithOpacity = { opacity, transform: [{ scaleX: scale }, { scaleY: scale }] };
			const slideInFromBottom = { transform: [{ translateY }] };

			if (thisSceneParams.plain) return slideFromRight;
			else if (index < 5) return slideInFromBottom;
			else return scaleWithOpacity;
		}
	};
};

const FilterStack = createStackNavigator(
	{
		Filters: {
			screen: Filters,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		Wanted: {
			screen: Wanted,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		NewFilter: {
			screen: NewFilter,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		UserPostProfile: {
			screen: UserPostProfile,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		Purchase: {
			screen: Purchase,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
	},
	{
		transitionConfig
	}
);

const UserStack = createStackNavigator(
	{
		MyProfile: {
			screen: Profile,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		EditProfile: {
			screen: EditProfile,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		SavedPosts: {
			screen: SavedPosts,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		UserProfile: {
			screen: Profile,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		UserPostProfile: {
			screen: UserPostProfile,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		Purchase: {
			screen: Purchase,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		FollowList: {
			screen: FollowList,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		Comments: {
			screen: Comments,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		ConversationsList: {
			screen: ConversationsList,
			navigationOptions: {
				header: null
			}
		},
		Chat: {
			screen: Chat,
			navigationOptions: {
				header: null
			}
		}
	},
	{
		transitionConfig
	}
);

const FeedStack = createStackNavigator(
	{
		MyFeed: {
			screen: Inspire,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		UserProfile: {
			screen: Profile,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		UserPostProfile: {
			screen: UserPostProfile,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		Comments: {
			screen: Comments,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		Purchase: {
			screen: Purchase,
			headerMode: 'none',
			navigationOptions: {
				header: null
			}
		},
		Chat: {
			screen: Chat,
			navigationOptions: {
				header: null
			}
		}
	},
	{
		transitionConfig
	}
);

const MainTab = createMaterialTopTabNavigator(
	{
		Inspire: {
			screen: FeedStack,
			navigationOptions: {
				tabBarLabel: <Text style={{ fontSize: 9 }}>Inspira-te</Text>,
				tabBarIcon: ({ focused }) =>
					focused ? (
						<MaterialCommunityIcons name="home" color={'blue'} size={28} />
					) : (
						<MaterialCommunityIcons name="home-outline" color={'grey'} size={28} />
					)
			}
		},
		Wanted: {
			screen: FilterStack,
			navigationOptions: {
				tabBarLabel: <Text style={{ fontSize: 9 }}>Filtros</Text>,
				tabBarIcon: ({ focused }) =>
					focused ? (
						<MaterialCommunityIcons name="heart" color={'blue'} size={28} />
					) : (
						<MaterialCommunityIcons name="heart-outline" color={'grey'} size={28} />
					)
			}
		},
		Add: {
			screen: Add,
			navigationOptions: {
				tabBarLabel: <Text style={{ fontSize: 9 }}>Adicionar</Text>,
				tabBarIcon: ({ tintColor }) => (
					<Image
						source={require('../assets/add.png')}
						style={{ height: 30, width: 30, flex: 1 }}
					/>
				)
			}
		},
		Combine: {
			screen: Combine,
			navigationOptions: {
				tabBarLabel: <Text style={{ fontSize: 9 }}>Combinar</Text>,
				tabBarIcon: ({ tintColor }) => (
					<MaterialCommunityIcons name="vector-combine" color={tintColor} size={28} />
				)
			}
		},
		Profile: {
			screen: UserStack,
			navigationOptions: {
				tabBarLabel: <Text style={{ fontSize: 9 }}>Perfil</Text>,
				tabBarIcon: ({ focused }) =>
					focused ? (
						<MaterialIcons name="person" color={'blue'} size={28} />
					) : (
						<MaterialIcons name="person-outline" color={'grey'} size={28} />
					)
			}
		}
	},
	{
		swipeEnabled: true,
		animationEnabled: true,
		tabBarOptions: {
			activeTintColor: 'blue',
			inactiveTintColor: 'grey',
			style: {
				backgroundColor: 'white',
				borderTopWidth: 0,
				shadowOffset: { width: 5, height: 3 },
				shadowColor: 'black',
				shadowOpacity: 0.5,
				elevation: 5
			},
			indicatorStyle: {
				backgroundColor: 'white'
			},
			showIcon: true,
			showLabel: false,
			iconStyle: {
				width: 30,
				height: 30
			}
		},
		tabBarPosition: 'bottom'
	}
);

MainTab.navigationOptions = {
	// Hide the header from root stack
	header: null
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default createAppContainer(MainTab);
