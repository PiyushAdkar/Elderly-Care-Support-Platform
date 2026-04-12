import React, { useState, useEffect } from 'react';
import { getEntertainment, searchMusic } from '../api/entertainmentService';

export default function EntertainmentPage() {
  const [activeTab, setActiveTab] = useState('music');
  const [data, setData] = useState({ music: [], stories: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackDuration, setTrackDuration] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const res = await searchMusic(searchQuery);
      setSearchResults(res.data || []);
      setHasSearched(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };

  useEffect(() => {
    const fetchEntertainment = async () => {
      try {
        setIsLoading(true);
        const result = await getEntertainment();
        setData(result.data || { music: [], stories: [] });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch entertainment data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntertainment();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1C3F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0B1C3F] mb-6">Entertainment & Relaxation</h1>

        {/* Tab Toggle */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('music')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'music'
                ? 'bg-[#0B1C3F] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🎵 Music & Audio
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'stories'
                ? 'bg-[#0B1C3F] text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            📖 Read Stories
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'music' && (
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-8">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setHasSearched(false);
                    setSearchResults([]);
                  }
                }}
                placeholder="Search Internet Archive for music..." 
                className="flex-1 px-4 py-3 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B1C3F] shadow-sm"
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="px-6 py-3 bg-[#0B1C3F] text-white rounded-full font-medium hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-70"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
            
            {hasSearched && !isSearching && searchResults.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center mb-8">
                <span className="text-6xl text-slate-300">🔍</span>
                <h3 className="text-xl font-bold text-[#0B1C3F] mt-4">No results found</h3>
                <p className="text-slate-500 mt-2">
                  We couldn't find any audio for "{searchQuery}". Try searching for classic artists like "Lata Mangeshkar" or "Kishore Kumar".
                </p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#0B1C3F] mb-4">Search Results</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((track, idx) => (
                      <div key={track.identifier || track.url || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100">
                        <div className="flex flex-col max-w-[80%]">
                          <span className="font-medium text-slate-800 truncate">{track.title}</span>
                          <span className="text-xs text-slate-500 truncate">{track.artist}</span>
                        </div>
                        <button
                          onClick={() => setCurrentTrack(track)}
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors flex items-center justify-center shrink-0"
                          title="Play"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <h2 className="text-2xl font-bold text-[#0B1C3F] mb-4">Curated Playlists</h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'music' &&
            data.music.map((category, index) => (
              <div key={category.id || index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1C3F]">{category.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{category.description}</p>
                  </div>
                  {category.mood && (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium border border-blue-100">
                      {category.mood}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3 mt-4">
                  {category.tracks.map((track, idx) => (
                    <div key={track.title || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{track.title}</span>
                        <span className="text-xs text-slate-500">{track.artist}</span>
                      </div>
                      <button
                        onClick={() => setCurrentTrack(track)}
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors flex items-center justify-center shrink-0"
                        title="Play"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {activeTab === 'stories' &&
            data.stories.map((category, index) => (
              <div key={category.id || index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                 <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1C3F]">{category.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{category.description}</p>
                  </div>
                  {category.genre && (
                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium border border-purple-100">
                      {category.genre}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3 mt-4">
                  {category.stories.map((story, idx) => (
                    <div key={story.title || idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{story.title}</span>
                        <span className="text-xs text-slate-500">{story.author} • {story.readTime} min read</span>
                      </div>
                      <button
                        className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-full transition-colors flex items-center justify-center shrink-0"
                        title="Read"
                        onClick={() => alert(`Reading functionality for "${story.title}" coming soon!`)}
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Global Audio Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 w-full bg-[#0B1C3F] text-white p-4 pr-40 z-50 flex flex-col sm:flex-row items-center justify-between shadow-2xl rounded-t-xl sm:rounded-none">
          <div className="flex items-center space-x-4 mb-3 sm:mb-0 w-full sm:w-auto">
             <div className="bg-blue-900/50 p-3 rounded-lg hidden sm:block">
              <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold truncate">{currentTrack.title}</h4>
              <p className="text-sm text-blue-200 truncate">{currentTrack.artist} • {formatTime(trackDuration)}</p>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-2xl px-4 flex items-center gap-4">
             <audio 
              key={currentTrack.url}
              src={currentTrack.url} 
              controls 
              autoPlay
              onLoadedMetadata={(e) => setTrackDuration(e.target.duration)}
              className="w-full max-w-[200px] sm:max-w-md h-10 outline-none"
              controlsList="nodownload"
              onError={(e) => console.error("Audio playback error:", e.nativeEvent)}
            >
              Your browser does not support the audio element.
            </audio>
             <button 
              onClick={() => setCurrentTrack(null)}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors shrink-0"
              title="Close Player"
            >
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
