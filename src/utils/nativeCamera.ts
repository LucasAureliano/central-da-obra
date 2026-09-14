import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const takePicture = async (): Promise<string | undefined> => {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback
    return undefined;
  }
  
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      width: 800,
      height: 800,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt // Asks user to use camera or gallery
    });

    if (image.base64String) {
      return `data:image/${image.format};base64,${image.base64String}`;
    }
  } catch (error) {
    console.error('Camera error:', error);
    return undefined; // If user cancels
  }
  return undefined;
};
