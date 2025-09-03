const player = {
  // Get DOM elements
  _playlist: document.querySelector(".playlist"),
  _songTitle: document.querySelector(".song-title"),
  _audio: document.querySelector("#audio"),
  _btnTogglePlay: document.querySelector(".btn-toggle-play"),
  _playIcon: document.querySelector("#play-icon"),
  _btnPrev: document.querySelector(".btn-prev"),
  _btnNext: document.querySelector(".btn-next"),
  // Mảng chứa các bài hát
  _songs: [
    {
      id: 1,
      name: "Kho Báu (with Rhymastic)",
      path: "./musics/Kho Báu (with Rhymastic).mp3",
      artist: "Nguyễn A",
    },
    {
      id: 2,
      name: "NÉT",
      path: "./musics/NÉT.mp3",
      artist: "Nguyễn B",
    },
    {
      id: 3,
      name: "Yêu Em Dài Lâu - Yêu 5",
      path: "./musics/Yêu Em Dài Lâu - Yêu 5.mp3",
      artist: "Nguyễn C",
    },
  ],
  _isPlaying: false,
  currentIndex: 0,
  getCurrentSong() {
    return this._songs[this.currentIndex];
  },
  loadCurrentSong() {
    const currentSong = this.getCurrentSong();
    this._songTitle.textContent = currentSong.name;
    this._audio.src = currentSong.path;
  },
  handlePrevOrNext(step) {
    const songLength = this._songs.length;
    this.currentIndex = (this.currentIndex + step + songLength) % songLength;
    this.loadCurrentSong();

    this._audio.play();
  },
  init() {
    this.loadCurrentSong();
    // Xu ly su kien
    this._btnTogglePlay.addEventListener("click", () => {
      if (this._audio.paused) {
        this._audio.play();
      } else {
        this._audio.pause();
      }
    });

    // Doi icon pause thanh song play
    this._audio.addEventListener("play", () => {
      this._playIcon.classList.add("fa-pause");
      this._playIcon.classList.remove("fa-play");
    });

    // Doi icon play thanh song pause
    this._audio.addEventListener("pause", () => {
      this._playIcon.classList.add("fa-play");
      this._playIcon.classList.remove("fa-pause");
    });

    // lui lai bai dang sau
    this._btnPrev.addEventListener("click", () => {
      this.handlePrevOrNext(-1);
    });

    // next bai tiep
    this._btnNext.addEventListener("click", () => {
      this.handlePrevOrNext(1);
    });

    // Render danh sách songs
    this.render();
  },
  render() {
    // 1. Render danh sách các bài hát từ "_songs"
    const songsElement = this._songs
      .map((song) => {
        return `<div class="song" id=${song.id}>
                    <div class="thumb" style=" background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg');"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.artist}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
      })
      .join("");
    // 2. Sử dụng innerHTML
    this._playlist.innerHTML = songsElement;
  },
};

// Khởi tạo player
player.init();

// Bài tập trên lớp:
// 1. Nhấn next chuyển bài tiếp theo
// 2. Nhấn prev lùi lại 1 bài
// 3. Bài cuối next -> về bài đầu, bài đầu prev -> tới bài cuối
