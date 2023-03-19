import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Validator from 'email-validator'
import app, {db} from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 

const SignupForm = ({navigation}) => {
    const signupFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        username: Yup.string().required().min(2, 'A username is required'),
        password: Yup.string().required().min(8, 'Your password must be at least 8 characters')
    })
    
    const getRandomProfilePicture = async () => {
        const response = await fetch('https://randomuser.me/api')
        const data = await response.json()
        return data.results[0].picture.large
    }

    const onSignup = async (email, password, username) => {
        const auth = getAuth(app)
        try {
            const authUser = await createUserWithEmailAndPassword(auth, email, password)
            const docRef = await setDoc(doc(db,'users', authUser.user.email),{
                owner_uid: authUser.user.uid, 
                username, 
                email: authUser.user.email, 
                profile_picture: await getRandomProfilePicture()
            })
            console.log(docRef)
        } catch (error) {
            Alert.alert('Hello', error.message)
        }
    }
    return (
        <View style={styles.wrapper}>
            <Formik
                initialValues={{ email: '', username: '', password: '' }}
                onSubmit={(values) => {
                    onSignup(values.email, values.password, values.username)
                }}
                validationSchema={signupFormSchema}
                validateOnMount={true}
            >
                {({ handleBlur, handleChange, handleSubmit, values, errors, isValid }) => (
                    <>

                        <View style={[styles.inputField, {
                            borderColor: values.email.length < 1 || Validator.validate(values.email) ? '#ccc' : 'red'
                        }]
                        }>
                            <TextInput
                                placeholder='Email'
                                placeholderTextColor='#444'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                textContentType='emailAddress'
                                autoFocus={true}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />
                        </View>

                        <View style={[styles.inputField, {
                            borderColor: values.username.length < 1 || values.username.length >= 8 ? '#ccc' : 'red'
                        }]}>
                            <TextInput
                                placeholder='Username'
                                placeholderTextColor='#444'
                                autoCapitalize='none'
                                autoFocus={true}
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                value={values.username}
                            />
                        </View>

                        <View style={[styles.inputField, {
                            borderColor: values.password.length < 1 || values.password.length >= 8 ? '#ccc' : 'red'
                        }]}>
                            <TextInput
                                placeholder='Password'
                                placeholderTextColor='#444'
                                autoCapitalize='none'
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType='password'
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                            />
                        </View>

                        <Pressable disabled={!isValid} style={styles.button(isValid)} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </Pressable>

                        <View style={styles.signupContainer}>
                            <Text>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.push('Login')}>
                                <Text style={{ color: '#6BB0F5' }}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

export default SignupForm

const styles = StyleSheet.create({
    inputField: {
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        borderWidth: 1,

    },
    wrapper: {
        marginTop: 80,
    },
    button: isValid => ({
        backgroundColor: isValid ? '#0096F6' : '#9ACAF7',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 4,
        marginTop: 50,
    }),
    buttonText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 20,
    },
    signupContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 20
    }
})