import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import storage from '@react-native-firebase/storage'

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';

import { photosData } from '../../utils/photo.data';

export function Receipts() {

  const [photos, setPhotos] = useState<FileProps[]>([])
  const [currentPhotoView, setCurrentPhotoView] = useState('')
  const [currentPhotoInfo, setCurrentPhotoInfo] = useState('')

  async function fetchImages() {
    await storage()
      .ref('/images')
      .list()
      .then(result => {
        const files: FileProps[] = []
        result.items.forEach(file => {
          files.push({
            name: file.name,
            path: file.fullPath
          })
        })
        setPhotos(files)
      })
  }

  async function deleteImage(path: string) {
    await storage()
      .ref(path)
      .delete()
      .then(() => console.log('Deleted image successfully'))
  }


  async function handleShowImage(path: string) {
    const photo = await storage()
      .ref(path)
      .getDownloadURL()
    setCurrentPhotoView(photo)

    const info = await storage()
      .ref(path)
      .getMetadata()
    setCurrentPhotoInfo(`Uploaded at ${info.timeCreated}`)
  }

  useEffect(() => {
    fetchImages()
  }, [photos])

  return (
    <Container>
      <Header title="Comprovantes" />

      <Photo uri={currentPhotoView} />

      <PhotoInfo>
        {currentPhotoInfo}
      </PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)}
            onDelete={() => deleteImage(item.path)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
