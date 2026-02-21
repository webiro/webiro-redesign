// clear-pages.js
import fs from 'fs-extra';
import path from 'path';

const PAGES_DIR = path.join(process.cwd(), 'src/pages');

async function clearPages(dir) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      // بازگشت به دایرکتوری
      await clearPages(fullPath);
    } else if (fullPath.endsWith('.astro')) {
      // پاک کردن محتویات فایل
      await fs.writeFile(fullPath, '');
      console.log('Cleared:', fullPath);
    }
  }
}

(async () => {
  try {
    await clearPages(PAGES_DIR);
    console.log('All pages cleared!');
  } catch (err) {
    console.error('Error clearing pages:', err);
  }
})();