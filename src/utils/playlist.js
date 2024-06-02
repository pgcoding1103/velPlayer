const getRandomSonglist = songlist => {
  const randomSonglist = []
  for (let i = 0; i < songlist.length; i++) {
    let randomIndex = Math.floor(Math.random() * songlist.length)
    randomSonglist.push(songlist[randomIndex])
    songlist.splice(randomIndex, 1)
  }
  return randomSonglist
}
