---
title: macOS 文件共享
date: 2023-03-15 10:30:00
updated: 2023-03-15 10:33:00
categories: 实用工具
tags: macOS
index_img: http://ww1.prweb.com/prfiles/2011/07/05/8620783/JPADS%202K%20FF%20in%20flight%201.JPG
banner_img: https://bitcoinafrica.io/wp-content/uploads/2018/07/Supply_air_drop_outside_of_Forward_Operating_Base_Boris_110922-A-AR883-003.jpg
---

## 前期准备

要从其他设备远程访问本地主机上的文件，就和其他类型的服务器类似，需要知道本地主机的地址才能进行连接。局域网内，可以通过**主机名**进行访问；局域网外，则需要 IP 地址或者域名进行访问。如果 IP 地址不固定，则每次连接前都需要查询最新的 IP 地址，或者连接到动态域名解析（DDNS）服务。

### 获取公网 IPv4 地址

目前大多数 IPv4 都是经由 NAT 转发的内网 IPv4 地址，从外网无法直接访问。向你的网络运营商（ISP）请求一个公网的 IPv4 地址，要么记住它，要么将一个域名（A）解析到这个地址。否组，你需要内网穿透服务。如果使用路由器，那么公网的 IPv4 地址将会是路由器的地址，所以还需要设置端口转发或者将主机设置到 DMZ（相当于全端口转发，但也十分不安全）。

### 获取 IPv6 地址

如果你的网络运营商提供 IPv6，并且你的路由器支持并开启了 IPv6 功能，那么你很可能已经拥有了 IPv6 地址。访问 [IPv6 测试](http://test-ipv6.com/) 来检查你是否接入了 IPv6 网络，或者在终端输入 `ifconfig en0 | grep inet6` 查看你的 IPv6 地址。你可能会看到很多个 IPv6 地址，其中大部分是动态随机生成的，并将在下次续租时更新。重启电脑若干次并运行上述命令，找出始终不变的一条。固定的 IP 地址有助于我们直接访问，否则需要 DDNS 服务。同样地，记住这条不变的 IPv6 地址，或者将一个域名（AAAA）解析到这个地址。

## 设置文件共享

在 macOS Ventura 及更新版本的 macOS 上，从「设置 - 通用 - 共享」菜单找到「文件共享」并打开。

![macOS 文件共享](macOS-File-Share.png)

如果仅供自己（管理员）使用，那么这样就算设置完成了，在局域网内的其他设备上连接到下方所示的「本地主机名」，在局域网外连接到先前记录的 IP 地址或者域名，输入用户名和密码登录即可访问主机连接到的所有磁盘。

### 允许客人用户访问

如果需要为客人用户提供访问权限，首先需要到「设置 - 用户与群组」中为客人用户打开共享访问权限。

![允许客人用户连接到共享文件夹](Allow-Guest-Access-Shared-Folder.png)

接着回到「设置 - 通用 - 共享 - 文件共享」，点按旁边的 ⓘ 进入到高级设置界面。

默认情况下当前用户的公共文件夹（`~/Public`）是开放共享的，权限设置为当前用户能够读写，其他用户和客人用户只读。

![macOS 文件共享高级设置界面](macOS-File-Share-Info.png)

{% note warning %}
检查「设置 - 隐私与安全性 - 文件保险箱」。

![macOS 文件保险箱](macOS-File-Vault.png)

如果此项设置已打开，那么其他用户无法访问系统盘（Macintosh HD）上的内容，共享文件夹必须位于未加密的外接磁盘中。
{% endnote %}

点按「+」号，选择一个共享位置，将其添加到列表。在右侧可以按需设置不同用户的权限。

### 允许 SMB 连接

在刚才的位置点按列表上方的「选项」，打开「使用 SMB 来共享文件和文件夹」，并勾选下方自己的账户。不开启此选项，只能通过 Apple 的协议从 Apple 设备上访问本机。

![macOS 文件共享选项](macOS-File-Share-Info-SMB.png)

### 共享为时间机器备份目的位置

如果要将一个宗卷设置为网络时间机器备份目的位置，在添加相关卷后，⌃单击（右键）目的宗卷，进入高级选项。

![文件共享高级选项](macOS-File-Share-Info-Right-Menu.png)

勾选「共享为时间机器备份目的位置」，同时取消勾选「允许客人用户」以防止未经授权的用户获取磁盘上的信息。

![文件共享高级选项](macOS-File-Share-Info-Advanced-Option.png)

## 连接到本机

在 Mac 上，从「访达 - 前往 - 连接服务器」或使用键盘快捷键 ⌘K 发起连接。输入一开始获取的 IP 地址或者解析的域名以连接。

![访达连接服务器](Finder-Connect-to-Server.png)

在 iPhone、iPad 和 iPod touch 上的「文件」App 里，点击「连接服务器」，输入 IP 地址或者域名以连接。

![iPad 文件 App](iPad-File-App.png)

在 Windows 上的「资源管理器」地址栏输入 IP 地址或者域名以连接。

![Windows 资源管理器](Windows-Explorer.png)
