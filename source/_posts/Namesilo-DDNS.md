---
title: 不求人，自制 DDNS 脚本！
date: 2023-11-20 15:00:00
updated: 2023-11-20 15:00:00
categories: 实用工具
tags: [Shell, DNS]
index_img: https://www.redeszone.net/app/uploads-redeszone.net/2018/11/Redes-DDNS.jpg
banner_img: https://static1.makeuseofimages.com/wp-content/uploads/2015/04/free-dynamic-dns-intro.jpg
---

使用 Namesilo API 更新本机 IPv6 解析记录。

## Shebang

在脚本的第一行写入一条特殊的注释：`#!/bin/zsh`。以 `#!` 开头的注释称为「Shebang」，用以指定运行脚本的解释器。我们接下来的脚本使用 Zsh 语法写成，因此指定使用 `zsh` 来运行。即使在默认 Shell 是 `bash` 的机器上，只要安装了 Zsh，脚本就会使用 Zsh 运行，而无需显式指定解释器。原先需要使用 `/bin/zsh ddns.sh` 来调用，现在直接键入 `./ddns.sh` 即可。

## 格式化输出日期

为了追踪我们对 DNS 记录的操作，一个良好的习惯是为每次操作记录日志。

日志的开头应是操作进行的时间，在 Zsh 中可以用 `date` 命令获取。默认情况下 `date` 的输出可能是形如「2023年11月20日 星期一 15时00分00秒 CST」这样的完整格式，这样的长度和文字形式非常不利于日志的快速查找，因此我们需要将其格式化为较短的格式。

查阅手册（`man date`）可知，我们可以传入一个字符串以自定义输出格式，例如，格式为 `'+%F %T'` 的输出将会是 `2023-11-20 15:00:00`，非常适合我们记录日志之用。

秉持「一行一条日志」的原则，输出时间时需要指定不输出换行符。使用 `echo -n` 来取消换行。

## 获取 IPv6

在 macOS 上可以使用 `ifconfig` 命令获取网络配置信息。直接使用该命令，可以发现不少网络设备都没有分配 IP 地址或者仅分配了 `fe80:` 开头的局域网地址，并不能从公网访问。一般来说，实际能够与外网连接的网络设备是 `en0`，因此使用 `ifconfig en0` 过滤其他无效输出。

在 `en0` 的配置信息中，可以发现有若干以 `inet6` 开头的配置信息，随后是合法的 IPv6 地址。在笔者的网络环境下，最后一条标记有 `prefixlen 64 dynamic` 的地址可以保持长久不变，其他地址都是临时且会快速变更。我们使用 `grep` 命令提取出这一条配置信息：`grep 'prefixlen 64 dynamic'`。

现在，在这一行有前后缀的文本中，我们仍需要提取出 IPv6 地址，丢弃无关信息。`grep -o` 可以仅保留匹配的内容，`grep -E` 可以匹配扩展的正则表达式。合法的 IPv6 地址的正则表达式为：`([0-9a-f]{0,4}:){0,6}([0-9a-f]{1,4}){0,1}(:[0-9a-f]{1,4}){1,7}`。

如果有多个符合条件的值，可任取其一。例如，取最后一个：`tail -n1`。

将获取的唯一合法公网 IPv6 地址写入变量，留作后用。如果未获取到 IPv6 地址，输出错误信息并退出。

## Namesilo API

笔者的域名在 [Namesilo](https://www.namesilo.com/) 购买，DNS 解析也由其负责。访问你的域名解析服务提供商，查看 API 信息。下面的示例演示通过 [Namesilo API](https://www.namesilo.com/api-reference) 更新域名解析。

进行操作之前，我们需要准备一些后续会经常用到的值写入变量。

`$key` 是你的 Namesilo 账户的 API Key，可前往 [API Manager](https://www.namesilo.com/account/api-manager) 获取。
`$domain` 是需要更新的一级域名，形式为 `example.com`。注意不要包含二级域！
`$host` 是需要更新的二级或更低级别的域名。不需要包含一级域。

### 获取当前解析记录

获取当前解析记录有两个重要用途。一是将目前解析值与当前 IPv6 地址进行比对，如果相同，则无需更新，可直接退出；二是地址不匹配是需要当前的记录 ID 才能更新新的记录。

查阅[文档](https://www.namesilo.com/api-reference#dns/dns-list-records)可知，向如下地址发出 GET 请求即可获取该域名下的所有解析记录。

```url
https://www.namesilo.com/api/dnsListRecords?version=1&type=xml&key=&domain=
```

其中 `key` 和 `domain` 的值就是我们上一步准备的变量。

获取到的回复是一个 XML 文件，我们需要使用 `xmllint` 解析其中的值获取当前已有的记录。

### 更新现有解析记录

查阅[文档](https://www.namesilo.com/api-reference#dns/dns-update-record)可知，更新 DNS 解析记录需要向如下地址发出 GET 请求并提供对应信息。

```url
https://www.namesilo.com/api/dnsUpdateRecord?version=1&type=xml&key=&domain=&rrid=&rrhost=&rrvalue=&rrttl=
```

其中各字段的含义如下。
- `domain`：一级域名
- `rrid`：现有记录的唯一 ID
- `rrhost`：要更新的二级域名
- `rrvalue`：更新后的解析值
	- A - IPv4 地址
	- AAAA - IPv6 地址
	- CNAME - 目标主机名
	- MX- 目标主机名
	- TXT 文本内容
- `rrdistance`：仅对 MX 记录生效，默认为 10
- `rrttl`：该记录的生存时间，默认是 7207

`rrid` 可以从上一步查询结果处获得。

对收到的回复进行解析，不论更新成功或失败都需要将结果写入日志。如果失败，还需要写入错误信息，方便后续排查。

## 完整脚本（需要填写部分变量值）

```sh
#!/bin/zsh
echo -n "[$(date '+%F %T')]: "
ipv6=$(ifconfig en0 | grep 'prefixlen 64 dynamic' | grep -oE '([0-9a-f]{0,4}:){0,6}([0-9a-f]{1,4}){0,1}(:[0-9a-f]{1,4}){1,7}' | tail -n1)
if [[ -z $ipv6 ]]
then
	echo '\U2718 IPv6 not get'
	exit -1
fi
key=
domain=
host=
record=$(curl -s https://www.namesilo.com/api/dnsListRecords\?version\=1\&type\=xml\&key\=$key\&domain\=$domain | xmllint --xpath '/namesilo/reply/resource_record' - | grep 'AAAA' | grep "$host.$domain")
if [[ $ipv6 == $(echo $record | xmllint --xpath '/resource_record/value/text()' -) ]]
then
	echo "\U2714 IPv6 $ipv6 remain unchanged"
	exit
fi
rrid=$(echo $record | xmllint --xpath '/resource_record/record_id/text()' -)
reply=$(curl -s https://www.namesilo.com/api/dnsUpdateRecord\?version=1\&type=xml\&key=$key\&domain=$domain\&rrid=$rrid\&rrhost=$host\&rrvalue=$ipv6 | xmllint --xpath '/namesilo/reply' -)
code=$(echo $reply | xmllint --xpath '/reply/code/text()' -)
detail=$(echo $reply | xmllint --xpath '/reply/detail/text()' -)
if [[ $code == '300' ]]
then
	echo "\U2714 IPv6 updated to $ipv6"
else
	echo "\U2718 IPv6 update filed, should be $ipv6"
	echo "\U2718 Error message: $detail"
	exit $code
fi
```
