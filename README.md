# Playwright 自动化测试 Demo

> Playwright + TypeScript + Page Object Model
> 包含 UI 功能测试与接口（API）测试，配套 CI 自动回归
>
> 这是一个为「自动化测试实习生（AI 方向 / Playwright）」岗位准备的演示项目。

---

## 一、这个项目是什么

一个**能真实运行**的自动化测试项目，演示了这个岗位日常做的核心工作：

- 用 **Playwright + TypeScript** 写自动化测试脚本（岗位优先方向）
- 用 **Page Object Model** 组织代码（面试高频考点）
- 既有 **UI 功能测试**（增删改查、边界、异常），也有 **接口测试**（GET/POST/PUT/DELETE）
- 配了 **GitHub Actions**，每次提交代码自动跑回归测试
- 用例设计体现了 **等价类、边界值、场景法、状态转换** 等测试方法

测试对象用的是公开练习站点，不需要你自己搭服务，下载就能跑。

---

## 二、零基础运行步骤（照着做，5 步跑通）

### 第 1 步：装 Node.js

去 https://nodejs.org 下载 **LTS 版本**，一路下一步装好。
装完打开命令行（Windows 用 PowerShell / Mac 用终端），输入下面命令验证：

```bash
node -v
```

能显示出版本号（如 v20.x.x）就成功了。

### 第 2 步：进入项目目录

把这个项目文件夹下载解压后，在命令行里进入它：

```bash
cd 你解压后的路径/playwright-demo
```

### 第 3 步：安装项目依赖

```bash
npm install
```

（这一步会下载 Playwright 等工具，等它跑完。）

### 第 4 步：安装浏览器

Playwright 要用它自己管理的浏览器，运行一次：

```bash
npx playwright install
```

### 第 5 步：跑测试！

```bash
npm test
```

跑完会看到一条条 ✓ 通过的结果。想看漂亮的网页版报告：

```bash
npm run report
```

> 第一次跑全套，**这就是你"实操过 Playwright"的真实证据**。

---

## 三、常用命令速查

| 命令 | 作用 |
|------|------|
| `npm test` | 跑全部测试（UI + 接口） |
| `npm run test:ui` | 只跑 UI 功能测试 |
| `npm run test:api` | 只跑接口测试 |
| `npm run test:headed` | 显示浏览器窗口跑（能亲眼看到自动操作，很直观） |
| `npm run test:debug` | 调试模式，单步执行 |
| `npm run report` | 打开 HTML 测试报告 |
| `npm run codegen` | 启动**录制**功能，鼠标点页面自动生成代码 |

> 重点体验 `npm run test:headed` 和 `npm run codegen` 这两个——
> 前者让你亲眼看到"机器自动操作浏览器"，后者就是岗位职责说的"录制脚本"。

---

## 四、项目结构（面试会问"你的框架怎么组织的"）

```
playwright-demo/
├── pages/
│   └── TodoPage.ts          # Page Object：封装页面元素和操作
├── tests/
│   ├── e2e/
│   │   └── todo.spec.ts     # UI 功能测试用例
│   └── api/
│       └── api.spec.ts      # 接口测试用例
├── .github/workflows/
│   └── playwright.yml       # CI 配置：提交代码自动跑回归
├── playwright.config.ts     # Playwright 核心配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 依赖与命令脚本
```

分层思路：**用例（测什么）** 和 **页面操作（怎么操作）** 分开，
这样页面变了只改 `pages/`，用例不用动 —— 这就是 POM 的核心价值。

---

## 五、面试讲解话术（重要，对着练）

把这个项目讲明白，比项目本身更重要。准备这几段：

**1. 介绍项目时：**
> "我做了一个 Playwright + TypeScript 的自动化测试 Demo，用了 Page Object Model 分层。
> 里面既有 UI 功能测试，覆盖了增删改查的正常流程，也用等价类、边界值的方法
> 测了空输入、超长输入、特殊字符这些异常场景；另外还写了接口测试，覆盖
> GET/POST/PUT/DELETE 和 404 异常。还配了 GitHub Actions，每次提交自动跑回归。"

**2. 被问 "为什么用 Page Object Model"：**
> "为了解耦和可维护。页面元素的定位如果散在几十个用例里，页面一改就要改几十处；
> 用 POM 封装后，页面变了只改一个文件，所有用例自动生效。同时代码也更易读、能复用。"

**3. 被问 "Playwright 和 Selenium 区别 / 为什么选 Playwright"：**
> "最大的区别是 Playwright 内置自动等待（auto-waiting），每个操作前会自动等元素
> 可见、可交互、稳定，基本不用手动 sleep，从根本上减少了不稳定（flaky）的用例。
> 另外它定位器推荐按用户可见内容来定位（getByRole、getByText），更稳定；
> 还自带录制（codegen）和 Trace Viewer 调试，开箱即用。"

**4. 被问 "为什么 UI 测了还要测接口"：**
> "接口测试更快更稳，后端写完不用等前端页面就能测，而且能直接验证数据正确性，
> 避免界面看着正常但底层数据其实错了的情况。两者是互补的。"

**5. 被问 "你怎么用 AI 辅助测试"（这家公司的重点加分项）：**
> "我会用 Claude Code / Cursor 这类工具加速三件事：根据需求文档生成测试用例初稿、
> 把手工步骤转成 Playwright 脚本骨架、辅助分析失败日志定位问题。但 AI 生成的脚本
> 定位器经常不稳、断言偏弱，我会人工 review 再用——AI 是提效工具，不能替代测试思维。"

---

## 六、上传到 GitHub（命中"有 GitHub 项目优先"加分项）

1. 注册 GitHub 账号，新建一个仓库（如 `playwright-automation-demo`）
2. 在项目目录依次运行：

```bash
git init
git add .
git commit -m "feat: Playwright + TS 自动化测试 Demo"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

3. 简历和面试时给出这个仓库链接。
   推送后 GitHub 会自动按 `.github/workflows` 跑一遍测试，
   仓库页面会显示绿色 ✓ —— 这本身就是一个亮点。

---

## 七、建议的学习/练习顺序

1. 先把项目跑通（第二节的 5 步）
2. 用 `npm run test:headed` 亲眼看自动化跑起来
3. 打开 `tests/e2e/todo.spec.ts`，对着注释看懂每个用例在测什么
4. 用 `npm run codegen` 自己录一段，体会"录制生成代码"
5. 试着自己加一条新用例（比如"全部标记完成"），改完跑通
6. 对着第五节的话术，模拟面试讲一遍这个项目

> 能把这个项目跑通 + 讲清楚，零基础也能在面试里明显区别于其他只会背概念的人。
