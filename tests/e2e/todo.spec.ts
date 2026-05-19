import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/TodoPage';

/**
 * UI 功能自动化测试
 * ==================
 * 对应岗位职责："功能测试""回归验证""基于 Playwright 编写测试脚本"
 *
 * 设计这些用例时用到的"测试用例设计方法"（面试讲解时主动点出来）：
 *  - 正常流程（场景法）：能不能正常增、删、改、查
 *  - 边界值分析：空输入、超长输入、只含空格
 *  - 等价类划分：有效输入 vs 无效输入分别取代表值
 *  - 状态转换：未完成 → 完成 → 重新激活
 */

test.describe('待办事项 - UI 功能测试', () => {
  let todoPage: TodoPage;

  // 每个用例执行前都先打开页面（保证用例之间互相独立、互不影响，
  // "用例独立性"也是面试常考的测试原则）
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  // ---------- 正常流程：场景法 ----------

  test('新增一条待办，应成功显示在列表中', async () => {
    await todoPage.addTodo('准备 Playwright 面试');
    expect(await todoPage.getTodoCount()).toBe(1);
    await todoPage.expectTodoText(0, '准备 Playwright 面试');
  });

  test('新增多条待办，数量与内容应正确', async () => {
    await todoPage.addTodos(['看测试基础', '做 Demo 项目', '练习面试问答']);
    expect(await todoPage.getTodoCount()).toBe(3);
    await todoPage.expectItemsLeft('3 items left');
  });

  test('把一条待办标记为完成，剩余计数应减少', async () => {
    await todoPage.addTodos(['任务A', '任务B']);
    await todoPage.completeTodoAt(0);
    // 完成 1 条后，应只剩 1 条未完成
    await todoPage.expectItemsLeft('1 item left');
  });

  test('删除一条待办，列表数量应减少', async () => {
    await todoPage.addTodos(['会被删除的任务', '保留的任务']);
    await todoPage.deleteTodoAt(0);
    expect(await todoPage.getTodoCount()).toBe(1);
    await todoPage.expectTodoText(0, '保留的任务');
  });

  // ---------- 边界值 / 等价类：异常与边界输入 ----------

  test('输入纯空格，不应创建有效待办（边界值测试）', async ({ page }) => {
    // TodoMVC 会对纯空格输入做 trim，不生成条目
    await todoPage.addTodo('     ');
    expect(await todoPage.getTodoCount()).toBe(0);
  });

  test('输入超长文本，应能正常创建（边界值-上界测试）', async () => {
    const longText = '长'.repeat(300);
    await todoPage.addTodo(longText);
    expect(await todoPage.getTodoCount()).toBe(1);
    await todoPage.expectTodoText(0, longText);
  });

  test('输入含特殊字符与表情，应原样保存（等价类-特殊输入）', async () => {
    const special = '测试 <script> & "引号" 😀 #@!';
    await todoPage.addTodo(special);
    await todoPage.expectTodoText(0, special);
  });

  // ---------- 状态转换测试 ----------

  test('待办状态流转：未完成→完成→重新激活', async ({ page }) => {
    await todoPage.addTodo('状态流转测试');
    const item = todoPage.todoItems.first();
    const checkbox = item.getByRole('checkbox');

    await checkbox.check();                        // 标记完成
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();                       // 重新激活
    await expect(checkbox).not.toBeChecked();
    await todoPage.expectItemsLeft('1 item left');
  });
});
