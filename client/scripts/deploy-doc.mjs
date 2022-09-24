#!/usr/bin/env zx
import { $ } from 'zx'
import path from 'path'
let dist = path.resolve(__dirname, '../', 'doc/doc/doc')
await $`npm run doc:build && scp -r ${dist} root@124.223.73.152:/usr/local/nginx/html/doc/`

// ssh 密码： Monibuca@4
