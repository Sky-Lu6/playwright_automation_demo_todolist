import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model（POM，页面对象模式）
 * ==========================================
 * 这是自动化测试最重要的设计模式，面试几乎必问，一定要能讲清楚。
 *
 * 【是什么】把"页面长什么样、上面有哪些元素、能做哪些操作"封装成一个类，
 *          测试用例只调用这个类的方法，不直接碰页面元素。
 *
 * 【为什么用】举例：如果"新增输入框"这个元素的定位方式变了，
 *   - 不用 POM：散落在 50 个用例里的 50 处定位代码都要改 → 维护地狱
 *   - 用 POM：只改这个文件里的 1 处 → 所有用例自动生效
 *   一句话总结："POM 让测试代码和页面细节解耦，提升复用性和可维护性。"
 *
 * 这个例子封装的是 TodoMVC（一个经典的待办事项练习站点）。
 */
export class TodoPage {
  // page 是 Playwright 操作浏览器的核心对象
  readonly page: Page;

  // 把页面元素的定位器作为类的属性集中管理
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly toggleAll: Locator;
  readonly clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 定位器优先级：getByPlaceholder / getByRole / getByText 这类
    // "按用户能看到的内容定位"比 CSS/XPath 更稳定，是 Playwright 推荐做法。
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.toggleAll = page.getByLabel('Mark all as complete');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
  }

  /** 打开页面 */
  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  /** 新增一条待办 */
  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  /** 批量新增 */
  async addTodos(texts: string[]) {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  /** 把第 index 条标记为完成（勾选复选框） */
  async completeTodoAt(index: number) {
    await this.todoItems.nth(index).getByRole('checkbox').check();
  }

  /** 删除第 index 条（鼠标悬停后点删除按钮 ×） */
  async deleteTodoAt(index: number) {
    const item = this.todoItems.nth(index);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  /** 获取当前待办数量 */
  async getTodoCount(): Promise<number> {
    return await this.todoItems.count();
  }

  /** 断言：列表里第 index 条的文本应该等于 expected */
  async expectTodoText(index: number, expected: string) {
    await expect(this.todoItems.nth(index)).toHaveText(expected);
  }

  /** 断言：剩余未完成计数文本，如 "2 items left" */
  async expectItemsLeft(text: string) {
    await expect(this.todoCount).toHaveText(text);
  }
}
