// https://github.com/sindresorhus/is-jxa/
const isJxa = () => {
  try {
    return typeof $ === 'function' &&
      typeof Application === 'function' &&
      typeof Application.currentApplication === 'function' &&
      typeof ObjC === 'object' &&
      typeof ObjC.import === 'function';
  } catch (_) {
    return false;
  }
};

const isNode = typeof global !== 'undefined' && ({}).toString.call(global) === '[object global]';
const isJest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;

class SetTrackCounts {
  constructor(music, decorate) {
    this.music = music;
    this.selection = this.music.selection();
    decorate(this.selection);
  }

  sortSongs() {
    this.selection.sort((a, b) => {
      return a.get('artist').localeCompare(b.get('artist')) ||
        a.get('album').localeCompare(b.get('album')) ||
        a.get('year') - b.get('year') ||
        a.get('discNumber') - b.get('discNumber') ||
        a.get('trackNumber') - b.get('trackNumber');
    })
  }

  updateTrackCounts(albumSongs) {
    if (albumSongs.length > 1) {
      const trackCount = albumSongs[albumSongs.length - 1].get('trackNumber');
      albumSongs.forEach(song => song.set('trackCount', trackCount));
    }
  }

  isSameAlbum(song, previousSong) {
    return (
      song.get('artist') === previousSong.get('artist') &&
      song.get('album') === previousSong.get('album') &&
      song.get('year') === previousSong.get('year') &&
      song.get('discNumber') === previousSong.get('discNumber'))
  }

  run() {
    this.sortSongs();

    let currentAlbum = [this.selection[0]];
    let previousSong = this.selection[0];

    this.selection.slice(1).forEach(song => {
      if (this.isSameAlbum(song, previousSong)) {
        currentAlbum.push(song);
      } else {
        this.updateTrackCounts(currentAlbum);
        currentAlbum = [song];
      }
      previousSong = song;
    });

    this.updateTrackCounts(currentAlbum);
  }
}

if (isJxa()) {
  const decorate = songs => {
    songs.forEach(song => {
      Object.defineProperty(song, 'get', {
        value: field => eval(`song.${field}()`)
      });
      Object.defineProperty(song, 'set', {
        value: (field, value) => eval(`song.${field}.set('${value}')`)
      });
    });
  }
  const setTrackCounts = new SetTrackCounts(Application('Music'), decorate);
  setTrackCounts.run();
} else if (isNode) {
  const { execSync } = require('child_process');
  const shellEscape = cmd => cmd.replace(/(["\s'$`\\])/g, '\\$1');
  execSync(`osascript -l JavaScript ${shellEscape(__filename)}`);
} else if (isJest) {
  module.exports = SetTrackCounts;
}
