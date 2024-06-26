import { ElMessage } from 'element-plus'
import { getSongCanPlay } from '../api/song'
import { useAudio } from '../store'
import { storeToRefs } from 'pinia'
//格式化时间
export const formatTime = dt => {
  const minute = Math.floor(dt / 1000 / 60)
  let second = Math.floor((dt / 1000) % 60)
  second = second < 10 ? '0' + second : second
  return `${minute}:${second}`
}
const formatArtistName = artist => {
  if (!artist) return ''
  return artist.map(at => at.name).join('，')
}
const formatArtistId = artist => {
  if (!artist) return []
  return artist.map(at => at.id)
}

//获取随机播放列表
export const getRandomSonglist = songlist => {
  if (songlist.length == 0) return []
  songlist = JSON.parse(JSON.stringify(songlist))
  let randomSonglist = []
  while (songlist.length) {
    let randomIndex = Math.floor(Math.random() * songlist.length)
    randomSonglist.push(songlist[randomIndex])
    songlist.splice(randomIndex, 1)
  }
  return parseSongList(randomSonglist)
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
  if (songlist.length == 0) return []
  songlist = JSON.parse(JSON.stringify(songlist))
  //通过是否包含artistName字段来判断是否为解析后的数据，防止二次解析
  if (songlist[0].artistName) return songlist
  return songlist.map(
    ({ id, name, ar: artist, al, album, dt, fee, mv, publishTime }, index) => {
      return {
        id, //歌曲id
        name, //歌曲名字
        artistName: formatArtistName(artist), //歌手名称，
        artistId: formatArtistId(artist), //歌手id
        albumName: al ? al.name : album.name, //专辑名称
        imgUrl: al ? al.picUrl : album.picUrl, //专辑封面
        duration: formatTime(dt), //歌曲时长（默认毫秒）
        fee,
        mv, //是否有mv
        publishTime, //发布时间（时间戳）
        index,
        dt
      }
    }
  )
}
export const showSongState = async () => {
  const { state, sid } = storeToRefs(useAudio())
  switch (state.value) {
    case 0:
      const isCanPlay = await getSongCanPlay(sid.value)
      if (isCanPlay) {
        ElMessage.success('开始播放!')
      } else {
        ElMessage.error('暂无版权')
      }

      break
    case 1:
      ElMessage.warning('当前曲目为VIP专享')
      break
    case 4:
      ElMessage.warning('当前曲目需要购买专辑')
      break
    case 8:
      ElMessage.info('非会员只能播放最低音质')
      break
  }
}
