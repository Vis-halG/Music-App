import { useRef, useState, useEffect } from "react";
import "./player.css";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaHeart,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa";

function Player({ songs, currentIndex, setCurrentIndex, autoPlay }) {
  const audioRef = useRef(null);
  const preloadRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const song = songs[currentIndex];
  const nextSong = songs[(currentIndex + 1) % songs.length];

  /* ===== LOAD + PLAY SONG (SAFE AUTOPLAY) ===== */
  useEffect(() => {
    if (!audioRef.current || !song) return;

    audioRef.current.src = song.audio_url;
    audioRef.current.currentTime = 0;
    audioRef.current.volume = volume;
    setCurrent(0);

    if (autoPlay) {
      const p = audioRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex]);

  /* ===== PRELOAD NEXT SONG ===== */
  useEffect(() => {
    if (!preloadRef.current || !nextSong) return;
    preloadRef.current.src = nextSong.audio_url;
  }, [nextSong]);

  /* ===== CONTROLS ===== */
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const next = () => {
    setCurrentIndex((i) => (i + 1) % songs.length);
  };

  const prev = () => {
    setCurrentIndex((i) => (i - 1 + songs.length) % songs.length);
  };

  const handleVolume = (e) => {
    const v = Number(e.target.value);
    audioRef.current.volume = v;
    setVolume(v);
  };

  const format = (t = 0) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!song) return null;

  return (
    <div className="player">
      {/* MAIN AUDIO */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrent(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={next}
      />

      {/* PRELOAD AUDIO */}
      <audio ref={preloadRef} preload="auto" />

      {/* LEFT */}
      <div className="song-info">
        <img src={song.cover_url} alt="cover" />
        <div>
          <h4>{song.title}</h4>
          <p>{song.artist}</p>
        </div>
      </div>

      {/* CENTER */}
      <div className="center">
        <div className="controls">
          <FaBackward onClick={prev} />
          {isPlaying ? (
            <FaPause className="play" onClick={togglePlay} />
          ) : (
            <FaPlay className="play" onClick={togglePlay} />
          )}
          <FaForward onClick={next} />
        </div>

        <div className="progress">
          <span className="time">{format(current)}</span>
          <div className="bar">
            <div
              className="fill"
              style={{
                width: duration
                  ? `${(current / duration) * 100}%`
                  : "0%"
              }}
            />
          </div>
          <span className="time">{format(duration)}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
        <input
          className="volume-range"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
        />
        <FaHeart />
      </div>
    </div>
  );
}

export default Player;
