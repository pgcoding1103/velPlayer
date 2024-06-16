export const parseUserPlaylist = playlist => {
  const _playlist = JSON.parse(JSON.stringify(playlist))
  return _playlist.map(
    ({
      id,
      name,
      playCount,
      tags,
      coverImgUrl,
      subscribedCount,
      artists,
      trackCount,
      trackUpdateTime
    }) => {
      return {
        id, //歌单id
        name, //歌单名称
        playCount, //播放量
        tags, //标签，数组形式，例如["流行", "华语", "女声"]
        coverImgUrl, //歌单封面
        subscribedCount, //收藏量
        artists, //歌单创建者
        trackCount, //歌单歌曲数量
        trackUpdateTime //更新歌曲时间
      }
    }
  )
}
