const player = {
  _NEXT: 1,
  _PREV: -1,
  // Get DOM elements
  _playlist: document.querySelector(".playlist"),
  _songTitle: document.querySelector(".song-title"),
  _audio: document.querySelector("#audio"),
  _btnTogglePlay: document.querySelector(".btn-toggle-play"),
  _playIcon: document.querySelector("#play-icon"),
  _btnPrev: document.querySelector(".btn-prev"),
  _btnNext: document.querySelector(".btn-next"),
  _progress: document.querySelector("#progress"),
  _btnRepeat: document.querySelector(".btn-repeat"),
  _btnRandom: document.querySelector(".btn-random"),
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
  _skeeing: false,
  _isRepeat: localStorage.getItem("repeat") === "true",
  _isShuffle: localStorage.getItem("shuffle") === "true",
  currentIndex: +localStorage.getItem("currentIndexSong") ?? 0,

  activeRepeat() {
    this._btnRepeat.classList.toggle("active", this._isRepeat);
  },
  activeShuffle() {
    this._btnRandom.classList.toggle("active", this._isShuffle);
  },
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
    if (this._isShuffle) {
      this.currentIndex = step;
    }
    localStorage.setItem("currentIndexSong", this.currentIndex);
    this.loadCurrentSong();

    this._audio.play();

    // remove active song prev, and active song current
    let songNode;
    this._playlist.querySelectorAll(".song").forEach((item, index) => {
      item.classList.remove("active");
      if (this.currentIndex === index) {
        songNode = item;
      }
    });
    if (songNode) {
      songNode.classList.add("active");
    }

    // this.render();
  },
  getRandomSong() {
    if (this._songs.length === 1) {
      return this.currentIndex;
    }

    let listRandomSongCurrent = !localStorage.getItem("listRandomSong")
      ? [this.currentIndex]
      : JSON.parse(localStorage.getItem("listRandomSong"));

    const listRandomSongCurrentIncludeCurrentIndex =
      !listRandomSongCurrent.includes(this.currentIndex) &&
      listRandomSongCurrent.length === this._songs.length - 1;

    if (
      listRandomSongCurrentIncludeCurrentIndex ||
      listRandomSongCurrent.length === this._songs.length
    ) {
      listRandomSongCurrent = [];
      localStorage.setItem(
        "listRandomSong",
        JSON.stringify(listRandomSongCurrent)
      );
    }

    let randomSong = Math.round(Math.random() * (this._songs.length - 1));

    while (
      listRandomSongCurrent.includes(randomSong) ||
      this.currentIndex === randomSong
    ) {
      randomSong = Math.round(Math.random() * (this._songs.length - 1));
    }

    const listRandomSongNew = [...listRandomSongCurrent, randomSong];
    localStorage.setItem("listRandomSong", JSON.stringify(listRandomSongNew));
    return randomSong;
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
      const { currentTime } = this._audio;
      if (currentTime > 2) {
        this._audio.currentTime = 0;
      } else {
        let currentIndex = this._PREV;
        if (this._isShuffle) {
          currentIndex = this.getRandomSong();
        }
        this.handlePrevOrNext(currentIndex);
      }
    });

    // next bai tiep
    this._btnNext.addEventListener("click", () => {
      let currentIndex = this._NEXT;
      if (this._isShuffle) {
        currentIndex = this.getRandomSong();
      }
      this.handlePrevOrNext(currentIndex);
    });

    // Xử lý progress chạy theo thời gian bài hát được cập nhật
    this._audio.addEventListener("timeupdate", () => {
      const { duration, currentTime } = this._audio;
      if (!duration || this._skeeing) {
        return;
      }

      this._progress.value = Math.round((currentTime / duration) * 100);
    });

    // bắt sự kiện mousedown, mouseup, bắt trạng thái kéo tua, di chuyển bài hát đến vị trí mong muốn
    this._progress.addEventListener("mousedown", () => {
      this._skeeing = true;
    });

    this._progress.addEventListener("mouseup", (e) => {
      this._skeeing = false;

      const nextProgress = e.target.value;
      const nextDuration = (nextProgress / 100) * this._audio.duration;
      this._audio.currentTime = nextDuration;
    });

    // bắt sự kiện ended next bài
    this._audio.addEventListener("ended", () => {
      if (!this._isRepeat) {
        let currentIndex = this._NEXT;
        if (this._isShuffle) {
          currentIndex = this.getRandomSong();
        }
        this.handlePrevOrNext(currentIndex);
      } else {
        this._audio.currentTime = 0;
        this._audio.play();
      }
    });

    // active repeat bài hát
    this.activeRepeat();

    this._btnRepeat.addEventListener("click", () => {
      this._isRepeat = !this._isRepeat;
      localStorage.setItem("repeat", this._isRepeat);

      this.activeRepeat();
    });

    // Click vào song -> active
    this._playlist.addEventListener("click", (e) => {
      this._playlist.find;
      const songNode = e.target.closest(".song");

      if (songNode) {
        this._playlist.querySelectorAll(".song").forEach((item) => {
          item.classList.remove("active");
        });
        const index = [...this._playlist.querySelectorAll(".song")].indexOf(
          songNode
        );
        songNode.classList.add("active");

        this.currentIndex = index;
        localStorage.setItem("currentIndexSong", this.currentIndex);

        this.loadCurrentSong();
        this._audio.play();
      }
    });

    // click random song
    this.activeShuffle();

    this._btnRandom.addEventListener("click", () => {
      this._isShuffle = !this._isShuffle;
      localStorage.setItem("shuffle", this._isShuffle);

      this.activeShuffle();
    });

    // Render danh sách songs
    this.render();
  },
  render() {
    // 1. Render danh sách các bài hát từ "_songs"
    const songsElement = this._songs
      .map((song, index) => {
        return `<div class="song ${
          this.currentIndex === index ? "active" : ""
        }" id=${song.id}>
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
