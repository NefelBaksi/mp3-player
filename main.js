/* elementlere ulasip obje olarak kullanma, yakalama*/
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

//sirasi
let index;

//dongu
let loop = true;

//sarki listesi
const songsList = [
  // 0 1 2
  {
    name: "Gelo Ew Ki Bu",
    link: "assets/gelo-ew-ki-bu.mp3",
    artist: "Aram Tigran",
    image: "assets/aram-tigran.jpeg",
  },
  {
    name: "Home",
    link: "assets/home.mp3",
    artist: "Edward Sharpe & The Magnetic Zeros",
    image: "assets/home.jpeg",
  },
  {
    name: "Aramam",
    link: "assets/aramam.mp3",
    artist: "Ibrahim Tatlises",
    image: "assets/ibrahim-tatlises.jpeg",
  },
  {
    name: "Ax Eman",
    link: "assets/ax-eman.mp3",
    artist: "Rewsan Celiker",
    image: "assets/rewsan-celiker.jpeg",
  },
];

//sarki atama
const setSong = (arrayIndex) => {
  // 0

  //bir obje icerisini tek bir adimda disari cikarip degiskenlere atama, sirasina gore
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  //zamani ayarla
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration); // 125
  };
  //sarki listesini gizle
  playListContainer.classList.add("hide");

  //sarkiyi oynat
  playAudio();
};

//sarkiyi cal
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); // gorun
  playButton.classList.add("hide"); //kaybol
};

//sarki kendiliginden bittiginde sonrakine gec
audio.onended = () => {
  nextSong();
};

//sarkiyi durdur
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

//sonrakine gec
const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index += 1; // index = index + 1
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }

  playAudio();
};

//onceki sarkiya gel
const previousSong = () => {
  pauseAudio();
  if (index > 0) {
    index -= 1; // index = index  - 1
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

//zaman duzenleyici
const timeFormatter = (timeInput) => {
  // 125
  let minute = Math.floor(timeInput / 60); // 02
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60); // 05
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

//tekrar acma, kapama
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

//karistirici tiklanildiginda
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
  } else {
    shuffleButton.classList.add("active");
    loop = false;
  }
});

//anlik zamani yakala
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  //progresi ilerlet
  currentProgress.style.width = audio.currentTime / audio.duration.toFixed(3);
}, 1000);

//liste ekranini getir
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

//listeyi kapat
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//liste olusturma
const initializePlaylist = () => {
  for (let i in songsList) {
    // 0 1 2 3 4
    playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                ${songsList[i].artist}
            </span>
        </div>
        </li>`;
  }
};

//progress bar ayarlama
progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = event.clientX;

  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progress * 100 + "%";

  audio.currentTime = progress * audio.duration;

  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

//zamani guncelle
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

//siradaki butona tiklanildiginda
nextButton.addEventListener("click", nextSong);

//durdur butonuna tiklanildiginda
pauseButton.addEventListener("click", pauseAudio);

//oynat butonuna tiklanildiginda
playButton.addEventListener("click", playAudio);

//geri tusuna tiklanildiginda
prevButton.addEventListener("click", previousSong);

//ekran yukleme
window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();

  initializePlaylist();
};
