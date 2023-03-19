import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import app from '../../firebase'
import { getAuth, signOut } from 'firebase/auth'
import { async } from '@firebase/util'

const handleSignout = async () => {
    const auth = getAuth(app)
    try {
        await signOut(auth)
        console.log('Sign out successfully')
    } catch (error) {
        console.error(error)
    }
}

const Header = ({navigation}) => {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleSignout}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/header-logo.jpg')}
                />
            </TouchableOpacity>
            
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('NewPost')}>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/plus-2-math.png'
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/like--v1.png'
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadeBadgeText}>100</Text>
                    </View>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/facebook-messenger.png'
                        }}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20
    },
    logo: {
        width: 100,
        height: 50,
        resizeMode: 'contain'
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: 10,
        resizeMode: 'contain'
    },
    unreadBadge: {
        backgroundColor: '#FF3250',
        position: 'absolute',
        left: 20,
        bottom: 18,
        width: 30,
        height: 18,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,

    },
    unreadeBadgeText : {
        color: 'white',
        fontWeight: '600'
    }
})