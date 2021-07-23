 window.addEventListener("DOMContentLoaded", () => {

 
  // Instan Music
  const music = new Music(data);

  const list = document.querySelector('.library .song-list');

  const library = () => {
    for(let track of music.tracks) {
      const item = music.createLibrary(track);
      list.append(item);

      item.addEventListener('click', () => {
        music.selectedLibrarySong(track)
        if (music.audioElement.paused) {
          music.audioElement.play();
          music.changePlayPauseIcon("play", music.playBtn.firstElementChild);
        }
      });
    }
  };

  library();

  let index = music.currentTrackIndex;

  const songIndex = music.tracks[index];

   music.loadEvent();

   music.loadSong(songIndex);

});
