const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');

function makeContext(teacherCode) {
  const context = {
    console,
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (name) => (name === 'TEACHER_CODE' ? teacherCode : '')
      })
    }
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  context.secureKey_ = () => 'teacher-key';
  context.requireLoginAllowed_ = () => {};
  context.clearLoginFailures_ = () => {};
  context.sessionSeconds_ = () => 3600;
  context.createSessionToken_ = () => 'teacher-session';
  context.teacherDashboardResponse_ = () => ({ grades: [] });
  return context;
}

{
  const context = makeContext('saint2026');
  const result = context.teacherLogin_('saint2026');
  assert.equal(result.teacher_token, 'teacher-session');
}

{
  const context = makeContext('123456');
  assert.throws(
    () => context.teacherLogin_('123456'),
    /อย่างน้อย 8 ตัวอักษร/
  );
}

{
  const removed = [];
  const context = {
    console,
    PropertiesService: {
      getScriptProperties: () => ({getProperty: () => 'x'.repeat(64)})
    },
    CacheService: {
      getScriptCache: () => ({remove: (key) => removed.push(key)})
    },
    Utilities: {
      computeHmacSha256Signature: () => [1, 2, 3],
      base64EncodeWebSafe: () => 'teacher-key'
    }
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  context.resetTeacherLoginLock?.();
  assert.deepEqual(removed, ['login-rate:teacher:teacher-key']);
}

console.log('Code.gs teacher-code validation tests passed');
