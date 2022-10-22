(function (window) {
  class Player {
    constructor($audio, musicList) {
      this.$audio = $audio;
      this.audio = $audio[0];
      this.musicList = musicList;
      this.defaultVolume = 0.5;
      this.audio.volume = this.defaultVolume;
      this.currentIndex = -1;
      this.playMode = "loop";
    }

    /* 播放某一首歌曲 */
    playMusic(index) {
      if (index === this.currentIndex) {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      } else {
        let song = this.musicList[index];
        let that = this;
        MusicApis.getSongURL(song.id)
          .then(function (data) {
            that.$audio.html("");
            for (let i = 0; i < data.data.length; i++) {
              let $sc = $(`<source src="${data.data[i].url}" type="audio/${data.data[i].type}" />`);
              $("audio").append($sc);
            }
            that.audio.load();
            that.audio.play();
          })
          .catch(function (err) {
            console.log(err);
          });
      }
      this.currentIndex = index;
    }

    /* 监听歌曲开始播放 */
    musicCanPlay(callBack) {
      let that = this;
      this.$audio.on("canplay", function () {
        let currentTime = that.audio.currentTime;
        let duration = that.audio.duration;
        let timeObj = formartTime(duration * 1000);
        let totalTimeStr = timeObj.minute + ":" + timeObj.second;
        callBack(currentTime, duration, totalTimeStr);
      });
    }

    /* 监听歌曲播放完毕 */
    musicEnded(callBack) {
      let that = this;
      let index = -1;
      this.$audio.on("ended", function () {
        if (that.playMode === "loop") {
          index = that.currentIndex;
          index++;
          if (index > that.musicList.length - 1) {
            index = 0;
          }
        } else if (that.playMode === "one") {
          index = that.currentIndex;
        } else if (that.playMode === "random") {
          for (;;) {
            index = getRandomIntInclusive(0, that.musicList.length - 1);
            if (index !== that.currentIndex) {
              break;
            }
          }
        }
        callBack(index);
      });
    }

    /* 设置歌曲的进度 */
    musicSeekTo(value) {
      value = this.audio.duration * value;
      if (!value) return;
      this.audio.currentTime = value;
    }

    /* 监听歌曲的播放 */
    musicTimeUpdate(callBack) {
      let that = this;
      this.$audio.on("timeupdate", function () {
        let currentTime = that.audio.currentTime;
        let duration = that.audio.duration;
        let timeObj = formartTime(currentTime * 1000);
        let currentTimeStr = timeObj.minute + ":" + timeObj.second;
        callBack(currentTime, duration, currentTimeStr);
      });
    }

    /* 设置音量 */
    musicSetVolume(value) {
      if (value < 0) {
        value = 0;
      } else if (value > 1) {
        value = 1;
      }
      this.audio.volume = value;
      if (value !== 0) {
        this.defaultVolume = value;
      }
    }

    musicGetVolume() {
      return this.audio.volume;
    }
  }

  window.Player = Player;
})(window);
