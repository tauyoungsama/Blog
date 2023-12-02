---
title: 虚拟机安装 Debian GNU/Linux
categories: 实用工具
tags: [Linux, Debian]
date: 2023-12-02 16:45:00
updated: 2023-12-02 16:45:00
index_img: https://linuxiac.b-cdn.net/wp-content/uploads/2020/11/debian13.png
banner_img: https://www.linuxadictos.com/wp-content/uploads/Debian-13-Trixie.png
---

[Debian GNU/Linux](https://zh.wikipedia.org/wiki/Debian) (/dɛbˌiən ˌgnuː ˈlɪnʊks/) 是完全由自由软件组成的类 UNIX 操作系统，也最早的 Linux 发行版之一。Debian 以其坚守 Unix 和自由软件的精神，以及给予用户的众多选择而闻名。Ubuntu、Knoppix 和 Deepin 等众多知名 Linux 发行版，都建基于 Debian GNU/Linux。

Debian 主要维护三个构建版本：每两年发布一次大版本的 stable 稳定版，目前代号为 bookworm；下一代大版本的 testing 测试版，目前代号为 trixie；以及最新的 unstable 不稳定版本，代号永远为 sid。

Debian 以其出色的稳定性著称，因此在软件包的选择上偏向于保守，stable 版本通常不会带有最新版本的软件包。对于玩具系统而言，可以尝试升级到 testing 甚至是 sid。

本文将带领读者一步步在虚拟机上安装 Debian GNU/Linux 的稳定版系统，并升级到 sid。因为是在安装到虚拟机环境，我们不需要制作安装镜像设备，只需要下载官方提供的镜像文件，虚拟机软件会帮我们引导系统。

## 下载 Debian 网络安装映像文件

访问 [Debian 发布页](https://www.debian.org/distrib/netinst)，根据自己机器的架构选用合适的映像文件。最常见的架构是 amd64 和 arm64。

或者可以前往国内的镜像站下载映像文件，例如[上海交通大学思源镜像站](https://mirror.sjtu.edu.cn/debian-cd/current/)。选择合适的架构后，进入 iso-cd 目录下，下载 ISO 映像文件。

下载完毕后，可自行检查校验和，确保文件无误。

![](Debian12.2ARM64NetInstISO.png)

## 创建并配置虚拟机

常见的虚拟机软件，如 VMware 或者 VirtualBox 都可以运行 Debian 虚拟机。这里选用专门为 macOS 优化的 Parallels Desktop 进行安装，不过大致配置与流程与其他虚拟机软件类似。

打开 Parallels Desktop，选择新建虚拟机。

可以在下方的「免费系统」里直接选择 Debian GNU/Linux，Parallels Desktop 会自动下载并启动 Debian 虚拟机。或者使用上一步手动下载的安装映像，因为从最近的镜像站下载一般速度会更快一些。

选择好系统后，可以为虚拟机设置名称、位置，以及是否创建替身和安装前是否设置。我们这里勾选上「安装前设定」。

在弹出来的窗口中，转到「硬件 > 网络」，将源设定为「桥接网络」。否则，虚拟机将无法访问外网，或者宿主机无法连接至客户机。

其他条目请按需设置。完成后关闭设置窗口，并点击「继续」启动虚拟机。

{% gi 4 2-2 %}
![](ParallelsNewVM.png)
![](ParallelsNewVMDebian.png)
![](ParallelsDebianSetting.png)
![](ParallelsDebianConfigureNetwork.png)
{% endgi %}

## 安装 Debian

启动虚拟机后，我们将看到 GRUB 引导界面，选择默认的 Install。也可以选择第二项 Graphic Install，具有更现代化的图形界面，但实际上没有必要。

![](DebianGNUGRUB.png)

等待安装程序自动加载，进入语言选择界面。这里选择的语言不仅会影响安装过程的显示语言，同时也会成为安装完毕后主系统的语言。

下一步选择区域，此选项用于设置系统的时区和区域。

选择键盘映射。汉语与美式英语的键盘映射大致是相同的，但是其他语言的键盘可能会有所不同。

{% gi 3 3 %}
![](DebianLanguageSelection.png)
![](DebianLocationSelection.png)
![](DebianKeyboardMapping.png)
{% endgi %}

等待组件加载和自动配置网络后，会要求输入此电脑的主机名。主机名是在局域网内让其他计算机发现、访问的名称，家庭网络中的主机名可以随意取，但需要保持唯一。方便起见，这里直接使用 debian 作为主机名。

域名建议留空。

{% gi 2 2 %}
![](DebianHostname.png)
![](DebianDomainName.png)
{% endgi %}

下一步设置用户。Root 是计算机系统中权限最高的用户，可以做任何事，包括搞坏整个系统。Root 密码非常重要，一旦密码被窃取，潜在的攻击者可以以 Root 身份在系统内执行任意代码，非常危险，请谨慎选取。在这一步将 Root 密码留空，则会禁用 Root 用户，之后创建的第一个用户自动拥有 sudoer 权限。否则，需要手动安装 sudo 命令和设置 sudoer 用户组。

![](DebianRootPassword.png)

下一步创建普通用户。每个用户都有「全名」和「用户名」之分，它们可以是相同或不同的。然后再为这位用户设置一个密码。密码不可以留空。

{% gi 4 2-2 %}
![](DebianAddUser.png)
![](DebianAddUsername.png)
![](DebianBlankPassword.png)
![](DebianAddPassword.png)
{% endgi %}

下一步对磁盘进行分区。由于我们是在虚拟环境中安装，大可放心使用默认选项，使用整个磁盘。毫无顾忌地选择下一步，实际格式化磁盘前，最后一问的默认选项是「否」，需要主动移动焦点到「是」后才能继续。

接下来会安装基本系统，完成后会询问是否扫描其他介质。我们只有一个安装映像，因此选择「否」。

{% gi 4 2-2 %}
![](DebianDiskPartition.png)
![](DebianDiskPartitionYes.png)
![](DebianInstallingBaseSystem.png)
![](DebianExtraImage.png)
{% endgi %}

接下来要通过网络安装额外软件包，因此需要选择一个镜像。一般来说在「中国」子菜单下选择一个距离机器较近的镜像站即可。我们使用的上海交通大学思源镜像站并不在列表里，需要选择「手动输入信息」进行配置。

在弹出来的窗口中输入思源镜像站的地址`mirror.sjtu.edu.cn`，目录不需要修改，默认的`/debian/`是正确的目录。

能够直连镜像站的，代理一般留空。

{% gi 4 2-2 %}
![](DebianAptMirror.png)
![](DebianAptMirrorSJTU.png)
![](DebianAptMirrorPath.png)
![](DebianAptMirrorProxy.png)
{% endgi %}

APT 将会自动从配置的镜像站下载软件包，期间会询问是否参与 Popularity Contest。

然后会询问是否安装预定义的软件集。默认选择的是 SSH Server 和标准系统工具，直接继续即可。有需要的用户可以在这里选择安装桌面环境，但是没必要。

{% gi 2 2 %}
![](DebianPopularityContest.png)
![](DebianSelectSoftware.png)
{% endgi %}

安装程序会自动下载并安装选择的软件，随后自动配置 GRUB 引导系统。全部完成后，将自动断开安装映像，并提示需要重启系统。

![](DebianInstallingFinish.png)

## 安装后配置

重新启动系统后，将看到与安装前稍微不一样的 GRUB 引导，默认在 5 秒后进入 Debian GNU/Linux。

{% gi 2 2 %}
![](DebianGRUB.png)
![](DebianLogin.png)
{% endgi %}

我们首先以 Root 身份登录，安装 sudo 并配置普通用户为 sudoer。配置完成后重启系统。

```sh
apt install sudo			# Login as root, can directly install
usermod -aG sudo tauyoung	# Add tauyoung to sudoer
systemctl reboot
```

![](DebianConfigureSudoer.png)

随后可以使用 SSH 登录 Debian，并正常使用 sudo 了。

```sh
ssh-copy-id debian
ssh debian
```

如果想要更改默认 SHELL 为 Zsh，需要先安装后更换。

```sh
sudo apt install zsh
chsh -s /bin/zsh
```

## 升级到 testing/sid

编辑`etc/apt/sources.list`文件，将`bookworm*`替换为`testing*`。如果想升级到`sid`，则将`testing`替换为`sid`。只有`testing`改为`sid`才有效，`updates`，`backports`和`security`没有`sid`版的软件包，因此这三项保留在`testing`即可。

<figure class="highlight sh">
	<table>
		<tbody>
			<tr>
				<td class="gutter">
					<pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br><span class="line">19</span><br><span class="line">20</span><br><span class="line">21</span><br></pre>
				</td>
				<td class="code">
					<pre><code class="hljs sh"><span class="hljs-comment">#deb cdrom:[Debian GNU/Linux 12.2.0 _Bookworm_ - Official arm64 NETINST with firmware 20231007-10:28]/ bookworm main non-free-firmware</span><br><br><span class="hljs-attr">deb</span> <span class="hljs-string">https://mirror.sjtu.edu.cn/debian/ sid main contrib non-free non-free-firmware</span><br><span class="hljs-attr">deb-src</span> <span class="hljs-string">https://mirror.sjtu.edu.cn/debian/ sid main contrib non-free non-free-firmware</span><br><br><span class="hljs-attr">deb</span> <span class="hljs-string">https://security.debian.org/debian-security testing-security main contrib non-free non-free-firmware</span><br><span class="hljs-attr">deb-src</span> <span class="hljs-string">https://security.debian.org/debian-security testing-security main contrib non-free non-free-firmware</span><br><br><span class="hljs-comment"># bookworm-updates, to get updates before a point release is made;</span><br><span class="hljs-comment"># see https://www.debian.org/doc/manuals/debian-reference/ch02.en.html#_updates_and_backports</span><br><span class="hljs-attr">deb</span> <span class="hljs-string">https://mirror.sjtu.edu.cn/debian/ testing-updates main contrib non-free non-free-firmware</span><br><span class="hljs-attr">deb-src</span> <span class="hljs-string">https://mirror.sjtu.edu.cn/debian/ testing-updates main contrib non-free non-free-firmware</span><br><br><span class="hljs-attr">deb</span> <span class="hljs-string">https://mirror.sjtu.edu.cn/debian/ testing-backports main contrib non-free non-free-firmware</span><br><span class="hljs-attr">deb-src</span> <span class="hljs-string">https://mirror.sjtu.edu.cn/debian/ testing-backports main contrib non-free non-free-firmware</span><br><br><span class="hljs-comment"># This system was installed using small removable media</span><br><span class="hljs-comment"># (e.g. netinst, live or single CD). The matching "deb cdrom"</span><br><span class="hljs-comment"># entries were disabled at the end of the installation process.</span><br><span class="hljs-comment"># For information about how to configure apt package sources,</span><br><span class="hljs-comment"># see the sources.list(5) manual.</span></code></pre>
				</td>
			</tr>
		</tbody>
	</table>
</figure>

保存并退出，然后依次执行

```sh
sudo apt update
sudo apt full-upgrade
sudo apt autoremove
sudo apt autoclean
```

可将系统升级至 testing/sid。

最后执行`sudo systemctl reboot`重启系统，或者`sudo systemctl poweroff`关闭系统。
