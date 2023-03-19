import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Validator from 'email-validator'
import app from '../../firebase'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = ({navigation}) => {
    const loginFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        password: Yup.string().required().min(8, 'Your password must be at least 8 characters')
    })

    const onLogin = async (email, password) => {
        const auth = getAuth(app)
        try {
            await signInWithEmailAndPassword(auth,email, password)
            console.log('Firebase Login Successfull')
        } catch (error) {
            Alert.alert(
                'Hello',
                error.message + '\n\n... What would you like to do next ?',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK'),
                        style: 'cancel',
                    },
                    {
                        text: 'Sign Up',
                        onPress: () => navigation.push('Signup'),
                        
                    }
                ]
            )
        }
    }
    return (
        <View style={styles.wrapper}>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={(values) => {
                    onLogin(values.email, values.password)
                }}
                validationSchema={loginFormSchema}
                validateOnMount={true}
            >
                {({ handleBlur, handleChange, handleSubmit, values, errors, isValid }) => (
                    <>

                        <View style={[styles.inputField, {
                            borderColor: values.email.length < 1 || Validator.validate(values.email) ? '#ccc' : 'red'
                        }]
                        }>
                            <TextInput
                                placeholder='Phone number, username or email'
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

                        <View style={{ alignItems: 'flex-end', marginBottom: 30 }}>
                            <Text style={{ color: '#6BB0F5' }}>Forgot password</Text>
                        </View>
                        <Pressable disabled={!isValid} style={styles.button(isValid)} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </Pressable>

                        <View style={styles.signupContainer}>
                            <Text>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.push('Signup')}>
                                <Text style={{ color: '#6BB0F5' }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

export default LoginForm

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
        borderRadius: 4
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
        marginTop: 50
    }
})