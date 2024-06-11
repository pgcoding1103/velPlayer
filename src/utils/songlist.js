import { ElMessage } from 'element-plus'
const formatTime = dt => {
  const minute = Math.floor(dt / 1000 / 60)
  let second = Math.floor((dt / 1000) % 60)
  second = second < 10 ? '0' + second : second
  return `${minute}:${second}`
}
const formatArtistName = artist => {
  return artist.map(at => at.name).join('，')
}
const formatArtistId = artist => {
  return artist.map(at => at.id)
}

//获取随机播放列表
export const getRandomSonglist = (songlist, sid, index) => {
  let randomSonglist = []
  while (songlist.length) {
    let randomIndex = Math.floor(Math.random() * songlist.length)
    randomSonglist.push(songlist[randomIndex])
    songlist.splice(randomIndex, 1)
  }
  return randomSonglist
}
//解析歌单信息
/* 
  fee:0: 免费或无版权
      1: VIP 歌曲
      4: 购买专辑
      8: 非会员可免费播放低音质，会员可播放高音质及下载 
      fee 为 1 或 8 的歌曲均可单独购买 2 元单曲
  mv: u64, 非零表示有MV ID
*/
export const parseSongList = songlist => {
  return JSON.parse(JSON.stringify(songlist)).map(
    ({ id, name, ar: artist, al, dt, fee, mv, publishTime }) => {
      return {
        id, //歌曲id
        name, //歌曲名字
        artistName: formatArtistName(artist), //歌手名称，
        artistId: formatArtistId(artist), //歌手id
        albumName: al.name, //专辑名称
        cover: al.picUrl, //专辑封面s
        alltime: formatTime(dt), //歌曲时长（默认毫秒）
        fee,
        mv, //是否有mv
        publishTime //发布时间（时间戳）
      }
    }
  )
}
export const getSongState = fee => {
  switch (fee) {
    case 0:
      ElMessage('暂无版权')
      break
    case 1:
      ElMessage('当前曲目为VIP专享')
      break
    case 4:
      ElMessage('当前曲目需要购买专辑')
      break
    case 8:
      ElMessage('当前曲目非会员只能试听')
      break
  }
}
