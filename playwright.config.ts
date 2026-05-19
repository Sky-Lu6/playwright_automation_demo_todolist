import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置文件
 * 文档：https://playwright.dev/docs/test-configuration
 *
 * 面试要点：面试官常问"你的框架是怎么配置的"，这个文件就是答案。
 * 重点能讲清楚：retries（失败重试）、reporter（报告）、baseURL（基地址）、
 * trace（出错时记录运行轨迹用于调试）这几个配置的作用。
 */
export default defineConfig({
  // 测试文件所在目录
  testDir: './tests',

  // 单个用例最长运行时间（毫秒），超时判失败
  timeout: 30 * 1000,

  // 断言的默认超时时间
  expect: {
    timeout: 5000,
  },

  // 是否禁止用例里出现 test.only（防止漏跑），CI 环境强制开启
  forbidOnly: !!process.env.CI,

  // 失败重试次数：本地不重试，CI 上重试 2 次（应对偶发的网络抖动）
  retries: process.env.CI ? 2 : 0,

  // 并行 worker 数量：CI 上用 1 个保证稳定，本地自动按 CPU 核数并行
  workers: process.env.CI ? 1 : undefined,

  // 测试报告格式：生成一个好看的 HTML 报告
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // 所有测试共享的全局配置
  use: {
    // 基础地址，用例里写 page.goto('/') 就会自动拼到这个域名后面
    baseURL: 'https://demo.playwright.dev/todomvc',

    // 出错时自动记录运行轨迹（Trace），可以用 Trace Viewer 回放排查问题
    // 这是 Playwright 调试的杀手锏，面试可以主动提
    trace: 'on-first-retry',

    // 失败时自动截图
    screenshot: 'only-on-failure',

    // 失败时保留录像
    video: 'retain-on-failure',
  },

  // 跨浏览器测试：同一套用例可以在 Chrome / Firefox / Safari 上都跑一遍
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
