'use strict'

const eloquence = require('eslint-config-eloquence')

module.exports = eloquence({
  target: 'node',
  rules: {
    'node/no-unsupported-features/node-builtins': 'off',
  },
})
