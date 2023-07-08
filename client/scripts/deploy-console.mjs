#!/usr/bin/env zx
import { $ } from 'zx'
import path from 'path'
const dist = path.resolve(__dirname, '../', 'dist')
// const dist = path.resolve(__dirname, '../', '../', 'server', 'web')
await $`scp -r ${dist} root@console.monibuca.com:/usr/local/nginx/html/`

// ssh 密码： Monibuca@4
