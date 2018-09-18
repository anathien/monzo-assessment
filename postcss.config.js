const postcssImport = require("postcss-import");
const autoprefixer = require("autoprefixer");
const postcssConditionals = require("postcss-conditionals");
// const postcssMixins = require("postcss-mixins");
const postcssSimpleVars = require("postcss-simple-vars");
const postcssColorAlpha = require("postcss-color-alpha");
const postcssNested = require("postcss-nested");
const postcssWillChange = require("postcss-will-change");
const postcssCalc = require("postcss-calc");
// const cssnano = require("cssnano");

module.exports = {
    plugins: [
        postcssImport,
        autoprefixer({
            browsers: ["iOS > 6"],
        }),
        postcssConditionals,
        // postcssMixins,
        postcssSimpleVars,
        postcssColorAlpha,
        postcssNested,
        postcssNested,
        postcssWillChange,
        postcssCalc({
            mediaQueries: true,
        }),
        // cssnano({
        //     zindex: false /* Disable z-index rebase */,
        // }),
    ],
};
