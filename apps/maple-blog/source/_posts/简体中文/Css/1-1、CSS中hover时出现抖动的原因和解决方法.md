---
title: 1-1、CSS中hover时出现抖动的原因和解决方法
toc: true
categories:
  - 简体中文
  - Css
tags:
  - 前端
  - Css
abbrlink: 16495
date: 2024-01-28 19:36:14
author:
img:
coverImg:
top:
cover:
mathjax:
password:
summary:
---

## 1. 出现的原因

```text
CSS hover时出现抖动的原因通常与盒模型和布局有关，可能是由于元素在hover状态下增加了一些样式，导致元素的尺寸或位置发生了变化，从而引发抖动。
```

## 2. 解决方式

### 2.1边框的影响

```css
/* 如果在hover状态下添加了边框，而没有在非hover状态下考虑到边框的宽度，可能导致抖动。确保在非hover状态下也为元素预留足够的空间。 */
/* 不好的例子 */
.box {
  border: 1px solid transparent;
  transition: border-color 0.3s;
}

.box:hover {
  border-color: red;
}

/* 好的例子 */
.box {
  border: 1px solid transparent;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.box:hover {
  border-color: red;
}
```

### 2.2 宽度和高度的变化

```css
/* 如果在hover状态下改变了元素的宽度或高度，而在非hover状态下没有合适地设置，也可能导致抖动。 */
/* 不好的例子 */
.box {
  width: 100px;
  height: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 120px;
}

/* 好的例子 */
.box {
  width: 100px;
  height: 100px;
  transition: width 0.3s;
  box-sizing: border-box;
}

.box:hover {
  width: 120px;
}
```

### 2.3 改变透明度

```css
/* 在某些情况下，改变元素透明度可能导致抖动。确保在非hover状态下也设置透明度。 */
/* 不好的例子 */
.box {
  opacity: 1;
  transition: opacity 0.3s;
}

.box:hover {
  opacity: 0.8;
}

/* 好的例子 */
.box {
  opacity: 1;
  transition: opacity 0.3s;
}

.box:hover {
  opacity: 0.8;
}
```

### 2.4 使用 transform 属性

```css
/* 在一些情况下，使用 transform 属性可能更有效，因为它不会影响文档流，避免了一些布局引起的抖动。 */
.box {
  transition: transform 0.3s;
}

.box:hover {
  transform: scale(1.1);
}
```
