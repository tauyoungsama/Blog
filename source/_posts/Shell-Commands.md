---
title: 一些有用的 Shell 命令
date: 2023-03-20 11:50:00
updated: 2023-04-08 01:33:40
categories: 实用工具
tags: Shell
---

本文收录了一些我用过的觉得今后还能用上 Shell 命令，作为存档，不定期更新。

## 系统相关

锁定 Dock 高度

```sh
defaults write com.apple.Dock size-immutable -bool yes; killall Dock
```

重置 LaunchPad

```sh
defaults write com.apple.dock ResetLaunchPad -bool true; killall Dock
```

## 文件与文件夹操作

修改文件日期

```sh
touch -achmt [[CC]YY]MMDDhhmm[.SS] filename
```

修复损坏 App

```sh
sudo xattr -rd com.apple.quarantine /Applications/AppName.app
```

符号链接

```sh
ln -s /path/to/actual/file /path/to/linked/file
```

打包并加密

```sh
tar -czf - /path/to/directory | openssl enc -aes-256-cbc -salt -out filename.tar.gz.enc
```

解密

```sh
openssl enc -aes-256-cbc -d -in filename.tar.gz.enc | tar -xzf -
```

### 文件转换

导出 Markdown 为 PDF

```sh
pandoc -s --pdf-engine=xelatex -V CJKmainfont='STSong' -V geometry:margin=1in filename.md -o filename.pdf
```

压制视频

```sh
ffmpeg -i input.mov -s 1920x1080 -c:v hevc -crf 23 -metadata:s language=zho output.mp4
```

## 批处理

删除 .DS_Store 文件

```sh
find . -name ".DS_Store" -type f -delete
```

批量转换文件

```sh
for f in *.flac; do ffmpeg -i "$f" -c:a alac "${f%.*}.m4a"; done
```

## 特定程序相关

修改 TeX Live 镜像源

```sh
sudo tlmgr option repository https://mirrors.sjtug.sjtu.edu.cn/ctan/systems/texlive/tlnet
```

修改 `pip` 镜像源

```sh
pip config set global.index-url https://mirror.sjtu.edu.cn/pypi/web/simple
```

禁止 `conda` 激活 `base` 环境

```sh
conda config --set auto_activate_base False
```

在 GitHub 上创建新仓库（需要预先配置）

```sh
curl -u $(git config github.user):$(git config github.token) https://api.github.com/user/repos -d '{"name":"'$(basename $(pwd))'"}'
```
