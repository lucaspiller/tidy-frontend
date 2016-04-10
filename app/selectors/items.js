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
