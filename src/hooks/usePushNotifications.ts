import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function usePushNotifications() {
  const { profile } = useAuth();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (!profile?.uid) return;

    const registerPush = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('User denied push notifications');
        return;
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token) => {
        // Save FCM token to the user's profile in Firestore
        try {
          await updateDoc(doc(db, 'users', profile.uid), {
            fcmToken: token.value,
            lastTokenUpdate: new Date().toISOString()
          });
          console.log('Push registration success');
        } catch (e) {
          console.error('Error saving push token to profile', e);
        }
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on push registration: ', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        // Here we could trigger a local toast if the app is foreground
        console.log('Push received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        // Triggered when user taps the notification
        console.log('Push action performed: ', notification);
      });
    };

    registerPush();

    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [profile?.uid]);
}
