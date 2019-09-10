const SetTrackCounts = require('./set-track-counts');

const decorate = songs => {
  songs.forEach(song => {
    song.get = field => song[field];
    song.set = (field, value) => song[field] = value;
  });
}

const music = range => {
    /* beautify ignore:start */
    let songs = [
      {artist: 'Artist 1', album: 'Album 1', name: 'Song 2', trackNumber: 4, trackCount: null},
      {artist: 'Artist 2', album: 'Album 1', name: 'Song 1', trackNumber: 1, trackCount: null},
      {artist: 'Artist 2', album: 'Album 1', name: 'Song 2', trackNumber: 2, trackCount: null},
      {artist: 'Artist 2', album: 'Album 1', name: 'Song 3', trackNumber: 3, trackCount: null},
      {artist: 'Artist 2', album: 'Album 1', name: 'Song 4', trackNumber: 4, trackCount: null},
      {artist: 'Artist 3', album: 'Album 1', name: 'Song 1', trackNumber: 1, trackCount: null},
      {artist: 'Artist 3', album: 'Album 1', name: 'Song 2', trackNumber: 2, trackCount: null},
      {artist: 'Artist 3', album: 'Album 2', name: 'Song 1', trackNumber: 1, trackCount: null},
      {artist: 'Artist 4', album: 'Album 1', name: 'Song 1', trackNumber: 1, trackCount: null},
      {artist: 'Artist 4', album: 'Album 1', name: 'Song 2', trackNumber: 2, trackCount: null},
      {artist: 'Artist 4', album: 'Album 1', name: 'Song 3', trackNumber: 3, trackCount: null},
    ];
    songs = songs.map(song => { song.year = 2000; song.discNumber = 1; return song; });
    /* beautify ignore:end */
  if (range) {
    songs = songs.slice(range[0], range[1]);
  }

  return {
    selection: () => songs
  };
}

describe('setting track counts', () => {
  it('returns a subset of songs', () => {
    const setTrackCounts = new SetTrackCounts(music([0, 3]), decorate);
    expect(setTrackCounts.selection.length).toBe(3);
  });

  it('checks album sorting', () => {
    const setTrackCounts = new SetTrackCounts(music(), decorate)
    const originalSelection = Array.from(setTrackCounts.selection);
    setTrackCounts.selection.reverse();
    setTrackCounts.run();
    expect(setTrackCounts.selection).toEqual(originalSelection);
  });

  it('updates a single album', () => {
    const setTrackCounts = new SetTrackCounts(music([1, 5]), decorate)
    setTrackCounts.run();
    const trackCounts = setTrackCounts.selection.map(song => song.trackCount);
    expect(trackCounts).toEqual([4, 4, 4, 4]);
  });

  it('does not update incomplete albums', () => {
    const setTrackCounts = new SetTrackCounts(music([0, 6]), decorate)
    setTrackCounts.run();
    const trackCounts = setTrackCounts.selection.map(song => song.trackCount);
    expect(trackCounts).toEqual([null, 4, 4, 4, 4, null]);
  });

  it('updates multiple albums', () => {
    const setTrackCounts = new SetTrackCounts(music(), decorate)
    setTrackCounts.run();
    const trackCounts = setTrackCounts.selection.map(song => song.trackCount);
    expect(trackCounts).toEqual([null, 4, 4, 4, 4, 2, 2, null, 3, 3, 3]);
  });
});
