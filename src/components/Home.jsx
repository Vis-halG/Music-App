import { useEffect, useState } from "react";
import "./home.css";
import { supabase } from "../services/supabase";
import Player from "../components/Player";

const albums = [
  {
    title: "Starboy",
    artist: "The Weeknd",
    img: "https://picsum.photos/600?1",
    type: "chill",
    desc: "Smooth vibes to relax and unwind."
  },
  {
    title: "Fame",
    artist: "Ariana Grande",
    img: "https://picsum.photos/600?2",
    type: "romantic",
    desc: "Love, emotions and soft melodies."
  },
  {
    title: "To Pimp a Butterfly",
    artist: "Kendrick Lamar",
    img: "https://picsum.photos/600?3",
    type: "workout",
    desc: "High energy tracks to keep you moving."
  },
  {
    title: "Cowboy Carter",
    artist: "Beyonce",
    img: "https://picsum.photos/600?4",
    type: "90s",
    desc: "Classic nostalgia from the golden era."
  }
];

function Home() {
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ===== FETCH SONGS BY TYPE ===== */
  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase
        .from("songs")
        .select("*")
        .eq("type", selectedAlbum.type)
        .order("id");

      setSongs(data || []);
    };

    fetchSongs();
  }, [selectedAlbum]);

  /* ===== AUTO PLAY FIRST SONG ===== */
  useEffect(() => {
    if (songs.length) {
      setCurrentIndex(0);
    }
  }, [songs]);

  return (
    <div className="home">

      {/* ===== HERO ===== */}
      <div className="hero">
        <div className="hero-content">
          <span className="badge">🔥 {selectedAlbum.type}</span>
          <h1>{selectedAlbum.title}</h1>
          <p>{selectedAlbum.desc}</p>
        </div>

        <img className="hero-img" src={selectedAlbum.img} alt="album" />

        {/* ===== SONGS INSIDE HERO ===== */}
        <div className="hero-songs">
          {songs.map((song, i) => (
            <div
              className="song-card"
              key={song.id}
              onClick={() => setCurrentIndex(i)}
            >
              <img src={song.cover_url} />
              <h4>{song.title}</h4>
              <p>{song.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ALBUM SWITCHER ===== */}
      <div className="albums">
        {albums.map((a, i) => (
          <div
            className={`album ${a.title === selectedAlbum.title ? "active" : ""}`}
            key={i}
            onClick={() => setSelectedAlbum(a)}
          >
            <img src={a.img} />
            <h4>{a.title}</h4>
            <p>{a.artist}</p>
          </div>
        ))}
      </div>

      {/* ===== PLAYER ===== */}
      {songs.length > 0 && (
        <Player
          songs={songs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          autoPlay
        />
      )}
    </div>
  );
}

export default Home;
