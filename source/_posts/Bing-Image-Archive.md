---
title: 必应每日一图？我收下了！
date: 2023-12-11 13:30:00
updated: 2023-12-11 13:30:00
categories: 实用工具
tags: [Shell, Git]
index_img: https://cdn.wallpaperhub.app/cloudcache/3/c/a/e/9/4/3cae9423e2f818afb6e64a220ea2c39fd0cee877.jpg
banner_img:
---

微软必应的每日一图收集了来自全世界的自然风光、人文建筑等唯美照片，这些照片是 bing.com 的默认背景，用户也可以下载「[必应壁纸](https://www.microsoft.com/zh-cn/bing/bing-wallpaper)」来将这些图片作为桌面壁纸。

这些图片确实太好看了！站长很喜欢，决定每天把它们保存下来，并将最新的照片作为本站的首页图。

[![](https://img.shields.io/badge/GitHub-imageArchive-0?logo=GitHub)](https://github.com/tauyoungsama/imageArchive)

## 抓取每日一图

必应的每日一图的元数据可以通过 https://www.bing.com/HPImageArchive.aspx 获取，但是直接访问此地址将不会有任何返回，需要追加查询参数。

- `format`：返回数据的格式。可选：js，xml（默认），rss。
- `idx`（必需）：图片相对今天的 ID。可选：0..7。7 以上的数字按照 7 处理。
- `n`（必需）：获取的图片数量。可选：1..8。8 以上的数字按照 8 处理。
- `mkt`：每日一图的地区。不同地区的图片可能相同或不同。中国大陆的 IP 只能获取中国大陆的返回结果，此参数无效。

经过笔者的多次实验，`mkt` 取以下值时可能会获取到新图片：`zh-cn` `en-us` `en-gb` `en-ca` `en-in` `ja-jp` `fr-fr` `de-de` `es-es` `pt-br` `it-it`。为了能够确实地获取到供给其他地区的图片，以下操作需要全部在代理下进行。

接下来，让我们在 12 月 10 日试试往这个地址发一条 GET 请求试试吧！

https://www.bing.com/HPImageArchive.aspx?idx=0&n=1&mkt=zh-cn

```xml
<images>
	<image>
		<startdate>20231209</startdate>
		<fullstartdate>202312090800</fullstartdate>
		<enddate>20231210</enddate>
		<url>
			/th?id=OHR.LlanberisSnowdoniaSunset_ZH-CN6682238671_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp
		</url>
		<urlBase>
			/th?id=OHR.LlanberisSnowdoniaSunset_ZH-CN6682238671
		</urlBase>
		<copyright>
			林帕达恩湖，斯诺登尼亚国家公园， 威尔士 (© Joe Daniel Price/Getty Images)
		</copyright>
		<copyrightlink>
			https://www.bing.com/search?q=%E6%96%AF%E8%AF%BA%E7%99%BB%E5%B0%BC%E4%BA%9A%E5%9B%BD%E5%AE%B6%E5%85%AC%E5%9B%AD&form=hpcapt&mkt=zh-cn
		</copyrightlink>
		<headline>一个让人沉思的地方</headline>
		<drk>1</drk>
		<top>1</top>
		<bot>1</bot>
		<hotspots />
	</image>
	<tooltips>
		<loadMessage>
			<message>正在加载...</message>
		</loadMessage>
		<previousImage>
			<text>上一个图像</text>
		</previousImage>
		<nextImage>
			<text>下一个图像</text>
		</nextImage>
		<play>
			<text>播放视频</text>
		</play>
		<pause>
			<text>暂停视频</text>
		</pause>
	</tooltips>
</images>
```

分析返回的结果不难发现，

- `/images/image/startdate` 是图片发布的日期（通常滞后一天）；
- `/images/image/url` 是图片的真实地址，当然后两个查询参数是可以丢弃的；
- `/images/image/url` 内还藏了图片的标题，例如这里是 LlanberisSnowdoniaSunset；
- `/images/image/copyright` 是图片的拍摄位置与版权信息；
- `/images/image/headline` 是图片的描述。

嗯，很好，之后我们再往 https://www.bing.com/th?id=OHR.LlanberisSnowdoniaSunset_ZH-CN6682238671_1920x1080.jpg 发一个 GET 请求就能获取我们想要的图片了！

![她真好看。](https://www.bing.com/th?id=OHR.LlanberisSnowdoniaSunset_ZH-CN6682238671_1920x1080.jpg)

## 利用脚本处理元数据

但是，我们想要的是自动化！我们才不想每天亲自去抓取最新的图片数据，然后再去去抓取图片呢。我们写了脚本来处理这件事，之后再添加一个定时任务，每天自动运行，那才叫舒服！

### 循环…

贪心点没关系的，我们不止想要本地区的图片，我们想要必应供给全球的图片！所以，我们需要循环，让抓图的操作对所有的地区都来一发！

```sh
for mkt in {zh-cn,en-us,en-gb,en-ca,en-in,ja-jp,fr-fr,de-de,es-es,pt-br,it-it}
do
	# What is next...?
done
```

### 抓取元数据

要是您还记得我们之前提过的 [cURL](https://curl.se/)，这一步算是最容易的啦！

```sh
curl -sG -d idx=0 -d n=1 -d mkt=$mkt https://www.bing.com/HPImageArchive.aspx
```

其中`-s`抑制了 cURL 进度条，因为我们完全不需要这种信息，我们只关心它能获取的内容。`-G`表示我们发出的是 GET 请求，`-d`后面跟着的就是查询参数了。

### 解析 XML 参数

登登～接下来是`xmllint`的主场了。我们可以通过**管道**把要解析的内容传递给它，用`xpath`参数指定我们想提取的内容，接下来就交给它！有关命令行参数与标准输入的区别，忘记了的伙伴们可以去看看这篇文章：{% post_link Argument-and-Stdin %}。

```sh
image=$(curl -sG -d idx=0 -d n=1 -d mkt=$mkt https://www.bing.com/HPImageArchive.aspx | xmllint --xpath '/images/image' -)
startdate=$(echo $image | xmllint --xpath '/image/startdate/text()' -)
url=$(echo $image | xmllint --xpath '/image/url/text()' -)
headline=$(echo $image | xmllint --xpath '/image/headline/text()' -)
copyright=$(echo $image | xmllint --xpath '/image/copyright/text()' -)
```

### 保存文件

用什么当做文件名好呢？如果只有一个地区的话，`startdate`或许是个不错的选择，但是我们胃口很大，同一天有不同的图片，同一张图片也可能会出现在不同地区的不同日期，这样的话就非常不适合了。不过，必应很贴心地已经帮我们取好了标题，就藏在图片的 URL 里！

在`id`参数`id=OHR.LlanberisSnowdoniaSunset_ZH-CN6682238671_1920x1080.jpg`中，要把`LlanberisSnowdoniaSunset`提取出来，可以用 Zsh 内置的字符串截断语法。

|语法|方向|程度|
|-|-|-|
|`${str#*.}`|删除`.`左侧的内容|最小匹配|
|`${str##*.}`|删除`.`左侧的内容|最大匹配|
|`${str%_*}`|删除`_`右侧的内容|最小匹配|
|`${str%%_*}`|删除`_`右侧的内容|最大匹配|

这里，我们需要删除 URL`.`左侧的字符，最小匹配，以及`_`右侧的字符，最大匹配。因此我们的文件名应该是

```sh
filename=${${url#*.}%%_*}
```

除了图片本身，必应贴心地给出的描述也很珍贵，所以我们决定把图片的描述统统保存下来！当然——要分离。我们新建两个名为`desc`和`img`的目录，前者用于保存描述文字，后者用于保存图片本身。

```sh
echo $image | xmllint --xpath '/image/headline/text()' - > desc/$filename.txt
echo $image | xmllint --xpath '/image/copyright/text()' - >> desc/$filename.txt
curl -so img/$filename.jpg www.bing.com${url%%&*}
```

### 异常处理

假如，我是说假如，我们没能获取到任何数据，会发生什么？

这样的话`xmllint`就解析不到任何数据了，上面我们设置的所有变量都会为空，要是再继续下去，我们就会把空的内容保存到空的文件，我们的图库就乱套啦！所以，为了保持我们图库的整洁，我们需要跳过空的数据！

```sh
[[ -z $image ]] && continue
```

如果`image`变量为空值，就跳过后面的步骤，直接进入下一次循环。

不过，从不同地区获取的图片也完全有可能是相同的嘛，甚至也会出现某个地区今天的图片是其他地区昨天的图片这样的情况呢。所以，我们还需要检测文件是否已经存在，如果已经存在，那么也直接跳到下一个循环。

```sh
[[ -e img/$filename.jpg ]] && continue
```

### 额外保存最新的图片

本站的首页采用每天获取的最新的图片！但是，图片都用必应提供的标题保存了，我们怎么知道哪一张是今天新鲜出炉的呢？所以，我们需要把最新的图片另外存一份，命名为`latest.jpg`，这样，这个文件就永远会是最新的啦。

虽然一张图片占用的空间不大，用`cp`命令复制一份副本完全可行，不过这里我们采用了另一种方法——硬链接。硬链接相当于给了文件一个别名，在文件系统里以两份文件的形式存在，但实际上他们拥有同一个 Inode，指向硬盘上的同一块区域，是如假包换的同一份文件，因此也不占用额外存储空间。

```sh
ln -f img/$filename.jpg img/latest.jpg
```

如果我们查看`latest.jpg`的文件信息，我们会发现，`Links: 2`表明这份文件的实际内容有两个链接，那么就是`LlanberisSnowdoniaSunset.jpg`和`latest.jpg`这两个啦！它们的 Inode 也完全相同。

```sh
╭[tauyoung](~/imageArchive)[main]
╰ % stat -x img/latest.jpg 
  File: "img/latest.jpg"
  Size: 334090       FileType: Regular File
  Mode: (0644/-rw-r--r--)         Uid: (  501/tauyoung)  Gid: (   20/   staff)
Device: 1,17   Inode: 7760216    Links: 2
Access: Sun Dec 10 08:00:08 2023
Modify: Sun Dec 10 08:00:08 2023
Change: Sun Dec 10 08:00:08 2023
 Birth: Sun Dec 10 08:00:07 2023
╭[tauyoung](~/imageArchive)[main]
╰ % stat -x img/LlanberisSnowdoniaSunset.jpg 
  File: "img/LlanberisSnowdoniaSunset.jpg"
  Size: 334090       FileType: Regular File
  Mode: (0644/-rw-r--r--)         Uid: (  501/tauyoung)  Gid: (   20/   staff)
Device: 1,17   Inode: 7760216    Links: 2
Access: Sun Dec 10 08:00:08 2023
Modify: Sun Dec 10 08:00:08 2023
Change: Sun Dec 10 08:00:08 2023
 Birth: Sun Dec 10 08:00:07 2023
```

## 发布到 GitHub

没错！GitHub 用作图床虽然不是正经用法，但也确实是最简单的途径了。要让 GitHub 接受这些图片，首先要让 Git 来管理它们。不过，Git 主要是用来管理源代码等文本文件的，图片这类二进制文件的确不是它的长处。所以有了 Git LFS，大文件存储。Git LFS 用一个独特的方式管理体积较大的文件，这些文件原本的位置会被替换成一个指针，指向文件实际存储的位置。推送到 GitHub 上后，也会被存到专门存放大文件的地方。免费用户拥有 1GB 的大文件存储空间，对于我们这些图片来说已经是绰绰有余。

通过以下命令安装和启用 Git LFS（不了解或未安装 Homebrew 的请参考{% post_link Homebrew %}）：

```sh
brew install git-lfs
git lfs install
```

然后，告诉 Git LFS 处理这些文件：

```sh
git lfs track "*.jpg"
```

别忘了把`.gitattributes`加到 Git 储存库里哦：

```sh
git add .gitattributes
```

随后，按照常规的方法 Git 就行啦！

最后在我们的脚本里面加上提交和推送的操作：

```sh
git add desc img
git commit -m "Fetch: $startdate"
git push
```

假设我们的仓库名是`imageArchive`，最终`latest.jpg`的地址就是 https://media.githubusercontent.com/media/tauyoungsama/imageArchive/main/img/latest.jpg ，只要把这个地址插入到要使用的地方（比如博客的首页！），每天打开就是最新的图片了。就像这样：

![正是本站今日的首页图！](https://media.githubusercontent.com/media/tauyoungsama/imageArchive/main/img/latest.jpg)

## 完整的脚本

我们可以把之前零散的代码拼接起来，去除掉一些不必要的中间变量，稍稍增加一些辅助功能，形成我们的最终脚本：

```sh
#!/bin/zsh
idx=${1:-0}
for mkt in {zh-cn,en-us,en-gb,en-ca,en-in,ja-jp,fr-fr,de-de,es-es,pt-br,it-it}
do
	image=$(curl -sG -d idx=$idx -d n=1 -d mkt=$mkt https://www.bing.com/HPImageArchive.aspx | xmllint --xpath '/images/image' -)
	[[ -z $image ]] && continue
	startdate=$(echo $image | xmllint --xpath '/image/startdate/text()' -)
	url=$(echo $image | xmllint --xpath '/image/url/text()' -)
	filename=${${url#*.}%%_*}
	[[ -e img/$filename.jpg ]] && continue
	echo $image | xmllint --xpath '/image/headline/text()' - > desc/$filename.txt
	echo $image | xmllint --xpath '/image/copyright/text()' - >> desc/$filename.txt
	curl -so img/$filename.jpg www.bing.com${url%%&*}
	[[ $mkt == zh-cn ]] && ln -f img/$filename.jpg img/latest.jpg
done
[[ $(git status --porcelain) ]] || exit
git add desc img
git commit -m "Fetch: $startdate"
git push
```

## 定时任务

我们的脚本可以配置在本地或者云端执行。在本地执行的脚本方便调试，并且可以保证效果与调试时一模一样，但是计算机必须保持开机和联网才能完成执行；在云端执行的脚本不受本地计算机状态的影响，但是由于执行环境与网络条件不同，有可能会有不一样的效果。

本来我们是打算利用 GitHub Actions 自动执行脚本的，但是试用过后发现它们的机器上`echo`默认不换行，非 ASCII 字符被强制转译，都是我们不想要的效果。迫不得已我们才选用了本地定时任务的方案。

作为类 Unix 的操作系统，macOS 也支持用`cron`工具执行定时任务，但永远不会保证执行！所以我们才用另一种 Apple 推荐的方法：`launchd`来管理定时任务。

`launchd`的任务配置是一个 XML 文件，具体配置方法可以在 https://www.launchd.info/ 找到。这里直接给出配置，并对关键部分作一些介绍。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>Label</key>
		<string>top.tauyoung.imagearchive</string>
		<key>Program</key>
		<string>/Users/tauyoung/imageArchive/fetch.sh</string>
		<key>EnvironmentVariables</key>
		<dict>
			<key>ALL_PROXY</key>
			<string>socks5://localhost:7890</string>
			<key>PATH</key>
			<string>/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
		</dict>
		<key>WorkingDirectory</key>
		<string>/Users/tauyoung/imageArchive</string>
		<key>StartCalendarInterval</key>
		<dict>
			<key>Hour</key>
			<integer>8</integer>
			<key>Minute</key>
			<integer>0</integer>
		</dict>
		<key>StandardOutPath</key>
		<string>/Users/tauyoung/Library/Logs/top.tauyoung.imagearchive.log</string>
		<key>StandardErrorPath</key>
		<string>/Users/tauyoung/Library/Logs/top.tauyoung.imagearchive.err</string>
	</dict>
</plist>
```

- `Label`：任务的标签，以和域名相反的方向写成。没有自己的域名可以随便写，`local.taskname` 就是一个不错的选择。
- `Program`：要运行的脚本或者程序。需要使用绝对路径。如果需要传入参数，请改用`ProgramArguments`。
- `EnvironmentVariables`：环境变量。这里配置了网络代理，以及包含 Git LFS 的搜索路径。
- `WorkingDirectory`：工作目录，脚本中所有的相对路径都将从工作目录出发。
- `StartCalendarInterval`：启动时间。这里设置为每天 8:00 (UTC 0:00) 运行。
- `StandardOutPath`：标准输出路径，任务的输出会被重定向至该文件。
- `StandardErrorPath`：错误输出路径，任务的报错会被重定向至该文件。

在任务配置中出现的路径都应该是绝对路径，因为`launchd`不是 SHELL，不会自动展开类似于`~`的路径。

把写好的任务配置保存为`~/Library/LaunchAgents/top.tauyoung.imagearchive.plist`，然后运行

```sh
launchctl load ~/Library/LaunchAgents/top.tauyoung.imagearchive.plist
```

来加载任务。
