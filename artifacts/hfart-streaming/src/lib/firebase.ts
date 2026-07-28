import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

const firestoreSettings = {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
};

export const db =
  firebaseConfig.firestoreDatabaseId &&
  firebaseConfig.firestoreDatabaseId !== '(default)'
    ? initializeFirestore(
        app,
        firestoreSettings,
        firebaseConfig.firestoreDatabaseId,
      )
    : initializeFirestore(app, firestoreSettings);
