import { useRef, useState, useEffect } from "react";
import "./player.css";
import {
  FaPlay, FaPause, FaForward, FaBackward, FaHeart, FaVolumeUp, FaVolumeMute
} from "react-icons/fa";

function Player({ songs, currentIndex, setCurrentIndex }) {
  const audioRef = useRef(null);
  const preloadRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const song = songs[currentIndex];
  const nextSong = songs[(currentIndex + 1) % songs.length];

  /* ===== AUTO-PLAY ON SONG CHANGE ===== */
  useEffect(() => {
    if (!audioRef.current || !song) return;

    audioRef.current.src = song.audio_url;
    audioRef.current.load();
    audioRef.current.currentTime = 0;
    setCurrent(0);

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [song?.id]); // Song ID badalne par automatic chalega

  /* ===== SEEKING (Aage Pichhe Karna) ===== */
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrent(time);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const next = () => setCurrentIndex((i) => (i + 1) % songs.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + songs.length) % songs.length);

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
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrent(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={next}
      />
      <audio ref={preloadRef} preload="auto" />

      <div className="song-info">
        <img src={song.cover_url} alt="cover" />
        <div>
          <h4>{song.title}</h4>
          <p>{song.artist}</p>
        </div>
      </div>
<div className="controls">
          <FaBackward onClick={prev} className="btn" />
          <div className="play-wrapper" onClick={togglePlay}>
            {isPlaying ? <FaPause className="play" /> : <FaPlay className="play" />}
          </div>
          <FaForward onClick={next} className="btn" />
        </div>
      <div className="center">
        

        <div className="progress">
          <span className="time">{format(current)}</span>
          <input
            type="range"
            className="seek-bar"
            min="0"
            max={duration || 0}
            value={current}
            onChange={handleSeek}
          />
          <span className="time">{format(duration)}</span>
        </div>
      </div>

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
        <FaHeart className="heart-icon" />
      </div>
    </div>
  );
}

export default Player;