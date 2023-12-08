---
title: 请使用 XDG 基本目录规范！
author: Edwin Kofler
categories:
tags: Shell
license: BY-SA
date: 2023-12-08 12:30:00
updated: 2023-12-08 12:30:00
index_img: /img/no-dotfiles.png
banner_img: https://editors.dexerto.com/wp-content/uploads/2023/06/15/How-to-Reroll-Honkai-Star-Rail.jpg
---

{% note info %}
本文原作者 [Edwin Kofler](https://edwinkofler.com/)，转载自 xdgbasedirectoryspecification.com。
{% endnote %}

## 但是，为什么？

{% fold default @看看你的主目录 %}

```bash
$ find ~ -mindepth 1 -maxdepth 1 -type f -printf '%f\n' -or -type d -printf '%f/\n'
.alsoftrc
.android/
.ansible/
.aqbanking/
.audacity-data/
.bashrc
.cache/
.choosenim/
.code-d/
.config/
config/
.cpan/
data/
Desktop/
Downloads/
Documents/
.eclipse/
.elementary/
.emacs.d/
.emulator_console_auth_token
.flutter
.flutter_tool_state
.gem/
.ghc/
.ghidra/
.gnome/
.gnupg/
.godot/
.gore/
.gradle/
.gsutil/
.guestfish
.heekscad
.helioslauncher/
HomeBank-20210521.bak
HomeBank-20210607.bak
HomeBank-20210611.bak
.hushlogin
.idapro/
.ivy2/
.java/
javasharedresources/
.kb/
.kube/
.lldb/
.local/
.lunarclient/
.lyxauth
.m2/
macOS.vdi
.mcfly/
.metals/
.minecraft/
.mono/
.mozilla
.mputils/
.mume/
Music/
.omnisharp/
.ort/
.osc_cookiejar
.pack/
.paradoxlauncher/
.parsec/
Pictures/
.pki/
.pm2/
.profile
.pythonhist
.sbt/
.scim/
.ssh/
.steam/
.steampath
.steampid
.step/
.subversion/
.swt/
.tooling/
'Universe Sandbox'/
Videos/
.vscode/
.w3m/
.wine/
.xinitrc
.yarnrc
.zcompdump
.zoom/
.zshenv
```
{% endfold %}

{% fold default @如果你的主目录干干净净呢？ %}

```bash
$ find ~ -mindepth 1 -maxdepth 1 -type f -printf '%f\n' -or -type d -printf '%f/\n'
.bashrc
.cache/
.config/
Desktop/
Downloads/
Documents/
.local/
Music/
Pictures/
.profile
Videos/
```
{% endfold %}

您的应用程序的最终用户（希望您自己也是）想要一个干净的主目录。与其让像`~/.gitconfig`这样的文件混乱地分散在主文件夹中，不如将它们驻留在专用的配置目录中。

我喜欢 0x46.net 的 [Filip](https://0x46.net/thoughts/2019/02/01/dotfile-madness) 从用户的角度解释这个问题的方式：

> 我自己的主目录包含 25 个普通文件和 144 个隐藏文件。这些 dotfiles 包含不属于我的数据，它属于程序员，他们的程序决定劫持设计为存储我个人文件的主要位置。我无法将这些 dotfiles 放在其他地方，如果我尝试删除它们，它们还会再次出现。我所能做的就只是干坐着，明白在黑暗中，在幕后，他们在那里……我害怕有一天我会听到响亮的敲门声，其中一个程序员会告诉我，如果我不介意的话，他要把一件家具存放在我的客厅中间。

简而言之，您的应用程序文件（至少）按照规范手段应当被归类到个人文件夹的子目录中。例如，缓存文件的位置默认为`~/.cache`，而配置文件的位置默认为`~/.config`等。

### 有什么好处？

如果您尚未被干净的主目录出卖，则还有其他好处。

- **更容易创建备份**：由于几个目录（例如默认情况下的`~/.config`）代表一类离散的应用程序文件，在备份期间为特定类别的文件制定规则要容易得多。
- **更容易共享配置设置**：由于所有设置都在一个目录中，因此它们可以更容易地在计算机系统之间共享。
- **更容易隔离应用程序状态**：由于特定于一台机器的所有数据都在单个目录中，因此在共享数据或备份时，您可以轻松避免它们在系统之间共享。
- **更容易暂时忽略配置**：并非所有应用程序都有`--no-config`选项（特别是 GUI 应用程序），那些具有`--config`选项的应用程序在使用`/dev/null`作为文件、shell 进程替换或简单的空文件时并不总是工作。设置`XDG_CONFIG_HOME=/tmp/dir`是最简单的。
- **更容易实现 ACL**：对于直接在`$HOME`写入文件的应用程序，可能很难限制系统访问。由于所有目录都是特定于特定应用程序的，因此实施访问控制模式更容易。
- **减少对硬编码路径的依赖（灵活性+可组合性）**：作为一个更具体的例子，想象一下`/etc`不存在——配置将以类似于今天`$HOME`的方式混乱地分散。但是，由于[文件层次结构标准](https://refspecs.linuxfoundation.org/fhs.shtml)专门将`/etc`指定为配置文件（以及其他目录）的目录，因此*跨机器*查找、编辑和备份系统文件要容易*得多*。这些工效学不仅应该存在于系统级文件，还应该存在于用户级文件。

因此，我*恳求*所有应用程序开发人员遵守 [XDG 基本目录规范](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)。

## 所以，怎么做？

首先，将程序需要编写的文件分为四类：

1. 配置：影响程序行为的配置文件。即使配置文件不是用户可编辑的，它也可能属于这里。
2. 数据：跨计算机固有可移植的一般文件和数据。例子包括字体、从互联网下载的文件和[桌面条目](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html)。
3. 状态：保存应用程序状态的文件。这可能包括日志、命令历史记录、最近使用的文件和游戏保存数据。换句话说，如果数据对给定机器来说是独一无二的，则文件属于这里。
4. 缓存：缓存文件。

上述每个类别都映射到一个特殊的环境变量，即包含该类别所有文件的目录。例如，「配置」文件全部存储在`$XDG_CONFIG_HOME`。如果该环境变量无效，则应使用`$HOME/.config`的默认值。请参阅下面的完整表格：

|类别|环境变量|默认值|类比 [FHS](https://refspecs.linuxfoundation.org/fhs.shtml)|
|-|-|-|-|
|配置|`$XDG_CONFIG_HOME`|`$HOME/.config`|`/etc`|
|数据|`$XDG_DATA_HOME`|`$HOME/.local/share`|`/usr/share`|
|状态|`$XDG_STATE_HOME`|`$HOME/.local/state`|`/var/lib`|
|缓存|`$XDG_CACHE_HOME`|`$HOME/.cache`|`/var/cache`|

三种情况下环境变量无效：

1. 未设置（`unset XDG_CONFIG_HOME`）
2. 设置为空值（`XDG_CONFIG_HOME=""`）
3. 不是绝对路径（`XDG_CONFIG_HOME="./config"`）

## 那么，有例子吗？

现在您已经熟悉了该标准，您可能想看看一些代码示例。以下程序仅适用于 Linux（有关 macOS 和 Windows 的详细信息，请参阅下面的常见问题解答）。当然，如果你要实际写一个程序，我建议使用库。

以下是 Go 1.13+ 代码。请注意，它不用 [`os.UserConfigDir`](https://pkg.go.dev/os#UserConfigDir)（[源码](https://github.com/golang/go/blob/90860e0c3110ac5898dfe8e0e0fafd0aea8d979a/src/os/file.go#L444)），因为根据规范，它不会静默忽略非绝对路径。

{% fold default @Go %}
```Go
package main
import (
	"os"
	"fmt"
	"log"
	"path/filepath"
)

func getConfigDir() (string, error) {
	configDir := os.Getenv("XDG_CONFIG_HOME")

	// If the value of the environment variable is unset, empty, or not an absolute path, use the default
	if configDir == "" || configDir[0:1] != "/" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return "", err
		}
		return filepath.Join(homeDir, ".config", "my-application-name"), nil
	}

	// The value of the environment variable is valid; use it
	return filepath.Join(configDir, "my-application-name"), nil
}

func main() {
	config_dir, err := getConfigDir()
	if err != nil {
		panic(err)
	}

	fmt.Println(config_dir)
}
```
{% endfold %}

以下是 Python 3.5+ 代码。它使用 [`Path.home`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.home)（[源码](https://github.com/python/cpython/blob/ec4d917a6a68824f1895f75d113add9410283da7/Lib/pathlib.py#L994)）（使用 [`os.path.expanduser`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.home)（[源码](https://github.com/python/cpython/blob/ec4d917a6a68824f1895f75d113add9410283da7/Lib/posixpath.py#L228)））。

{% fold default @Python %}
```Py
import sys, os
from pathlib import Path

def get_config_dir() -> str:
	config_dir = os.getenv('XDG_CONFIG_HOME', '')

	// If the value of the environment variable is unset, empty, or not an absolute path, use the default
	if config_dir == '' or config_dir[0] != '/':
		return str(Path.home().joinpath('.config', 'my-application-name'))

	// The value of the environment variable is valid; use it
	return str(Path(config_dir).joinpath('my-application-name'))

config_dir = get_config_dir()
print(config_dir)
```
{% endfold %}

以下是 Bash 代码。请注意，它不使用`${XDG_CONFIG_HOME:-$HOME/.config}`，因为这不会按照规范静默忽略非绝对路径。

{% fold default @Bash %}
```bash
get_config_dir() {
	unset REPLY; REPLY=

	local config_dir="$XDG_CONFIG_HOME"

	# If the value of the environment variable is unset, empty or not an absolute path, use the default
	if [ -z "$config_dir" ] || [ "${config_dir::1}" != '/' ]; then
		REPLY="$HOME/.config/my-application-name"
		return
	fi

	# The value of the environment variable is valid; use it
	REPLY="$config_dir/my-application-name"
}

get_config_dir
printf '%s\n' "$REPLY"
```
{% endfold %}

## 但是，我还有些问题

### 是这样吗？

标准还有更多，但您*至少*应该了解并实施上述内容，这是最重要的部分。如果您不想自己实现这一点，请[使](https://github.com/dirs-dev/directories-rs)[用](https://github.com/adrg/xdg)[库](https://github.com/sindresorhus/env-paths)。通过实施这一点，您的用户将默默地感谢您！

### 如果我已经做错了，直接使用主目录了怎么办？

如果您在`$HOME`中写入几个单个文件，只需在遵循 XDG 基本目录规范之前检查这些文件是否存在。考虑以下示例，给定`~/foo-app.json`的传统配置位置：如果`~/foo-app.json`存在，就用它；如果不存在，则检查`$XDG_CONFIG_HOME`是否已设置且有效。如果是，请写入`$XDG_CONFIG_HOME/foo-app/foo-app.json`。如果没有，请写入`$HOME/.config/foo-app/foo-app.json`。

但是，如果您将所有配置和数据保存在主目录的子目录中（例如`~/.ansible`），事情变得有些麻烦了。将所有内容移动到`$XDG_STATE_HOME/application-dir`对应用程序开发人员来说是最容易的，但在语义上不太正确。如果您不想考虑将多个文件迁移到单独的目录的麻烦事，通过环境变量配置目录位置将会是一个良好开始。例如，[Terraform](https://www.terraform.io/) 使用`TF_DATA_DIR`公开此选项。即使只是通过环境变量公开目录也[*非常*有用](https://github.com/eankeen/dots/blob/d534663b655b3e470ba85abca0828ca9b514a0c2/user/config/profile/modules/xdg.sh)。

### 还有谁这么做了？

{% label default @Kitty %} {% label default @FontForge %} {% label default @ImageMagick %} {% label default @Alacritty %} {% label default @Composer %} {% label default @Terminator %} {% label default @clangd %} {% label default @chezmoi %} {% label default @aria2 %} {% label default @bat %} {% label default @i3 %} {% label default @nano %} {% label default @picom %} {% label default @poetry %} {% label default @VLC %} {% label default @awesome %} {% label default @aerc %} {% label default @micro %} {% label default @Handbrake %} {% label default @OfflineIMAP %} {% label default @polybar %} {% label default @rclone %} {% label default @xmonad %} {% label default @mesa %} {% label default @Godot %} {% label default @Docker %} {% label default @Anki %} {% label default @httpie %} {% label default @citra %} {% label default @basher %} {% label default @asunder %} {% label default @Transmission %} {% label default @htop %} {% label default @Termite %} {% label default @Git %} {% label default @Kakoune %} {% label default @Blender %} {% label default @Gstreamer %} {% label default @ranger %} {% label default @Pry %} {% label default @TypeScript %} {% label default @navi %} {% label default @d-feet %} {% label default @Mercurial %} {% label default @LibreOffice %} {% label default @Audacious %} {% label default @byobu %} {% label default @colordiff %} {% label default @cmus %} {% label default @ccache %} {% label default @antimicro %} {% label default @lftp %} {% label default @mc %} {% label default @calcurse %} {% label default @Deluge %} {% label default @Terraria %} {% label default @Wireshark %} {% label default @sway %} {% label default @xsettingsd %} {% label default @tmux %} {% label default @PulseAudio %} {% label default @neomutt %} {% label default @VirtualBox %} {% label default @broot %} {% label default @httpie %} {% label default @ALSA %} {% label default @pandoc %} {% label default @nb %} {% label default @tig %} {% label default @cargo %} {% label default @openbox %} {% label default @asdf %} {% label default @fish %} {% label default @fontconfig %} {% label default @Dolphin %} {% label default @MultiMC %} {% label default @pnpm %} {% label default @GIMP %} {% label default @binwalk %} {% label default @Inkscape %} {% label default @iwd %} {% label default @mpv %} {% label default @josm %} {% label default @Wechat %}

有关更长的列表和更多详细信息，请参阅 [Arch Wiki](https://wiki.archlinux.org/title/XDG_Base_Directory)。

### 我已经提供了一个`--config`选项。我真的需要这个吗？

当然！使用命令行参数指定文件或目录的能力无法始终如一地使用。例如，您*可以*定义一个 shell 别名，但不总是会使用它，因为在非交互式环境中，默认情况下 bash 选项`expand_aliases`是未启用的。此外，如果您的程序以任何编程方式（例如 [exec 风格](https://man7.org/linux/man-pages/man3/exec.3.html)的系统调用）被调用，则没有合理的方法来确保标志被传递。

### 我应该在 macOS 上这样做吗？

我做了相当多的研究，似乎没有共同的共识。一般来说，如果您的程序唯一的接口是 CLI，那么即使您不是 Linux，也可以遵循 XDG 基本目录规范。这似乎在整个生态系统中非常普遍，特别是对于 Bash 项目。另一方面，如果是 GUI，那么您通常会遵循标准的 [macOS 目录位置](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFileSystem/Articles/WhereToPutFiles.html)。例如，Sublime Text 3 将其首选项存储在 macOS 上的`~/Library/Application Support/Sublime Text 3/Packages/User`中，即使它还附带了一个`subl`命令。

### 我应该在 Windows 上这样做吗？

我没有直截了当的答案，只是因为我不够频繁地使用 Windows。我会补充一点，Windows 已经有一个预先存在的目录来放置用户数据。尽管如此，像 [scoop](https://scoop.sh/) 这样广泛使用的应用程序遵循[配置](https://github.com/lukesampson/scoop/blob/092005046454d94d141d5c68fdbdb4c4a1229ae9/lib/core.ps1#L980)规范。另一个命令行应用程序，[PSKoans](https://github.com/vexx32/PSKoans) 硬编码了`~/.config`。诚然，它的使用并不普遍，特别是与 macOS 相比，所以答案更接近于「不」。

### 你是谁？

我是[埃德温·科夫勒](https://edwinkofler.com/)，一位软件开发人员，希望将该规范的知识（和实施）扩散给更广泛的开发人员群体。我在 [Potry](https://github.com/python-poetry/poetry/issues/1659) 和 [pnpm](https://github.com/pnpm/pnpm/issues/2574) 等存储库中提出了问题（现已修复），并在 [osc](https://github.com/openSUSE/osc/pull/940)、[vscode-kubernetes-tools](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/pull/1081)、[mume](https://github.com/shd101wyy/mume/pull/234)、[basher](https://github.com/basherpm/basher/pull/98) 等存储库中提出了合并请求（现已合并）！我希望我们能一起让主目录再次干净！

### 想要了解更多？看这里！

- [官方规范](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
- [Debian 维基](https://wiki.debian.org/XDGBaseDirectorySpecification)
- [Arch Linux 维基](https://wiki.archlinux.org/title/XDG_Base_Directory)
- [libetc](http://ordiluc.net/fs/libetc)：使用`LD_PRELOAD`技巧强制将文件/目录存储在正确位置的共享库
- [boxxy](https://github.com/queer/boxxy)：使用绑定安装恶作剧强制将文件/目录存储在正确位置的脚本
- [xdg-ninja](https://github.com/b3nj5m1n/xdg-ninja)：一个检查`$HOME`不需要的文件和目录的外壳脚本
