import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../src/lib/request-validation';
const input = {phone:'(204) 555-0100',name:'Alex',service:'battery-boost',area:'General neighbourhood',consent:true,website:''};
test('normalizes callback numbers without collecting precise location',()=>{ const result=validateRequest(input); assert.ok(result.ok); if (result.ok) assert.equal(result.value.phone,'+12045550100'); });
test('rejects missing consent, spam, invalid numbers, unknown services, oversized and markup fields',()=>{
  for (const change of [{consent:false},{consent:'true'},{website:'spam'},{phone:'911'},{phone:'555'},{service:'collision-recovery'},{area:'x'.repeat(81)},{area:'<script>'},{name:'x'.repeat(61)},{area:''},{area:'one\ntwo'}]) assert.equal(validateRequest({...input,...change}).ok,false,JSON.stringify(change));
});
test('handles malformed and primitive requests',()=>{for (const value of [null,undefined,[],{},42,'text']) assert.equal(validateRequest(value).ok,false);});
