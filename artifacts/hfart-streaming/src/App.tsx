import React, { useState, useEffect } from 'react';
import { ViewMode, Stream, Creator, UserProfile } from './types';
import {
  INITIAL_STREAMS,
  INITIAL_CREATORS,
  INITIAL_CLIPS,
  INITIAL_RECORDINGS,
  INITIAL_POSTS,
  MOCK_CREATOR_ANALYTICS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CreateModal } from './components/CreateModal';
import { HomeScreen } from './components/HomeScreen';
import { DiscoverScreen } from './components/DiscoverScreen';
import { LiveWatchScreen } from './components/LiveWatchScreen';
import { GoLiveSetupScreen } from './components/GoLiveSetupScreen';
import { CreatorWhileLiveScreen } from './components/CreatorWhileLiveScreen';
import { CreatorDashboard } from './components/CreatorDashboard';
import { UserProfileScreen } from './components/UserProfileScreen';
import { SplashScreen } from './components/SplashScreen';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import { MessagesScreen } from './components/MessagesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { subscribeToAuth, logoutUser } from './lib/authService';
import {
  seedFirestoreIfEmpty,
  subscribeToStreams,
  subscribeToCreators,
  createFirestoreStream,
  toggleFollowFirestoreCreator,
  updateFirestoreStream,
  notifyFollowersStreamLive,
} from './lib/firestoreService';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [streams, setStreams] = useState<Stream[]>(INITIAL_STREAMS);
  const [creators, setCreators] = useState<Creator[]>(INITIAL_CREATORS);
  const [selectedStream, setSelectedStream] = useState<Stream>(INITIAL_STREAMS[0]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('c1');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Seed Firestore and listen to auth + real-time data
  useEffect(() => {
    seedFirestoreIfEmpty();

    const unsubAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });

    const unsubStreams = subscribeToStreams((fireStreams) => {
      if (fireStreams && fireStreams.length > 0) setStreams(fireStreams);
    });

    const unsubCreators = subscribeToCreators((fireCreators) => {
      if (fireCreators && fireCreators.length > 0) setCreators(fireCreators);
    });

    return () => {
      unsubAuth();
      unsubStreams();
      unsubCreators();
    };
  }, []);

  // Splash screen timer — wait at least 2.8s so auth state can settle
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  // After splash: if no user, force auth modal open
  const requiresAuth = !showSplash && authChecked && !currentUser;

  const currentCreator = creators[0];
  const selectedCreator = creators.find((c) => c.id === selectedCreatorId) || creators[0];

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleToggleFollow = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          const isNowFollowing = !c.isFollowing;
          toggleFollowFirestoreCreator(creatorId, !isNowFollowing);
          return {
            ...c,
            isFollowing: isNowFollowing,
            followersCount: isNowFollowing ? c.followersCount + 1 : c.followersCount - 1,
          };
        }
        return c;
      }),
    );
  };

  const handleToggleSubscribe = (creatorId: string) => {
    setCreators((prev) =>
      prev.map((c) =>
        c.id === creatorId ? { ...c, isSubscribed: !c.isSubscribed } : c,
      ),
    );
  };

  const handleSelectStream = (stream: Stream) => {
    setSelectedStream(stream);
    setViewMode('live_watch');
  };

  const handleSelectCreator = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setViewMode('profile');
  };

  const handleStartLiveStream = async (streamData: Partial<Stream>) => {
    const newStream: Stream = {
      id: `stream-${Date.now()}`,
      title: streamData.title || 'Untitled Stream',
      description: streamData.description || '',
      category: streamData.category || 'Entertainment',
      creator: streamData.creator || currentCreator,
      thumbnail:
        streamData.thumbnail ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      viewerCount: 1,
      likesCount: 0,
      startedAt: new Date().toISOString(),
      isLive: true,
      tags: streamData.tags || [],
      visibility: streamData.visibility || 'Public',
      allowClips: streamData.allowClips ?? true,
      enableChat: streamData.enableChat ?? true,
      recordStream: streamData.recordStream ?? true,
    };

    try {
      const { id: _id, ...streamWithoutId } = newStream;
      await createFirestoreStream(streamWithoutId);
      await notifyFollowersStreamLive(
        newStream.creator.name,
        newStream.title,
        newStream.id,
        newStream.creator.avatar,
      );
    } catch (err) {
      console.warn('Firestore stream create failed, continuing locally:', err);
    }

    setStreams((prev) => [newStream, ...prev]);
    setSelectedStream(newStream);
    setViewMode('while_live_creator');
  };

  const handleEndStream = async () => {
    if (selectedStream?.id) {
      try {
        await updateFirestoreStream(selectedStream.id, { isLive: false });
      } catch (err) {
        console.warn('Firestore stream end failed:', err);
      }
      setStreams((prev) =>
        prev.map((s) => (s.id === selectedStream.id ? { ...s, isLive: false } : s)),
      );
    }
    setViewMode('creator_studio');
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setViewMode('home');
  };

  // Render splash until done
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Full-screen modes — no header, no nav
  const isFullscreen = viewMode === 'live_watch' || viewMode === 'while_live_creator' || viewMode === 'go_live_setup';
  const showHeader = !isFullscreen;
  const showBottomNav = viewMode !== 'while_live_creator' && viewMode !== 'live_watch';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {showHeader && (
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <main className={`flex-1 overflow-y-auto ${showHeader ? 'pt-14' : ''}`}>
        {viewMode === 'home' && (
          <HomeScreen
            streams={streams}
            onSelectStream={handleSelectStream}
            onToggleFollow={handleToggleFollow}
            onSelectCreator={handleSelectCreator}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {viewMode === 'discover' && (
          <DiscoverScreen
            streams={streams}
            clips={INITIAL_CLIPS}
            creators={creators}
            onSelectStream={handleSelectStream}
            onSelectCreator={handleSelectCreator}
            onToggleFollow={handleToggleFollow}
          />
        )}

        {viewMode === 'live_watch' && (
          <LiveWatchScreen
            stream={selectedStream}
            streams={streams}
            currentUser={currentUser}
            onToggleFollow={handleToggleFollow}
            onToggleSubscribe={handleToggleSubscribe}
            onSelectCreator={handleSelectCreator}
            onBack={() => setViewMode('home')}
          />
        )}

        {viewMode === 'profile' && (
          <UserProfileScreen
            creator={selectedCreator}
            streams={streams}
            recordings={INITIAL_RECORDINGS}
            clips={INITIAL_CLIPS}
            posts={INITIAL_POSTS}
            currentUser={currentUser}
            onToggleFollow={handleToggleFollow}
            onToggleSubscribe={handleToggleSubscribe}
            onSelectStream={handleSelectStream}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {viewMode === 'creator_studio' && (
          <CreatorDashboard
            creator={currentCreator}
            analytics={MOCK_CREATOR_ANALYTICS}
            setViewMode={setViewMode}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {viewMode === 'go_live_setup' && (
          <GoLiveSetupScreen
            currentCreator={currentCreator}
            onStartLiveStream={handleStartLiveStream}
            onBack={() => setViewMode('creator_studio')}
          />
        )}

        {viewMode === 'while_live_creator' && (
          <CreatorWhileLiveScreen
            stream={selectedStream}
            currentUser={currentUser}
            onEndStream={handleEndStream}
          />
        )}

        {viewMode === 'messages' && (
          <MessagesScreen currentUser={currentUser} creators={creators} />
        )}

        {viewMode === 'settings' && (
          <SettingsScreen
            currentUser={currentUser}
            onLogout={handleLogout}
            onBack={() => setViewMode('profile')}
          />
        )}
      </main>

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        setViewMode={setViewMode}
      />

      {/* Auth modal — required=true blocks dismissal when not logged in */}
      <AuthModal
        isOpen={isAuthModalOpen || requiresAuth}
        required={requiresAuth}
        onClose={requiresAuth ? undefined : () => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />

      {showBottomNav && (
        <BottomNav
          viewMode={viewMode}
          setViewMode={(mode) => {
            // Protect routes that need auth
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            setViewMode(mode);
          }}
          onOpenCreateModal={() => {
            if (!currentUser) { setIsAuthModalOpen(true); return; }
            setIsCreateModalOpen(true);
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
