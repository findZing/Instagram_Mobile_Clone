import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Stories from '../components/home/Stories'
import Post from '../components/home/Post'
import { POSTS } from '../data/posts'
import BottomTabs from '../components/home/BottomTabs'
import { db } from '../firebase'
import { collectionGroup, getDoc, getDocs, query } from 'firebase/firestore'

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
        inactive: 'https://img.icons8.com/ios/50/ffffff/user-male-circle--v1.png',
        active: 'https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png'
    }
]


const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const callApi = async () => {
            const data = query(collectionGroup(db, 'posts'))
            const queryData = await getDocs(data)
            // console.log(queryData[0].data)
            queryData.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
                // setPosts(state => [...state, doc.data()])
                setPosts(state => [...state, {...doc.data(), id: doc.id}])
            })
            // console.log(queryData.forEach(doc => doc.data()))
            // setPosts(queryData.)
            console.log('hello')
        }

        callApi()
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={navigation} />
            <Stories />
            <ScrollView>
                {
                    posts.map((post, index) => (
                        <Post key={index} post={post} />

                    ))
                }
            </ScrollView>
            <BottomTabs icons={bottomTabIcons} />
        </SafeAreaView>
    )
}

export default HomeScreen


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1
    }
})