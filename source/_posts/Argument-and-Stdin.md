---
title: 命令行参数与标准输入
date: 2023-10-21 02:00:00
updated: 2023-10-21 02:00:00
categories: 实用工具
tags: Shell
index_img: https://freepngimg.com/thumb/graphic_design/73392-shell-command-line-script-unix-linux-interface.png
banner_img: https://i.kinja-img.com/gawker-media/image/upload/s--sPlZaVZB--/c_fill,fl_progressive,g_center,h_900,q_80,w_1600/18ixt8oys3vbcpng.png
---

一般来说，向程序传递数据可以采用参数传递的方式，在调用的同时将数据一并传递；或者使用标准输入，在程序启动后通过控制台键入等方式输入数据。下面我们通过一个简单的例子说明二者的区别。我们实现一个简单的 `echo` 命令，分别采用参数传递和标准输入两种传递数据的方式，接受一个字符串并打印。

```c
// echo1.c Argument passing
#include <stdin.h>
int main(int argc, char* argv[])
{
	printf("%s\n", argv[1]);
	return 0;
}
```
```c
// echo2.c Standard input
#include <stdio.h>
int main(int argc, char* argv[])
{
	char str[128];
	scanf("%s", str);
	printf("%s\n", str);
	return 0;
}
```

要注意这两个程序有不同的启动方式。

```sh
~ % ./echo1 tauyoung	# 启动的同时一并传递参数
tauyoung				# 打印传递的参数值
~ % ./echo2				# 启动时不接受任何参数
tauyoung				# 在控制台通过键盘输入
tauyoung				# 打印输入的数据
```

在大部分情况下我们可以采用任意一种方式传递数据，只要程序能够正常运行。但是，在配合其他程序或者脚本使用时，也应该采用相应的方式启动。例如，我们希望通过我们实现的 `echo` 输出当前用户，下面是这两个程序的正确启动方式：

```sh
~ % ./echo1 $(whoami)	# 将用户名作为参数传递给 echo1
tauyoung
~ % whoami | ./echo2	# 通过管道将用户名传递给 echo2 的标准输入
tauyoung
```

仅接受参数传递的一个真实的例子是，我们需要卸载某个 Python 环境的所有包，我们应将包名作为参数传递，而不是标准输入。

```sh
for i in $(pip freeze);
do
	pip uninstall $i -y;
done
```

而遇到需要标准输入的命令或者程序时，不可将数据作为参数传递。例如，我们将一个文件的内容拷贝到剪贴板上，只能将文件内容作为标准输入：

```sh
pbcopy < echo1.c
```

有时命令或者程序既接受参数传递，又接受标准输入，我们可以按需灵活选择启动方式。例如，统计一个文件的行数，我们既可以将文件名作为参数传递，也可以将文件内容作为标准输入。注意有些命令或者程序的表现可能会有所区别。

```sh
wc -l echo1.c
   7 echo1.c
wc -l < echo1.c
   7
```

在编写程序时，尽量支持多的输入方式能允许用户根据实际情况选择合适的输入方式。条件不允许时，可以仅支持其中一种方式，但也请在文档中作详细的说明。
