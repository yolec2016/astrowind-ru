# YOLEC 俄语站 SEO 修复 - Implementation Plan

## Task 1: P0-1 批量删除 57 篇博客中的错误 canonical

- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 使用终端 `find + sed -i ''` 一次性删除 src/data/post 下所有 .md/.mdx 中指向 `www.yolec-electronics.com` 和 `yoleckitchen.xyz/` / `/blog/` 的 canonical 行
  - **不** 覆盖任何其他 frontmatter 字段（title/publishDate/tags/excerpt/image/category/author 等全部保留）
  - 删除前先做 `_backup_seo/` 备份
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-1.1: `grep -cE 'canonical:\s*"?https?://(www\.yolec-electronics\.com|yoleckitchen\.xyz/("|blog/)?$)' src/data/post/*.md | awk -F: '{s+=$2} END{print s}'` 输出 = 0
  - `rule` TR-1.2: `_backup_seo/post/` 备份目录下文件数与原 post 目录相等
- **Notes**: macOS BSD sed 使用 `sed -i '' -E`

## Task 2: P0-2 重命名无后缀文章使其被构建

- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - `mv src/data/post/kakie-funktsii-elektrochaynikov-naibolee-vostrebovany-v-rossii src/data/post/kakie-funktsii-elektrochaynikov-naibolee-vostrebovany-v-rossii.md`
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-2.1: `find src/data/post -maxdepth 1 -type f ! -name '*.md' ! -name '*.mdx'` 输出为空
  - `rule` TR-2.2: build 后 `ls dist/blog/kakie-funktsii-*/index.html` 文件存在且大小 > 5KB

## Task 3: P0-3 修复 best-electric-kettle publishDate 2027 → 2025

- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 编辑 `src/data/post/best-electric-kettle-manufacturer-in-china.md`
  - `publishDate: 2027-07-01T00:00:00Z` → `publishDate: 2025-08-15T09:00:00+08:00`
  - 同步清理该文件中错误的 `canonical: https://yoleckitchen.xyz/`（Task 1 会覆盖，若残留此处单独修）
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `rule` TR-3.1: `grep -E 'publishDate: 202[7-9]-' src/data/post/*.md` 0 匹配
  - `rule` TR-3.2: 该文件 publishDate 字段以 `2025-` 开头

## Task 4: P0-4 创建 StructuredData.astro Schema.org 组件

- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 新建 `src/components/common/StructuredData.astro`
  - Props: `data?` (自定义 schema 数组)、`pagePath?`、`pageTitle?`、`blogPost?` (MarkdownLayout 传入的单篇文章对象)
  - 每个页面固定输出：
    a) Organization (`@id: #organization`, name=YOLEC Electric, makesOffer 4 类产品, sameAs YouTube/LinkedIn/VK/WhatsApp, address=CN, contactPoint=Adrian, areaServed=欧亚+全球)
    b) WebSite (`@id: #website`, publisher=#organization, potentialAction SearchAction)
    c) BreadcrumbList（Home > Current Page，自动按 pathname 生成）
  - 条件输出：
    d) Product：检测 `electric-kettle / rice-cooker / electric-pressure-cooker / electric-lunch-box` 任一关键词出现在 path 时输出对应 Product Schema（含 additionalProperty: ServiceType=OEM/ODM, Certifications=CE/CB/EAC/LFGB/RoHS, MOQ=可谈, LeadTime=30-45d）
    e) BlogPosting：`blogPost` prop 传入时输出 Article/BlogPosting（包含 headline, datePublished, dateModified, author=Adrian, publisher=#organization, image, keywords, mainEntityOfPage）
    f) FAQPage：`data` 中传入时输出（供未来页面使用）
  - 所有 `<script type="application/ld+json">` 必须通过 `set:html={JSON.stringify(schema)}` 注入
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-4.1: `grep -c 'application/ld+json' dist/index.html` >= 3
  - `rule` TR-4.2: 单篇博客 `grep -c '"@type": "BlogPosting"' dist/blog/best-electric-*/index.html` = 1
  - `rubric` TR-4.3: Schema 语义丰富度；scale 1-5；anchors 1=无 3=Org+WebSite 5=Org+WebSite+Breadcrumb+BlogPosting/Product；threshold >= 4；evidence = grep 各种 @type 结果

## Task 5: P1-1 修复 4 个 Manufacturer 页面 /contacto 404 + 俄语 SEO 元数据优化

- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 批量修复 `src/pages/electric-(kettle|rice-cooker|pressure-cooker|lunch-box)-manufacturer.astro`
  - 每页 2 处：`href="/contacto"` → `href="https://www.yolec-electronics.com/contact/" target="_blank" rel="noopener"`
  - 每页 metadata：title/description **加入俄语制造业 B2B 关键词**：производитель, поставщик, фабрика в Китае, OEM/ODM, сертификат EAC, импорт, опт, прямой завод，同时俄语 H1 不被改为英文
  - metadata.title 默认长度 45-65 字符；description 140-165 字符
- **Acceptance Criteria Addressed**: AC-5, AC-7（title/description 俄语）
- **Test Requirements**:
  - `rule` TR-5.1: `grep -Rrn '/contacto' src/pages` 0 匹配
  - `rubric` TR-5.2: 元数据关键词优化度；scale 1-5；anchors 1=纯英文重复 3=有俄语关键词但不自然 5=title/description 包含 производитель/поставщик/фабрика/ОЕМ/сертификат/импорт/опт 至少 4 个；threshold >= 4；evidence = grep 每页 metadata.\*title

## Task 6: P1-2 Layout.astro 域名统一 + StructuredData 注入 + 动态 canonical

- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4
- **Description**:
  - `import { SITE } from 'astrowind:config'` 替换硬编码
  - 删除 `const siteUrl = 'https://www.yoleckitchen.xyz'`
  - 删除 head 中硬编码的 `<link rel=alternate hreflang=ru>` + x-default 段（单语言站不需要自指 hreflang）
  - 使用 `canonical = getCanonical(Astro.url.pathname)` 在 `<head>` 顶部输出 `<link rel="canonical" href={canonical} />`
  - 插入 `<StructuredData {structuredData} pagePath={Astro.url.pathname} pageTitle={metadata?.title} />` 到 head
  - Props 接口新增 `structuredData?`、`keywords?`，二者透传给 Metadata / StructuredData
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `rule` TR-6.1: `grep -rnE 'www\.yoleckitchen\.xyz' src/layouts src/components` 0 匹配
  - `rule` TR-6.2: build 后的首页 HTML `<link rel="canonical" href="https://yoleckitchen.xyz/"` 存在 1 条

## Task 7: P1-3 config.yaml 默认 SEO 元数据俄语化 + 保留 i18n.language=ru

- **Status**: `pending`
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - `i18n.language: ru` 不变（强制要求，diff 拒绝任何改成 en 的行为）
  - `metadata.title.default` 更新为包含 `OEM/ODM завод кухонной техники Китай — электрочайники, рисоварки, скороварки, ланч-боксы | YOLEC`
  - `metadata.description` 更新为包含 `прямой завод в Китае, опт, сертификаты CE/CB/EAC/LFGB/RoHS, производство под брендом заказчика` 等俄语核心词
  - `googleSiteVerificationId:` 留空 + 行注释 `⚠️ впишите реальный код из Google Search Console`
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-7.1: `grep "language:" src/config.yaml` 输出包含 `ru`
  - `rule` TR-7.2: 构建后 `grep -oE '<meta name="language" content="[^"]+' dist/index.html` 输出 `ru`

## Task 8: P1-4 navigation.ts Header+Footer 外链泄漏修复 + 内链打通

- **Status**: `pending`
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - Header `Продукция` 下拉：在前 4 条加入 4 个站内 Manufacturer 页：
    - Производитель электрочайников → `/electric-kettle-manufacturer`
    - Производитель рисоварок → `/electric-rice-cooker-manufacturer`
    - Производитель скороварок → `/electric-pressure-cooker-manufacturer`
    - Производитель ланч-боксов → `/electric-lunch-box-manufacturer`
    - 之后放分隔线 + `Полный каталог на основном сайте →` 外链
  - Footer `Продукция` 列相同处理（4 内链 + 1 目录外链）
  - 外链全部确保 `rel="noopener" target="_blank"`
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `rubric` TR-8.1: 内链消除孤岛；scale 1-5；anchors 1=0 2=2个 3=4个 5=Header+Footer 都有 4 个共 8 个以上；threshold >= 4；evidence = `grep -cE 'href="/electric-(kettle|rice-cooker|pressure-cooker|lunch-box)-manufacturer"' src/navigation.ts`

## Task 9: P1-5 MarkdownLayout 注入 BlogPosting Schema

- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 4, Task 6
- **Description**:
  - 修改 `src/layouts/MarkdownLayout.astro`
  - 构建 blogPost 对象并传给 `<Layout>` 的 `structuredData` prop（以 BlogPosting schema 数组形式），包含：
    `@context: https://schema.org`, `@type: BlogPosting`, headline, description, datePublished, dateModified, author{name=Adrian}, publisher=#organization, image, keywords, mainEntityOfPage, inLanguage=ru, articleBody 摘要 400 字符
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-9.1: `grep -c '"@type":"BlogPosting"' dist/blog/best-electric-*/index.html` = 1

## Task 10: P2-1 sitemap/robots 过滤与 Host/Crawl-delay

- **Status**: `pending`
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - `astro.config.ts` sitemap filter：删除 `!page.includes('/category/')` 这一条（恢复 category 收录），保留 tag 过滤 + 分页数字正则。+ lastmod new Date + changefreq 'weekly' + priority 0.7
  - `public/robots.txt`：新增 `Host: yoleckitchen.xyz`、`Crawl-delay: 3`、`Sitemap: https://yoleckitchen.xyz/sitemap-0.xml`（除 index.xml 外再加这一条绝对路径），保留 low-value 爬虫屏蔽规则
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**:
  - `rule` TR-10.1: build 后 `unzip -p dist/sitemap-0.xml | grep -cE '/blog/category/[^"]+' | awk '{if($1>=1) print "PASS:",$1; else print "FAIL"}'` 输出 PASS
  - `rule` TR-10.2: `grep -cE '^Host:' public/robots.txt` = 1 且 `grep -cE 'Crawl-delay:' public/robots.txt` = 1

## Task 11: P2-2 MetaData 类型 + 组件增强

- **Status**: `pending`
- **Priority**: low
- **Depends On**: None
- **Description**:
  - `src/types.d.ts` MetaData 接口：新增 `keywords?: string`
  - `src/components/common/Metadata.astro`：
    - Props 加 `keywords?`（透传），空值 fallback 到俄语默认关键词清单（производитель электрочайников, поставщик рисоварок, OEM фабрика Китай, опт бытовой техники, EAC сертификат）
    - 新增 `<meta>`：author=YOLEC, publisher=YOLEC, language=ru, audience=B2B импортеры/дистрибьюторы/оптовики, category=Производство/Малая бытовая техника/OEM/ODM, distribution=global, geo.region=RU, geo.placename=Россия, googlebot=index,follow,max-image-preview:large
- **Acceptance Criteria Addressed**: AC-7, NFR-5
- **Test Requirements**:
  - `rule` TR-11.1: `grep -E 'interface MetaData' src/types.d.ts -A 20` 结果含 `keywords?`
  - `rule` TR-11.2: build 后首页 `grep -cE 'meta name="googlebot"' dist/index.html` = 1

## Task 12: 最终整体回归 - npm run check + build 双绿

- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1-11 全部 completed
- **Description**:
  - 先 `npm run fix`（如 AGENTS.md 推荐的）再 `npm run check`
  - `npm run build` 检查 dist 大小正常
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `rule` TR-12.1: `npm run check` exit == 0
  - `rule` TR-12.2: `npm run build` exit == 0 且 output 有 `@astrojs/sitemap` 输出行
