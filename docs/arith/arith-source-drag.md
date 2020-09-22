# 拖拽的基本原理
现在稍微复杂点界面交互中少不了拖拽，现在就探索一下拖拽的原理。并且实现一个简单的拖拽
:::tip offset指偏移，指元素所显示的宽度，padding，border，不包括overflow隐藏的部分
offsetWidth 水平方向 width + 左右padding + 左右border-width
offsetHeight 垂直方向 height + 上下padding + 上下border-width

**client指元素本身的可视内容**
clientWidth 水平方向 width + 左右padding
clientHeight 垂直方向 height + 上下padding

offsetTop 获取当前元素到 定位父节点 的top方向的距离
offsetLeft 获取当前元素到 定位父节点 的left方向的距离

scrollWidth 元素内容真实的宽度，内容不超出盒子高度时为盒子的clientWidth
scrollHeight 元素内容真实的高度，内容不超出盒子高度时为盒子的clientHeight

**Window视图属性（低版本IE浏览器[<IE9]不支持） 【自测包含滚动条，但网络教程都说不包含？？？】**

innerWidth 浏览器窗口可视区宽度（不包括浏览器控制台、菜单栏、工具栏）
innerHeight 浏览器窗口可视区高度（不包括浏览器控制台、菜单栏、工具栏）
:::
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>drag</title>
    <style>
        #box{
          height: 100px;
          width: 100px;
          background-color: red;
          border: 1px solid #666;
          position: absolute;
          left: 0;
          top: 0;
        }
    </style>
</head>
<body>
  <div id="box"></div>
  <script >
    function drag(dom){
      let dragObj = document.getElementById(dom);
      // drag处于绝对定位状态
      dragObj.onmousedown = function(e){
        e  = e || window.event;
        // 鼠标与拖拽元素边界的距离 = 鼠标与可视区边界的距离 - 拖拽元素与边界的距离
        let dragging = true;
        let diffX = e.clientX - dragObj.offsetLeft;
        let diffY = e.clientY - dragObj.offsetTop;
        // 防止鼠标移动过快，拖拽元素拖离鼠标
        document.onmousemove = function (e) {
          e = e || window.event;
          if(dragging){
            let left = e.clientX - diffX;
            let top = e.clientY - diffY;
            // 避免拖拽出可视区
            if(left < 0){
              left = 0;
            } else if(left > window.innerWidth - dragObj.offsetWidth){
              left = window.innerWidth - dragObj.offsetWidth;
            }

            if(top < 0){
              top = 0;
            } else if(top > window.innerHeight - dragObj.offsetHeight){
              top = window.innerHeight - dragObj.offsetHeight;
            }

            dragObj.style.left = left + "px";
            dragObj.style.top = top + "px";
          }
        };

        document.onmouseup = function(e){
          dragging = false;
          this.onmousemove = null;
          this.onmouseup = null;
        }
      } 
    }
  </script>
</body>
</html>
```

