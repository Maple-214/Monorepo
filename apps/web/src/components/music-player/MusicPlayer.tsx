import React from 'react';
import { Card, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import styles from './MusicPlayer.module.styl';

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  audio: string;
  duration: number;
}

interface MusicPlayerProps {
  isDark?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isDark = false }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [currentSongIndex, setCurrentSongIndex] = React.useState(0);
  const [isRepeat, setIsRepeat] = React.useState(false);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<number>(0);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playlist: Song[] = [
    {
      id: 1,
      title: '小柔Channel',
      artist: '晴天',
      cover: 'http://imge.kugou.com/stdmusic/120/20220117/20220117153343822315.jpg',
      audio:
        'https://sharefs.kugou.com/202509110043/2a332871c754850edc8936aa9a73ad26/v3/7307921e861154495cdcb5a3e9ff01ba/yp/full/ap1000_us0_pi409_s782798405.mp3',
      duration: 272,
    },
    {
      id: 2,
      title: '花海',
      artist: '小柔Channel',
      cover: 'http://imge.kugou.com/stdmusic/120/20220117/20220117153343822315.jpg',
      audio:
        'https://sharefs.kugou.com/202509110140/c5f13e6dcd0ecabaf2723a85287808c6/v3/1e160db54f124c435cda8fb880745497/yp/full/ap1000_us0_pi409_s4251160347.mp3',
      duration: 180,
    },
    {
      id: 3,
      title: '海色',
      artist: '小柔Channel',
      cover: 'http://imge.kugou.com/stdmusic/120/20220117/20220117153343822315.jpg',
      audio: 'https://music.163.com/song/media/outer/url?id=2128522811.mp3',
      duration: 240,
    },
  ];

  const currentSong = playlist[currentSongIndex];

  const formatTime = (s: number) => {
    if (!Number.isFinite(s) || s <= 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };

    const onTime = () => {
      const t = audio.currentTime || 0;
      const d = audio.duration || 0;
      setCurrentTime(t);
      setDuration(d);
      setProgress(d > 0 ? (t / d) * 100 : 0);
    };

    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isRepeat]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (isPlaying) {
      const t = setTimeout(() => {
        audio.play().catch(() => {});
      }, 0);
      return () => clearTimeout(t);
    }
  }, [currentSongIndex]);

  const handlePlayPause = () => setIsPlaying((p) => !p);

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setTimeout(() => setIsPlaying(true), 0);
  };

  const handleNext = () => {
    if (isShuffle) {
      setCurrentSongIndex(Math.floor(Math.random() * playlist.length));
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    }
    setTimeout(() => setIsPlaying(true), 0);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value);
    setProgress(pct);
    const audio = audioRef.current;
    if (audio && duration > 0) {
      audio.currentTime = (pct / 100) * duration;
      setCurrentTime(audio.currentTime);
    }
  };

  return (
    <Card
      className={`w-full max-w-2xl rounded-2xl p-6 shadow-lg border-none transition-all ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      <audio ref={audioRef} src={currentSong.audio} preload="metadata" />

      {/* 封面 + 歌曲信息 */}
      <div className="flex items-center gap-5 mb-4">
        <div
          className={`w-20 h-20 bg-gradient-to-br rounded-lg flex items-center justify-center shadow-md transition-all ${
            isDark ? 'from-gray-700 to-gray-800' : 'from-orange-200 to-orange-100'
          }`}
        >
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentSong.artist}
          </h3>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {currentSong.title}
          </h2>
        </div>
        <Button isIconOnly variant="light" onPress={() => setIsFavorite((f) => !f)} className="p-0">
          <Icon
            icon="lucide:heart"
            width={22}
            className={isFavorite ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}
          />
        </Button>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={handleRangeChange}
          className={`w-full appearance-none h-2 rounded-full focus:outline-none ${styles['range-thumb']}`}
          style={{
            background: `linear-gradient(to right, ${
              isDark ? '#f97316' : '#111827'
            } ${progress}%, #e6e6e6 ${progress}%)`,
          }}
        />
        <div
          className={`flex justify-between text-xs mt-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-6">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsRepeat((r) => !r)}
          className={`${isRepeat ? 'text-orange-500' : isDark ? 'text-gray-300' : 'text-gray-600'} p-0`}
        >
          <Icon icon="lucide:repeat" width={18} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          onPress={handlePrev}
          className={isDark ? 'text-white p-0' : 'text-gray-800 p-0'}
        >
          <Icon icon="lucide:skip-back" width={20} />
        </Button>
        <Button
          isIconOnly
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
            isDark ? 'bg-orange-500 text-white' : 'bg-black text-white'
          }`}
          onPress={handlePlayPause}
        >
          <Icon icon={isPlaying ? 'lucide:pause' : 'lucide:play'} width={26} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          onPress={handleNext}
          className={isDark ? 'text-white p-0' : 'text-gray-800 p-0'}
        >
          <Icon icon="lucide:skip-forward" width={20} />
        </Button>
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsShuffle((s) => !s)}
          className={`${isShuffle ? 'text-orange-500' : isDark ? 'text-gray-300' : 'text-gray-600'} p-0`}
        >
          <Icon icon="lucide:shuffle" width={18} />
        </Button>
      </div>
    </Card>
  );
};

export default MusicPlayer;
