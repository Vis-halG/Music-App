import { useRef, useState, useEffect } from "react";
import "./player.css";
import { supabase } from "../services/supabase";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaHeart,
  FaMoon,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa";

function Player() {
  const audioRef = useRef(null);

  const [songs, setSongs] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH SONGS FROM SUPABASE ================= */
  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("id", { ascending: true });

      if (!error) {
        setSongs(data);
      }

      setLoading(false);
    };

    fetchSongs();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading songs...</p>;
  if (!songs.length) return <p style={{ textAlign: "center" }}>No songs found</p>;

  const song = songs[index];

  /* ================= PLAY / PAUSE ================= */
  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  /* ================= NEXT / PREV ================= */
  const nextSong = () => {
    setIndex((i) => (i + 1) % songs.length);
    setCurrent(0);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setIndex((i) => (i - 1 + songs.length) % songs.length);
    setCurrent(0);
    setIsPlaying(true);
  };

  /* ================= VOLUME ================= */
  const handleVolume = (e) => {
    const v = Number(e.target.value);
    audioRef.current.volume = v;
    setVolume(v);
  };

  /* ================= TIME FORMAT ================= */
  const format = (t = 0) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="player">
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src={song.audio_url}
        autoPlay={isPlaying}
        onTimeUpdate={() => setCurrent(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={nextSong}
      />

      {/* LEFT */}
      <div className="song-info">
        <img src={song.cover_url} alt="cover" />
        <div>
          <h4>{song.title}</h4>
          <p>{song.artist}</p>
        </div>
      </div>

      {/* CENTER */}
       <div className="controls">
          <FaBackward onClick={prevSong} />
          {isPlaying ? (
            <FaPause className="play" onClick={togglePlay} />
          ) : (
            <FaPlay className="play" onClick={togglePlay} />
          )}
          <FaForward onClick={nextSong} />
        </div>
      <div className="center">
       

        <div className="progress">
          <span className="time">{format(current)}</span>
          <div className="bar">
            <div
              className="fill"
              style={{
                width: duration ? `${(current / duration) * 100}%` : "0%"
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
