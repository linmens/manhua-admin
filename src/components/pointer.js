// 使用技巧后的 Pointer 拖拽
export const drag = ($el) => {
  // 每次拖拽最开始的触摸点
  const startPoint = {};
  // 拖拽过程中移动到的点
  const movePoint = {};
  // 被拖拽元素的当前位置
  const curPos = {
    x: 0,
    y: 0,
  };

  $el.addEventListener("pointerdown", startHandler, false);
  // $el.addEventListener('pointermove', moveHandler, false);
  // $el.addEventListener('pointerup', endHandler, false);
  // $el.addEventListener('pointercancel', endHandler, false);
  $el.addEventListener(
    "touchstart",
    (evt) => {
      evt.preventDefault();
    },
    false
  );

  function startHandler(evt) {
    console.log(evt, "isin");
    startPoint.x = evt.pageX;
    startPoint.y = evt.pageY;

    document.addEventListener("pointermove", moveHandler, false);
    document.addEventListener("pointerup", endHandler, false);
    document.addEventListener("pointercancel", endHandler, false);
  }
  function moveHandler(evt) {
    evt.preventDefault();

    movePoint.x = curPos.x + evt.pageX - startPoint.x;
    movePoint.y = curPos.y + evt.pageY - startPoint.y;

    $el.style.transform = `translate3d(${movePoint.x}px, ${movePoint.y}px, 0)`;
  }
  function endHandler() {
    curPos.x = movePoint.x;
    curPos.y = movePoint.y;

    document.removeEventListener("pointermove", moveHandler, false);
    document.removeEventListener("pointerup", endHandler, false);
    document.removeEventListener("pointercancel", endHandler, false);
  }
};
