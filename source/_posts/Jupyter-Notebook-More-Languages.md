---
title: 在 Jupyter Notebook 中使用更多语言
date: 2023-05-11 10:55:40
updated: 2023-05-15 13:32:50
categories: 实用工具
tags: [Python, Jupyter, R, MATLAB]
---

使用过 Jupyter Notebook 的开发者想必都十分熟悉这种基于 Web 的交互式计算环境，并且喜爱这种可以同时包含代码、文本、公式、图表和富媒体的文件格式吧！Jupyter Notebook 中最流行的程序语言是 Python，但是这不代表其他语言不能在 Jupyter Notebook 中运行，毕竟，这么好的格式怎么能让 Python 独占呢！事实上，只要能安装运行相应的**核**（Kernel），那么对应语言的代码就能在 Jupyter Notebook 中运行。你可以在[这里](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels)找到第三方核和它们支持的语言的完整列表，或者在文末查看。

本文主要介绍 R 和 MATLAB 核的安装与使用。

## R

在安装任何 R 内核之前，请确保你已经安装了 Jupyter Notebook 和 R，在虚拟环境里安装的请确保在同一虚拟环境里进行后续操作，否则相关程序可能无法正常运行。下面给出了在一台全新的机器上安装内核的步骤，读者若已经部分安装了相关程序可以按需阅读。

### 安装 Python

#### 在全局 Python 环境下安装

```sh
brew install python
export PATH=$PATH:$(brew --prefix python)/libexec/bin
pip install notebook
```

#### 在虚拟 Python 环境下安装

```sh
brew install miniforge
conda init "$(basename "${SHELL}")"
conda create -n kernel python
conda activate kernel
pip install notebook
```

### 安装 R 和 R 内核

```sh
brew install r
```

安装完毕后，进入 R 环境，安装 IRkernel。

```sh
R
```

注意启动 R 需要大写，小写的 `r` 是 shell 内置命令，表示运行上一条命令。

```r
> install.packages('IRkernel')
> IRkernel::installspec()
```

第一条命令会下载并编译很多包，因此过程可能比较缓慢，耐心等待即可。网络上有些教程可能会用 `IRkernel::installspec(user = FALSE)` 代替上述第二条命令，不过在我的机器上提示权限不够，个人感觉并不会影响使用。

安装完毕后，就可以在 Jupyter Notebook 中找到 R 的核了。

## MATLAB

MATLAB 需要 Python 与之通信，因此机器上除了完整的 MATLAB 以外，还需要安装 Python。截止 R2023a，MATLAB 仍不支持 Python 3.11，所以我们建立一个 Python 3.10 的虚拟环境。这里我们使用 `conda` 管理虚拟环境，如果读者有其他等效方法也可使用。

```sh
conda create -n matlab python=3.10
```

建立好虚拟环境后，我们激活并安装 MATLAB Engine for Python（由 MathWorks 提供）和 MATLAB Kernel。

```sh
conda activate matlab
cd /Applications/MATLAB_R2023a.app/extern/engines/python
pip install .
pip install matlab_kernel
```

安装完毕后，就可以在 Jupyter Notebook 中找到 MATLAB 的核了。

## Jupyter Kernels

以下是一份完整的 Jupyter 内核和支持语言的列表。相应的使用方法点击链接即可访问。

|Name| Jupyter/IPython Version | Language(s) Version | 3rd party dependencies | Example Notebooks | Notes |
|----|-------------------------|---------------------|------------------------|-------------------|-------|
|[GoNB](https://github.com/janpfeifer/gonb)| Jupyter >= 5 | Go >= 1.19 | | [Tutorial](https://github.com/janpfeifer/gonb/blob/e15ac2e8e3fe/examples/tutorial.ipynb)| |
|[Micronaut](https://github.com/stainlessai/micronaut-jupyter)||Python>=3.7.5, Groovy>3|[Micronaut](https://micronaut.io/)|https://github.com/stainlessai/micronaut-jupyter/blob/master/examples/basic-service/notebooks/use-library.ipynb|Compatible with [BeakerX](http://beakerx.com)|
|[Agda kernel](https://github.com/lclem/agda-kernel) | | 2.6.0 | | https://mybinder.org/v2/gh/lclem/agda-kernel/master?filepath=example/LabImp.ipynb |  |
|[Dyalog Jupyter Kernel](https://github.com/Dyalog/dyalog-jupyter-kernel)| |APL (Dyalog)|[Dyalog](https://www.dyalog.com/download-zone.htm) >= 15.0|[Notebooks](https://github.com/Dyalog/dyalog-jupyter-notebooks)|Can also be run on [TryAPL](https://tryapl.org/)'s Learn tab|
|[Coarray-Fortran](https://github.com/sourceryinstitute/jupyter-CAF-kernel)|Jupyter 4.0|Fortran 2008/2015|GFortran >= 7.1, [OpenCoarrays](https://github.com/sourceryinstitute/OpenCoarrays), [MPICH](https://mpich.org) >= 3.2|[Demo](https://nbviewer.jupyter.org/github/sourceryinstitute/jupyter-CAF-kernel/blob/master/index.ipynb), [Binder demo](https://beta.mybinder.org/v2/gh/sourceryinstitute/jupyter-CAF-kernel/master?filepath=index.ipynb)|[Docker image](https://hub.docker.com/r/sourceryinstitute/jupyter-caf-kernel/)|
|[LFortran](https://lfortran.org/) | | | |[Binder demo](https://mybinder.org/v2/gl/lfortran%2Fweb%2Flfortran-binde/master?filepath=Demo.ipynb) | Main repository at [GitLab](https://gitlab.com/lfortran/lfortran) |
| [Ansible Jupyter Kernel](https://github.com/ansible/ansible-jupyter-kernel) | Jupyter 5.6.0.dev0 | Ansible 2.x | | [Hello World](https://github.com/ansible/ansible-jupyter-kernel/blob/master/notebooks/HelloWorld.ipynb) | |
|[sparkmagic](https://github.com/jupyter-incubator/sparkmagic)|Jupyter >=4.0|Pyspark (Python 2 & 3), Spark (Scala), SparkR (R)|[Livy](https://github.com/cloudera/livy)|[Notebooks](https://github.com/jupyter-incubator/sparkmagic/tree/master/examples), [Docker Images](https://github.com/jupyter-incubator/sparkmagic#docker)|This kernels are implemented via the magics machinery of the ipython kernel to use Spark via Livy|
|[sas_kernel](https://github.com/sassoftware/sas_kernel)|Jupyter 4.0|python >= 3.3|SAS 9.4 or higher|||
|[IPyKernel](https://github.com/ipython/ipykernel)|Jupyter 4.0|python 2.7, >= 3.3|pyzmq|||
|[IJulia](https://github.com/JuliaLang/IJulia.jl)||julia >= 0.3||||
|[IHaskell](https://github.com/gibiansky/IHaskell)||ghc >= 7.6|||[Demo](https://begriffs.com/posts/2016-01-20-ihaskell-notebook.html)|
|[IRuby](https://github.com/SciRuby/iruby)||ruby >= 2.3||||
|[tslab](https://github.com/yunabe/tslab)||Typescript 3.7.2, JavaScript ESNext|Node.js|[Example notebooks](https://github.com/yunabe/tslab/blob/master/README.md#example-notebooks)|[Jupyter kernel for JavaScript and TypeScript](https://github.com/yunabe/tslab) - [npm](https://www.npmjs.com/package/tslab)|
|[IJavascript](https://github.com/n-riesco/ijavascript)||nodejs >= 0.10||||
|[ITypeScript](https://github.com/nearbydelta/itypescript)||Typescript >= 2.0|Node.js >= 0.10.0|||
|[jpCoffeescript](https://github.com/n-riesco/jp-coffeescript)||coffeescript >= 1.7||||
|[jp-LiveScript](https://github.com/p2edwards/jp-livescript)||livescript >= 1.5|||Based on IJavascript and jpCoffeescript|
|[Juka](https://github.com/jukaLang/juka_kernel)|Jupyter 4|Any|[Juka](https://jukalang.com/download)|[Example](https://github.com/jukaLang/juka_kernel/blob/main/JukaTest.ipynb)|Wrapper. Requires [Juka](https://jukalang.com/download) executable in PATH|
|[ICSharp](https://github.com/zabirauf/icsharp)|Jupyter 4.0|C# 4.0+|scriptcs|||
|[IRKernel](http://irkernel.github.io/)|IPython 3.0|R 3.2|rzmq|||
|[SageMath](http://www.sagemath.org/)|Jupyter 4|Any|many|||
|[pari_jupyter](https://github.com/jdemeyer/pari_jupyter)|Jupyter 4|PARI/GP >= 2.9||||
|[IFSharp](https://github.com/fsprojects/IfSharp)|Jupyter 4|F#||[Features](https://github.com/fsprojects/IfSharp/blob/master/FSharp_Jupyter_Notebooks.ipynb)||
|[lgo](https://github.com/yunabe/lgo)|Jupyter >= 4, JupyterLab|Go >= 1.8|ZeroMQ (4.x)|[Example](http://nbviewer.jupyter.org/github/yunabe/lgo/blob/master/examples/basics.ipynb)|[Docker image](https://hub.docker.com/r/yunabe/lgo/)|
|[iGalileo](https://github.com/cascala/igalileo)|Jupyter >= 4, JupyterLab|Galileo >= 0.1.3|||[Docker image](https://hub.docker.com/r/cascala/igalileo/)|
|[gopherlab](https://github.com/fabian-z/gopherlab)|Jupyter 4.1, JupyterLab|Go >= 1.6|ZeroMQ (4.x)|[examples](https://github.com/fabian-z/gopherlab/tree/master/examples)|Deprecated, use gophernotes|
|[Gophernotes](https://github.com/gopherdata/gophernotes)|Jupyter 4, JupyterLab, nteract|Go >= 1.9|ZeroMQ 4.x.x|[examples](https://github.com/gopherdata/gophernotes/tree/master/examples)|[docker image](https://hub.docker.com/r/dwhitena/gophernotes/)|
|[IGo](https://github.com/takluyver/igo)||Go >= 1.4|||Unmaintained, use gophernotes|
|[IScala](https://github.com/mattpap/IScala)||Scala||||
|[almond (old name: Jupyter-scala)](https://github.com/almond-sh/almond)|IPython>=3.0|Scala>=2.10||[examples](https://github.com/almond-sh/examples)| [Docs](https://almond.sh)|
|[IErlang](https://github.com/robbielynch/ierlang)|IPython 2.3|Erlang|rebar|||
|[ITorch](https://github.com/facebook/iTorch)|IPython >= 2.2 and <= 5.x |Torch 7 (LuaJIT)||||
|[IElixir](https://github.com/pprzetacznik/IElixir)|Jupyter >= 4.0|Elixir >= 1.5|Erlang OTP >= 19.3, Rebar|[example](https://github.com/pprzetacznik/IElixir/blob/master/resources/example.ipynb), [Boyle package manager examples](https://github.com/pprzetacznik/IElixir/blob/master/resources/boyle%20example.ipynb), [Boyle examples with usage of Matrex library](https://github.com/pprzetacznik/IElixir/blob/master/resources/boyle%20example%20-%20matrex%20installation%20and%20usage.ipynb)|[IElixir Docker image](https://hub.docker.com/r/pprzetacznik/ielixir/), [IElixir Notebook in Docker](https://mattvonrocketstein.github.io/heredoc/ielixir-notebook-in-docker.html#sf-ielixir-notebook-in-docker-2-back)|
|[ierl](https://github.com/filmor/ierl)|Jupyter >= 4.0|Erlang >= 19, Elixir >= 1.4, LFE 1.2|Erlang, (optional) Elixir||
|[IAldor](https://github.com/mattpap/IAldor)|IPython >= 1|Aldor||||
|[IOCaml](https://github.com/andrewray/iocaml)|IPython >= 1.1|OCaml >= 4.01|opam|||
|[OCaml-Jupyter](https://github.com/akabe/ocaml-jupyter)|Jupyter >= 4.0|OCaml >= 4.02|opam|[Example](https://github.com/akabe/ocaml-jupyter/blob/master/notebooks/introduction.ipynb)|[Docker image](https://github.com/akabe/docker-ocaml-jupyter-datascience)|
|[IForth](https://github.com/jdfreder/iforth)|IPython >= 3|Forth||||
|[peforth](https://github.com/hcchengithub/peforth)|IPython 6/Jupyter 5|Forth||[Example](https://github.com/hcchengithub/peforth/wiki)|python debugger in FORTH syntax|
|[IPerl](https://metacpan.org/release/Devel-IPerl)||Perl 5||||
|[Perl6](https://github.com/gabrielash/p6-net-jupyter)|Jupyter >= 4|Perl 6.c|zeromq 4|||
|[IPerl6](https://github.com/timo/iperl6kernel)||Perl 6||||
|[Jupyter-Perl6](https://github.com/bduggan/p6-jupyter-kernel)|Jupyter|Perl 6.C|[Rakudo Perl 6](http://rakudo.org/how-to-get-rakudo/)|||
|[IPHP](https://github.com/dawehner/ipython-php)|IPython >= 2|PHP >= 5.4|composer||DEPRECATED, use Jupyter-PHP|
|[Jupyter-PHP](https://github.com/Litipk/Jupyter-PHP)|Jupyter 4.0|PHP >= 7.0.0|composer, php-zmq|||
|[IOctave](https://github.com/calysto/octave_kernel)|Jupyter|Octave||[Example](http://nbviewer.jupyter.org/github/Calysto/octave_kernel/blob/master/octave_kernel.ipynb)|MetaKernel|
|[IScilab](https://github.com/calysto/scilab_kernel)|Jupyter|Scilab||[Example](http://nbviewer.jupyter.org/github/Calysto/scilab_kernel/blob/master/scilab_kernel.ipynb)|MetaKernel|
|[MATLAB Kernel](https://github.com/calysto/matlab_kernel)|Jupyter|Matlab|pymatbridge|[Example](http://nbviewer.ipython.org/github/Calysto/matlab_kernel/blob/master/matlab_kernel.ipynb)|MetaKernel|
|[Bash](https://github.com/takluyver/bash_kernel)|IPython >= 3|bash|||Wrapper|
|[Z shell](https://github.com/dan-oak/zsh-jupyter-kernel)|IPython >= 3|zsh >= 5.3||[Example](https://github.com/dan-oak/zsh-jupyter-kernel/blob/master/example.ipynb)|
|[Pharo Smalltalk](https://github.com/jmari/JupyterTalk)|IPython >= 3|Mac Os X||[Binder demo](https://mybinder.org/v2/gh/jmari/JupyterTalk.git/master?filepath=Tutorial1_BasicStatistics.ipynb)|Paro 64 bits native kernel, zeromq|
|[PowerShell](https://github.com/vors/jupyter-powershell)|IPython >= 3|Windows|||Wrapper, Based on Bash Kernel|
|[CloJupyter](https://github.com/roryk/clojupyter)|Jupyter|Clojure >= 1.7||||
|[CLJ-Jupyter](https://github.com/achesnais/clj-jupyter)|Jupyter|Clojure |||Abandoned as of 2017-02-12|
|[jupyter-kernel-jsr223](https://github.com/fiber-space/jupyter-kernel-jsr223)|Jupyter>=4.0|Clojure 1.8|[clojure-jrs223](https://github.com/ato/clojure-jsr223), Java>=7||Java based JSR223 compliant||
|[Hy Kernel](https://github.com/bollwyvl/hy_kernel/)|Jupyter|Hy||[Tutorial](http://nbviewer.ipython.org/github/bollwyvl/hy_kernel/blob/master/notebooks/Tutorial.ipynb)|treats Hy as Python pre-processor|
|[Calysto Hy](https://github.com/Calysto/calysto_hy)|Jupyter|Hy||[Tutorial](https://github.com/Calysto/calysto_hy/blob/master/notebooks/Tutorial.ipynb)| based on MetaKernel (magics, shell, parallel, etc.)|
|[Redis Kernel](https://github.com/supercoderz/redis_kernel)|IPython >= 3|redis|||Wrapper|
|[jove](https://www.npmjs.com/package/jove)||io.js||||
|[jp-babel](https://www.npmjs.com/package/jp-babel)|Jupyter|Babel||||
|[ICalico](http://wiki.roboteducation.org/ICalico)|IPython >= 2|*multiple*||[Index](http://nbviewer.jupyter.org/urls/bitbucket.org/ipre/calico/raw/master/notebooks/Index.ipynb)||
|[IMathics](http://nbviewer.ipython.org/gist/sn6uv/8381447)||Mathics||||
|[IWolfram](https://github.com/mmatera/iwolfram)||Wolfram Mathematica| Wolfram Mathematica(R), Metakernel||MetaKernel|
|[Lua Kernel](https://github.com/neomantra/lua_ipython_kernel)||Lua||||
|[IPurescript](https://github.com/Eoksni/ipurescript)||Purescript||||
|[IPyLua](https://github.com/pakozm/IPyLua)||Lua|||Fork of *Lua Kernel*|
|[ILua](https://github.com/guysv/ilua)||Lua||||
|[Calysto Scheme](https://github.com/Calysto/calysto_scheme)||Scheme||[Reference Guide](https://github.com/Calysto/calysto_scheme/blob/master/notebooks/Reference%20Guide%20for%20Calysto%20Scheme.ipynb)|MetaKernel|
|[Calysto Processing](https://github.com/Calysto/calysto_processing)||Processing.js >= 2|||MetaKernel|
|[idl_kernel](https://github.com/lstagner/idl_kernel)||IDL|||IDL seem to have a [built-in kernel](http://www.exelisvis.com/docs/idl_kernel.html) starting with version 8.5|
|[Mochi Kernel](https://github.com/pya/mochi-kernel)||Mochi||||
|[Lua (used in Splash)](https://github.com/scrapinghub/splash/tree/master/splash/kernel)||Lua||||
|[Apache Toree (formerly Spark Kernel)](https://github.com/apache/incubator-toree)|Jupyter|Scala, Python, R|Spark >= 1.5|[Example](https://github.com/apache/incubator-toree/blob/master/etc/examples/notebooks/magic-tutorial.ipynb)||
|[Skulpt Python Kernel](https://github.com/Calysto/skulpt_python)||Skulpt Python||[Examples](http://jupyter.cs.brynmawr.edu/hub/dblank/public/Examples/Skulpt%20Python%20Examples.ipynb)|MetaKernel|
|[Calysto Bash](https://github.com/Calysto/calysto_bash)||bash|||MetaKernel|
|[MetaKernel Python](https://github.com/Calysto/metakernel/tree/master/metakernel_python)||python|||MetaKernel|
|[IVisual](https://pypi.python.org/pypi/IVisual)||VPython||[Ball-in-Box](http://nbviewer.jupyter.org/url/dl.dropboxusercontent.com/u/5095342/visual/Ball-in-Box.ipynb)||
|[IBrainfuck](https://github.com/robbielynch/ibrainfuck)||Brainfuck||[Example](https://github.com/robbielynch/ibrainfuck/blob/master/notebooks/a-brief-look-at-brainfuck.ipynb)|Wrapper|
|[JupyterQ (KX Official Kernel)](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels)|Jupyter||kdb+ ≥ v3.5 64-bit, Python ≥ 3.6, embedPy|[Notebook Examples](https://github.com/KxSystems/jupyterq/blob/master/examples/q_widgets.ipynb)|
|[KDB+/Q Kernel (IKdbQ)](https://github.com/jvictorchen/IKdbQ)|IPython >= 3.1|Q|qzmq, qcrypt|||
|[KDB+/Q Kernel (KdbQ Kernel)](https://github.com/newtux/KdbQ_kernel)|Jupyter|Q||||
|[PyQ Kernel](https://pypi.org/project/pyq-kernel)|Jupyter|Q||[Python for kdb+](https://pyq.enlnt.com/pyq-2017)||
|[ICryptol](https://github.com/GaloisInc/ICryptol)||Cryptol|CVC4|||
|[cling](https://github.com/root-mirror/cling)|Jupyter 4|C++||[Example](https://github.com/root-mirror/cling/blob/master/tools/Jupyter/kernel/cling.ipynb)||
|[xeus-cling](https://github.com/QuantStack/xeus-cling)|Jupyter >= 5.1|C++||[Example](https://github.com/QuantStack/xeus-cling/tree/master/notebooks)|Supports Jupyter widgets|
|[Xonsh](https://github.com/calysto/xonsh_kernel)||Xonsh||[Example](http://nbviewer.ipython.org/github/Calysto/xonsh_kernel/blob/master/xonsh_kernel.ipynb)|MetaKernel|
|[Prolog](https://github.com/Calysto/calysto_prolog)||Prolog|||MetaKernel|
|[SWI-Prolog](https://github.com/madmax2012/SWI-Prolog-Kernel)|Jupyter >=4.0 |SWI-Prolog|||https://hub.docker.com/r/jm1337/jupyter-prolog-notebook/|
|[common-lisp-jupyter](https://github.com/yitzchak/common-lisp-jupyter)|Jupyter|Common Lisp|Quicklisp|[About](https://github.com/fredokun/cl-jupyter/blob/master/examples/about.ipynb)||
|[Maxima-Jupyter](https://github.com/robert-dodier/maxima-jupyter)|Jupyter|Maxima|Quicklisp|||
|[ielisp](https://github.com/shwina/ielisp)|Jupyter|Emacs Lisp|[emacs-zmq](https://github.com/nnicandro/emacs-zmq)|||
|[Calysto LC3](https://github.com/Calysto/calysto_lc3)|||||Assembly Language for the [Little Computer 3](https://en.wikipedia.org/wiki/LC-3)|
|[Yacas](https://github.com/grzegorzmazur/yacas_kernel)||YACAS||||
|[IJython](https://github.com/suvarchal/IJython)||Jython 2.7||||
|[ROOT](https://github.com/root-project/root/tree/master/bindings/jupyroot)|Jupyter|C++/python|ROOT >= 6.05|||
|[Gnuplot Kernel](https://github.com/has2k1/gnuplot_kernel)||Gnuplot||[Example](https://github.com/has2k1/gnuplot_kernel/tree/master/examples)|MetaKernel|
|[Tcl](https://github.com/rpep/tcl_kernel)|Jupyter|Tcl 8.5|||Based on Bash Kernel|
|[Tcl](https://github.com/mpcjanssen/tcljupyter)|Jupyter|Tcl 8.6||[Binder demo](https://mybinder.org/v2/gh/mpcjanssen/tcljupyter/binder?filepath=examples%2Fexample.ipynb)|Written from scratch with a patched Tcl zmq binding|
|[J](https://github.com/martin-saurer/jkernel)|Jupyter Notebook/Lab|J 805-807 (J901beta)||[Examples](https://github.com/martin-saurer/jkernel)||
|[Jython](https://github.com/fiber-space/jupyter-kernel-jsr223)|Jupyter>=4.0|Jython>=2.7.0|Java>=7||Java based JSR223 compliant||
|[C](https://github.com/brendan-rius/jupyter-c-kernel)|Jupyter|C|`gcc`||||
|[jupyterC](https://github.com/XaverKlemenschits/jupyter-c-kernel)|Jupyter|C|`gcc>=3.0`||Supports `C89` to `C17`, Built for teaching C||
|[TaQL](https://github.com/tammojan/taql-jupyter) | Jupyter | TaQL | [python-casacore](https://github.com/casacore/python-casacore) | [TaQL tutorial](http://taql.astron.nl) | |
|[Coconut](http://coconut-lang.org/)|Jupyter|Coconut|||||
|[SPARQL](https://github.com/paulovn/sparql-kernel)|Jupyter 4|Python 2.7 or >=3.4|[rdflib](https://github.com/RDFLib/rdflib), [SPARQLWrapper](https://rdflib.github.io/sparqlwrapper/)|[Examples](http://nbviewer.jupyter.org/github/paulovn/sparql-kernel/tree/master/examples/)| Optional [GraphViz](http://www.graphviz.org/) dependency|
|[AIML chatbot](https://github.com/paulovn/aiml-chatbot-kernel)|Jupyter 4|Python 2.7|[pyAIML](https://github.com/creatorrr/pyAIML)|[Examples](http://nbviewer.jupyter.org/github/paulovn/aiml-chatbot-kernel/tree/master/examples/)||
|[IArm](https://github.com/DeepHorizons/iarm)|Jupyter 4|ARMv6 THUMB||[Examples](http://nbviewer.jupyter.org/github/DeepHorizons/iarm/tree/master/docs/examples/)|Based off of the ARM Cortex M0+ CPU|
|[SoS](https://github.com/vatlab/SOS)|Jupyter 4|Python >=3.4|Support kernels for bash, python2/3, matlab/octabe, javascript, julia, R, Stata, SAS, and more|[Examples](http://vatlab.github.io/SOS/#documentation)|Workflow system, Multi-Kernel support|
|[jupyter-nodejs](https://github.com/notablemind/jupyter-nodejs)|Jupyter, iPython 3.x|NodeJS, Babel, Clojurescript||[Examples](http://nbviewer.jupyter.org/gist/jaredly/404a36306fdee6a1737a)|
|[Pike](https://github.com/kevinior/jupyter-pike-kernel)|IPython >= 3|Pike >= 7.8|||Wrapper, Based on Bash Kernel|
|[imatlab](https://github.com/imatlab/imatlab)|ipykernel >= 4.1|MATLAB >= 2016b||||
|[jupyter-kotlin](https://github.com/Kotlin/kotlin-jupyter)|Jupyter|Kotlin 1.4.20-dev-*** DEV|Java >= 8||[Samples](https://mybinder.org/v2/gh/kotlin/kotlin-jupyter/master?filepath=samples)|
|[jupyter_kernel_singular](https://github.com/sebasguts/jupyter_kernel_singular)|Jupyter|Singular 4.1.0||[Demo](https://github.com/sebasguts/jupyter-singular/blob/master/Demo.ipynb)|Optional PySingular for better performance, surf for images, [details](https://www.singular.uni-kl.de/index.php/graphical-interface.html)|
|[spylon-kernel](https://github.com/maxpoint/spylon-kernel)|ipykernel >=4.5|python >= 3.5, scala >= 2.11|Apache Spark >=2.0|[Example](https://github.com/maxpoint/spylon-kernel/blob/master/examples/basic_example.ipynb)|MetaKernel|
|[mit-scheme-kernel](https://github.com/joeltg/mit-scheme-kernel)|Jupyter 4.0|MIT Scheme 9.2||||
|[elm-kernel](https://github.com/abingham/jupyter-elm-kernel)|Jupyter|||[Examples](https://github.com/abingham/jupyter-elm-kernel/tree/master/examples)||
|[Isbt](https://github.com/ktr-skmt/Isbt)|Jupyter 4.3.0|sbt >= 1.0.0|sbt|[example](https://github.com/ktr-skmt/Isbt/blob/master/examples/isbt_examples.ipynb)||
|[BeakerX](http://beakerx.com/)|||Groovy, Java, Scala, Clojure, Kotlin, SQL|[example](https://github.com/twosigma/beakerx/blob/master/doc/StartHere.ipynb)|[docker image](https://hub.docker.com/r/beakerx/beakerx/)|
|[MicroPython](https://github.com/goatchurchprime/jupyter_micropython_kernel/)|Jupyter|ESP8266/ESP32|USB or Webrepl|[developer notebooks](https://github.com/goatchurchprime/jupyter_micropython_developer_notebooks)|relies on the micro-controller's paste-mode|
|[IJava](https://github.com/SpencerPark/IJava)|Jupyter|Java 9|Java **JDK** >= 9|[Binder online demo](https://mybinder.org/v2/gh/SpencerPark/ijava-binder/master)|Based on the new JShell tool|
|[Guile](https://github.com/jerry40/guile-kernel)|Jupyter 5.2|Guile 2.0.12|[guile-json](https://github.com/aconchillo/guile-json), openssl|||
|[circuitpython_kernel](https://github.com/adafruit/circuitpython_kernel)|Jupyter|[CircuitPython](https://github.com/adafruit/circuitpython)|USB| [Examples](https://github.com/adafruit/circuitpython_kernel/tree/master/examples)| 
|[stata_kernel](https://github.com/kylebarron/stata_kernel)|Jupyter >=5|Stata|Stata >=14| | Communicates natively with Stata|
|[iPyStata](https://github.com/TiesdeKok/ipystata)|Jupyter|Stata|Stata| [Example Notebook](http://nbviewer.jupyter.org/github/TiesdeKok/ipystata/blob/master/ipystata/Example.ipynb)| Implemented using magics machinery of ipython. |
|[pystata-kernel](https://github.com/ticoneva/pystata-kernel)||Stata >= 17|||Communicates with Stata through the [pystata](https://www.stata.com/python/pystata/) official Python bindings|
|[nbstata](https://hugetim.github.io/nbstata/)|Jupyter >= 5.2|Stata >= 17|[pystata](https://www.stata.com/python/pystata/), [ipydatagrid](https://github.com/bloomberg/ipydatagrid)|[stata_kernel example](https://github.com/hugetim/nbstata/blob/master/manual_test_nbs/stata_kernel%20example.ipynb)||
|[IRacket](https://github.com/rmculpepper/iracket)|IPython >= 3|Racket >= 6.10|Racket, ZeroMQ|[Example](https://github.com/rmculpepper/iracket/blob/master/examples/getting-started.ipynb)||
|[jupyter-dot-kernel](https://github.com/laixintao/jupyter-dot-kernel)|Jupyter >= 4.0|dot/graphviz|graphviz version 2.40.1| | | |
|[Teradata SQL kernel and extensions](https://teradata.github.io/jupyterextensions/)|JupyterLab >= 3.0|SQL|  |[Example Notebooks](https://github.com/Teradata/jupyterextensions/tree/master/notebooks) | | |
|[HiveQL Kernel](https://github.com/EDS-APHP/HiveQLKernel)|Jupyter >= 5|[HiveQL](https://en.wikipedia.org/wiki/Apache_Hive)| [pyhive](https://github.com/dropbox/PyHive) | | Display HiveQL queries in HTML tables |
|[EvCxR Jupyter Kernel](https://github.com/google/evcxr/tree/master/evcxr_jupyter)|Jupyter 4, JupyterLab, nteract|Rust >= 1.29.2|ZeroMQ 4.x.x|[Examples](https://github.com/google/evcxr/tree/master/evcxr_jupyter/samples), [Binder online demo](https://mybinder.org/v2/gh/google/evcxr/main?filepath=evcxr_jupyter%2Fsamples%2Fevcxr_jupyter_tour.ipynb)| |
|[StuPyd Kernel](https://github.com/StuPyd/demo-kernel)|Jupyter >= 4|[StuPyd Programming Language](https://github.com/StuPyd/stupyd-lang)|Python3, antlr4-python3-runtime >= 4.7.1|[nbviewer demo](https://nbviewer.jupyter.org/github/StuPyd/demo-kernel/blob/master/test.ipynb)||
|[coq_jupyter](https://github.com/EugeneLoy/coq_jupyter)|Jupyter 5|Coq|coq|[Binder online demo](https://mybinder.org/v2/gh/EugeneLoy/coq_jupyter_demo/master?filepath=demo.ipynb)||
|[Cadabra2](https://github.com/kpeeters/cadabra2/blob/master/JUPYTER.rst)|Jupyter 5|[Cadabra2](https://cadabra.science)||[Example notebook](https://github.com/kpeeters/cadabra2/blob/master/examples/schwarzschild.ipynb)||
|[iMongo](https://github.com/gusutabopb/imongo)||MongoDB||||
|[jupyter_kernel_chapel](http://github.com/krishnadey30/jupyter_kernel_chapel)|Jupyter|[Chapel](https://github.com/chapel-lang/chapel/)||||
|[A Jupyter kernel for Vim script](https://github.com/mattn/vim_kernel)|Jupyter|[Vim script](https://github.com/vim/vim/)||||
|[SSH Kernel](https://github.com/NII-cloud-operation/sshkernel)|Jupyter|Bash|paramiko, metakernel|[Examples](https://github.com/NII-cloud-operation/sshkernel/tree/master/examples)|A Jupyter kernel specialized in executing commands remotely with paramiko SSH client.|
|[GAP Kernel](https://gap-packages.github.io/JupyterKernel/)|Jupyter|GAP >= 4.10||[Binder demo](https://github.com/gap-system/try-gap-in-jupyter)|A Jupyter kernel for the computational algebra system [GAP](https://www.gap-system.org/).|
|[Wolfram Language for Jupyter](https://github.com/WolframResearch/WolframLanguageForJupyter)|   | Wolfram Engine, i.e., a Wolfram Desktop or Mathematica installation; `wolframscript` is optional but recommended |  |  |A Jupyter kernel for [the Wolfram Language](https://www.wolfram.com/language) (Mathematica).|
|[GrADS kernel](https://github.com/ykatsu111/jupyter-grads-kernel)|   | GrADS >= 2.0 |  |  |  |
|[Bacatá](https://github.com/cwi-swat/bacata)| Jupyter  | Java & [Rascal](https://rascal-mpl.org) | ZeroMQ & Rascal | [Example](https://github.com/maveme/rascal-notebooks-examples) | A Jupyter kernel generator for domain-specific languages. |
|[nelu-kernelu](https://github.com/3Nigma/nelu-kernelu)| Jupyter  | NodeJs 12 | [NodeJs 12.3+](https://nodejs.org/dist/latest-v12.x/docs/api/) | [Examples](https://github.com/3Nigma/nelu-kernelu/blob/master/nbs/nk-features.ipynb) | An advanced NodeJs Jupyter kernel supporting comms and displays among other things. |
|[IPolyglot](https://github.com/hpi-swa/ipolyglot)| Jupyter | [JavaScript, Ruby, Python, R, and more](https://www.graalvm.org/docs/reference-manual/polyglot/) | [GraalVM](https://www.graalvm.org/) | [Example Polyglot Notebook](https://github.com/hpi-swa/ipolyglot/blob/master/demo/polyglot-notebook.ipynb) | [Dockerfile](https://github.com/hpi-swa/ipolyglot/blob/master/Dockerfile) |
| [Emu86 Kernel](https://github.com/gcallah/Emu86/tree/master/kernels) | Jupyter | Intel Assembly Language |  | [Introduction to Intel Assembly Language Tutorial](https://github.com/gcallah/Emu86/blob/master/kernels/Introduction%20to%20Assembly%20Language%20Tutorial.ipynb) | |
|[Common Workflow Language (CWL) Kernel](https://github.com/giannisdoukas/CWLJNIKernel)|  | v1.1 |  | [examples directory](https://github.com/giannisdoukas/CWLJNIKernel/blob/master/examples/) |  |
|[MIPS Jupyter Kernel](https://github.com/epalmese/MIPS-jupyter-kernel)|Jupyter|MIPS32 Assembly Language|Python3, [SPIM](http://spimsimulator.sourceforge.net/)|[Example](https://github.com/epalmese/MIPS-jupyter-kernel/blob/master/kernel/test.ipynb)|Driven by Python3 and Pexpect|
|[iTTS](https://github.com/KOLANICH/iTTS)||Natural languages|[speech-dispatcher](https://github.com/brailcom/speechd)|[Example](https://github.com/KOLANICH/iTTS/blob/master/tutorial.ipynb)|Currently cannot output sound into files or blobs because of limitations of speech-dispatcher|
|[xeus-clickhouse](https://github.com/wangfenjin/xeus-clickhouse)||ClickHouse SQL|[xeus](https://github.com/jupyter-xeus/xeus)|[Example](https://github.com/wangfenjin/xeus-clickhouse/blob/master/examples/clickhouse.ipynb)|  |
|[IQSharp](https://github.com/microsoft/iqsharp)|Jupyter 4|Q#||[QuantumKatas](https://github.com/microsoft/QuantumKatas)|
|[.Net Interactive](https://github.com/dotnet/interactive/)|Jupyter 4| C#, F#, Powershell| [.Net Core SDK](https://dotnet.microsoft.com/download) |[Binder Examples](https://github.com/dotnet/interactive/blob/main/docs/NotebooksOnBinder.md) |
|[mariadb_kernel](https://github.com/MariaDB/mariadb_kernel)|Jupyter Notebook/Lab|SQL|[Internal Dependencies](https://github.com/MariaDB/mariadb_kernel/blob/master/requirements.txt), [MariaDB Server](https://mariadb.org/download/)|[Binder notebook](https://mybinder.org/v2/gh/MariaDB/mariadb_kernel.git/master?filepath=binder%2Ftry_it_out.ipynb)|A Jupyter kernel for the MariaDB Open Source database|
|[ISetlX](https://github.com/1b15/iSetlX)|Jupyter|SetlX||[Example](https://github.com/1b15/iSetlX/blob/master/example_notebooks/fibonacci.ipynb)||
|[Ganymede](https://github.com/allen-ball/ganymede)|Jupyter >= 4.0|Java 11+, [Groovy](https://groovy-lang.org/), [Javascript](https://www.oracle.com/technical-resources/articles/java/jf14-nashorn.html), [Kotlin](https://kotlinlang.org/), [Scala](https://www.scala-lang.org/), [Apache Spark](http://spark.apache.org/), and more|[JShell](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.jshell/jdk/jshell/JShell.html?is-external=true), [Apache Maven Resolver](https://maven.apache.org/resolver/index.html)|[Examples](https://github.com/allen-ball/ganymede-notebooks)|
|[cqljupyter](https://github.com/bschoening/cqljupyter)|Jupyter|Cassandra CQL||[CQL Examples](https://github.com/bschoening/cqljupyter/blob/master/Sample.ipynb)|
|[iclingo](https://github.com/thesofakillers/iclingo)|IPython 8|clingo|[clingo](https://pypi.org/project/clingo/)|[Basic Examples](https://github.com/thesofakillers/iclingo/tree/main/examples)||
|[ICrystal](https://github.com/RomainFranceschini/icrystal)|Jupyter|Crystal|[IRC](https://github.com/crystal-community/icr)|||
|[crystal_kernel](https://github.com/crystal-data/crystal_kernel)|Jupyter|Crystal|||Python wrapper kernel [Crystal interpreter](https://crystal-lang.org/2021/12/29/crystal-i.html)|
|[idg](https://github.com/LeaveNhA/idg)|Jupyter|Dg (Doge)||[Example Notebooks](https://github.com/LeaveNhA/UIST602-DG)||
|[Whitenote](https://github.com/makiuchi-d/whitenote)| Jupyter>=5 | Whitespace 0.1 | Go>=1.19 | [example.ipynb](https://github.com/makiuchi-d/whitenote/blob/main/example.ipynb) | [Docker image](https://hub.docker.com/r/makiuchid/whitenote) |
