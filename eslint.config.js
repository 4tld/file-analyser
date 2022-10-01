import tsParser from '@typescript-eslint/parser'
import ts from '@typescript-eslint/eslint-plugin'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

const baseRules = {
  'array-bracket-spacing': [ 1, 'always', { singleValue: false, objectsInArrays: false, arraysInArrays: false }],
  'array-bracket-newline': [ 1, 'consistent' ],
  'array-element-newline': [ 1, 'consistent' ],
  'class-methods-use-this': [ 1, { enforceForClassFields: false }],
  'comma-dangle': [ 1, 'always-multiline' ],
  complexity: 0,
  curly: [ 1, 'multi-line' ],
  'dot-location': [ 1, 'property' ],
  eqeqeq: 0,
  'func-style': [ 1, 'declaration' ],
  'function-call-argument-newline': [ 1, 'consistent' ],
  'id-length': [ 1, { exceptions: ['_'] }],
  indent: [ 1, 2 ],
  'init-declarations': 0,
  'line-comment-position': 0,
  'lines-around-comment': 0,
  'lines-between-class-members': [ 1, 'always', { exceptAfterSingleLine: true }],
  'max-depth': 0,
  'max-len': 0,
  'max-lines': 0,
  'max-lines-per-function': 0,
  'max-params': 0,
  'max-statements': 0,
  'multiline-ternary': [ 1, 'always-multiline' ],
  'no-bitwise': 0,
  'no-control-regex': 0,
  'no-continue': 0,
  'no-inline-comments': 0,
  'no-labels': 0,
  'no-magic-numbers': 0,
  'no-mixed-operators': 0,
  'no-plusplus': 0,
  'no-ternary': 0,
  'no-undefined': 0,
  'no-use-before-define': 0,
  'no-warning-comments': 0,
  'object-curly-spacing': [ 1, 'always' ],
  'object-property-newline': [ 1, { allowAllPropertiesOnSameLine: true }],
  'one-var': [ 1, 'never' ],
  'padded-blocks': [ 1, 'never' ],
  'quote-props': [ 1, 'as-needed' ],
  quotes: [ 1, 'single' ],
  semi: [ 1, 'never' ],
  'sort-imports': [ 1, { ignoreDeclarationSort: true }],
  'sort-keys': 0,
}
const tsRules = {
  'ts/adjacent-overload-signatures': 1,
  'ts/array-type': 1,
  'ts/await-thenable': 1,
  'ts/ban-ts-comment': 1,
  'ts/ban-tslint-comment': 1,
  'ts/ban-types': 1,
  'ts/class-literal-property-style': 1,
  'ts/consistent-generic-constructors': 1,
  'ts/consistent-indexed-object-style': 1,
  'ts/consistent-type-assertions': 1,
  'ts/consistent-type-definitions': [ 1, 'type' ],
  'ts/consistent-type-exports': 1,
  'ts/consistent-type-imports': 1,
  'ts/explicit-function-return-type': 0, // Type is inferred
  'ts/explicit-member-accessibility': 1,
  'ts/explicit-module-boundary-types': 0, // Type is inferred
  'ts/member-delimiter-style': [ 1, { multiline: { delimiter: 'none' } }],
  'ts/member-ordering': 1,
  'ts/method-signature-style': 1,
  'ts/naming-convention': [ 1, { selector: 'objectLiteralProperty', format: null }],
  'ts/no-base-to-string': 1,
  'ts/no-confusing-non-null-assertion': 1,
  'ts/no-confusing-void-expression': 1,
  'ts/no-duplicate-enum-values': 1,
  'ts/no-dynamic-delete': 1,
  'ts/no-empty-interface': 1,
  'ts/no-explicit-any': 1,
  'ts/no-extra-non-null-assertion': 1,
  'ts/no-extraneous-class': 1,
  'ts/no-floating-promises': 1,
  'ts/no-for-in-array': 1,
  'ts/no-implicit-any-catch': 1,
  'ts/no-inferrable-types': 1,
  'ts/no-invalid-void-type': 1,
  'ts/no-meaningless-void-operator': 1,
  'ts/no-misused-new': 1,
  'ts/no-misused-promises': 1,
  'ts/no-namespace': 1,
  'ts/no-non-null-asserted-nullish-coalescing': 1,
  'ts/no-non-null-asserted-optional-chain': 1,
  'ts/no-non-null-assertion': 1,
  'ts/no-parameter-properties': 1,
  'ts/no-redundant-type-constituents': 1,
  'ts/no-require-imports': 1,
  'ts/no-shadow': 1,
  'ts/no-this-alias': 1,
  'ts/no-type-alias': 0, // No disabling features
  'ts/no-unnecessary-boolean-literal-compare': 1,
  'ts/no-unnecessary-condition': 1,
  'ts/no-unnecessary-qualifier': 1,
  'ts/no-unnecessary-type-arguments': 1,
  'ts/no-unnecessary-type-assertion': 1,
  'ts/no-unnecessary-type-constraint': 1,
  'ts/no-unsafe-argument': 0, // Doesn't work with vue
  'ts/no-unsafe-assignment': 0, //  Doesn't work with vue
  'ts/no-unsafe-call': 1,
  'ts/no-unsafe-member-access': 1,
  'ts/no-unsafe-return': 1,
  'ts/no-unused-vars': 1,
  'ts/no-useless-empty-export': 1,
  'ts/no-var-requires': 1,
  'ts/non-nullable-type-assertion-style': 1,
  'ts/parameter-properties': 1,
  'ts/prefer-as-const': 1,
  'ts/prefer-enum-initializers': 0, // Default enum values are less verbose
  'ts/prefer-for-of': 1,
  'ts/prefer-function-type': 1,
  'ts/prefer-includes': 1,
  'ts/prefer-literal-enum-member': 1,
  'ts/prefer-namespace-keyword': 1,
  'ts/prefer-nullish-coalescing': 1,
  'ts/prefer-optional-chain': 1,
  'ts/prefer-readonly': 1,
  'ts/prefer-readonly-parameter-types': 0, // Too hard to enforce
  'ts/prefer-reduce-type-parameter': 1,
  'ts/prefer-regexp-exec': 1,
  'ts/prefer-return-this-type': 1,
  'ts/prefer-string-starts-ends-with': 1,
  'ts/prefer-ts-expect-error': 1,
  'ts/promise-function-async': 1,
  'ts/require-array-sort-compare': 1,
  'ts/restrict-plus-operands': 1,
  'ts/restrict-template-expressions': 1,
  'ts/sort-type-union-intersection-members': 1,
  'ts/strict-boolean-expressions': 0, // Require unnecessary type coalescing
  'ts/switch-exhaustiveness-check': 1,
  'ts/triple-slash-reference': 1,
  'ts/type-annotation-spacing': 1,
  'ts/typedef': 1,
  'ts/unbound-method': 1,
  'ts/unified-signatures': 1,
  // Broken rules with ts
  'no-shadow': 0,
  'no-unused-vars': 0,
}
const vueRules = {
  'vue/array-bracket-newline': [ 1, 'consistent' ],
  'vue/array-bracket-spacing': 1,
  'vue/arrow-spacing': 1,
  'vue/attribute-hyphenation': 1,
  'vue/attributes-order': 1,
  'vue/block-lang': [ 1, { script: { lang: 'ts' } }],
  'vue/block-spacing': 1,
  'vue/block-tag-newline': 1,
  'vue/brace-style': 1,
  'vue/camelcase': 1,
  'vue/comma-dangle': [ 1, 'always-multiline' ],
  'vue/comma-spacing': 1,
  'vue/comma-style': 1,
  'vue/comment-directive': 0,
  'vue/component-api-style': [ 1, ['options']],
  'vue/component-definition-name-casing': 1,
  'vue/component-name-in-template-casing': 1,
  'vue/component-options-name-casing': 1,
  'vue/component-tags-order': 1,
  'vue/custom-event-name-casing': 1,
  'vue/define-emits-declaration': 1,
  'vue/define-macros-order': 1,
  'vue/define-props-declaration': 1,
  'vue/dot-location': [ 1, 'property' ],
  'vue/dot-notation': 1,
  'vue/eqeqeq': 0,
  'vue/first-attribute-linebreak': 1,
  'vue/func-call-spacing': 1,
  'vue/html-button-has-type': 1,
  'vue/html-closing-bracket-newline': 1,
  'vue/html-closing-bracket-spacing': 1,
  'vue/html-comment-content-newline': 1,
  'vue/html-comment-content-spacing': 1,
  'vue/html-comment-indent': 1,
  'vue/html-end-tags': 1,
  'vue/html-indent': 1,
  'vue/html-quotes': 1,
  'vue/html-self-closing': [ 1, { html: { void: 'always' } }],
  'vue/jsx-uses-vars': 1,
  'vue/key-spacing': 1,
  'vue/keyword-spacing': 1,
  'vue/match-component-file-name': 1,
  'vue/match-component-import-name': 1,
  'vue/max-len': 0,
  'vue/max-attributes-per-line': 1,
  'vue/multiline-html-element-content-newline': 1,
  'vue/multi-word-component-names': 1,
  'vue/mustache-interpolation-spacing': 1,
  'vue/new-line-between-multi-line-property': 1,
  'vue/next-tick-style': 1,
  'vue/no-arrow-functions-in-watch': 1,
  'vue/no-async-in-computed-properties': 1,
  'vue/no-bare-strings-in-template': 0, // No translation in this app
  'vue/no-boolean-default': 1,
  'vue/no-child-content': 1,
  'vue/no-computed-properties-in-data': 1,
  'vue/no-constant-condition': 1,
  'vue/no-custom-modifiers-on-v-model': 1,
  'vue/no-deprecated-data-object-declaration': 1,
  'vue/no-deprecated-destroyed-lifecycle': 1,
  'vue/no-deprecated-dollar-listeners-api': 1,
  'vue/no-deprecated-dollar-scopedslots-api': 1,
  'vue/no-deprecated-events-api': 1,
  'vue/no-deprecated-filter': 1,
  'vue/no-deprecated-functional-template': 1,
  'vue/no-deprecated-html-element-is': 1,
  'vue/no-deprecated-inline-template': 1,
  'vue/no-deprecated-props-default-this': 1,
  'vue/no-deprecated-router-link-tag-prop': 1,
  'vue/no-deprecated-scope-attribute': 1,
  'vue/no-deprecated-slot-attribute': 1,
  'vue/no-deprecated-slot-scope-attribute': 1,
  'vue/no-deprecated-v-bind-sync': 1,
  'vue/no-deprecated-v-is': 1,
  'vue/no-deprecated-v-on-native-modifier': 1,
  'vue/no-deprecated-v-on-number-modifiers': 1,
  'vue/no-deprecated-vue-config-keycodes': 1,
  'vue/no-dupe-keys': 1,
  'vue/no-dupe-v-else-if': 1,
  'vue/no-duplicate-attr-inheritance': 1,
  'vue/no-duplicate-attributes': 1,
  'vue/no-empty-component-block': 1,
  'vue/no-empty-pattern': 1,
  'vue/no-export-in-script-setup': 1,
  'vue/no-expose-after-await': 1,
  'vue/no-extra-parens': 1,
  'vue/no-irregular-whitespace': 1,
  'vue/no-lifecycle-after-await': 1,
  'vue/no-lone-template': 1,
  'vue/no-loss-of-precision': 1,
  'vue/no-multi-spaces': 1,
  'vue/no-multiple-objects-in-class': 1,
  'vue/no-multiple-slot-args': 1,
  'vue/no-multiple-template-root': 0, // Useless in Vue3
  'vue/no-mutating-props': 1,
  'vue/no-parsing-error': 1,
  'vue/no-potential-component-option-typo': 1,
  'vue/no-ref-as-operand': 1,
  'vue/no-ref-object-destructure': 1,
  'vue/no-required-prop-with-default': 1,
  'vue/no-reserved-component-names': 1,
  'vue/no-reserved-keys': 1,
  'vue/no-reserved-props': 1,
  'vue/no-restricted-block': 1,
  'vue/no-restricted-call-after-await': 1,
  'vue/no-restricted-class': 1,
  'vue/no-restricted-component-options': 1,
  'vue/no-restricted-custom-event': 1,
  'vue/no-restricted-html-elements': 1,
  'vue/no-restricted-props': 1,
  'vue/no-restricted-static-attribute': 1,
  'vue/no-restricted-syntax': 1,
  'vue/no-restricted-v-bind': 1,
  'vue/no-setup-props-destructure': 1,
  'vue/no-shared-component-data': 1,
  'vue/no-side-effects-in-computed-properties': 1,
  'vue/no-spaces-around-equal-signs-in-attribute': 1,
  'vue/no-sparse-arrays': 1,
  'vue/no-static-inline-styles': 1,
  'vue/no-template-key': 1,
  'vue/no-template-shadow': 1,
  'vue/no-template-target-blank': 1,
  'vue/no-textarea-mustache': 1,
  'vue/no-this-in-before-route-enter': 1,
  'vue/no-undef-components': 1,
  'vue/no-undef-properties': 0, // Doesn't work with state mapping
  'vue/no-unsupported-features': 1,
  'vue/no-unused-components': 1,
  'vue/no-unused-properties': 1,
  'vue/no-unused-refs': 1,
  'vue/no-unused-vars': 1,
  'vue/no-use-computed-property-like-method': 1,
  'vue/no-use-v-if-with-v-for': 1,
  'vue/no-useless-concat': 1,
  'vue/no-useless-mustaches': 1,
  'vue/no-useless-template-attributes': 1,
  'vue/no-useless-v-bind': 1,
  'vue/no-v-for-template-key-on-child': 1,
  'vue/no-v-for-template-key': 1,
  'vue/no-v-html': 1,
  'vue/no-v-model-argument': 1,
  'vue/no-v-text': 1,
  'vue/no-v-text-v-html-on-component': 1,
  'vue/no-watch-after-await': 1,
  'vue/object-curly-newline': 1,
  'vue/object-curly-spacing': [ 1, 'always' ],
  'vue/object-property-newline': [ 1, { allowAllPropertiesOnSameLine: true }],
  'vue/object-shorthand': 1,
  'vue/one-component-per-file': 1,
  'vue/operator-linebreak': 1,
  'vue/order-in-components': 1,
  'vue/padding-line-between-blocks': 1,
  'vue/padding-line-between-tags': [ 1, [{ blankLine: 'never', prev: '*', next: '*' }]],
  'vue/prefer-import-from-vue': 1,
  'vue/prefer-prop-type-boolean-first': 1,
  'vue/prefer-separate-static-class': 1,
  'vue/prefer-template': 1,
  'vue/prefer-true-attribute-shorthand': 1,
  'vue/prop-name-casing': 1,
  'vue/quote-props': [ 1, 'as-needed' ],
  'vue/require-component-is': 1,
  'vue/require-default-prop': 0, // Factory defaults are often ok
  'vue/require-direct-export': 1,
  'vue/require-emit-validator': 0, // Too verbose for me
  'vue/require-explicit-emits': 1,
  'vue/require-expose': 1,
  'vue/require-name-property': 1,
  'vue/require-prop-type-constructor': 1,
  'vue/require-prop-types': 1,
  'vue/require-render-return': 1,
  'vue/require-slots-as-functions': 1,
  'vue/require-toggle-inside-transition': 1,
  'vue/require-v-for-key': 1,
  'vue/require-valid-default-prop': 1,
  'vue/return-in-computed-property': 1,
  'vue/return-in-emits-validator': 1,
  'vue/script-indent': 1,
  'vue/singleline-html-element-content-newline': 1,
  'vue/sort-keys': 0,
  'vue/space-in-parens': 1,
  'vue/space-infix-ops': 1,
  'vue/space-unary-ops': 1,
  'vue/static-class-names-order': 1,
  'vue/template-curly-spacing': 1,
  'vue/this-in-template': 1,
  'vue/use-v-on-exact': 1,
  'vue/v-bind-style': 1,
  'vue/v-for-delimiter-style': 1,
  'vue/v-on-event-hyphenation': 1,
  'vue/v-on-function-call': 1,
  'vue/v-on-style': 1,
  'vue/v-slot-style': 1,
  'vue/valid-attribute-name': 1,
  'vue/valid-define-emits': 1,
  'vue/valid-define-props': 1,
  'vue/valid-model-definition': 1,
  'vue/valid-next-tick': 1,
  'vue/valid-template-root': 1,
  'vue/valid-v-bind-sync': 1,
  'vue/valid-v-bind': 1,
  'vue/valid-v-cloak': 1,
  'vue/valid-v-else-if': 1,
  'vue/valid-v-else': 1,
  'vue/valid-v-for': 1,
  'vue/valid-v-html': 1,
  'vue/valid-v-if': 1,
  'vue/valid-v-is': 1,
  'vue/valid-v-memo': 1,
  'vue/valid-v-model': 1,
  'vue/valid-v-on': 1,
  'vue/valid-v-once': 1,
  'vue/valid-v-pre': 1,
  'vue/valid-v-show': 1,
  'vue/valid-v-slot': 1,
  'vue/valid-v-text': 1,
}

export default [
  'eslint:all',
  { ignores: ['dist/**/*'] },
  { files: [ '**/*.js', '**/*.ts', '**/*.vue' ] },
  {
    languageOptions: {
      globals: { console: 'readonly' },
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.vue'],
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: { ts, vue },
    rules: {
      ...baseRules,
      ...tsRules,
      ...vueRules,
    },
  },
]
