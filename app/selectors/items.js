// Sorts items by the maximum date. Returns oldest items first.
export function itemsSortedByDate(items, ascending = true) {
  return items.map(function(item) {
    item.sortDate = Date.parse(item.timestamp)
    return item
  }).sort(function(a, b) {
    if (ascending) {
      return a.sortDate - b.sortDate
    } else {
      return b.sortDate - a.sortDate
    }
  })
}

// Sorts and groups items by date. Returns newest date first.
//
// [
//   {
//     date:  Date(2015-01-01),
//     items: [ ... ]
//   },
//   ...
// ]
//
export function itemsGroupedByDate(items) {
  let dates = []
  let dateAlbum

  itemsSortedByDate(items).forEach(function(item) {
    const itemDate = new Date(item.sortDate).setHours(0,0,0,0)

    if (dateAlbum == undefined || dateAlbum.date != itemDate) {
      if (dateAlbum) {
        dateAlbum.items = dateAlbum.items.reverse()
      }

      dateAlbum = {
        date:  itemDate,
        items: []
      }

      dates.push(dateAlbum)
    }

    dateAlbum.items.push(item)
  })

  return dates.reverse()
}
