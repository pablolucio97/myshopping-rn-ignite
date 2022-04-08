import React, { useState } from 'react';

import { Container, Account, Title, Subtitle } from './styles';
import { ButtonText } from '../../components/ButtonText';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import auth from '@react-native-firebase/auth'
import { Alert } from 'react-native';

export function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleAnonymousSignIn() {
    const { user } = await auth().signInAnonymously()
    console.log(user)
  }

  async function handleEmailPasswordRegistering() {
    try {
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => console.log('user authenticated successfully'))
        .catch(error => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              return Alert.alert('Falha ao autenticar-se',
                'Email já em uso.');
              break;
            case 'auth/invalid-email':
              return Alert.alert('Falha ao autenticar-se',
                'Email inválido, cheque seu email.');
              break;
            case 'auth/weak-password':
              return Alert.alert('Falha ao autenticar-se',
                'Senha precisa ter pelo menos 6 dígitos');
              break;
              return
          }
          console.log(error.code)
        })
    } catch (error) {
      return
    }
  }

  async function handleEmailPasswordSignIn() {
    try {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(({ user }) => console.log(user.email))
        .catch(error => {
          if (error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password') {
            return Alert.alert('Falha ao autenticar-se',
              'Email ou senha incorretos.');
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  async function handleRecoveryPassword() {
    try {
      await auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert('Redefinição de senha',
            'Enviamos um e-mail para que você possa redefinir sua senha.')
        })
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <Container>
      <Title>MyShopping</Title>
      <Subtitle>monte sua lista de compra te ajudar nas compras</Subtitle>

      <Input
        placeholder="e-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <Input
        placeholder="senha"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Entrar" onPress={handleEmailPasswordSignIn} />

      <Account>
        <ButtonText title="Recuperar senha" onPress={handleRecoveryPassword} />
        <ButtonText title="Criar minha conta" onPress={handleEmailPasswordRegistering} />
      </Account>
    </Container>
  );
}