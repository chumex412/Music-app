// Instan Music
const music = new Music();

let index = music.currentTrack;

const songIndex = music.song[index];

 music.loadEvent();

 music.loadSong(songIndex);
