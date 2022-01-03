import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    declaration: true,
    rollup: {
        emitCJS: true,
    },
    clean: true,
    outDir: 'lib',
    entries: ['src/index', 'static/'],
    externals: ['@waxio/waxjs', 'eosjs', 'universal-authenticator-library'],
});
