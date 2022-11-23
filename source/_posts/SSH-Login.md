---
title: SSH 登录远程主机
date: 2022-11-08 23:50:00
categories: 技术分享
tags:
  - Shell
  - SSH
---

**安全外壳协议**（Secure Shell Protocol，简称 SSH）是一种加密的网络传输协议，可在不安全的网络中为网络服务提供安全的传输环境。SSH 通过在网络中创建安全隧道来实现SSH客户端与服务器之间的连接。SSH 最常见的用途是远程登录系统，人们通常利用 SSH 来传输命令行界面和远程执行命令。SSH 使用频率最高的场合是类 Unix 系统，但是 Windows 操作系统也能有限度地使用 SSH。2015 年，微软宣布将在未来的操作系统中提供原生 SSH 协议支持，Windows 10 1803 版本已提供 OpenSSH 工具。[^1]

## 准备远程地址

SSH 需要远程主机的 IP 地址。如果远程主机有固定的 IP 地址，那再好不过了。如果远程主机的 IP 地址是动态的，那么需要动态 IP 解析服务。由于笔者的拥有固定公网 IP，因此没有对动态 IP 解析做过研究，在此不进行说明。

如果你有固定 IP，但是是绑定在路由器上的，那么需要在路由器后台管理处做端口映射。SSH 默认使用的是 22 端口，但是也可以用 `-p` 开关手动指定。或者，也可以将远程主机放到 DMZ 中，但是此举可能使远程主机容易遭受攻击。

如果你有域名，也可以到 DNS 管理处添加一条指向远程主机 IP 地址的记录，这样可以通过自定义域名而不是 IP 地址访问远程主机。

## SSH 登录到远程主机

macOS 需要在系统设置中打开「远程登录」。macOS 12 及以下在「共享」面板可以找到这项设置，macOS 13 及以上在「通用 - 共享」面板可以找到这项设置。

![远程登录](/img/Remote-Login.png)

使用以下命令登录到远程主机：
```sh
ssh username@59.78.xxx.xxx
```
如果你配置了自定义域名：
```sh
ssh username@your.domain.com
```
如果远程用户的用户名恰好与本机当前用户的用户名一致：
```sh
ssh 59.78.xxx.xxx
```
如果远程用户设置了密码，登录过程也会要求输入密码。

操作完成后，使用 `logout` 命令退出登录并断开连接。

## 使用公钥登录远程主机

可以将登录凭据保存到远程主机，以避免每次登录都输入密码。

首先生成 SSH 密钥对，此操作与连接 GitHub 的操作类似。

### 检查现有的 SSH 密钥

在你生成一个新的 SSH 密钥之前，你应该检查你的本地机器是否存在密钥。

打开终端，输入 `ls -al ~/.ssh` 查看现有的 SSH 密钥是否存在。
```sh
$ ls -al ~/.ssh
# 列出你的 .ssh 目录中的文件，如果它们存在的话
```
检查目录列表，看看你是否已经有一个公共的 SSH 密钥。

{% note info %}
提示：如果你收到 `~/.ssh` 不存在的错误，你在默认位置没有现有的 SSH 密钥对。你可以在下一步创建一个新的 SSH 密钥对。
{% endnote %}

如果你没有支持的公钥和私钥对，或者不希望使用任何可用的公钥和私钥对，那么就生成一个新的SSH密钥。

如果你看到一个现有的公钥和私钥对（例如，`id_rsa.pub` 和 `id_rsa`），你可以直接使用它们而不创建新的密钥对。

### 生成一个新的 SSH 密钥

检查完现有的 SSH 密钥后，你可以在你的本地机器上生成一个新的 SSH 密钥。

打开终端，粘贴下面的命令，并将电子邮件替换成你的 GitHub 电子邮件地址。
```
ssh-keygen -t rsa -f filename -C "Remark"
```
这将创建一个新的 SSH 密钥，采用 RSA 加密方式，存储文件名为 `filename`，并备注 "Remark"。

### 将公钥拷贝到远程主机

```sh
ssh-copy-id username@59.78.xxx.xxx
```
按提示操作并输入密码。操作完成后，登录一次以确保配置成功。这样，以后便可直接登录这台主机而不用再输入密码。

[^1]: [Secure Shell - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/Secure_Shell)