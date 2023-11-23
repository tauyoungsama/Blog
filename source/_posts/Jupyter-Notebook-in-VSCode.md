---
title: 在 VSCode 中使用 Jupyter Notebook
date: 2023-01-30 22:48:40
updated: 2023-06-17 19:48:20
categories: 实用工具
tags: [Python, Jupyter]
---

## Jupyter Notebook

> Jupyter Notebook（前身是 IPython Notebook）是一个基于 Web 的交互式计算环境，用于创建 Jupyter Notebook 文档。Jupyter Notebook 文档是一个 JSON 文档，包含一个有序的输入/输出单元格列表，这些单元格可以包含代码、文本（使用 Markdown 语言）、数学、图表和富媒体 (Rich media)，通常以「.ipynb」结尾扩展。[^1]
>
> Jupyter Notebook 文档可以通过 Web 界面中的「Download As」，通过 nbconvert 库或 shell 中的「jupyter nbconvert」命令行界面，转换为许多的开源标准输出格式（HTML、演示幻灯片、LaTeX、PDF、reStructuredText、Markdown、Python）。
>
> 为了简化 Jupyter Notebook 文档在 Web 上的可视化，nbconvert 库是通过 nbviewer 提供的一项服务，它可以获取任何公开可用的 Notebook 文档的 URL，将其动态转换为 HTML 并显示给用户。

Jupyter 为 Notebook 提供了基于 Web 的 GUI 界面，不能说不好用，只是笔者有点叛逆，希望什么工作都能在 VSCode 里解决。所以，这才有了这篇文章，希望能对和笔者一样叛逆的朋友们有点帮助。

## 安装

### 安装 Python

使用 Homebrew 安装 Python。

```sh
brew install python
```

{% note info %}
以上安装命令会让 Homebrew 自动选择 Python 版本，不一定会是最新版。例如，在笔者撰写这篇文章期间，Python 3.11 已经发布，但是 Homebrew 仍然安装了 Python 3.10.9。如果要指定安装的版本，可以使用如下命令：

```sh
brew install python@3.11
```
{% endnote %}

留意安装完成后显示的信息：

```text
Python has been installed as
  /opt/homebrew/bin/python3

Unversioned symlinks `python`, `python-config`, `pip` etc. pointing to
`python3`, `python3-config`, `pip3` etc., respectively, have been installed into
  /opt/homebrew/opt/python@3.10/libexec/bin

You can install Python packages with
  pip3 install <package>
They will install into the site-package directory
  /opt/homebrew/lib/python3.10/site-packages

tkinter is no longer included with this formula, but it is available separately:
  brew install python-tk@3.10

See: https://docs.brew.sh/Homebrew-and-Python
```

方便起见，我们将 Python 路径添加到 `$PATH`。在 `~/.zprofile` 中添加以下内容：

```sh
export PATH=$PATH:$(brew --prefix python)/libexec/bin
```

### `pip` 使用技巧

#### 换源

如果从 PyPI 源下载遇到了问题，可以考虑更换为国内的镜像源。

```sh
pip config set global.index-url https://mirror.sjtu.edu.cn/pypi/web/simple
```

#### 安装包

安装的命令是 `pip install <package>`。例如，要安装 `numpy`，则执行

```sh
pip install numpy
```

#### 搜索包

`pip` 的搜索功能被禁用，我们需要额外安装一个包来实现搜索。
```sh
pip install pip-search
```
这样，我们可以使用 `pip_search` 来搜索特定的包，搜索结果将在终端中以表格的形式呈现。

#### 更新包

更新与安装类似，只需加上 `-U` 开关即可。例如要更新 `numpy`，则执行
```sh
pip install -U numpy
```
`pip-review` 是一个第三方工具，可以帮助我们管理使用 `pip` 安装的包。直接执行 `pip-review` 会列出所有过时的包，加上 `--auto` 开关可以自动更新所有过时的包。
```sh
pip-review --auto
```

#### 删除包

删除使用 `pip uninstall <package>` 命令，其余与安装类似。

### 安装 Jupyter Notebook

```sh
pip install notebook
```
这条命令会安装 Jupyter Notebook 以及包括 `nbconvert` 在内的一系列 Notebook 相关工具。安装完毕我们便可在浏览器中创建、编辑、运行和导出 Notebook 文件。

### 安装 `nbconvert` 依赖

如果需要使用 `nbconvert` 将 notebook 文件转换到 PDF 文件，需要安装 $\LaTeX$ 和 `pandoc`。

```sh
brew install mactex-no-gui pandoc
```

### 安装 VSCode 扩展

在 VSCode 应用商店中搜索并安装「Jupyter」扩展。安装这个扩展的同时会一并安装其他四个相关的扩展，如果不需要可以单独删除。

![Jupyter Extension in VSCode](Jupyter-Extension.png)

## 常见问题

### `nbconvert` 不正常运行

首先检查是否已经正确安装 `nbconvert`、$\LaTeX$ 和 `pandoc`。若问题仍然存在，运行下列命令[^2]：

```sh
mkdir ~/Library/Jupyter     # Create directory if not exists
ln -s /opt/homebrew/share/jupyter/nbconvert ~/Library/Jupyter
```

这段代码解决的是 `nbconvert` 找不到默认模板的问题，按照上述方法安装的都会遇到这个问题。

---

[^1]: https://zh.wikipedia.org/wiki/Jupyter
[^2]: https://github.com/executablebooks/jupyter-book/issues/1541#issuecomment-1166064740
