---
title: 安装和使用 Homebrew
date: 2022-09-22 10:40:30
updated: 2023-10-25 00:00:00
categories: 实用工具
tags: [Shell, Homebrew]
index_img: /img/Homebrew.png
banner_img: http://beekmanbeergarden.com/wp-content/uploads/2020/10/header_brewing-tips.jpg
---

## Homebrew 是什么？

[Homebrew](https://brew.sh) 是一个**包管理器**，可以在 macOS 和 Linux 上安装一些软件、命令等。Homebrew 支持在 Linux 上运行，但不在本文的介绍范围内。

Homebrew 不会将文件安装到它本身目录之外，安装后只会将软件和命令**软链接**到 `/Applications` 和其他存放命令到路径下。

使用 Homebrew 安装软件只需短短的几个命令，无需再从茫茫互联网上寻找你需要的，也无需担心你安装的软件被恶意更改过。

## 安装 Homebrew

在终端中执行以下命令，并按提示操作。原版安装需要用到 GitHub 上的一些资源，因此可能会安装失败，我们使用镜像源（以上海交大镜像源为例）以加速安装：

```sh
export HOMEBREW_BREW_GIT_REMOTE=https://mirrors.sjtug.sjtu.edu.cn/git/brew.git
export HOMEBREW_CORE_GIT_REMOTE=https://mirrors.sjtug.sjtu.edu.cn/git/homebrew-core.git
export HOMEBREW_BOTTLE_DOMAIN=https://mirror.sjtu.edu.cn/homebrew-bottles/bottles
export HOMEBREW_NO_INSTALL_FROM_API=1
/bin/bash -c "$(curl -fsSL https://git.sjtu.edu.cn/sjtug/homebrew-install/-/raw/master/install.sh)"
```

对于基于 Intel 处理器的 Mac，Homebrew 将会安装至 `/usr/local/Homebrew`；对于基于 Apple Silicon 的 Mac，Homebrew 将会安装至 `/opt/homebrew`。

成功安装 Homebrew 后，可以选择额外 Tap 一些仓库，以便我们安装更多软件：

```sh
brew tap --custom-remote --force-auto-update homebrew/cask https://mirrors.sjtug.sjtu.edu.cn/git/homebrew-cask.git
for tap in cask{-fonts,-versions} services; do
	brew tap --custom-remote --force-auto-update homebrew/${tap} "https://mirror.sjtu.edu.cn/git/homebrew-${tap}.git"
done
```

在 `~/.bash_profile`（如果使用 Bash）或 `~/.zprofile` （如果使用 Zsh）中添加如下语句：

```sh
# Set PATH, MANPATH, etc., for Homebrew.
eval "$(/opt/homebrew/bin/brew shellenv)"
export HOMEBREW_BREW_GIT_REMOTE=https://mirrors.sjtug.sjtu.edu.cn/git/brew.git
export HOMEBREW_CORE_GIT_REMOTE=https://mirrors.sjtug.sjtu.edu.cn/git/homebrew-core.git
export HOMEBREW_BOTTLE_DOMAIN=https://mirror.sjtu.edu.cn/homebrew-bottles/bottles
export HOMEBREW_NO_INSTALL_FROM_API=1
```

如果是基于 Intel 处理器的 Mac，按需修改 `eval` 语句中的路径。Homebrew 目前默认使用 API 进行安装，但是上海交大镜像源目前不支持此方式，所以需要设置不从 API 安装。

最后，运行 `source .zprofile` 或者重启终端来启用上述设置。恭喜你！Homebrew 已经设置完成，现在你可以自由安装多数软件了！

## 使用 Homebrew 安装软件

安装软件使用 `brew install` 命令。但是，在大部分情况下我们不能确定这些软件的包名，因此需要先搜索。例如，我们希望安装媒体转码器 FFmpeg，先搜索这个软件的包名：

```sh
brew search ffmpeg
```

Homebrew 会给出搜索结果：

```text
==> Formulae
ffmpeg                     ffmpeg@2.8                 ffmpeg@5
ffmpeg2theora              ffmpeg@4                   ffmpegthumbnailer
```

我们注意到 Formulae 里面有若干个与我们想要的匹配的包名，其中@后面跟着的是大版本号，如有必要我们可以安装旧版。我们验证一下它是不是我们想要安装的：

```sh
brew info ffmpeg
```

```text
==> ffmpeg: stable 6.0 (bottled), HEAD
Play, record, convert, and stream audio and video
https://ffmpeg.org/
Not installed
From: https://mirrors.sjtug.sjtu.edu.cn/git/homebrew-core.git/Formula/f/ffmpeg.rb
License: GPL-2.0-or-later
==> Dependencies
Build: pkg-config ✘
Required: aom ✘, aribb24 ✘, dav1d ✘, fontconfig ✔, freetype ✔, frei0r ✘, gnutls ✘, jpeg-xl ✘, lame ✘, libass ✘, libbluray ✘, librist ✘, libsoxr ✘, libvidstab ✘, libvmaf ✘, libvorbis ✘, libvpx ✘, opencore-amr ✘, openjpeg ✔, opus ✘, rav1e ✘, rubberband ✘, sdl2 ✘, snappy ✘, speex ✘, srt ✘, svt-av1 ✘, tesseract ✘, theora ✘, webp ✘, x264 ✘, x265 ✘, xvid ✘, xz ✔, zeromq ✘, zimg ✘
==> Options
--HEAD
	Install HEAD version
==> Analytics
install: 74,569 (30 days), 221,137 (90 days), 472,374 (365 days)
install-on-request: 61,014 (30 days), 184,190 (90 days), 395,424 (365 days)
build-error: 259 (30 days)
```

Homebrew 给出了这个软件的基本信息、相关依赖和统计信息。我们确定我们想要的就是这个，接下来执行安装命令：

```sh
brew install ffmpeg
```

Homebrew 便会自动下载并安装 FFmpeg 和它所有的依赖。

如果你想卸载 FFmpeg，只需执行：

```sh
brew uninstall ffmpeg
```

注意随 FFmpeg 一并安装的依赖项并不会一起被移除，可以用 `brew autoremove` 来移除不再使用的依赖。

对于一些使用安装器（`.pkg`）的软件，在安装和卸载的过程中可能会要求输入密码。

## 卸载 Homebrew

如果你想卸载或重新安装 Homebrew，请执行以下命令以卸载 Homebrew。注意，这也会移除你使用 Homebrew 安装过的 Formula（已安装至 `/Applications` 的应用程序不受影响）！你可以保存 `brew list` 的结果以便再次安装这些包。

```sh
/bin/bash -c "$(curl -fsSL https://git.sjtu.edu.cn/sjtug/homebrew-install/-/raw/master/uninstall.sh)"
```

如果提示有一些文件未被删除，请手动删除它们。

```sh
sudo rm -rf /opt/homebrew	# Apple Silicon
sudo rm -rf /usr/local/*	# Intel
```

如果是基于 Intel 处理器的 Mac，只需将上面这条命令中的目录替换成前文所述的地址即可。
