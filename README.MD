预览链接：https://dcbryant.github.io/canvas-moon/index.html

原由：前几天中秋到来，但一直在学校学习，遂用canvas画一幅明月，夜空和流星图，以表相思之情

技术栈：es6 + canvas 

具体实现：分别用class分别制作了三个类：Moon Stars Meteor，Moon用了径向渐变，Stars实现了一个blink函数，随机改变每一个星星的半径大小，从而产生闪烁的效果,Meteor中的每个流星由一个半圆和一个三角形组成，类似于一个不倒翁。然后整体倾角45度，并且填充时用上一个径向渐变，就可以相当完美的达到流行尾巴那样渐行渐远渐模糊的样子