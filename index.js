let currentSongIndex = 0;
let songs = [];
const audioPlayer = document.getElementById("audio-player");
const seekSlider = document.getElementById("seek-slider");
const volumeSlider = document.getElementById("volume-slider");
const currentTimeElem = document.getElementById("current-time");
const totalTimeElem = document.getElementById("total-time");

function loadSongs() {
  fetch("content.JSON")
    .then((response) => response.json())
    .then((jsonData) => {
      songs = jsonData;
      displaySong(currentSongIndex);
    })
    .catch((error) => console.error("Błąd przy wczytywaniu JSON:", error));
}

function displaySong(index) {
  const song = songs[index];
  document.getElementById("song-title").textContent = song.title;
  document.getElementById("band-name").textContent = song.band;
  document.getElementById("album-cover").src = song.img;
  document.getElementById("text-container").src = song.text;
  audioPlayer.src = song.music;

  const backgroundDiv = document.getElementById("background");
  backgroundDiv.style.backgroundImage = `url('${song.img}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  audioPlayer.addEventListener("loadedmetadata", () => {
    seekSlider.max = audioPlayer.duration;
    totalTimeElem.textContent = formatTime(audioPlayer.duration);
  });
}

const playBtn = document.getElementById("play-btn");

playBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.classList.add("active");
  } else {
    audioPlayer.pause();
    playBtn.classList.remove("active");
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  displaySong(currentSongIndex);
  audioPlayer.play();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  displaySong(currentSongIndex);
  audioPlayer.play();
});

document.getElementById("again-btn").addEventListener("click", () => {
  audioPlayer.currentTime = 0;
  audioPlayer.play();
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

audioPlayer.addEventListener("timeupdate", () => {
  seekSlider.value = audioPlayer.currentTime;
  currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
});

seekSlider.addEventListener("input", () => {
  audioPlayer.currentTime = seekSlider.value;
});

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value;
});

loadSongs();

const textContainer = document.getElementById("text-container");

document.getElementById("text").addEventListener("click", () => {
  const song = songs[currentSongIndex];
  textContainer.textContent = song.text;

  if (textContainer.classList.contains("show")) {
    textContainer.classList.remove("show");
    setTimeout(() => {
      textContainer.style.display = "none";
    }, 500);
  } else {
    textContainer.style.display = "block";
    setTimeout(() => {
      textContainer.classList.add("show");
    }, 0);
  }
});

function loadNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  displaySong(currentSongIndex);
  audioPlayer.play();
}

audioPlayer.addEventListener("ended", loadNextSong);

const volumeOnButton = document.getElementById("volume-on");
const volumeOffButton = document.getElementById("volume-off");

audioPlayer.volume = volumeSlider.value;

volumeOnButton.addEventListener("click", () => {
  audioPlayer.volume = 0;
  volumeSlider.value = 0;
  volumeOnButton.style.display = "none";
  volumeOffButton.style.display = "block";
});

volumeOffButton.addEventListener("click", () => {
  audioPlayer.volume = 1;
  volumeSlider.value = 1;
  volumeOffButton.style.display = "none";
  volumeOnButton.style.display = "block";
});

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value;
});

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value;

  if (volumeSlider.value == 0) {
    volumeOffButton.style.display = "block";
    volumeOnButton.style.display = "none";
  } else {
    volumeOnButton.style.display = "block";
    volumeOffButton.style.display = "none";
  }
});
