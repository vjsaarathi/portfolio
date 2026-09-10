const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const { Marked } = require('marked');
const hljs = require('highlight.js');

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function generateSlug(filename, frontMatter) {
  return frontMatter.slug || path.basename(filename, '.md');
}

function generateTableOfContents(html) {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g;
  const flatToc = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    flatToc.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, '').trim(),
    });
  }

  const tree = [];
  const stack = [];

  for (const item of flatToc) {
    const node = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return tree;
}

module.exports = function markdownPostsLoader() {
  const isProd = process.env.NODE_ENV === 'production';
  const contentDir = path.resolve(__dirname, '../content/posts');

  this.addContextDependency(contentDir);

  if (!fs.existsSync(contentDir)) {
    return `export default [];`;
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

  const posts = files
    .map(filename => {
      const filepath = path.join(contentDir, filename);
      const raw = fs.readFileSync(filepath, 'utf-8');
      const { data: frontMatter, content: markdownBody } = matter(raw);

      if (isProd && frontMatter.draft === true) {
        return null;
      }

      const hasMermaid = /```mermaid/.test(markdownBody);

      const parser = new Marked({ gfm: true, breaks: false });
      const loaderContext = this;
      parser.use({
        renderer: {
          heading(text, level) {
            const id = text.toLowerCase()
              .replace(/<[^>]*>/g, '')
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return `<h${level} id="${id}">${text}</h${level}>`;
          },
          image(href, title, text) {
            if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('data:')) {
              const imageName = path.basename(href);
              const candidates = [
                path.resolve(path.dirname(filepath), href),
                path.resolve(__dirname, '../src/assets', imageName),
                path.resolve(__dirname, '../public/assets', imageName),
              ];
              let resolvedPath = candidates.find(p => fs.existsSync(p));
              if (resolvedPath) {
                loaderContext.addDependency(resolvedPath);
                const imageBuffer = fs.readFileSync(resolvedPath);
                const relativeAssetPath = `assets/${imageName}`;
                loaderContext.emitFile(relativeAssetPath, imageBuffer);
                const publicPath = loaderContext._compiler?.options?.output?.publicPath || '/';
                const cleanPublic = publicPath.endsWith('/') ? publicPath : publicPath + '/';
                href = cleanPublic + relativeAssetPath;
              }
            }
            let out = `<img src="${href}" alt="${text}"`;
            if (title) {
              out += ` title="${title}"`;
            }
            out += '>';
            return out;
          },
          code(code, language) {
            if (language === 'mermaid') {
              const encoded = Buffer.from(code).toString('base64');
              return `<pre class="mermaid" data-source="${encoded}">${code}</pre>`;
            }
            const highlighted = (language && hljs.getLanguage(language))
              ? hljs.highlight(code, { language }).value
              : hljs.highlightAuto(code).value;
            const langName = language || 'code';
            const copyIcon = `<svg class="copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            return `<div class="code-block-wrapper"><div class="code-block-header"><span class="code-block-lang">${langName}</span><button class="code-block-copy" type="button" aria-label="Copy code">${copyIcon}<span class="copy-text">Copy</span></button></div><pre><code class="hljs language-${langName}">${highlighted}</code></pre></div>`;
          }
        }
      });

      const htmlContent = parser.parse(markdownBody);
      const slug = generateSlug(filename, frontMatter);
      const toc = generateTableOfContents(htmlContent);

      this.addDependency(filepath);

      let heroImage = frontMatter.heroImage || null;
      if (heroImage && typeof heroImage === 'string') {
        if (!heroImage.startsWith('http://') && !heroImage.startsWith('https://') && !heroImage.startsWith('data:')) {
          const imageName = path.basename(heroImage);
          const candidates = [
            path.resolve(path.dirname(filepath), heroImage),
            path.resolve(__dirname, '../src/assets', imageName),
            path.resolve(__dirname, '../public/assets', imageName),
          ];

          let resolvedPath = candidates.find(p => fs.existsSync(p));

          if (resolvedPath) {
            this.addDependency(resolvedPath);
            const imageBuffer = fs.readFileSync(resolvedPath);
            const relativeAssetPath = `assets/${imageName}`;
            this.emitFile(relativeAssetPath, imageBuffer);

            const publicPath = this._compiler?.options?.output?.publicPath || '/';
            const cleanPublic = publicPath.endsWith('/') ? publicPath : publicPath + '/';
            heroImage = cleanPublic + relativeAssetPath;
          }
        }
      }

      return {
        id: slug,
        slug,
        title: frontMatter.title || slug,
        date: frontMatter.date
          ? new Date(frontMatter.date).toISOString().split('T')[0]
          : null,
        draft: frontMatter.draft || false,
        description: frontMatter.description || '',
        excerpt: frontMatter.description || '',
        tags: frontMatter.tags || [],
        categories: frontMatter.categories || [],
        author: frontMatter.author || '',
        featured: frontMatter.featured || false,
        series: frontMatter.series || null,
        heroImage,
        readingTime: calculateReadingTime(markdownBody),
        content: htmlContent,
        tableOfContents: toc,
        wordCount: markdownBody.trim().split(/\s+/).length,
        hasMermaid,
      };
    })
    .filter(Boolean);

  posts.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date) - new Date(a.date);
  });

  return `export default ${JSON.stringify(posts, null, 2)};`;
};
