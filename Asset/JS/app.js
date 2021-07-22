 window.addEventListener("DOMContentLoaded", () => {

 
  // Instan Music
  const music = new Music(data);

  const list = document.querySelector('.library .song-list');

  for(let track of music.tracks) {
    const item = music.createLibrary(track);
    list.append(item);
  }

  let index = music.currentTrack;

  const songIndex = music.tracks[index];

   music.loadEvent();

   music.loadSong(songIndex);

})
