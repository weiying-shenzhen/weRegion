import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'

const isProduction = process.env.NODE_ENV === 'production'

export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'WeRegion',
    plugins: [
        eslint({ exclude: 'node_modules/**' }),
        resolve({ jsnext: true, main: true }),
        commonjs({
            namedExports: {
                'node_modules/raf-plus/dist/index.js': ['requestAnimationFrame']
            }
        }),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: [
                [
                    'es2015', {
                        modules: false,
                    },
                ],
            ],
            plugins: ['external-helpers'],
        }),
        (isProduction && uglify()),
    ],
    dest: 'dist/index.js',
}
