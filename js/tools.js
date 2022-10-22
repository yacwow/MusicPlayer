(function () {
  /* 获取屏幕尺寸 */
  function getScreen() {
    let width, height;
    if (window.innerWidth) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else if (document.compatMode === "BackCompat") {
      width = document.body.clientWidth;
      height = document.body.clientHeight;
    } else {
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
    }
    return {
      width: width,
      height: height,
    };
  }

  /* 获取滚动条滚动距离 */
  function getPageScroll() {
    let x, y;
    if (window.pageXOffset) {
      x = window.pageXOffset;
      y = window.pageYOffset;
    } else if (document.compatMode === "BackCompat") {
      x = document.body.scrollLeft;
      y = document.body.scrollTop;
    } else {
      x = document.documentElement.scrollLeft;
      y = document.documentElement.scrollTop;
    }
    return {
      x: x,
      y: y,
    };
  }

  /* 添加事件 */
  function addEvent(ele, name, fn) {
    if (ele.attachEvent) {
      ele.attachEvent("on" + name, fn);
    } else {
      ele.addEventListener(name, fn);
    }
  }

  /* 获取样式 */
  function getStyleAttr(obj, name) {
    if (obj.currentStyle) {
      return obj.currentStyle[name];
    } else {
      return getComputedStyle(obj)[name];
    }
  }

  /* 防抖 */
  function debounce(fn, delay) {
    let timerId = null;
    return function () {
      let self = this;
      let args = arguments;
      timerId && clearTimeout(timerId);
      timerId = setTimeout(function () {
        fn.apply(self, args);
      }, delay || 1000);
    };
  }

  /* 节流 */
  function throttle(fn, delay) {
    let timerId = null;
    let flag = true;
    return function () {
      if (!flag) return;
      flag = false;
      let self = this;
      let args = arguments;
      timerId && clearTimeout(timerId);
      timerId = setTimeout(function () {
        flag = true;
        fn.apply(self, args);
      }, delay || 1000);
    };
  }

  /* 金额格式 */
  function formartNum(num) {
    let res = 0;
    if (num / 100000000 > 1) {
      let temp = num / 100000000 + "";
      if (temp.indexOf(".") === -1) {
        res = num / 100000000 + "亿";
      } else {
        res = (num / 100000000).toFixed(1) + "亿";
      }
    } else if (num / 10000 > 1) {
      let temp = num / 10000 + "";
      if (temp.indexOf(".") === -1) {
        res = num / 10000 + "万";
      } else {
        res = (num / 10000).toFixed(1) + "万";
      }
    } else {
      res = num;
    }
    return res;
  }

  /* 时间格式 */
  function formartTime(time) {
    let differSecond = time / 1000;
    let day = Math.floor(differSecond / (60 * 60 * 24));
    day = day >= 10 ? day : "0" + day;
    let hour = Math.floor((differSecond / (60 * 60)) % 24);
    hour = hour >= 10 ? hour : "0" + hour;
    let minute = Math.floor((differSecond / 60) % 60);
    minute = minute >= 10 ? minute : "0" + minute;
    let second = Math.floor(differSecond % 60);
    second = second >= 10 ? second : "0" + second;
    return {
      day: day,
      hour: hour,
      minute: minute,
      second: second,
    };
  }

  /* 日期格式 */
  function dateFormart(fmt, date) {
    let yearStr = fmt.match(/y+/);
    if (yearStr) {
      yearStr = yearStr[0];
      let yearNum = date.getFullYear() + "";
      yearNum = yearNum.substr(4 - yearStr.length);
      fmt = fmt.replace(yearStr, yearNum);
    }
    let obj = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (let key in obj) {
      let reg = new RegExp(`${key}`);
      let fmtStr = fmt.match(reg);
      if (fmtStr) {
        fmtStr = fmtStr[0];
        if (fmtStr.length === 1) {
          fmt = fmt.replace(fmtStr, obj[key]);
        } else {
          let numStr = "00" + obj[key];
          numStr = numStr.substr((obj[key] + "").length);
          fmt = fmt.replace(fmtStr, numStr);
        }
      }
    }
    return fmt;
  }

  /* 获取歌曲 */
  function getSongs() {
    let songArray = sessionStorage.getItem("history");
    if (!songArray) {
      songArray = [];
    } else {
      songArray = JSON.parse(songArray);
    }
    return songArray;
  }

  /* 设置歌曲 */
  function setSong(id, name, singer) {
    let songArray = getSongs();
    let flag = false;
    for (let i = 0; i < songArray.length; i++) {
      let song = songArray[i];
      if (song.id === id) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      songArray.unshift({ id: id, name: name, singer: singer });
      sessionStorage.setItem("history", JSON.stringify(songArray));
    }
  }

  /* 清空歌曲 */
  function clearSongs() {
    sessionStorage.removeItem("history");
  }

  /* 删除歌曲 */
  function deleteSongByIndex(index) {
    let songArray = getSongs();
    songArray.splice(index, 1);
    sessionStorage.setItem("history", JSON.stringify(songArray));
    return songArray.length;
  }
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
  }

  window.getScreen = getScreen;
  window.getPageScroll = getPageScroll;
  window.addEvent = addEvent;
  window.getStyleAttr = getStyleAttr;
  window.debounce = debounce;
  window.throttle = throttle;
  window.formartNum = formartNum;
  window.formartTime = formartTime;
  window.dateFormart = dateFormart;
  window.getSongs = getSongs;
  window.setSong = setSong;
  window.clearSongs = clearSongs;
  window.deleteSongByIndex = deleteSongByIndex;
  window.getRandomIntInclusive = getRandomIntInclusive;
})();
