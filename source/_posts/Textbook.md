---
title: 获取、加工和使用电子课本
date: 2022-09-22 17:42:26
updated: 2023-10-31 19:00:00
categories: 实用工具
---

纸质版的课本通常不便宜，尤其是国外出版的教材，而且它们携带起来非常重且不方便。如果有一台 iPad 或者类似的平板电脑，那么使用电子课本将会变得非常方便。

## 获取电子课本

### Z-Library

> [Z-Library](https://zh.singlelogin.se/) 是世界上最大的在线图书馆之一，它拥有超过 11,179,413 的书籍和 84,837,000 的文章。我们的目标是让每个人都能获得文学作品。

Z-Library 提供了多种访问方式，除了[直接](https://zh.singlelogin.se/)或通过 [TOR 网络](http://loginzlib2vrak5zzpcocc3ouizykn6k5qecgj2tzlnab5wcbqhembyd.onion)访问其网站，还有可以通过[桌面客户端](https://zh.go-to-zlibrary.se/soft/zlibrary-setup-latest.dmg)、[Firefox 浏览器扩展](https://zh.go-to-zlibrary.se/soft/mozilla-addon-latest.xpi)、Telegram 机器人等方式获取图书资源，具体方式见[此链接](https://zh.go-to-zlibrary.se/)。

### Library Genesis

> 图书馆创世纪是一个旨在收集和编目项目描述的社区，大部分是科学、科学和技术方向，以及文件元数据。除了描述之外，聚合器只包含由用户主持的第三方资源的链接。网站上发布的所有信息都是从公开的公共互联网资源中收集的，仅用于提供信息的目的。

Library Genesis 是一个俄罗斯的找书网站。它也有很多站点，在以下链接中寻找可访问的即可。科学上网可以稳定访问下列任意站点。
- [libgen.io](https://libgen.io)
- [libgen.org](https://libgen.org)
- [libgen.li](https://libgen.li)
- [libgen.lc](https://libgen.lc)
- [libgen.gs](https://libgen.gs)
- [libgen.top](https://libgen.top)
- [libgen.click](https://libgen.click)

## 加工电子课本

网上获取的电子课本大多没有文字图层，为方便今后使用的时候快速定位和查找内容，需要提前对它们进行**光学文字识别**（OCR）和制作目录。

### 光学文字识别

#### ABBYY FineReader PDF (Windows and macOS)

我曾尝试过许多 PDF OCR 解决方案，大多数在识别中文时都会在每两个汉字中间增加一些无意义的空格。目前我发现的最好的文字识别软件是 [ABBYY FineReader PDF](https://pdf.abbyy.com/finereader-pdf-for-mac/)。需注意，这是收费软件，但是我们可以找到[破解版](https://appstorrent.ru/16-abbyy-finereader-pdf.html)。

安装软件后立即打开，输入激活码激活软件。如果书中出现了数学公式，需要设置识别语言为「简体中文和英文，**简单数学公式**」；对于计算机类教材，还可以添加对应的程序设计语言。

回到我们刚才下载的电子课本，选择打开方式为 ABBYY FineReader PDF，软件会自动添加 PDF 页面并开始识别。识别过程是多核的，占用资源比较多，性能不太够的电脑可以考虑暂停其他操作。识别完后，对照警告检查页面，并导出。导出时可按需选择「使用 MRC 压缩图像」，打开该选项能显著缩小导出的文件，但部分数学公式可能会渲染异常。如果发生这样的情况，就不要勾选。导出的过程是单核的，因此可能会非常慢。确认导出的文件没有问题后，就可以退出 ABBYY FineReader PDF 了。

{% note warning %}
在识别下一本书之前，请先退出 ABBYY FineReader PDF，否则它将会将下一本书的页面添加到上一本书的末尾。
{% endnote %}

{% note danger %}
ABBYY FineReader PDF 无法处理使用 `jbig2` 编码的 PDF 文件。这种文件是纯黑白的，并且十分少见。解决方案：将 PDF 文件每页都导出为图像文件再进行处理。
{% endnote %}

#### Preview.app (Apple Silicon Mac)

在 macOS Ventura (13.0) 及后续版本，系统自带的 Preview.app 也可以进行 OCR 了。这是基于 macOS 的「实况文本」功能，在 QuickLook（快速查看）和 Preview.app（预览）中打开的 PDF 文档都会进行自动识别。在预览中，选择菜单栏中的「文件>导出…」后，勾选上「嵌入文本」复选框，然后保存，就能获得一份识别后的文档了。但是这个过程没有进度条，识别过程中整个预览（包括打开的其他文档窗口）都会无响应，耐心等待即可。

特别注意：实况文本是 Apple Silicon Mac 特有的功能，配有 Intel 处理器的 Mac 没有此功能。由于 ABBYY FineReader PDF 仅有 Intel 版本，在 Apple Silicon Mac 上需要转译运行，且无法发挥 Apple Silicon 神经学习处理能力的优势，在识别速度上被「实况文本」吊打。

### 制作目录

我们采用 [Coherent PDF Tools](https://www.coherentpdf.com/) 作为后续处理 PDF 的工具。对照官网的介绍下载、安装 `cpdf` 命令行工具。一般建议将下载好的对应版本的命令行工具拷贝到 `/usr/local/bin` 目录下。首次运行可能会被操作系统拒绝，到「设置>隐私与安全性>安全性」里允许即可。

我们先检查电子课本中是否自带目录：

```sh
cpdf -list-bookmarks -utf8 textbook.pdf
```

{% note warning %}
如果不加 `-utf8` 开关，`cpdf` 则只会输出目录中的 ASCII 字符，如果有汉字或者其他非 ASCII 字符，它们将会被忽略。
{% endnote %}

如果有输出，表示电子课本自带目录，导出后稍作处理就可以作为新目录插入到经过 OCR 的文件中。

```sh
cpdf -list-bookmarks -utf8 textbook.pdf > bookmarks.txt
```

{% note warning %}
ABBYY FineReader PDF 在导出时会重新制作 PDF，因此不会保留原始 PDF 的书签。无论何时，对于 ABBYY FineReader PDF 导出的文件都需要重新添加目录。
{% endnote %}

如果原始电子课本没有自带目录，就需要我们手动制作。目录文件的格式参考[官方文档](https://www.coherentpdf.com/cpdfmanual.pdf)，可以使用任意文本编辑器手动制作目录。

制作好我们的目录文件 `bookmarks.txt` 后，需要将其添加至 PDF 文件中。

```sh
cpdf -utf8 -add-bookmarks bookmarks.txt textbook-ocr.pdf -o textbook-final.pdf
```

{% note warning %}
这条命令的 `-utf8` 的位置和上面一条的不一样。
{% endnote %}

检查输出的 PDF 文件，确认无误后可以删除先前产生的中间文件。

### 添加逻辑页码

一般来说，书籍的正文部分会从头开始重新编号页码，这就导致了我们阅览 PDF 文件的正文部分会出现书中的页码与文件的页码不一致的问题。为了使两者同步，我们可以往 PDF 文件中添加**逻辑页码**。在 Coherent PDF Tools 中，这样的操作被称为添加「页面标签」（Page Labels）。我们可以为页面标签指定不同的页面范围、样式、前缀、起始编号等等。默认的样式是十进制数字，默认的起始编号是 1。

> |样式|预览|
> |-:|:-|
> |`DecimalArabic`|1, 2, 3, 4, 5...|
> |`LowercaseRoman`|i, ii, iii, iv, v...|
> |`UppercaseRoman`|I, II, III, IV, V...|
> |`LowercaseLetters`|a, b, c, ..., z, aa, bb...|
> |`UppercaseLetters`|A, B, C, ..., Z, AA, BB...|
> |`NoLabelPrefixOnly`|No number, but a prefix will be used if defined.|
> 
> 考虑一份有 20 页的 PDF 文件，我们要向其添加如下的页面标签：
> 
> i, ii, iii, iv, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, A-0, A-1, A-2, A-3, A-4, A-5
> 
> 我们可以这么操作：
> ```sh
> cpdf -add-page-labels in.pdf 1-4 -label-style LowercaseRoman -o out.pdf
> cpdf -add-page-labels out.pdf 5-14 -o out.pdf
> cpdf -add-page-labels out.pdf 15-20 -label-prefix "A-" -label-startval 0 -o out.pdf
> ```

## 使用电子课本

将我们加工完成的电子课本文件使用任意 PDF 阅读器打开即可。经过我们对课本文件的处理，现在可以通过目录或页码快速、准确地定位到某一特定内容。

笔者目前常用的阅读器是 Preview.app 和 VSCode + PDF 插件（在写作业时同时需要参考书本）。如果安装了 LaTeX Workshop，由于该插件自带 `PDF.js` 用于预览生成的文件，无需另外安装插件即可查看 PDF 文件。
