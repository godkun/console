#!/usr/bin/env zx
import { $ } from 'zx'
import path from 'path'
const dist = path.resolve(__dirname, '../', 'doc/doc/doc')
await $`scp -r ${dist} root@console.monibuca.com:/usr/local/nginx/html/doc/`

// ssh 密码： Monibuca@4
