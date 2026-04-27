const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("assets");

  // Watch CSS for changes during dev
  eleventyConfig.addWatchTarget("assets/css/");

  // Ignore the README (it shouldn't ship as a page)
  eleventyConfig.ignores.add("README.md");

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);

  // Posts collection — published only, sorted newest first
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter(post => post.data.published !== false)
      .sort((a, b) => b.date - a.date);
  });

  // Format a date as "April 2026"
  eleventyConfig.addFilter("monthYear", function(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      timeZone: "UTC"
    });
  });

  // Format a date as "Apr 14, 2026"
  eleventyConfig.addFilter("shortDate", function(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
  });

  // ISO date for <time datetime="">
  eleventyConfig.addFilter("isoDate", function(date) {
    return new Date(date).toISOString().split("T")[0];
  });

  // Project metadata lookups — single source of truth.
  // To add a new project, add it here and use its key in post frontmatter.
  const projects = {
    cbc: {
      name: "Cardboard Critters",
      label: "CBC",
      color: "#7AB069",
      colorLight: "#A8D89A"
    },
    gg: {
      name: "Goblin's Greed",
      label: "GG",
      color: "#9B7DB8",
      colorLight: "#B89DCB"
    }
  };

  eleventyConfig.addFilter("projectColor", key => projects[key]?.color || null);
  eleventyConfig.addFilter("projectColorLight", key => projects[key]?.colorLight || null);
  eleventyConfig.addFilter("projectName", key => projects[key]?.name || null);
  eleventyConfig.addFilter("projectLabel", key => projects[key]?.label || null);

  // Take the first N items
  eleventyConfig.addFilter("limit", function(arr, n) {
    return arr.slice(0, n);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};
