import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, facebookProvider, db } from './firebase';
import { UserProfile } from '../types';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err: any) {
    console.warn('User profile query notice:', err?.message || err);
  }
  return null;
}

export function subscribeToAuth(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    let profile = await getUserProfile(firebaseUser.uid);
    if (!profile) {
      profile = {
        id: firebaseUser.uid,
        fullName:
          firebaseUser.displayName ||
          firebaseUser.email?.split('@')[0] ||
          'HFArt Member',
        username: (
          firebaseUser.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_') ||
          `user_${firebaseUser.uid.slice(0, 5)}`
        ),
        email: firebaseUser.email || '',
        avatar:
          firebaseUser.photoURL ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        bio: 'HFArt Streaming enthusiast.',
        followersCount: 0,
        followingCount: 0,
        sparklesBalance: 5000,
        isCreator: false,
        verified: false,
      };

      callback(profile);

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      } catch (e) {
        console.warn('Firestore write pending:', e);
      }
      return;
    }
    callback(profile);
  });
}

export async function loginWithEmail(
  email: string,
  pass: string,
): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  let profile = await getUserProfile(cred.user.uid);
  if (!profile) {
    profile = {
      id: cred.user.uid,
      fullName: cred.user.displayName || email.split('@')[0],
      username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_'),
      email,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'HFArt Live enthusiast.',
      followersCount: 0,
      followingCount: 0,
      sparklesBalance: 5000,
      isCreator: false,
      verified: false,
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), profile);
    } catch (e) {
      console.warn('Firestore setDoc deferred:', e);
    }
  }
  return profile;
}

export async function registerWithEmail(
  email: string,
  pass: string,
  fullName: string,
  username: string,
): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (cred.user) {
    try {
      await updateProfile(cred.user, { displayName: fullName });
    } catch (e) {
      console.warn('Failed to update display name:', e);
    }
  }
  const profile: UserProfile = {
    id: cred.user.uid,
    fullName: fullName || email.split('@')[0],
    username:
      username ||
      email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_'),
    email,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'HFArt Live stream creator & viewer.',
    followersCount: 0,
    followingCount: 0,
    sparklesBalance: 5000,
    isCreator: true,
    verified: false,
  };
  try {
    await setDoc(doc(db, 'users', cred.user.uid), profile);
  } catch (e) {
    console.warn('Firestore setDoc deferred:', e);
  }
  return profile;
}

export async function loginWithFacebook(): Promise<UserProfile> {
  const cred = await signInWithPopup(auth, facebookProvider);
  let profile = await getUserProfile(cred.user.uid);
  if (!profile) {
    profile = {
      id: cred.user.uid,
      fullName: cred.user.displayName || 'HFArt Member',
      username: (
        cred.user.email?.split('@')[0] || `user_${cred.user.uid.slice(0, 5)}`
      ).toLowerCase().replace(/[^a-z0-9]/g, '_'),
      email: cred.user.email || '',
      avatar:
        cred.user.photoURL ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'HFArt streaming community member.',
      followersCount: 0,
      followingCount: 0,
      sparklesBalance: 5000,
      isCreator: true,
      verified: false,
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), profile);
    } catch (e) {
      console.warn('Firestore setDoc deferred:', e);
    }
  }
  return profile;
}

export async function logoutUser() {
  await signOut(auth);
}
