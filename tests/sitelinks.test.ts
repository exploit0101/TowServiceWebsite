import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { services } from '../src/lib/content';
import { servicePresentation } from '../src/lib/service-presentation';

test('sitelink reference covers every current service with unique text and valid field lengths',()=>{
  const rows=readFileSync(new URL('../docs/GOOGLE_ADS_SITELINKS.csv',import.meta.url),'utf8').trim().split(/\r?\n/).slice(1).map(line=>line.split(','));
  assert.equal(rows.length,services.length);
  assert.equal(new Set(rows.map(row=>row[0])).size,rows.length);
  assert.deepEqual(rows.map(row=>new URL(row[3]).pathname).sort(),services.map(service=>`/services/${service.id}/`).sort());
  for(const [text,first,second,url] of rows) {
    assert.ok(text.length>0 && text.length<=25,text);
    assert.ok(first.length>0 && first.length<=35,first);
    assert.ok(second.length>0 && second.length<=35,second);
    assert.equal(new URL(url).origin,'https://easytowing.ca');
  }
  assert.deepEqual(Object.keys(servicePresentation).sort(),services.map(service=>service.id).sort());
});
