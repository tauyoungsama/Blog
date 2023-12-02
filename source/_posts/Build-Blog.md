---
title: 自建博客，也没有那么复杂嘛
date: 2023-11-24 00:35:00
updated: 2023-11-24 00:35:00
categories: 实用工具
tags: Node.js
index_img: https://pic1.zhimg.com/v2-41e1b825c51055f39c22b95777bc620b_1440w.jpg
banner_img: https://www.hammertime.tech/images/posts/hexo_og.jpg
---

博客是一种在线日记型式的个人网站。在博客上发表的文章，可以是对特定的课题或新闻的评论，也可以专注于个人日记。简而言之，博客是一个人在网上独立发表文章的平台。

对于非技术爱好者或者对独立博客没有需求的作者，各大内容分享平台完全可以当作博客使用。[知乎专栏](https://zhuanlan.zhihu.com/)可以是博客，[微信公众号](https://mp.weixin.qq.com/)也可以是博客，甚至 [QQ 空间](https://qzone.qq.com/)也可以当作博客使用。如果有自定义页面样式的需求，[博客园](https://www.cnblogs.com/)或许是一个不错的选择。

但是出于不同的原因，或许是希望彰显自己的技术实力，又或许是受够了内容平台的审查，有部分人希望建立自己的独立博客网站。本文回顾了笔者建立个人网站的历史，希望能带领有一定计算机基础的新手从零开始建立一个属于自己的博客网站。

## 框架

从头开始手撸一个网站是真正的技术大佬才做得到的，对于我们普通人，主流的做法是采用成熟的博客框架，按照自己的需求进行配置。常见的博客框架有 [WordPress](https://wordpress.com/zh-cn/)、[Hexo](https://hexo.io/zh-cn/)、[Hugo](https://gohugo.io/)、[JekyII](https://jekyllrb.com/) 等。本站采用 [Hexo](https://hexo.io/zh-cn/) 作为框架进行构建，决定采用其他框架的读者可自行阅读相关文档或者搜索其他教程。

### Node.js

[Node.js](https://nodejs.org/) 是能够在服务器端运行 JavaScript 的开源、跨平台执行环境。Hexo 依赖于 Node.js 运行，因此我们需要先安装 Node.js。

在 Mac 上，使用 [Homebrew](https://brew.sh/zh-cn/) 安装：

```sh
brew install node
```

如果你不了解 Homebrew，可以参考{% post_link Homebrew %}。

或者直接访问其网站下载：https://nodejs.org/en/download/current

或者根据操作系统使用相应的包管理器安装：https://nodejs.org/en/download/package-manager

如有需要，可以给`npm`替换镜像源：

```sh
echo 'registry=https://mirrors.sjtug.sjtu.edu.cn/npm-registry' > ~/.npmrc
```

### Hexo

使用以下命令安装 Hexo：

```sh
npm install hexo-cli -g
```

创建新的项目：

```sh
hexo init Blog
```

将会在当前目录下新建名为 Blog 的项目。

常用的命令有：
- `hexo new title`：新建标题为 title 的文章；
- `hexo generate`：生成静态网页；
- `hexo server`：启动本地服务器；
- `hexo deploy`：根据配置部署到远程服务器；
- `hexo clean`：清理静态文件。

### 配置文件

网站的配置写在 `_config.yml` 中，可参考配置文件内的注释和相应的链接进行修改。

## 主题

博客的框架负责文章的管理和静态文件的生成，而让众多博客拥有惊艳的视觉效果和独特的浏览体验的则是主题。和框架一样，主题也有许多其他人写好的模板，可以直接套用。Hexo 默认的主题是 [Landscape](https://github.com/hexojs/hexo-theme-landscape)，可以直接使用，也可以安装其他心仪的主题。

本站采用的是 [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 主题，该主题目前在 GitHub 上有 6.5k Star，所以读者可能会在许多其他人的博客也见过这类主题。

根据[文档](https://hexo.fluid-dev.com/docs/start/)，在项目目录下运行

```sh
npm install --save hexo-theme-fluid
curl -o _config.fluid.yml https://raw.githubusercontent.com/fluid-dev/hexo-theme-fluid/HEAD/_config.yml
```

在`_config.yml`指定使用的主题的语言：

```yml
theme: fluid
language: zh-CN
```

随后可删除`theme/`、`_config.landscape.yml`等无关文件。

在主题相关的配置文件`_config.fluid.yml`中，可参照注释或者相关链接进行自定义的配置。

## 评论

Fluid 主题[支持的评论插件](https://hexo.fluid-dev.com/docs/guide/#评论)有很多，本站使用的是 [Waline](https://waline.js.org/)。可根据[快速上手](https://waline.js.org/guide/get-started/)的教程进行配置。

Waline 可绑定社交账号。通过此类方式在不同的博客上登录 Waline，可同步昵称、头像等相关信息。

## 编写

运行`hexo new`命令通过模板新建一篇文章。模板在`scaffolds/`目录下，可修改里面的文件更改新文章的初始内容。

文章使用 [Markdown](https://markdown.com.cn/) 语法编写，也可以插入 Fluid 主题支持的特殊语法，例如 [Tag 插件](https://hexo.fluid-dev.com/docs/guide/#tag-插件)。

本站[源代码](https://github.com/tauyoungsama/Blog)完全公开，如果遇到了没见过的语法，可以查看源代码观摩学习。

## 部署

尽管可以通过`hexo server`在本地启动网页服务，但这仅仅作为预览之用，不应作为直接对外提供服务的接口。正常来讲应该将项目部署在专用的服务器上，以便提供全天候的访问。

Hexo 支持多种方式部署项目。可以选择购买一台云服务器（VPS），将项目推送到这台服务器上并对外提供网站服务；也可以采用静态网页托管平台，只需要编写、提交，平台会自动处理构建和部署事宜。

本站部署在 [Vercel](https://vercel.com/) 上，和 Waline 插件的部署相同。

部署前请先将本项目推送到 GitHub 或者其他代码托管平台，Vercel 需要连接这些服务进行自动化部署。

在 Vercel 上选择「导入项目」，并选择本项目的仓库，Vercel 将自动检测并应用 Hexo 模板，可不作修改用默认配置直接部署。

连接项目仓库后，以后所有推送到主要分支的提交都会触发 Vercel 的自动部署。通常推送后只需要半分钟就能看到更新后的博客了。

成功部署后，Vercel 会提供类似于 https://blog-tauyoungsama.vercel.app/ 的项目地址。这个地址是永久的，即使博客更新后重新部署，此地址仍然有效。如果希望使用自己的域名，详见下一节。

## 域名

一个简单好记的域名是博客传播的关键。比起诸如 https://www.cnblogs.com/* 毫无新意的博客地址，或者是 https://*.github.io/ 寄人篱下的地址，拥有一个自己的域名能让你的博客（看起来）更加高大上。拥有一个自己的域名还能使用域名邮箱服务，从此你的电子邮件地址就是独一无二的域名后缀啦！不过需要说明的是，购买域名是收费的，无需域名同样可以完成个人博客的部署，请各位读者量力而行。

### 购买域名

域名需要到域名注册商处购买。常见的域名注册商有[阿里云](https://wanwang.aliyun.com/)、[腾讯云](https://buy.cloud.tencent.com/domain)、[Go DDaddy](https://www.godaddy.com/zh-sg/domains)、[Cloudflare](https://www.cloudflare.com/products/registrar/)、[Namesilo](https://www.namesilo.com/) 等。本站的域名 (tauyoung.top) 在 [Namesilo](https://www.namesilo.com/) 注册，可供参考。各位读者可自行前往心仪的域名注册商处购买。

特别需要注意的是，域名注册商可能会推荐一些首年价格极低的顶级域，其中不少从次年开始的续费价格会暴涨几十到几百倍。在所有顶级域中，`.top`域是最划算的，首次注册 $1，每年续费价格仅 $5，是经济实惠之选。

### DNS 解析

域名是买到手了，但是现在互联网上还没人知道你的域名应该怎么连接到你的博客。在域名注册商处，我们还需要配置域名的 DNS 记录，这样浏览器访问这个域名的时候，就知道去哪里访问你的博客啦！

根据部署方式的不同，配置的 DNS 记录也有所不同。解析的子域名可以是一级域名加上任意前缀（如 blog.tauyoung.top），也可以直接采用一级域名（如 tauyoung.top）。

#### 部署在云服务器上

需要从你的 VPS 提供商处获取 VPS 的 IP 地址。如果是 IPv4 地址，则添加一条 A 记录；如果是 IPv6 地址，则添加一条 AAAA 记录。

#### 部署在网页托管服务上

需要遵循你的网页托管服务商的指示，添加一条 CNAME 记录指向所提供的域名。DNS 记录需要几十分钟到几个小时才会生效，在此之前请稍作等候。

## 友链

不同于在热门的内容共享平台上发文，自建个人博客是很难被发现和访问的，本站的流量真是少的可怜呐……

所以，自建博客的技术爱好者们通常都会在自己的博客上增加[友链](/links/)页，从这里能访问到其他同伴们的个人博客！

当然，友链的交换是相互的，只有两个站点都加上了对方的链接，这样的友链才被认为是完整的。

通常由一人在另一人的友链页下发表评论，提供所需信息，随后两位作者各自在自己站点上添加对方的链接，便完成了一次交换。

还有人开发出了「[开往](https://www.travellings.cn/)」，这是一个友链接力项目，点击[链接](https://travellings.link/)会自动跳转到一个随机的博客。本站没有加入「开往」项目。

## 最后

如此，一个简洁但完整的博客就搭建完成了！

如果各位读者在自己尝试搭建过程中领悟了什么心得，或是遇见了什么问题，欢迎在下方进行评论！

成功搭建了属于自己的个人博客后，也欢迎互相[交换友链](/links/)，让彼此的博客成为访问对方博客的门户。
