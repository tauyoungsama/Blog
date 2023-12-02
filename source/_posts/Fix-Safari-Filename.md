---
title: 修复 Safari 下载文件名乱码
date: 2023-06-08 02:00:00
updated: 2023-06-16 12:15:00
categories: 实用工具
tags: [macOS, Automator]
index_img: https://www.shamwari.com/wp-content/uploads/2019/09/02_Shamwari_Safari_Lion-1024x576.jpg
banner_img: https://wallpaperaccess.com/full/1286215.jpg
---

Safari 浏览器从特定网站上下载文件时，会出现文件名乱码的问题。本文提供了一键修复的教程。

我们需要 macOS 提供的「自动操作」（Automator.app）制作快速操作。

![Automator.app](Automator.png)

打开「自动操作」后，我们新建文稿，选择「快速操作」。

![新建快速操作](NewQuickAction.png)

在左侧边栏找到「运行 Shell 脚本」，双击或者拖到右边编辑窗口，将下面的代码粘贴至最大的文本框内，并修改「工作流程收到当前」为「文件或文件夹」，修改「传递输入：」为「作为自变量」。

```sh
for f in "$@"; do
	fileName=$(basename ${f})
	filePath=$(dirname ${f})
	{
		fileNewName=$(echo $fileName | iconv -f UTF-8-Mac -t latin1 | iconv -f gbk)
	} || {
		fileNewName=$(echo $fileName | iconv -f UTF-8-Mac -t latin1)
	} || {
		fileNewName=$(echo $fileName) | iconv -f UTF-8-Mac -t GBK
	}
	if [ -n "$fileNewName" ]; then
		if [ -e ${filePath}/$fileNewName ]; then
			mv "$f" "${filePath}/${fileNewName}-${RANDOM}"
		else
			mv "$f" "${filePath}/${fileNewName}"
		fi
	fi
done
```

![快速操作](QuickAction.png)

你可以把「图像」和「颜色」修改成自己喜欢的样式，然后选择「保存」（⌘S）。提示输入时输入「修复文件名」或者其他你认得出的名字，最后点按「存储」，你的快速操作就自动会在你的「访达」中出现。

要使用快速操作，辅助点按（右键）需要修复的文件或文件夹，找到「快速操作」，找到「修复文件名」，选中它即可。
