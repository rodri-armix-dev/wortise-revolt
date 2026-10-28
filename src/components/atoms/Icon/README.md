# Icon

Server-rendered inline SVG with a stable name, independent of its provider.
No client JavaScript or CMS dependency is added by the atom.

```astro
<Icon name="arrow-up-right" size={18} />
<Icon name="linkedin" label="LinkedIn" />
```

Existing names `arrow-up-right`, `chevron-down`, `chevron-up`, `menu`, and `x`
retain their Lucide geometry and default stroke width. `linkedin` demonstrates
a local SVG using the existing project artwork; its footer consumer is unchanged.

## Appearance and accessibility

Configure appearance on the consumer's own wrapper:

```scss
.card
{
	&__icon
	{
		--icon-color: var(--color-text-primary);
		--icon-size: 24px;

		display: flex;
	}
}
```

`--icon-size` controls height; width preserves the catalog entry's ratio.
It overrides `size`, which defaults to 24px and supports numeric values and CSS
lengths such as `1.5em`. Color inherits unless `--icon-color` is configured.
Monochrome SVGs use `currentColor`; intentional multicolor fills remain intact.
`strokeWidth` is supported by Lucide and other providers that explicitly opt in.
It is not forced onto local filled artwork.

No label (including whitespace-only labels) means decorative: `aria-hidden`.
A localized label means informative: `role="img"` and `aria-label`.
Icons are never focusable. Buttons and links provide their own accessible name.
The consumer controls positioning and external alignment.

## Catalog and providers

The reusable rendering contract lives in `src/lib/icons/providers.ts`.
The project-specific catalog lives in `config/icons.ts`. Its keys are stable
content identifiers; swapping an entry's source does not change consumers.

Register a native Astro SVG component:

```ts
import CustomMark from '../src/assets/icons/custom-mark.svg';
import { svgIcon } from '../src/lib/icons/providers';

// Entry inside iconRegistry:
'custom-mark': { label: 'Custom mark', ...svgIcon(CustomMark) },
```

The adapter reads the SVG import's dimensions. Keep them consistent with its
viewBox. Review local assets before registration. Remove unnecessary IDs;
referenced masks, gradients, and definitions require a wrapper generating unique
IDs per instance, because native SVG imports retain their internal IDs.
Do not remove IDs that are referenced. Keep relevant licenses with the assets.

For another library, register only the icons the project uses. Normalize its
Astro-compatible SVG component with `componentIcon(component, options)` or create
a small provider adapter around that function. Options declare `provider`,
`width`, `height`, default SVG `attributes`, and optionally
`supportsStrokeWidth`. Icon renders the common contract without provider branches.
Client framework components need an Astro-compatible server SVG wrapper first.

## Future CMS contract

A CMS stores a stable string such as `{ "icon": "arrow-up-right" }`.
The future WordPress/other CMS adapter validates it before rendering:

```ts
import { parseIconName, getIconOptions } from '../config/icons';

const icon = parseIconName(record.icon); // IconName | undefined
const choices = getIconOptions(); // Serializable { value, label }[]
```

Unknown, non-string, or inherited object keys are rejected. Omit invalid optional
icons or reject invalid required records in the content adapter. Direct invalid
usage of Icon throws to make authoring errors visible. TypeScript types alone
cannot validate external data.

The atom accepts no SVG markup, remote SVG URL, library name, or import path from
the CMS. Asset upload/processing would be a separate ingestion feature.
`getIconOptions()` provides data for a future selector; no CMS endpoint or live
connection is created here. Catalog labels are editor metadata, not accessible
labels for rendered instances.

Consumers infer props with `ComponentProps<typeof Icon>`. Domain adapters can
import `IconName`, `isIconName`, and `parseIconName` from `config/icons.ts`.

Examples of both providers are available in `/es/ui/`.
