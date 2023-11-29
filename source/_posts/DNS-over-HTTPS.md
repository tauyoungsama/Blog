---
title: 使用加密 DNS 保护 DNS 查询
date: 2023-11-29 13:23:05
categories: 实用工具
tags: [macOS, DNS]
---

## DNS 协议简介

互联网上，计算机相互使用 [IP 地址](https://zh.wikipedia.org/wiki/IP地址)来标识主机和网络寻址。但是不论是 IPv4 还是 IPv6，对于人类来说记忆过于困难，人们更偏向于使用诸如 tauyoung.top 的更方便好记的[域名](https://zh.wikipedia.org/wiki/域名)。因此，在发送数据包之前，计算机需要将人类可读的域名转换为计算机可识别的 IP 地址，这样的转换是通过[域名系统](https://zh.wikipedia.org/wiki/域名系统)（Domain Name System, DNS）来完成的。

DNS 服务如果出现问题，将会出现上网异常的情况。一个经典的表现是打不开所有网站，但能正常登录 QQ。QQ 内置了腾讯服务器的 IP 地址，当无法通过 DNS 获取到服务器地址时，QQ 将直接通过保存的 IP 地址连接到服务器，因此在 DNS 服务异常时仍然可以正常登录。DNS 如果遭遇劫持，还可能导致访问部分网站时无法建立连接或者实际访问了另一个网站，这常常被作为监管手段在学校或者公司的内部网络实施。

经典的 DNS 传输协议是 [DNS-over-UDP/53](https://zh.wikipedia.org/wiki/域名系统#DNS-over-UDP/53_(%22Do53%22))。从 1983 年起源到最近，DNS 主要回答 UDP 端口 53 上的查询。此类查询包括从客户端以单个 UDP 数据包发送的明文请求，响应为从服务器以单个 UDP 数据包发送的明文回复。

由于使用 UDP 协议和明文传输，这样的 DNS 查询很容易受到攻击。一个简单的攻击方式是 DNS 抢答。不同于 [TCP](https://zh.wikipedia.org/wiki/传输控制协议)，[UDP](https://zh.wikipedia.org/wiki/用户数据报协议) 协议不需要建立连接，也没有序列号，攻击者可以发送一个来源 IP 是 DNS 服务器的数据报，假装自己是 DNS 服务器。发出查询请求的主机将会接受 53 端口上第一个响应的数据报，因此攻击者在真正的回复到达之前发出伪装的数据报，即可达到欺骗的目的。

另一个 DNS 传输协议是 [DNS-over-TCP/53](https://zh.wikipedia.org/wiki/域名系统#DNS-over-TCP/53_(%22Do53/TCP%22))，使用 TCP 替代 UDP 进行 DNS 查询。TCP 协议并不比 UDP 安全，即使建立了连接和使用序列号，明文传输的数据可被攻击者获取并且按照 TCP 协议的规则计算出可被接受序列号，同样可以进行攻击。同时，每次 DNS 查询都徒增了建立连接和释放连接的过程和资源开销，大大增加了 DNS 查询的成本，且性能有所下降，因此该协议并不流行。

2016 年，加密 DNS 标准 [DNS-over-TLS](https://zh.wikipedia.org/wiki/DNS_over_TLS) (DoT) 出现，利用 [TLS](https://zh.wikipedia.org/wiki/Tls) 来保护整个连接，而不仅仅是 DNS 有效负载。该协议使用 TCP 端口 853。

2018 年引入了 DNS 查询传输的竞争标准 [DNS-over-HTTPS](https://zh.wikipedia.org/wiki/DNS_over_HTTPS) (DoH)，通过 HTTPS 隧道传输 DNS 查询数据。该协议使用与 HTTPS 协议相同的端口 443，因此看起来类似于网络流量，更不容易被区分出来。

DoT 和 DoH 加密了查询请求的全过程，可以保护数据在 DNS 服务器和主机之间的传输不受篡改，也可以有效避免抢答。

{% note danger %}
加密 DNS 不能帮助你翻越长城防火墙。
{% endnote %}

## 在设备上配置 DoH

在设备上使用相应服务商的 DoH 软件，例如 [Cloudflare WARP](https://cloudflarewarp.com/)，可自动配置和路由设备的 DNS 查询。或者使用下面的方式手动配置。

在 iOS，iPadOS 和 macOS 上，Apple 没有提供手动配置加密 DNS 的开关，但可以通过[配置描述文件](https://support.apple.com/zh-cn/guide/security/secf6fb9f053/web)进行配置。配置描述文件是一个由有效负载组成的 XML 文件（以 .mobileconfig 结尾），这些有效负载可将设置和授权信息载入到 Apple 设备上。

以[阿里云公共 DNS](https://alidns.com/) 为例。将以下文本保存为一个文件并命名为`AliDNS-https.mobileconfig`。读者可以检查下面的文本，确保里面没有出现恶意的配置。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>DNSSettings</key>
			<dict>
				<key>DNSProtocol</key>
				<string>HTTPS</string>
				<key>ServerAddresses</key>
				<array>
					<string>2400:3200::1</string>
					<string>2400:3200:baba::1</string>
					<string>223.5.5.5</string>
					<string>223.6.6.6</string>
				</array>
				<key>ServerURL</key>
				<string>https://dns.alidns.com/dns-query</string>
			</dict>
			<key>PayloadDescription</key>
			<string>Configures device to use AliDNS Encrypted DNS over HTTPS</string>
			<key>PayloadDisplayName</key>
			<string>Ali DNS over HTTPS</string>
			<key>PayloadIdentifier</key>
			<string>cc.lxd.alidoh.dnsSettings.managed</string>
			<key>PayloadType</key>
			<string>com.apple.dnsSettings.managed</string>
			<key>PayloadUUID</key>
			<string>39e6a9fb-9532-461e-a73d-97e744bbe4e9</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
			<key>ProhibitDisablement</key>
			<false/>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>Adds the AliDNS to Big Sur and iOS 14 based systems</string>
	<key>PayloadDisplayName</key>
	<string>Ali DNS over HTTPS</string>
	<key>PayloadIdentifier</key>
	<string>cc.lxd.alidoh</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>c9b1404a-a873-4b08-b051-48c6f6c4d6aa</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>
```

如果使用其他 DoT/DoH 代理商，请修改配置文件中的 IP 地址、DNS 查询域名、文字描述和识别码。UUID 的内容并不重要，但需保证全局唯一。macOS 上可使用`uuidgen`来生成一个随机的 UUID。

双击此配置描述文件，然后按照系统提示进行安装。

![AliDNS Profile](AliDNSProfile.png)

请注意，此描述文件未签名，系统会向用户二次确认。签名仅仅代表文件从签名时到安装时未受篡改，不能保证文件不包含恶意内容。上述配置文件已经过读者审查，确认安全后再安装。如果您心存疑虑，请不要安装。

![AliDNS Profile Unsigned Warning](AliDNSProfileUnsignedWarning.png)

安装后，可以在「系统设置 > 网络 > VPN 与过滤条件」处查看，开启或关闭 DoH。

![AliDNS Profile Enabled](AliDNSProfileEnabled.png)
