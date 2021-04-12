class Music {
  constructor() {
    this.currentTrack = 0;
    this.musicBtns = document.querySelector('.music-action-btn');
    this.audioElement = document.getElementById('musicFile');
    this.songTitle = document.getElementById('songTitle');
    this.songArtist = document.getElementById('songArtist');
    this.songCover = document.querySelector('.song-cover');
    this.volume = document.getElementById('volume');
    this.seekBar = document.getElementById('seekBar');
    this.playBtn = document.getElementById('play');
    this.nextBtn = document.getElementById('next');
    this.prevBtn = document.getElementById('previous');
    this.volumeBtn = document.getElementById('volumeBtn');
    this.shuffle = document.getElementById('shuffle');
    this.favourite = document.getElementById('favourite');
    this.volumeContainer = document.querySelector('.volume-container');
    this.song = [
      {
        title: 'We Dont Talk Anymore',
        artist: "Charlie Puth ft Selena Gomez",
        file: "song1",
        cover: "cover1"
      },
      {
        title: 'Pretty Little Liars',
        artist: "Black ft J. Cole",
        file: "song2",
        cover: "cover2"
      },
      {
        title: 'Up All Night',
        artist: "Khalid",
        file: "song3",
        cover: "cover3"
      },
      {
        title: 'Got Money',
        artist: "Lil Wayne ft T-pain",
        file: "song4",
        cover: "cover4"
      },
      {
        title: 'Falling Like the Stars',
        artist: "James Arthur",
        file: "song5",
        cover: "cover5"
      },
      {
        title: 'Vibration',
        artist: "Fireboy",
        file: "song6",
        cover: "cover6"
      },
    ];
    
  }

  // Event Listeners
  loadEvent() {
    this.playBtn.addEventListener('click', this.handlePlay);
    this.nextBtn.addEventListener('click', this.handleNext);
    this.prevBtn.addEventListener('click', this.handlePrev);
    this.audioElement.addEventListener('loadeddata', this.displayTimer);
    this.audioElement.addEventListener('timeupdate', this.displayCurrentTime);
    this.audioElement.addEventListener('ended', this.handleNext);
    this.volume.addEventListener('input', this.handleVolume);
    this.seekBar.addEventListener('input', this.setProgress);
    this.volumeContainer.addEventListener('click', this.displayVolume);
    this.shuffle.addEventListener('click', this.handleShuffle);
    this.favourite.addEventListener('click', this.handleFavourite);
  }

  // Load track to the DOM
  loadSong(index) {
    const {audioElement, songTitle, songArtist, songCover, prevBtn, volumeBtn} = this;

    audioElement.src = `Asset/Audio/${index.file}.mp3`;
    songTitle.textContent = `${index.title}`;
    songArtist.textContent = `${index.artist}`;
    songCover.src = `Asset/Images/${index.cover}.jpeg`;

    // Hide volume 
    document.querySelector('.volume-wrapper').classList.add('hidden');
    volumeBtn.firstElementChild.classList.remove('is-active');

    if(this.currentTrack === 0) {
      prevBtn.disabled = true;
    }
  }

  // Play and pause song
  handlePlay = (e) => {
    const {audioElement, playBtn} = this;
    if(audioElement.paused) {
      audioElement.play();
      this.changePlayIcon(playBtn.firstElementChild);
    } else {
      audioElement.pause();
      this.changePauseIcon(playBtn.firstElementChild);
    }
  }

  // show Next song
  handleNext = () => {
    const {song, prevBtn, playBtn} = this;
    this.changePauseIcon(playBtn.firstElementChild);
    prevBtn.disabled = false;

    this.indexRemaining = this.indexRemaining + 1;

    // Go to first song on reaching the end
    if(this.currentTrack > (song.length - 1)) {
      this.currentTrack = 0;
    }

    this.loadSong(song[this.currentTrack]);
  }

  // Show previous song
  handlePrev = (e) => {
    const {song, prevBtn, playBtn} = this;
    this.changePauseIcon(playBtn.firstElementChild);

    this.indexRemaining = this.indexRemaining - 1;

    this.loadSong(song[this.currentTrack]);
  }

  // Sync media element volume and Determine what happens with volume
  handleVolume = (e) => {
    this.audioElement.volume = e.target.value / 10;
    this.volumeBtn.firstElementChild.classList.remove('fa-volume-mute');
    this.volumeBtn.firstElementChild.classList.add('fa-volume-up');
    
    // If html media element is less than 0
    if(this.audioElement.volume === 0) {
      this.volumeBtn.firstElementChild.classList.remove('fa-volume-up');
      this.volumeBtn.firstElementChild.classList.add('fa-volume-mute');
    }
  }

  // Activates shuffle option
  handleShuffle() {
    this.classList.toggle('is-active'); 
    this.firstElementChild.classList.toggle('is-active');
  }

  // Activates favourite
  handleFavourite = (e) => {
    if(e.target.classList.contains('fa-heart')) {
      e.target.classList.toggle('is-favourite');
    }
  }

  // Display volume to DOM
  displayVolume = (e) => {
    const volWrapper = document.querySelector('.volume-wrapper');
    if(e.target.parentElement.classList.contains('volume-btn')) {
      e.target.classList.toggle('is-active');
      volWrapper.classList.toggle('hidden');
      volWrapper.classList.toggle('show');
    }
  }

  // Change play icon to pause
  changePlayIcon(icon) {
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
  }

  // Change pause icon to play
  changePauseIcon(icon) {
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  }

  // Get and return currentTrack value
  get indexRemaining() {
    if(this.shuffle.classList.contains('is-active')) {
      return this.currentTrack = this.getRandomIndex();
    } else {
      return this.currentTrack 
    }
  }

  // Updates the currentTrack value
  set indexRemaining(index) {
    this.currentTrack = index;
  }

  // Return random song index value
  getRandomIndex() {
    return Math.floor(Math.random() * this.song.length);
  }

  // Show Total duration of audio
  displayTimer = (e) => {
    const {duration} = e.target;
    // Set max to value of audio element duration property
    this.seekBar.max = duration;
    
    let ds = parseInt(duration % 60);
    let dm = parseInt((duration / 60 ) % 60);
    // Display duration on the DOM
    document.getElementById('totalDuration').innerHTML = (ds < 10) ? `${dm}:0${ds}` : `${dm}:${ds}`;
  }

  displayCurrentTime = (e) => {
    const {currentTime} = e.target;
    let cs = parseInt(currentTime % 60);
    let cm = parseInt((currentTime / 60 ) % 60);
    // Set seek bar to value of audio element currentTime property
    this.seekBar.value = currentTime;
    // Display current audio time on the DOM
    document.getElementById('currentTime').innerHTML = (cs < 10) ? `${cm}:0${cs}` : `${cm}:${cs}`;
  }

  setProgress = () => {
    const {seekBar, audioElement} = this;
    
    // Click seek bar to progress song 
    audioElement.currentTime = seekBar.value;
  }
}