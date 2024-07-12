import storage from '@react-native-firebase/storage';

// Function to upload an image and return its URL
export const uploadImage = async (uri: string): Promise<string> => {
  if (!uri) return '';
  const response = await fetch(uri);
  const blob = await response.blob();
  const fileName = uri.substring(uri.lastIndexOf('/') + 1);
  const ref = storage().ref(`images/${fileName}`);
  await ref.put(blob);
  const downloadUrl = await ref.getDownloadURL();
  return downloadUrl;
};
