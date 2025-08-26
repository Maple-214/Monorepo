function todo() {
  document.getElementById('name-container').style.display = 'none';
  var position = window.scrollY;
  var nameContainer = document.getElementById('name-container');
  var menusItems = document.getElementsByClassName('menus_items')[1];

  function handleScroll() {
    var scroll = window.scrollY;

    if (scroll > position) {
      nameContainer.style.display = '';
      menusItems.setAttribute('style', 'display:none!important');
    } else {
      menusItems.setAttribute('style', '');
      nameContainer.style.display = 'none';
    }

    position = scroll;
  }

  window.CustomEvent.scrollToTop = function () {
    menusItems.style.display = '';
    nameContainer.style.display = 'none';
    btf.scrollToDest(0, 500);
  };

  // 修复没有弄右键菜单的童鞋无法回顶部的问题
  document.getElementById('page-name').innerText = document.title.split(' | 澤楓の小屋')[0];

  // 使用 requestAnimationFrame 优化滚动事件处理
  function throttle(callback) {
    var isThrottled = false;
    return function () {
      if (!isThrottled) {
        callback.apply(this, arguments);
        isThrottled = true;
        requestAnimationFrame(function () {
          isThrottled = false;
        });
      }
    };
  }
  window.addEventListener('scroll', throttle(handleScroll));
}
window.addEventListener('pjax:complete', todo); //后面几次，pjax加载
window.addEventListener('DOMContentLoaded', todo); //第一次
