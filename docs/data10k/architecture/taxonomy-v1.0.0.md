# DATA10K controlled taxonomy v1.0.0

Status: G0 contract candidate. Product Owner approval is still required.

The unit below is a canonical prompt key, not a localization row. Every category has a final canonical quota of 400, so `25 × 400 = 10,000`. Vietnamese and English are both mandatory attributes of each key. Raw oversupply used to replace rejected candidates is tracked separately and never increases the accepted target.

## Categories and use-case families

Each family is a planning stratum, not a license to create 80 noun swaps. The detailed machine-readable definitions are in `data/corpus/contracts/taxonomy.v1.0.0.json`.

| # | Category slug | VI / EN label | Quota | Five use-case families |
| ---: | --- | --- | ---: | --- |
| 1 | `brand-identity-systems` | Hệ thống nhận diện thương hiệu / Brand identity systems | 400 | identity foundations; launch toolkit; environmental applications; digital brand system; governance board |
| 2 | `abstract-mark-logo-exploration` | Khám phá biểu trưng trừu tượng / Abstract mark and logo exploration | 400 | geometric study; negative space; modular family; monoline emblem; responsive system |
| 3 | `packaging-design` | Thiết kế bao bì / Packaging design | 400 | primary pack; secondary pack; gift set; refill system; seasonal pack |
| 4 | `product-photography` | Nhiếp ảnh sản phẩm / Product photography | 400 | catalog hero; material macro; in-use still life; comparison; detail sequence |
| 5 | `advertising-key-visuals` | Hình ảnh chủ đạo quảng cáo / Advertising key visuals | 400 | launch reveal; benefit metaphor; seasonal campaign; event promotion; master visual |
| 6 | `social-media-campaign-design` | Thiết kế chiến dịch mạng xã hội / Social media campaign design | 400 | awareness carousel; educational series; countdown; community prompt; story set |
| 7 | `poster-design` | Thiết kế áp phích / Poster design | 400 | cultural event; public-interest message; fictional exhibition; type announcement; experimental series |
| 8 | `editorial-magazine-design` | Thiết kế biên tập và tạp chí / Editorial and magazine design | 400 | feature opener; long-form spread; service page; photo essay; special issue |
| 9 | `original-book-album-cover-concepts` | Ý tưởng bìa sách và album nguyên bản / Original book and album cover concepts | 400 | fictional cover; nonfiction cover; poetry; instrumental album; audio anthology |
| 10 | `typography-lettering-exploration` | Khám phá chữ và lettering / Typography and lettering exploration | 400 | display lettering; editorial type; kinetic frame; multilingual hierarchy; material letterform |
| 11 | `infographics-data-visuals` | Đồ họa thông tin và trực quan dữ liệu / Infographics and data visuals | 400 | process; comparison; timeline; system map; small multiples |
| 12 | `ui-ux-hero-onboarding-illustration` | Minh họa hero và onboarding UI/UX / UI/UX hero and onboarding illustration | 400 | landing hero; onboarding; empty state; feature explainer; success state |
| 13 | `icons-pictograms` | Biểu tượng và ký hiệu hình / Icons and pictograms | 400 | interface actions; service categories; wayfinding; status; instructions |
| 14 | `2d-editorial-illustration` | Minh họa biên tập 2D / 2D editorial illustration | 400 | abstract concept; human-scale scene; spot; sequence; opinion opener |
| 15 | `3d-illustration` | Minh họa 3D / 3D illustration | 400 | object composition; character-free narrative; spatial metaphor; material study; scene kit |
| 16 | `isometric-scenes` | Cảnh đẳng phối / Isometric scenes | 400 | workflow; service ecosystem; cutaway; logistics map; neighborhood |
| 17 | `patterns-textures-materials` | Hoa văn, bề mặt và vật liệu / Patterns, textures and materials | 400 | seamless repeat; placement pattern; surface texture; swatch family; relief |
| 18 | `presentation-product-mockups` | Mô phỏng trình bày và sản phẩm / Presentation and product mockups | 400 | stationery; packaging lineup; device-neutral screen; signage; sample board |
| 19 | `architecture-visualization` | Diễn họa kiến trúc / Architecture visualization | 400 | daylight exterior; night exterior; massing; public space; landscape integration |
| 20 | `interior-visualization` | Diễn họa nội thất / Interior visualization | 400 | residential; hospitality; workplace; retail-neutral; small-space solution |
| 21 | `fashion-editorial` | Biên tập thời trang / Fashion editorial | 400 | studio; location; material story; accessory-neutral; seasonal sequence |
| 22 | `food-beverage-imagery` | Hình ảnh ẩm thực và đồ uống / Food and beverage imagery | 400 | menu hero; ingredient story; preparation; beverage still life; table scene |
| 23 | `beauty-cosmetics-imagery` | Hình ảnh mỹ phẩm và làm đẹp / Beauty and cosmetics imagery | 400 | product texture; routine; ingredient metaphor; color range; portrait detail |
| 24 | `portrait-lifestyle-photography` | Nhiếp ảnh chân dung và đời sống / Portrait and lifestyle photography | 400 | environmental portrait; group activity; workday; home routine; outdoor lifestyle |
| 25 | `motion-storyboard-keyframes` | Storyboard chuyển động và khung hình chính / Motion storyboard and keyframes | 400 | title sequence; neutral reveal; process animation; interface transition; narrative beat |

## Anti-padding axes

Two records are materially distinct only when they differ on at least three axes, including `designObjective` or `deliverable`:

1. Design objective — what decision or communication problem the artifact solves.
2. Deliverable — the actual artifact and placement, not merely a subject.
3. Audience and channel — who uses/sees it and where.
4. Lifecycle moment — awareness, onboarding, comparison, instruction, retention, and so on.
5. Information complexity — single message, sequence, hierarchy, system, or dense data.
6. Composition system — grid, focal path, spatial relationship, sequencing, or modular rule.
7. Medium and production method — photograph, 2D, 3D, print, material, or motion treatment.
8. Aspect ratio and placement — meaningful crop/placement constraints, not arbitrary ratio swapping.
9. Interaction or temporal behavior — static, multi-frame, responsive, animated, or stateful use.
10. Operational constraints — accessibility, safe text zone, print method, material, camera lock, or downstream editability.

Changing only a noun, palette, adjective stack, locale, crop, or variable default is never sufficient. `NOUN_SWAP_DUPLICATE`, `ADJECTIVE_PADDING`, or `QUOTA_PADDING` is emitted. Near-duplicate thresholds must be calibrated on the pilot; G0 does not invent a numeric similarity threshold.

## Distribution contract inside every category

- Complexity: 80 simple, 200 intermediate, 120 advanced.
- Aspect-ratio bands: 80 square, 80 portrait, 80 landscape, 80 vertical, 80 adaptive/special.
- Locale coverage: all 400 keys have one natural VI localization and one natural EN localization.
- Use-case, medium, and output-type allocations are category-specific. A planner must report gaps and overlap before generation and preserve an explicit anti-padding signature per candidate.
- An accepted distribution must sum to 400 distinct prompt keys in each category. Rejected, held, duplicate, or raw oversupply keys are reported but not substituted into the count without passing the full contract.

## Category boundaries

- Choose the category from primary objective and deliverable, not visible technique. A 3D hero for onboarding belongs to UI/UX illustration if onboarding is its purpose; it belongs to 3D illustration only when the dimensional illustration itself is the deliverable.
- Book/album covers use invented works and creators only. Poster work uses fictional events or general public-interest messages.
- Architecture/interior outputs are concepts, never permit, engineering, code-compliance, safety, valuation, or regulated advice.
- Infographic examples use supplied or explicitly fictional data and may not present fabricated facts as real.
- Portrait/fashion/beauty examples use neutral synthetic consenting adults and may not infer sensitive traits or reproduce a real person.

