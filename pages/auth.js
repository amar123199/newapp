// pages/auth.js
import { useState } from 'react';
// import firebase from '../firebaseConfig';

import { Button, Input, Box, Separator, Text, VStack, Flex, Stack, Heading, Field, Textarea, ButtonGroup, Group, InputAddon } from '@chakra-ui/react';
// import { Field } from "../components/ui/field"


const AuthPage = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  // // Google Sign-In
  // const handleGoogleSignIn = async () => {
  //   setLoading(true);
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   try {
  //     await firebase.auth().signInWithPopup(provider);
  //     // After sign-in, you can redirect to another page or show user info
  //     console.log("User signed in with Google");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  //   setLoading(false);
  // };

  // // Email/Password Sign-In
  // const handleEmailSignIn = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     await firebase.auth().signInWithEmailAndPassword(email, password);
  //     // Redirect to another page on successful sign-in
  //     console.log("User signed in with email");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  //   setLoading(false);
  // };

  // FAB click handler with an alert
  const handleLogin = () => {

  };

  return (
    <div>

      <Flex direction="column" size="2xl">
        <Heading>Login</Heading>

        <Stack gap="10">
          <Group attached>
            <InputAddon>+91</InputAddon>
            <Input placeholder="Phone number..." />
          </Group>

          <Group attached>
            <Input placeholder="Placeholder" />
            <InputAddon>.com</InputAddon>
          </Group>
        </Stack>
        <Button>this is button</Button>
      </Flex>




    </div>
  );
};

export default AuthPage;


