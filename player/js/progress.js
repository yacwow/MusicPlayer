(function (window) {
  class NJProgress {
    /**
     * 构造函数
     * @param $progressBg 进度条背景
     * @param $progressFg 进度条进度
     * @param $progressDot 进度条小圆点
     */
    constructor($progressBg, $progressFg, $progressDot) {
      this.$progressBg = $progressBg;
      this.$progressFg = $progressFg;
      this.$progressDot = $progressDot;
      this.$isMove = false;
    }

    /**
     * 点击设置进度
     * @param callBack(value) 当前进度
     */
    progressClick(callBack) {
      let $that = this;
      this.$progressBg.click(function (event) {
        let normalLeft = $(this).offset().left; // 获取进度条距离窗口的位置
        let eventLeft = event.pageX; // 获取点击位置距离窗口的位置
        $that.$progressFg.css("width", eventLeft - normalLeft);
        let curProgress = (eventLeft - normalLeft) / $(this).width(); // 计算进度条的比例
        if (isNaN(curProgress)) return;
        if (curProgress < 0) curProgress = 0;
        if (curProgress > 1) curProgress = 1;
        callBack(curProgress);
        return event.stopPropagation();
      });
    }

    /**
     * 拖拽设置进度
     * @param isPC 是否是PC端使用
     * @param callBack(value): 当前进度
     */
    progressMove(isPC = true, callBack) {
      let downEventName = "mousedown";
      let moveEventName = "mousemove";
      let upEventName = "mouseup";
      if (!isPC) {
        downEventName = "touchstart";
        moveEventName = "touchmove";
        upEventName = "touchend";
      }
      let $that = this;
      let normalLeft = this.$progressBg.offset().left; // 获取背景距离窗口的位置
      let barWidth = this.$progressBg.width();
      let eventLeft;
      // 监听鼠标按下
      this.$progressBg.on(downEventName, function (event) {
        $that.$isMove = true;
        $(document).on(moveEventName, function (event) {
          // 获取点击的位置距离窗口的位置
          if (isPC) {
            eventLeft = event.pageX;
          } else {
            eventLeft = event.targetTouches[0].pageX;
          }
          let offset = eventLeft - normalLeft;
          if (offset >= 0 && offset <= barWidth) {
            $that.$progressFg.css("width", offset);
          }
          return event.stopPropagation();
        });
        $(document).on(upEventName, function (event) {
          $that.$isMove = false;
          $(document).off(moveEventName);
          $(document).off(upEventName);
          let curProgress = (eventLeft - normalLeft) / barWidth; // 计算进度条的比例
          if (isNaN(curProgress)) return;
          if (curProgress < 0) curProgress = 0;
          if (curProgress > 1) curProgress = 1;
          callBack(curProgress);
          return event.stopPropagation();
        });
        return event.stopPropagation();
      });
    }

    /**
     * 直接设置进度
     * @param value 需要设置的进度值
     */
    setProgress(value) {
      if (this.$isMove) return;
      if (value < 0 || value > 100) return;
      this.$progressFg.css({
        width: value + "%",
      });
    }
  }

  window.NJProgress = NJProgress;
})(window);
