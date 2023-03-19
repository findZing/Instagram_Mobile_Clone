import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Button, Divider } from 'react-native-elements'
import validUrl from 'valid-url'
import { getAuth } from 'firebase/auth'
import app, { db } from '../../firebase'
import { addDoc, collection, collectionGroup, doc, FieldValue, getDocs, limit, query, setDoc, where } from 'firebase/firestore'
import uuid from 'react-native-uuid'

const PLACEHOLDER_IMG = 'https://www.materiaimpar.com/wp-content/uploads/2015/07/import_placeholder.png'

const uploadPostSchema = Yup.object().shape({
    imageUrl: Yup.string().url().required('A URL is required'),
    caption: Yup.string().max(2200, 'Caption has reached the character limit')

})

const FormikPostUploader = ({ navigation }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMG)
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)

    const getUsername = async () => {
        const auth = getAuth(app)
        const user = auth.currentUser
        const q = query(collection(db, 'users'), where('owner_uid', '==', user.uid), limit(1))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(doc => {
            console.log(doc.data())
            setCurrentLoggedInUser({
                username: doc.data().username,
                profilePicture: doc.data().profile_picture,
            })
        })
    }

    useEffect(() => {
        getUsername()
    }, [])

    const uploadPostToFirebase = async (imageUrl, caption) => {
        const auth = getAuth(app)
        const user = auth.currentUser
        try {
            // uuid.v4()
            const userPostRef = doc(db, `users/${user.email}/posts/${uuid.v4()}`)
            const docRef = await setDoc(userPostRef, {
                imageUrl: imageUrl,
                user: currentLoggedInUser.username,
                profile_picture: currentLoggedInUser.profilePicture,
                owner_uid: user.uid,
                owner_email: user.email,
                caption,
                // createdAt: FieldValue.serverTimestampl(),
                likes: 0,
                likes_by_users: [],
                comments: [],
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Formik
            initialValues={{ caption: '', imageUrl: '' }}
            onSubmit={async (values) => {
                await uploadPostToFirebase(values.imageUrl, values.caption, values)
                //navigation.goBack()
            }}
            validationSchema={uploadPostSchema}
            validateOnMount={true}
        >
            {({ handleBlur, handleChange, handleSubmit, values, errors, isValid }) => (
                <>
                    <View style={{ margin: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Image style={{ width: 100, height: 100 }} source={{ uri: thumbnailUrl ? thumbnailUrl : PLACEHOLDER_IMG }} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <TextInput
                                style={{ color: 'white', fontSize: 18 }}
                                placeholderTextColor='gray'
                                placeholder='Write a caption ...'
                                multiline={true}
                                onChangeText={handleChange('caption')}
                                onBlur={handleBlur('caption')}
                                value={values.caption}
                            />
                        </View>
                    </View>
                    <Divider width={0.2} orientation='vertical' />
                    <TextInput
                        onChange={(e) => setThumbnailUrl(e.nativeEvent.text)}
                        style={{ color: 'white' }}
                        placeholderTextColor='gray'
                        placeholder='Enter Image Url'
                        onChangeText={handleChange('imageUrl')}
                        onBlur={handleBlur('imageUrl')}
                        value={values.imageUrl}
                    />
                    {errors.imageUrl && (
                        <Text style={{ fontSize: 10, color: 'red' }}>
                            {errors.imageUrl}
                        </Text>
                    )}

                    <Button onPress={handleSubmit} title='Share' disabled={!isValid} />
                </>
            )}
        </Formik>
    )
}

export default FormikPostUploader

const styles = StyleSheet.create({})