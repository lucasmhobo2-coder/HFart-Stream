import { 
  collection, doc, getDocs, setDoc, addDoc, updateDoc, onSnapshot, query, orderBy, limit, increment, serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Stream, Creator, ChatMessage, NotificationItem } from '../types';
import { INITIAL_CREATORS, INITIAL_STREAMS, INITIAL_CHAT_MESSAGES } from '../data/mockData';

// Seed initial real records into Firestore if DB is empty
export async function seedFirestoreIfEmpty() {
  try {
    const fetchPromise = getDocs(collection(db, 'streams'));
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore network timeout')), 3000)
    );

    const streamsSnap = (await Promise.race([fetchPromise, timeoutPromise])) as any;
    if (streamsSnap && streamsSnap.empty) {
      console.log('Seeding initial streams and creators to Firestore...');
      
      // Seed Creators
      for (const creator of INITIAL_CREATORS) {
        await setDoc(doc(db, 'creators', creator.id), creator);
      }

      // Seed Streams
      for (const stream of INITIAL_STREAMS) {
        await setDoc(doc(db, 'streams', stream.id), {
          ...stream,
          createdAt: serverTimestamp(),
        });

        // Seed Chat for stream 1
        if (stream.id === 'str-1') {
          for (const msg of INITIAL_CHAT_MESSAGES) {
            const { id: _ignore, ...msgData } = msg;
            await addDoc(collection(db, 'streams', stream.id, 'chat'), {
              ...msgData,
              createdAt: serverTimestamp(),
            });
          }
        }
      }
      console.log('Firestore seeding complete!');
    }
  } catch (err: any) {
    console.warn('Firestore seeding offline mode / cached:', err?.message || err);
  }
}

// Real-time listener for live streams
export function subscribeToStreams(callback: (streams: Stream[]) => void) {
  const q = collection(db, 'streams');
  return onSnapshot(q, (snapshot) => {
    const streamsList: Stream[] = [];
    snapshot.forEach((docSnap) => {
      streamsList.push({ id: docSnap.id, ...docSnap.data() } as Stream);
    });
    // Sort live streams first
    streamsList.sort((a, b) => (b.isLive ? 1 : 0) - (a.isLive ? 1 : 0));
    callback(streamsList);
  }, (error) => {
    console.error('Streams snapshot error:', error);
    callback(INITIAL_STREAMS);
  });
}

// Real-time listener for creators
export function subscribeToCreators(callback: (creators: Creator[]) => void) {
  const q = collection(db, 'creators');
  return onSnapshot(q, (snapshot) => {
    const creatorsList: Creator[] = [];
    snapshot.forEach((docSnap) => {
      creatorsList.push({ id: docSnap.id, ...docSnap.data() } as Creator);
    });
    if (creatorsList.length > 0) {
      callback(creatorsList);
    } else {
      callback(INITIAL_CREATORS);
    }
  }, (error) => {
    console.error('Creators snapshot error:', error);
    callback(INITIAL_CREATORS);
  });
}

// Real-time listener for stream chat
export function subscribeToStreamChat(streamId: string, callback: (messages: ChatMessage[]) => void) {
  const chatRef = collection(db, 'streams', streamId, 'chat');
  const q = query(chatRef, orderBy('createdAt', 'asc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      messages.push({ ...data, id: docSnap.id } as ChatMessage);
    });
    callback(messages);
  }, (error) => {
    console.warn('Chat snapshot error, fallback to initial chat:', error);
    callback(INITIAL_CHAT_MESSAGES);
  });
}

// Post a chat message to Firestore
export async function sendFirestoreChatMessage(streamId: string, messageData: Omit<ChatMessage, 'id'>) {
  try {
    const chatRef = collection(db, 'streams', streamId, 'chat');
    await addDoc(chatRef, {
      ...messageData,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to send chat message to Firestore:', err);
  }
}

// Create a new real live stream in Firestore
export async function createFirestoreStream(stream: Omit<Stream, 'id'>): Promise<string> {
  const streamsRef = collection(db, 'streams');
  const docRef = await addDoc(streamsRef, {
    ...stream,
    createdAt: serverTimestamp(),
  });

  // Also update creator isLive status
  if (stream.creator && stream.creator.id) {
    try {
      await updateDoc(doc(db, 'creators', stream.creator.id), {
        isLive: true,
      });
    } catch (e) {
      // If creator doesn't exist yet in firestore
      await setDoc(doc(db, 'creators', stream.creator.id), {
        ...stream.creator,
        isLive: true,
      });
    }
  }

  return docRef.id;
}

// Send Real-Time Follower Notification when creator goes live
export async function notifyFollowersStreamLive(creatorName: string, streamTitle: string, streamId: string, avatar: string) {
  try {
    const notifRef = collection(db, 'notifications');
    await addDoc(notifRef, {
      type: 'live',
      title: `${creatorName} is Live Now!`,
      message: `🔴 HFArt: ${creatorName} has started streaming: "${streamTitle}". Tap to watch.`,
      timeAgo: 'Just now',
      read: false,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      linkAction: streamId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error sending follower notification:', err);
  }
}

// Real-time listener for notifications
export function subscribeToNotifications(callback: (notifications: NotificationItem[]) => void) {
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const list: NotificationItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as NotificationItem);
    });
    callback(list);
  }, (err) => {
    console.warn('Notifications snapshot error:', err);
  });
}

// Update live stream (e.g. End Stream, Viewer count, Likes)
export async function updateFirestoreStream(streamId: string, updates: Partial<Stream>) {
  try {
    const streamDoc = doc(db, 'streams', streamId);
    await updateDoc(streamDoc, updates);
  } catch (err) {
    console.error('Error updating stream in Firestore:', err);
  }
}

// Like a stream in Firestore
export async function likeFirestoreStream(streamId: string) {
  try {
    const streamDoc = doc(db, 'streams', streamId);
    await updateDoc(streamDoc, {
      likesCount: increment(1),
    });
  } catch (err) {
    console.error('Error liking stream in Firestore:', err);
  }
}

// Follow or Unfollow creator in Firestore
export async function toggleFollowFirestoreCreator(creatorId: string, currentFollowingState: boolean) {
  try {
    const creatorDoc = doc(db, 'creators', creatorId);
    await updateDoc(creatorDoc, {
      isFollowing: !currentFollowingState,
      followersCount: increment(currentFollowingState ? -1 : 1),
    });
  } catch (err) {
    console.error('Error toggling follow creator in Firestore:', err);
  }
}
