---
title: 将 FLAC 音频转换为 ALAC
date: 2023-02-27 23:31:20
updated: 2023-6-17 19:52:30
categories: 实用工具
tags: Shell
index_img: https://ahmadawais.com/wp-content/uploads/2021/05/FFmpeg.jpg
banner_img: https://www.apple.com.cn/newsroom/images/2023/11/taylor-swift-is-apple-musics-artist-of-the-year-for-2023/article/Apple-Music-Awards-Artist-of-the-Year-Taylor-Swift_big.jpg.large_2x.jpg
---

FLAC（**F**ree **L**ossless **A**udio **C**odec）是无损压缩音频文件中最常见的格式之一，许多数字专辑购买后获得的音频也是这个格式。尽管 macOS 原生支持 FLAC 格式音频的播放（QuickLook），但是无法将其导入到 Apple Music 中。要将无损的音源导入到 Apple Music 中，除了无压缩的 AIFF 格式外，还有一种方法就是转换为 Apple Music 支持的 ALAC（**A**pple **L**ossless **A**udio **C**odec）格式。

## Permute 3

Permute 3 是一款强大的媒体转换工具，可以方便地在各种媒体格式之间转换。售价 98 元人民币（[Mac App Store](https://apps.apple.com/cn/app/permute-3/id1444998321)）或 79 元人民币（[官方网站](https://software.charliemonroe.net/permute/)）。笔者使用的是 TNT 团队提供的破解版本，可以在[这里](https://macapp.org.cn/app/permute.html)找到。在「预设」界面添加 Apple Lossless 即可在转换界面使用。

在国内流媒体平台（网易云音乐、QQ 音乐等）下载的无损音频文件在 Permute 3 中无法转换，会提示「文件受 DRM 保护」（尽管并没有）。这时可以尝试用下一种方法。

## FFmpeg

[FFmpeg](https://ffmpeg.org/) 是开源的命令行媒体工具，可以执行音频和视频多种格式的录影、转换、串流功能。

### 安装 FFmpeg

```sh
brew install ffmpeg
```

会一并安装大量依赖，不用慌张，请耐心等待。

### 使用 FFmpeg

使用 FFmpeg 将 FLAC 的音频转换为 ALAC 的命令如下：

```sh
ffmpeg -i audio.flac -acodec alac -vcodec copy audio.m4a
```

如果要转换整个目录下的 FLAC 音频，可以使用 Zsh 的循环：

```sh
for f in *.flac; do ffmpeg -i "$f" -acodec alac -vcodec copy "${f%.*}.m4a"; done
```

转换其他格式的媒体同理，感兴趣的读者可以自行查阅。
