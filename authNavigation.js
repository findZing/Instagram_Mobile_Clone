import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SignedInStack, SignedOutStack } from './navigation'
import app from './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const AuthNavigation = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const userHandler = user => user ? setCurrentUser(user) : setCurrentUser(null)
    
    useEffect(() => {
        const auth = getAuth(app)
        onAuthStateChanged(auth, user => userHandler(user)) 
    }, [])
  return (
    <>{currentUser ? <SignedInStack /> : <SignedOutStack />}</>
  )
}

export default AuthNavigation