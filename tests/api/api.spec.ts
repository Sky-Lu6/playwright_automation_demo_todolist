import { test, expect } from '@playwright/test';

/**
 * 接口（API）自动化测试
 * =====================
 * 对应岗位职责："简单接口测试"
 *
 * 【面试要点】为什么除了 UI 还要做接口测试？
 *  1. 快：不用启动浏览器、不用渲染页面，几十毫秒一个用例
 *  2. 稳：不受页面样式调整影响，不容易 flaky
 *  3. 早：后端接口写好就能测，不用等前端页面做完
 *  4. 准：能直接验证数据正确性，避开"界面正常但数据错"的情况
 *
 * Playwright 自带 request 能力，不用额外引第三方库就能测接口。
 * 这里用公开的练习 API（jsonplaceholder）演示增删改查四类请求。
 */

const BASE = 'https://jsonplaceholder.typicode.com';

test.describe('接口测试 - 待办/文章 CRUD', () => {

  test('GET 查询列表，状态码 200 且返回数组', async ({ request }) => {
    const res = await request.get(`${BASE}/todos`);

    // 断言 HTTP 状态码（接口测试第一关）
    expect(res.status()).toBe(200);
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    // 断言响应体结构
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    // 断言数据字段是否齐全
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('title');
    expect(body[0]).toHaveProperty('completed');
  });

  test('GET 查询单条，返回指定 id 的数据', async ({ request }) => {
    const res = await request.get(`${BASE}/todos/1`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.id).toBe(1);
    expect(typeof body.title).toBe('string');
    expect(typeof body.completed).toBe('boolean');
  });

  test('POST 新建数据，状态码 201 且返回新建内容', async ({ request }) => {
    const payload = { title: '自动化测试新建任务', completed: false, userId: 1 };

    const res = await request.post(`${BASE}/posts`, { data: payload });

    expect(res.status()).toBe(201);
    const body = await res.json();
    // 断言提交的数据被正确回显
    expect(body.title).toBe(payload.title);
    expect(body).toHaveProperty('id');
  });

  test('PUT 更新数据，提交的字段应被更新', async ({ request }) => {
    const res = await request.put(`${BASE}/posts/1`, {
      data: { id: 1, title: '已更新标题', body: '内容', userId: 1 },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('已更新标题');
  });

  test('DELETE 删除数据，状态码应为 200', async ({ request }) => {
    const res = await request.delete(`${BASE}/posts/1`);
    expect(res.status()).toBe(200);
  });

  test('GET 不存在的资源，应返回 404（异常场景测试）', async ({ request }) => {
    const res = await request.get(`${BASE}/todos/999999999`);
    // 异常路径同样要覆盖：请求不存在的数据应返回 404
    expect(res.status()).toBe(404);
  });
});
