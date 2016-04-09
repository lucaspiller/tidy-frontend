// Sorts albums by the maximum date. Returns newest albums first.
// We use the maximum date so that albums which have new items added will pop
// to the top of the list.
export function albumsSortedByDate(albums) {
  return albums.map(function(album) {
    album.sortDate = Date.parse(album.maxDate)
    return album
  }).sort(function(a, b) {
    return b.sortDate - a.sortDate
  })
}

// Sorts and groups albums by year. Returns newest years first.
//
// [
//   {
//     year:   2015,
//     albums: [ ... ]
//   },
//   ...
// ]
//
export function albumsGroupedByYear(albums) {
  let years = []

  albumsSortedByDate(albums).forEach(function(album) {
    const year = new Date(album.sortDate).getFullYear()
    if (years[year] == undefined) {
      years[year] = []
    }

    years[year].push(album)
  })

  return years.map(function(albums, year) {
    return {
      year:   year,
      albums: albums
    }
  }).reverse()
}
