# YOLEC Kitchen Russian Site SEO 修复规范 (PRD)

## Overview

- **Summary**: 按 `yoleckitchen-seo-handoff.md` 交接清单，对俄语站 `yoleckitchen.xyz` 进行从 P0（收录死亡缺陷）→ P3（验证+GSC）的完整SEO修复。核心目标是消除 GSC 收录的硬阻碍，建立 Schema.org 结构化数据基础，修复外链泄漏和内链孤岛问题。
- **Purpose**: 消除 `canonical` 指向外站、未来日期 publishDate、无后缀文章未构建、缺少结构化数据、硬编码 www 域名不一致、`/contacto` 404 等收录阻碍；使 57 篇博客和 4 个产品落地页能被 Google 正常索引并获得排名机会。
- **Target Users**: 俄语区 / EAEU（欧亚经济联盟）B2B 家电进口商、分销商、批发商、自主品牌采购商。搜索引擎：Googlebot、Yandex Bot、Bingbot。

## Goals

1. 消除 100% 的 `canonical` 指向外部域名 `www.yolec-electronics.com` 或错误首页的博客（基线 57/57 篇）
2. 修复所有无法被 Astro 构建的无后缀文件（基线 1 个）
3. 消除所有 publishDate 为未来日期的博客（基线 1 篇 2027-07-01）
4. 新增统一的 Schema.org JSON-LD 组件：Organization、WebSite、BreadcrumbList、BlogPosting、FAQPage、Product，覆盖率达到 100% 页面
5. 修复所有产品落地页的 `/contacto` 404 链接（基线 8 处，4 页 × 2 CTA）
6. 统一全站域名规范：`https://yoleckitchen.xyz`（无 www），所有 canonical/OG/sitemap 一致
7. 站点语言标识严格保持 `ru`（用户明确："当前项目是俄语站点"），**不做任何西语站的 language:en 改动**
8. Header / Footer 导航分离"站内落地页"和"外部产品目录"，减少内部链接权重泄漏
9. `npm run check` 通过、`npm run build` 成功、无 ESLint/astro 错误

## Non-Goals

1. **不新建 8 个 Supplier/Factory 落地页**（与用户"当前是俄语站 + 交接清单 P0-P2 范围"冲突，超出本次范围）
2. **不将标题正文改为纯英文**（俄语站保持俄语 SEO 元数据，仅保留英文关键词作为补充）
3. 不修改 AGENTS.md / package.json / astro.config.ts 中的 Astro/Tailwind 版本等基础配置
4. 不修改单篇博客正文内容（仅修复 frontmatter 和 canonical/date）
5. 不修改 Contact 表单提交后端（因为用的是外站 Formspree）
6. 不做 Web Vitals 性能优化（超出交接清单范围）

## Background & Context

- 基线审计 2026-09-03：
  - 57 篇博客全部存在 `canonical:` 字段，其中至少 52 条指向 `www.yolec-electronics.com`（外站），其余指向 `/`、`/blog/` —— **全部阻碍收录**
  - 1 个文件 `kakie-funktsii-elektrochaynikov-naibolee-vostrebovany-v-rossii` 无 `.md` 后缀 → **从未被 Astro content layer 发现和构建**
  - 1 篇 `best-electric-kettle-manufacturer-in-china.md` `publishDate: 2027-07-01T00:00:00Z` → 未来日期
  - 4 个 Manufacturer 页面（电水壶/电饭煲/压力锅/保温饭盒）CTA 按钮 `href="/contacto"` → **404**（每页 2 处，共 8 处）
  - `Layout.astro` 第 32 行硬编码 `const siteUrl = 'https://www.yoleckitchen.xyz'`，而 `config.yaml` 中 `site.site: 'https://yoleckitchen.xyz'` 不一致 → 权重分散
  - 全站无任何 Schema.org JSON-LD 结构化数据（无 `StructuredData.astro` 组件；单篇博客页也没有 BlogPosting）
  - navigation.ts + Footer 产品链接全部为外站 `yolec-electronics.com/product-category/...` → **全站无内链指向 4 个 Manufacturer 页面**（形成孤岛）
  - 站点 `i18n.language = ru`，用户明确要求保持俄语站身份
- 参考：西语站成功修复案例和交接文档 `/Users/adrian/.trae-cn/memory/yoleckitchen-seo-handoff.md`

## Functional Requirements

- **FR-1 (P0-1)**: 移除所有博客文章 frontmatter 中指向 `www.yolec-electronics.com`、`yoleckitchen.xyz/`、`yoleckitchen.xyz/blog/` 的 canonical 行；让 Astro/MetaData 组件按页面真实 URL 生成正确 canonical。
- **FR-2 (P0-2)**: 重命名无后缀文章文件为 `...v-rossii.md`，使其能被 content layer 的 `glob('src/data/post/*.{md,mdx}')` 拾取。
- **FR-3 (P0-3)**: 将 `best-electric-kettle-manufacturer-in-china.md` 的 `publishDate` 从 2027 改为 2025-Q3 实际日期，避免 Google 不收录未来文章。
- **FR-4 (P0-4)**: 新建 `src/components/common/StructuredData.astro`，实现：
  - Organization（含 makesOffer, areaServed, contactPoint, sameAs YouTube/LinkedIn/VK）
  - WebSite（含 SearchAction potentialAction）
  - BreadcrumbList（按当前路径自动生成）
  - BlogPosting（由 MarkdownLayout 传入）
  - Product Schema（按 URL 中 productKey 自动识别：electric-kettle、rice-cooker、electric-pressure-cooker、electric-lunch-box）
  - FAQPage（由各页面传入 props）
- **FR-5 (P1-1)**: 4 个 Manufacturer 页面：
  - 修复 `/contacto` → `https://www.yolec-electronics.com/contact/`（与导航保持一致的外部联系页）
  - SEO title/description/keywords **俄语优化**（加入目标关键词变体：производитель, поставщик, фабрика Китай, OEM/ODM, сертификат EAC, импорт）
- **FR-6 (P1-2)**: Layout.astro 修复：
  - `siteUrl` 不再硬编码，改为 `import { SITE } from 'astrowind:config'` → 使用 `SITE.site`
  - 移除不正确的 `hreflang=ru` / `x-default` 硬编码（因为单语言站点，不需要 hreflang 自指）
  - `<link rel="canonical">` 由 `getCanonical(Astro.url.pathname)` 动态生成并统一
  - `<StructuredData />` 注入 `<head>`，支持 `structuredData` prop
  - 支持 `keywords` prop 传递到 Metadata
- **FR-7 (P1-3)**: config.yaml 调整（**保留 language=ru!**）：
  - `site.name`, `site.site`, `site.base`, `site.trailingSlash` 保留原值
  - 默认 `metadata.title.default` 和 `metadata.description` 加入俄语核心制造业关键词
  - `i18n.language: ru` 保持不变
  - `googleSiteVerificationId` 留空 + 加入注释提醒用户填入真实 ID
- **FR-8 (P1-4)**: navigation.ts Header + Footer：
  - "Продукция"下拉项首先加入 4 个 Manufacturer 站内页内链（解决孤岛），再保留外部产品目录为"Полный каталог →"
  - Footer 产品列：4 Manufacturer 内链 + 1 外站目录入口
  - Announcement.astro 链接检查（外站 new-releases 合理保留，但加 `rel="noopener"` 和 `target="_blank"`）
- **FR-9 (P1-5)**: MarkdownLayout.astro 注入 BlogPosting schema 给 StructuredData
- **FR-10 (P2-1)**: astro.config.ts sitemap filter：保留 tag/分页过滤，**取消 category 过滤**（因为 category 页在 metadata 中是 indexable）；加入 changefreq=weekly/priority=0.7，单语言 sitemap。robots.txt 加入 `Host: yoleckitchen.xyz`、`Crawl-delay: 3`、双 sitemap 路径、屏蔽低价值爬虫。
- **FR-11 (P2-2)**: types.d.ts `MetaData` 接口新增 `keywords?: string`。Metadata.astro 组件新增：author/publisher/theme-color、language=ru、geo.region=RU（因为俄语站目标市场 EAEU，非中国市场）、distribution=global、audience=B2B、category=Manufacturing/Home Appliance、googlebot meta 强化。

## Non-Functional Requirements

- **NFR-1 (构建稳定性)**: 修复后 `npm run build` 必须成功，`dist/` 输出包含 58 篇博客索引条目（新增 1 篇之前不构建的）
- **NFR-2 (Lint合规)**: `npm run check` 0 错误（astro check + ESLint + Prettier）
- **NFR-3 (Schema验证)**: 首页、博客列表、产品页、单篇博客的 `application/ld+json` 块数分别 ≥ 3（首页），并可被 schema.org 验证工具识别
- **NFR-4 (回归安全)**: 不改变 Contact 表单目标、不改变 Logo 图片路径、不删除任何 Widget（Header/Footer/Hero/Stats 全部保留）
- **NFR-5 (俄语一致性)**: <html lang>、meta language、OG locale 全部 = ru/RU；所有内页 H1/H2、title、description 为俄语或俄语为主+少量通用英文产品名

## Constraints

- **Technical**: Astro v6 + Tailwind v4 + TypeScript 5.9 栈不变，不得升级/降级依赖。必须使用 `twMerge`、`class:list` 等现有模式。
- **Business**: 所有"询盘 / 报价 / 联系"CTA 必须保留跳转到主站 `yolec-electronics.com/contact/`（因为表单在那里），**不能改为本站 `/contact.astro`（无效）**。
- **Dependencies**: `astro-seo` / `@astrojs/sitemap` 已存在，保持不变；不新增任何 npm 依赖。
- **Content**: 不重写博客正文内容（交接清单未授权）。

## Assumptions

1. 构建系统用标准 `npm run build`，环境 Node >= 22.12（AGENTS.md 规定）
2. 用户后续能手动填 `googleSiteVerificationId` 并在 GSC 提交 sitemap
3. 404 `/contacto` 修复为外站是可接受的（因为主站才有有效表单）
4. `~/utils/permalinks.ts` 的 `getCanonical` 行为正确（测试后无需改）

## Open Questions

- [ ] （非阻塞）Supplier/Factory 8 个新落地页是否下一期再做？本 PRD 不做，留作后续任务。

## Acceptance Criteria

### AC-1: 错误博客 canonical 100% 移除

- **Type**: `rule`
- **Given**: 基线 57 篇博客中 100% 存在干扰收录的 canonical（外站或首页）
- **When**: 执行 P0-1 批量 sed 删除 + `find src/data/post -type f | grep -v '/$' | xargs grep -lE 'canonical:\s*"?https?://(www\.yolec-electronics\.com|yoleckitchen\.xyz/(blog/)?$)'`
- **Then**: 命令返回 0 个匹配（exit 1；`|| true` 后计数=0）
- **Pass Condition**: grep 返回空 / exit code == 1 表示无匹配
- **Evidence**: 终端 `grep -cE 'canonical:.*(yolec-electronics\.com|yoleckitchen\.xyz/(blog)?$)' src/data/post/*.md | awk -F: '{s+=$2} END {print s}'` 输出为 `0`

### AC-2: 无后缀文件重命名成功，文章被构建

- **Type**: `rule`
- **Given**: 基线存在 `src/data/post/kakie-funktsii-elektrochaynikov-naibolee-vostrebovany-v-rossii`（无后缀）
- **When**: 执行 P0-2 重命名后，执行 `find src/data/post -maxdepth 1 -type f ! -name '*.md' ! -name '*.mdx'`
- **Then**: 返回空；同时 `npm run build` 后，`dist/blog/kakie-funktsii-elektrochaynikov-naibolee-vostrebovany-v-rossii/index.html` 文件存在
- **Pass Condition**: find 无结果 + dist HTML 文件存在
- **Evidence**: `ls -la dist/blog/kakie-funktsii-*/index.html` 显示文件存在且大小 > 5KB

### AC-3: 无未来日期 publishDate

- **Type**: `rule`
- **Given**: 基线 best-electric-kettle... 日期 2027-07-01
- **When**: `grep -nE 'publishDate: 202[7-9]-' src/data/post/*.md`
- **Then**: 0 匹配
- **Pass Condition**: 0 匹配
- **Evidence**: grep exit code == 1（空结果）

### AC-4: Schema.org 注入覆盖所有页面类型

- **Type**: `rubric`
- **Dimension**: Schema 覆盖率和语义丰富度
- **Scale**: 1-5
- **Anchors**: 1 = 无任何 JSON-LD；3 = 有 Organization + WebSite 2 种；5 = 包含 Organization + WebSite + BreadcrumbList + 按页面类型额外的 Product/BlogPosting
- **Pass Threshold**: >= 4
- **Evidence**: 首页 `grep -c 'application/ld+json' dist/index.html` >= 3；单篇博客 `grep -c 'application/ld+json' dist/blog/<slug>/index.html` >= 4（多 BlogPosting 一个）；Manufacturer 页面 `grep -c '"@type": "Product"' dist/<manufacturer>/index.html` = 1

### AC-5: 产品页面无 /contacto 404

- **Type**: `rule`
- **Given**: 基线 4 Manufacturer 页共 8 处 `/contacto`
- **When**: `grep -Rrn 'href="/contacto"' src/pages`
- **Then**: 0 匹配
- **Pass Condition**: 0 匹配
- **Evidence**: grep exit == 1；且构建后 HTML 中所有 CTA href 均包含 `yolec-electronics.com/contact` 或 `wa.me`

### AC-6: 全站域名一致（yoleckitchen.xyz，无 www）

- **Type**: `rule`
- **Given**: 基线 `Layout.astro` 硬编码 www.yoleckitchen.xyz + config.yaml 无 www 不一致
- **When**: `grep -RrnE 'www\.yoleckitchen\.xyz' src/ vendor/ astro.config.ts`
- **Then**: 0 匹配（排除注释中的示例）
- **Pass Condition**: 0 匹配
- **Evidence**: grep exit == 1；且 canonical、sitemap、OG:url 全部为 `https://yoleckitchen.xyz/...`

### AC-7: <html lang="ru" 保持且不被改

- **Type**: `rule`
- **Given**: 用户要求"当前项目是俄语站点"
- **When**: `npm run build && grep -hE '<html lang=' dist/index.html dist/electric-kettle-manufacturer/index.html dist/blog/index.html`
- **Then**: 3 页都输出 `lang="ru"`
- **Pass Condition**: 每页均为 lang=ru
- **Evidence**: grep 结果行中每个都含 `"ru"`

### AC-8: Header/Footer 至少 4 个产品内链

- **Type**: `rubric`
- **Dimension**: 内链消除孤岛效果
- **Scale**: 1-5
- **Anchors**: 1 = 全部产品跳外站；3 = 一半内链一半外链；5 = 4 Manufacturer 全部加入 + 外站作为"完整目录"补充
- **Pass Threshold**: >= 4
- **Evidence**: `grep -cE '/electric-(kettle|rice-cooker|pressure-cooker|lunch-box)-manufacturer' src/navigation.ts` 计数 >= 8（Header下拉+Footer各4）

### AC-9: npm run check + build 双绿

- **Type**: `rule`
- **Given**: 修复后的工作区
- **When**: 先 `npm run check` 再 `npm run build`
- **Then**: 两条命令都 exit code == 0，build 输出 size report 正常
- **Pass Condition**: exit 0
- **Evidence**: 终端输出尾部无 Error、无 Fatal

### AC-10: robots.txt + sitemap 一致性

- **Type**: `rule`
- **Given**: 基线 sitemap filter 过滤 category 而 metadata 让 index，robots 缺少 Host
- **When**: `npm run build` 后 `grep -c 'Host:' public/robots.txt` == 1 且 `grep -c 'sitemap' public/robots.txt` >= 2，且 sitemap-0.xml 包含 `/blog/category/...` 条目（证明未过滤）
- **Then**: 三项条件全部满足
- **Pass Condition**: 三项 true
- **Evidence**: 三次 grep 结果分别为 >=1、>=2、>=1 条 /category/ URL
