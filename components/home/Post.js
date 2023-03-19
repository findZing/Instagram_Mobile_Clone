import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import { Divider } from 'react-native-elements'
import { getAuth } from 'firebase/auth'
import {push, child, ref} from 'firebase/database'
import app, { db } from '../../firebase'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const postFooterIcons = [
    {
        name: 'Like',
        imageUrl: 'https://img.icons8.com/ios/60/ffffff/hearts--v1.png',
        likedImageUrl: 'https://img.icons8.com/ios-filled/90/fa314a/hearts.png'
    },
    {
        name: 'Comment',
        imageUrl: 'https://img.icons8.com/material-outlined/60/ffffff/filled-topic.png',
    },
    {
        name: 'Share',
        imageUrl: 'https://img.icons8.com/external-outline-juicy-fish/60/ffffff/external-send-contact-us-outline-outline-juicy-fish.png',
    },
    {
        name: 'Save',
        imageUrl: 'https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/60/ffffff/external-bookmark-social-media-ui-tanah-basah-basic-outline-tanah-basah.png',
    },
]

const PostHeader = ({ post }) => (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        alignItems: 'center'
    }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={styles.story} source={{ uri: post.profile_picture }} />
            <Text style={{ color: 'white', marginLeft: 5, fontWeight: '700' }}>{post.user}</Text>
        </View>

        <Text style={{ color: 'white', fontWeight: '900' }}>...</Text>
    </View>
)

const PostImage = ({ post }) => (
    <View style={{
        width: '100%',
        height: 450
    }}>
        <Image
            source={{ uri: post.imageUrl }}
            style={{ height: '100%', resizeMode: 'cover' }
            } />
    </View>
)

const PostFooter = ({handleLike, post, currentLikeStatus}) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.leftFooterIconContainer}>
            <TouchableOpacity onPress={() => handleLike(post)}>
                <Image style={styles.footerIcon} source={{uri: currentLikeStatus ? postFooterIcons[0].likedImageUrl : postFooterIcons[0].imageUrl}} />
            </TouchableOpacity>
            <Icon imageStyle={styles.footerIcon} imageUrl={postFooterIcons[1].imageUrl} />
            <Icon imageStyle={styles.footerIcon} imageUrl={postFooterIcons[2].imageUrl} />
        </View>

        <View>
            <Icon imageStyle={styles.footerIcon} imageUrl={postFooterIcons[3].imageUrl} />
        </View>
    </View>
)

const Icon = ({ imageStyle, imageUrl }) => (
    <TouchableOpacity>
        <Image style={imageStyle} source={{ uri: imageUrl }} />
    </TouchableOpacity>
)

const Likes = ({ post, currentLikeStatus }) => {
    const numberUsers = post.likes_by_users.includes(getAuth(app).currentUser.email) ? (currentLikeStatus ? post.likes_by_users.length : post.likes_by_users.length -1)
        : (currentLikeStatus ? post.likes_by_users.length + 1 : post.likes_by_users.length)

    return (
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{numberUsers.toLocaleString('en')} likes</Text>
    </View>
)}

const Caption = ({ post }) => (
    <View style={{marginTop: 5}}>
        <Text style={{ color: 'white' }}>
            <Text style={{ fontWeight: '600'}}>{post.user}</Text>
            <Text> {post.caption}</Text>
        </Text>
    </View>
)

const CommentsSection = ({post}) => (
    <View style={{marginTop: 5}}>
        {post?.comments.length > 0 && (
            <Text style={{color: 'gray'}}>
                View{post?.comments.length > 1 ? ' all' : ''} {post?.comments.length} 
                {post?.comments.length > 1 ? ' comments' : ' comment'}
            </Text>
        )} 
    </View>
)

const Comments = ({post}) => (
    <>
        {post.comments.map((comment, index) => (
            <View key={index} style={{flexDirection: 'row', marginTop: 5}}>
                <Text style={{color: 'white'}}>
                    <Text style={{fontWeight: '600'}}>{comment.user}</Text>{' '}
                    {comment.comment}
                </Text>
            </View>
        ))}
    </>
)
const Post = ({ post }) => {

    const [currentLikeStatus, setCurrentLikeStatus] = useState(post.likes_by_users.includes(
        getAuth(app).currentUser.email
    ))

    const handleLike = async (post) => {
        console.log('hi')
        try {    
            const userPostRef = doc(db, `users/${post.owner_email}/posts/${post.id}`)
            await updateDoc(userPostRef, {
                likes_by_users: currentLikeStatus 
                    ? arrayRemove(getAuth(app).currentUser.email)
                    : arrayUnion(getAuth(app).currentUser.email)
            })
            setCurrentLikeStatus(state => !state)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={{ marginBottom: 30 }}>
            <Divider width={1} orientation='vertical' />
            <PostHeader post={post} />
            <PostImage post={post} />
            <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                <PostFooter post={post} handleLike={handleLike} currentLikeStatus={currentLikeStatus}/>
                <Likes post={post} currentLikeStatus={currentLikeStatus}/>
                <Caption post={post} />
                <CommentsSection post={post} />
                <Comments post={post} />
            </View>
        </View>
    )
}


export default Post

const styles = StyleSheet.create({
    story: {
        width: 35,
        height: 35,
        borderRadius: 50,
        borderWidth: 3,
        marginLeft: 6,
        borderColor: '#ff8501'
    },
    footerIcon: {
        width: 33,
        height: 33,
    },
    leftFooterIconContainer: {
        flexDirection: 'row',
        width: '32%',
        justifyContent: 'space-between',
    }
})