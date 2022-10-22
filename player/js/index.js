$(function () {
  /* 获取传递的歌曲 */
  let songArray = getSongs();
  let index = 0; // 当前歌曲的索引
  let ids = [];
  songArray.forEach(function (obj) {
    ids.push(obj.id);
  });

  /* 获取歌曲信息 */
  let mySwiper = null;
  MusicApis.getSongDetail(ids.join(","))
    .then(function (data) {
      for (let i = 0; i < data.songs.length; i++) {
        let song = data.songs[i];
        songArray[i].picUrl = song.al.picUrl;
        // 初始化碟片区域
        let slide = $(`
        <div class="swiper-slide">
          <div class="disc-pic">
            <img src="${song.al.picUrl}" alt="">
          </div>
        </div>`);
        $(".swiper-wrapper").append(slide);
        // 创建swiper
        mySwipe = new Swiper(".swiper-container", {
          loop: true,
          observer: true,
          observeParents: true,
          observeSlideChildren: true,
          on: {
            slideChangeTransitionEnd: function () {
              index = this.realIndex;
              initDefaultInfo(this.realIndex, this.swipeDirection);
            },
          },
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });

  /* 根据索引初始化当前歌曲的默认信息 */
  function initDefaultInfo(index, swipeDirection) {
    let song = songArray[index]; // 获取歌曲信息
    // 初始化头部信息
    $(".header-title").text(song.name);
    $(".header-singer").text(song.singer);
    // 初始化播放界面的背景
    $(".main > .bg").css({ background: `url("${song.picUrl}") no-repeat center top` });
    if (swipeDirection && !$(".play").hasClass("active")) {
      $(".detault-top > img").css({ transform: "rotate(0deg);" });
      $(".disc-pic").css({ "animation-play-state": "running" });
      $(".play").toggleClass("active");
    }
    // 如果不是第一次就直接播放歌曲（上一首 下一首）
    if (swipeDirection) {
      player.playMusic(index);
      getLyric(songArray[index].id);
    }
  }

  /* 创建播放器对象 */
  let player = new Player($("audio"), songArray);

  /* 公共头部处理 */
  $(".go-back").click(function () {
    window.history.back();
  });

  /* 公共底部处理 */
  $(".footer-bottom .list").click(function () {
    // 初始化
    $(".modal-top > p > span").html(`列表循环(${songArray.length})`);
    $(".modal-top .clear-all").click(function () {
      clearSongs();
      window.location.href = "./../home/index.html";
    });
    // 初始化歌曲列表
    if ($(".modal-midlle > li").length !== songArray.length) {
      // 创建歌曲列表
      $(".modal-midlle").html("");
      songArray.forEach(function (obj) {
        ids.push(obj.id);
        let $li = $(`<li>
           <p>${obj.name} - ${obj.singer}</p>
            <img src="images/player-it666-close.png" class="delete-song">
          </li>`);
        $(".modal-midlle").append($li);
      });
      // 监听歌曲列表删除按钮点击
      $(".delete-song").click(function () {
        let delIndex = $(this).parent().index();
        let len = deleteSongByIndex(delIndex);
        if (len === 0) {
          $(".modal-top .clear-all").click();
        }
        $(this).parent().remove();
        mySwiper.removeSlide(delIndex);
        songArray.splice(delIndex, 1);
        $(".modal-top>p>span").html(`列表循环(${len})`);
      });
    }
    $(".modal").css({ display: "block" });
    modalScroll.refresh();
  });

  /* 上一首按钮点击 */
  $(".footer-bottom .prev").click(function () {
    index--;
    mySwiper.swipeDirection = "prev";
    mySwiper.slideToLoop(index);
  });

  /* 下一首按钮点击 */
  $(".footer-bottom .next").click(function () {
    index++;
    mySwiper.swipeDirection = "next";
    mySwiper.slideToLoop(index);
  });

  /* 播放方式按钮点击 */
  $(".footer-bottom .play-mode").click(function () {
    if (player.playMode === "loop") {
      player.playMode = "one";
      $(".play-mode > img").attr("src", "./images/player-it666-one.png");
    } else if (player.playMode === "one") {
      player.playMode = "random";
      $(".play-mode>img").attr("src", "./images/player-it666-random.png");
    } else if (player.playMode === "random") {
      player.playMode = "loop";
      $(".play-mode>img").attr("src", "./images/player-it666-loop.png");
    }
  });

  $(".modal-bottom").click(function () {
    $(".modal").css({ display: "none" });
  });

  /* 处理公共的内容区域 */
  $(".main-in").click(function () {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      getLyric(songArray[index].id);
    }
  });

  /* 监听播放按钮点击 */
  $(".play").click(function () {
    if ($(this).attr("class").includes("active")) {
      $(".detault-top > img").css({ transform: "rotate(-30deg);" });
      $(".disc-pic").css({ "animation-play-state": "paused" });
    } else {
      $(".detault-top > img").css({ transform: "rotate(0deg);" });
      $(".disc-pic").css({ "animation-play-state": "running" });
    }
    $(this).toggleClass("active");
    player.playMusic(index);
  });

  /* 监听歌曲播放进度 */
  player.musicCanPlay(function (currentTime, duration, totalTimeStr) {
    $(".total-time").text(totalTimeStr);
  });

  /* 监听歌曲播放完毕 */
  player.musicEnded(function (index) {
    mySwiper.swipeDirection = "next";
    mySwiper.slideToLoop(index);
  });

  /* 初始化进度条 */
  let musicProgress = new NJProgress($(".progress-bar"), $(".progress-line"), $(".progress-dot"));

  /* 点击进度条控制歌曲进度 */
  musicProgress.progressClick(function (value) {
    player.musicSeekTo(value);
  });

  /* 拖拽进度条控制歌曲进度 */
  musicProgress.progressMove(false, function (value) {
    player.musicSeekTo(value);
  });

  /* 监听歌曲的播放 */
  player.musicTimeUpdate(function (currentTime, duration, currentTimeStr) {
    // 设置当前时间
    $(".cur-time").text(currentTimeStr);
    // 处理进度条同步
    let value = (currentTime / duration) * 100;
    musicProgress.setProgress(value);
    // 处理歌词同步
    let curTime = parseInt(currentTime);
    let cur$li = $("#nj_" + curTime);
    if (!cur$li[0]) return;
    cur$li.addClass("active").siblings().removeClass("active");
    let curOffset = cur$li[0].lrc.offset;
    if ($(".lyric-list")[0].isDrag) return;
    lyricScroll.scrollTo(0, curOffset);
  });

  /* 通过进度条控制音量 */
  let voiceProgress = new NJProgress($(".voice-progress-bar"), $(".voice-progress-line"), $(".voice-progress-dot"));
  voiceProgress.progressClick(function (value) {
    player.musicSetVolume(value);
  });
  voiceProgress.progressMove(false, function (value) {
    player.musicSetVolume(value);
  });

  $(".lyric-top>img").click(function (event) {
    let volume = player.musicGetVolume();
    if (volume === 0) {
      player.musicSetVolume(player.defaultVolume);
      voiceProgress.setProgress(player.defaultVolume * 100);
    } else {
      player.musicSetVolume(0);
      voiceProgress.setProgress(0);
    }
    return event.stopPropagation();
  });

  /* 初始化歌词滚动 */
  let lyricScroll = new IScroll(".lyric-bottom", {
    mouseWheel: false,
    scrollbars: false,
    probeType: 3,
  });
  lyricScroll.on("scroll", function () {
    $(".lyric-time-line").css({ display: "flex" });
    $(".lyric-list")[0].isDrag = true;
    let index = Math.abs(parseInt(this.y / $(".lyric-list>li").eq(0).height()));
    let cur$li = $(".lyric-list>li").eq(index);
    if (!cur$li[0]) return;
    $(".lyric-time-line>span").text(cur$li[0].lrc.timeStr);
    cur$li.addClass("hover").siblings().removeClass("hover");
  });
  lyricScroll.on("scrollEnd", function () {
    $(".lyric-list")[0].isDrag = false;
    $(".lyric-time-line").css({ display: "none" });
  });

  /* 加载歌词 */
  function getLyric(id) {
    MusicApis.getSongLyric(id)
      .then(function (data) {
        let lyricObj = parseLyric(data.lrc.lyric);
        let index = 0;
        $(".lyric-list").html("");
        for (let key in lyricObj) {
          let $li = $(`<li id="nj_${key}">${lyricObj[key]}</li>`);
          if (index === 0) {
            $li.addClass("active");
          }
          $(".lyric-list").append($li);
          let li = $li[0];
          let timeObj = formartTime(key * 1000);
          li.lrc = {
            offset: -index * $li.height(),
            timeStr: timeObj.minute + ":" + timeObj.second,
          };
          index++;
        }
        lyricScroll.refresh();
        lyricScroll.maxScrollY -= $(".lyric-bottom").height();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  /* 格式化歌词 */
  function parseLyric(lrc) {
    let lyrics = lrc.split("\n");
    let reg1 = /\[\d*:\d*\.\d*\]/g;
    let reg2 = /\[\d*/i;
    let reg3 = /\:\d*/i;
    // 定义对象，保存处理好的歌词
    let lyricObj = {};
    lyrics.forEach(function (lyric) {
      // 提取时间
      let timeStr = lyric.match(reg1);
      if (!timeStr) {
        return;
      }
      timeStr = timeStr[0];
      let minStr = timeStr.match(reg2)[0].substr(1); // 提取分钟
      let secondStr = timeStr.match(reg3)[0].substr(1); // 提取秒钟
      let time = parseInt(minStr) * 60 + parseInt(secondStr);
      let text = lyric.replace(reg1, "").trim();
      lyricObj[time] = text;
    });
    return lyricObj;
  }

  let modalScroll = new IScroll(".modal-list", {
    mouseWheel: false,
    scrollbars: false,
  });
});
