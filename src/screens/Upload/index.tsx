import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage'

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';

import { Container, Content, Progress, Transferred } from './styles';

export function Upload() {
  const [image, setImage] = useState('');
  const [transferredBytes, setTransferredBytes] = useState('');
  const [progress, setProgress] = useState('0');

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

      const uploadTask = reference.putFile(image)

      uploadTask.on('state_changed', snapShot => {
        const percent = ((snapShot.bytesTransferred / snapShot.totalBytes) * 100)
          .toFixed(0)
        setTransferredBytes(`${snapShot.bytesTransferred} transferido de ${snapShot.totalBytes}`)
        setProgress(percent)
      })

      uploadTask.then(() => {
        console.log('Upload completed')
      })
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
          {progress}%
        </Progress>

        <Transferred>
          0 de {transferredBytes} bytes transferido
        </Transferred>
      </Content>
    </Container>
  );
}
