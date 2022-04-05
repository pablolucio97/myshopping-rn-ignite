import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage'

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';

export function Upload() {
  const [image, setImage] = useState('');

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  async function handleUpload() {
    try {
      const fileName = new Date().getTime()
      const reference = storage().ref(`/images/${fileName}.png`);
      reference.putFile(image)
        .then(() => console.log('Upload complete'));
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Header title="Lista de compras" />

      <Content>
        <Photo uri={image} onPress={handlePickImage} />

        <Button
          title="Fazer upload"
          onPress={handleUpload}
        />

        <Progress>
          0%
        </Progress>

        <Transferred>
          0 de 100 bytes transferido
        </Transferred>
      </Content>
    </Container>
  );
}
