module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("_src/css");
    eleventyConfig.addPassthroughCopy("_src/js");
    eleventyConfig.addPassthroughCopy("_src/models");
    eleventyConfig.addPassthroughCopy("_src/assets");
  
    return {
      dir: {
        input: "_src",
        includes: "_includes",
        output: "_site",
      },
    };
  };
  