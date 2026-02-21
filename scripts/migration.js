import axios from "axios";
import fs from "fs-extra";
import path from "path";

const WP_URL = "https://webiro.ir";
const OUTPUT_DIR = "./src/pages";

async function fetchAllPages() {
  let page = 1;
  let allPages = [];
  let hasMore = true;

  while (hasMore) {
    const res = await axios.get(
      `${WP_URL}/wp-json/wp/v2/pages?per_page=100&page=${page}`
    );

    allPages = [...allPages, ...res.data];

    const totalPages = res.headers["x-wp-totalpages"];
    if (page >= totalPages) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allPages;
}

function buildUrlMap(pages) {
  const map = {};
  pages.forEach(p => {
    map[p.id] = {
      id: p.id,
      slug: p.slug,
      parent: p.parent,
      title: p.title.rendered,
      content: p.content.rendered,
    };
  });
  return map;
}

function resolvePath(page, map) {
  let segments = [page.slug];
  let current = page;

  while (current.parent && map[current.parent]) {
    current = map[current.parent];
    segments.unshift(current.slug);
  }

  return segments.join("/");
}

async function generateAstroFiles(pages) {
  const map = buildUrlMap(pages);

  for (const page of pages) {
    const fullPath = resolvePath(page, map);
    const dirPath = path.join(OUTPUT_DIR, fullPath);

    await fs.ensureDir(dirPath);

    const fileContent = `---
layout: ../../layouts/BaseLayout.astro
title: "${page.title.rendered.replace(/"/g, '\\"')}"
---

<div class="wp-content">
${page.content.rendered}
</div>
`;

    await fs.writeFile(path.join(dirPath, "index.astro"), fileContent);

    console.log("Created:", fullPath);
  }
}

(async () => {
  const pages = await fetchAllPages();
  await generateAstroFiles(pages);
  console.log("Migration complete.");
})();