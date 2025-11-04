module.exports = {
    root: true,
    env: { node: true, es2022: true, mocha: true },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'prettier', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        /* === Formatting / Style === */
        'prettier/prettier': [
            'error',
            {
                semi: true,
                singleQuote: false,
                printWidth: 100,
                trailingComma: 'none',
                bracketSpacing: true,
                endOfLine: 'lf',
                tabWidth: 2,
                useTabs: false,
                quoteProps: 'as-needed',
                jsxSingleQuote: false
            }
        ],
        quotes: ['error', 'double'],
        semi: ['error', 'always'],
        'no-trailing-spaces': 'error',
        'eol-last': ['error', 'always'],

        /* === Code Quality === */
        'no-unused-vars': 'off', // handled by TS
        '@typescript-eslint/no-unused-vars': ['warn'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'import/order': [
            'warn',
            {
                groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
                'newlines-between': 'always'
            }
        ]
    },
    ignorePatterns: ['dist', 'node_modules', 'coverage']
};
