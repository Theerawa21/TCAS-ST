const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const students = [
  {student_id:'00001',citizen_id:'test-a',class_room:'ม.6/1'},
  {student_id:'00002',citizen_id:'test-b',class_room:'ม.5/1'}
];
const records = [
  ['test-a','','','','A','role','','01/09/2569','','2569','','',''],
  ['test-b','','','','B','role','','01/09/2569','','2569','','',''],
  ['test-a','','','','Older','role','','01/08/2569','','2569','','','']
];
const sheet = {getLastRow:()=>4,getRange:()=>({getDisplayValues:()=>records})};
const ss = {getSheetByName:()=>sheet};
const ctx = {SpreadsheetApp:{openById:()=>ss},Utilities:{formatDate:()=> 'test-time'}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../apps-script/Code.gs'),'utf8'),ctx);
ctx.requireTeacherSession_ = token=>{if(token!=='valid')throw new Error('unauthorized');};
ctx.getAllActiveStudents_ = ()=>students;
const exportRows = (id='',grade='all',room='all',from='',to='')=>
  ctx.teacherExportResponse_('valid',grade,'activity',room,from,to,id);
// Missing student filter would leak B into this individual export.
assert.deepEqual(Array.from(exportRows('00001').rows,r=>r[4]),['A','Older']);
assert.equal(exportRows('00001').student_id,'00001');
assert.equal(exportRows('00001','ม.5').rows.length,0);
assert.equal(exportRows('00001','all','ม.5/1').rows.length,0);
assert.deepEqual(Array.from(exportRows('00001','all','all','2026-09-01','2026-09-30').rows,r=>r[4]),['A']);
assert.equal(exportRows('99999').rows.length,0);
assert.equal(exportRows().rows.length,3);
assert.deepEqual(Array.from(exportRows(' 00001 ').rows,r=>r[4]),['A','Older']);
assert.throws(()=>exportRows('abc'),/รหัสนักเรียน/);
assert.throws(()=>ctx.teacherExportResponse_('', 'all','activity','all','','','00001'),/unauthorized/);
console.log('Individual teacher export tests passed');
