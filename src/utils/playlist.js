export const getRandomSonglist = songlist => {
  const randomSonglist = []
  while (songlist.length) {
    let randomIndex = Math.floor(Math.random() * songlist.length)
    randomSonglist.push(songlist[randomIndex])
    songlist.splice(randomIndex, 1)
  }
  return randomSonglist
}
