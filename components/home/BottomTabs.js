import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import { Divider } from 'react-native-elements'

const bottomTabIcons = [
    {
        name: 'Home',
        inactive: 'https://img.icons8.com/material-outlined/48/ffffff/home--v2.png',
        active: 'https://img.icons8.com/material/48/ffffff/home--v5.png'
    },
    {
        name: 'Search',
        inactive: 'https://img.icons8.com/ios/50/ffffff/search--v1.png',
        active: 'https://img.icons8.com/ios-filled/50/ffffff/search--v1.png'
    },
    {
        name: 'Reels',
        inactive: 'https://img.icons8.com/ios/50/ffffff/instagram-reel.png',
        active: 'https://img.icons8.com/ios-filled/50/ffffff/instagram-reel.png'
    },
    {
        name: 'Shop',
        inactive: 'https://img.icons8.com/ios/50/ffffff/shopaholic.png',
        active: 'https://img.icons8.com/ios-filled/50/ffffff/shopaholic.png'
    },
    {
        name: 'Profile',
        inactive: 'https://img.icons8.com/ios/50/null/user-male-circle--v1.png',
        active: 'https://img.icons8.com/ios-filled/50/null/user-male-circle.png'
    }
]

const BottomTabs = ({ icons }) => {
    const [activeTab, setActiveTab] = useState('Home')

    const Icon = ({ icon }) => (
        <TouchableOpacity onPress={() => setActiveTab(icon.name)}>
            <Image source={{uri: activeTab === icon.name ? icon.active : icon.inactive}} style={styles.icon}/>
        </TouchableOpacity>
    )
    return (
        <View style={styles.wrapper}>
            <Divider width={1} orientation='vertical' />
            <View style={styles.container}>
            {icons.map((icon, index) => (
                <Icon key={index} icon={icon} />
            ))}
        </View>
        </View>
    )
}

export default BottomTabs

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        width: '100%',
        bottom: '3%',
        zIndex: 999,
        backgroundColor: '#000'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 50,
        paddingTop: 10
    },
    icon: {
        width: 30,
        height: 30,
    }
})