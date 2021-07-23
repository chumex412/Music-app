class Music {
  constructor(songs) {
    this.currentTrackIndex = 0;
    this.currentTrack = null,
    this.tracks = songs(),
    this.library = false,
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
    this.volumeBtn.addEventListener('click', this.displayVolume);
    this.shuffle.addEventListener('click', this.handleShuffle);
    this.favourite.addEventListener('click', this.handleFavourite);
    document.querySelector(".music-header button").addEventListener('click', this.handleLibraryDisplay);
  }

  // Load track to the DOM
  loadSong(track) {
    const {
      audioElement, 
      songTitle, 
      songArtist, 
      songCover, 
      prevBtn, 
      volumeBtn
    } = this;

    audioElement.src = `Asset/Audio/${track.file}.mp3`;
    songTitle.textContent = `${track.title}`;
    songArtist.textContent = `${track.artist}`;
    songCover.src = `Asset/Images/${track.cover}.jpeg`;

    // Hide volume 
    document.querySelector('.volume-wrapper').classList.add('hidden');
    volumeBtn.firstElementChild.classList.remove('is-active');

    if(this.currentTrackIndex === 0) {
      prevBtn.disabled = true;
      prevBtn.firstElementChild.classList.add('mute-color');
    } else {
      prevBtn.firstElementChild.classList.remove('mute-color');
    }

    //Set value of track to current song
    this.currentSong = track;

    //Get all DOM elements with class song-item
    const songItems = document.querySelectorAll(".song-list .song-item");
    
    // Highlight the current playing song in the library
    for(let item of songItems) {
      if(item.id == this.currentTrack.id) {
        item.classList.add('active-song');
      } else {
        item.classList.remove('active-song');
      }
    }
  }

  // Creating Library elements
  createLibrary = (item) => {
    const li = document.createElement('li');
    li.className = 'song-item';
    li.id = item.id;
    const img = document.createElement('img');
    img.src = `Asset/Images/${item.cover}.jpeg`;
    li.append(img);
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.innerHTML = item.title;
    const h3 = document.createElement('h3');
    h3.innerHTML = item.artist;
    div.append(h2);
    div.append(h3);
    li.append(div);
    
    return li;
  }

  // Display library
  handleLibraryDisplay = (e) => {
    
    const musicLibrary = document.querySelector('.library');
    musicLibrary.classList.toggle('show-library');
    
  }

  // Play and pause song
  handlePlay = (e) => {
    const {audioElement, playBtn} = this;
    if(audioElement.paused) {
      audioElement.play();
      this.changePlayPauseIcon('play' ,playBtn.firstElementChild);
    } else {
      audioElement.pause();
      this.changePlayPauseIcon('pause', playBtn.firstElementChild);
    }
  }

  // show Next song
  handleNext = async () => {
    const {tracks, prevBtn, playBtn, audioElement} = this;
    
    prevBtn.disabled = false;
    
    // Get current index of playing song
    const currentIndex = tracks.findIndex(track => track.id === this.currentTrack.id);

    if(this.shuffle.classList.contains('is-active')) {
      this.indexRemaining = this.getRandomIndex();
    } else {
      this.indexRemaining = currentIndex + 1;
    }

    await this.loadSong(tracks[this.currentTrackIndex]);
    if (audioElement.paused) {
      audioElement.play();
      this.changePlayPauseIcon('play', playBtn.firstElementChild);
    }
  }

  // Show previous song
  handlePrev = async (e) => {
    const {tracks, playBtn, audioElement} = this;

    // Get current index of playing song
    const currentIndex = tracks.findIndex(track => track.id === this.currentTrack.id);
    this.indexRemaining = currentIndex - 1;

    await this.loadSong(tracks[this.currentTrackIndex]);
    if (audioElement.paused) {
      audioElement.play();
      this.changePlayPauseIcon('play', playBtn.firstElementChild);
    }
  }

  // Play next song after previous song is ended handler
  songEndHandler = async () => {
    // Get current index of playing song
    const currentIndex = tracks.findIndex(track => track.id === this.currentTrack.id);

    if(this.shuffle.classList.contains('is-active')) {
      this.indexRemaining = this.getRandomIndex();
    } else {
      this.indexRemaining = currentIndex + 1;
    }

    await this.loadSong(tracks[this.currentTrackIndex]);
    if (audioElement.paused) {
      audioElement.play();
      this.changePlayPauseIcon('play', playBtn.firstElementChild);
    }
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
  handleFavourite (e) {
    this.firstElementChild.classList.toggle('is-favourite');
  }

  // Display volume to DOM
  displayVolume () {
    const volWrapper = document.querySelector('.volume-wrapper');
    this.firstElementChild.classList.toggle('is-active');
    volWrapper.classList.toggle('hidden');
    volWrapper.classList.toggle('show');
  }

  // Change play icon to pause
  changePlayPauseIcon(name, icon) {
    if(name === "play") {
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
    } else {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
  }

  // Get and return currentTrack value
  get indexRemaining() {
      return this.currentTrackIndex 
  }

  // Updates the currentTrack value
  set indexRemaining(index) {
    this.currentTrackIndex = index % this.tracks.length;
  }

  // Getting and updating the value of current song info
  get currentSong () {
    return this.currentTrack;
  }

  set currentSong (song) {
    this.currentTrack = song;
  }


  // Return random song index value
  getRandomIndex() {
    return Math.floor(Math.random() * this.tracks.length);
  }

  // Select library song
  selectedLibrarySong = (item) => {
    const { tracks } = this;
    const newTrack = tracks.map((track, index) => {
      if(track.id === item.id) {
        this.loadSong(tracks[index]);
        return {...track, active: true};
      } else {
        return {...track, active: false};
      }
    });
    
    return newTrack
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