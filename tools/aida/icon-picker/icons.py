# Writes icons.json: the icon names of the BMW ligature icon font (fonts/bmw_next_icons_regular.woff2),
# i.e. the text that renders each glyph. Only the [a-z0-9_] spellings the site's
# decorateFontIcons (scripts/bmw-utils.js) converts; the font's spaced and hyphenated spellings
# are aliases of these.
#   uv run --with fonttools --with brotli python3 tools/aida/icon-picker/icons.py
import json
import re
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[3]
font = TTFont(ROOT / "fonts/bmw_next_icons_regular.woff2")
chars = {
    glyph: chr(cp) for cp, glyph in sorted(font.getBestCmap().items(), reverse=True)
}
names = set()
for lookup in font["GSUB"].table.LookupList.Lookup:
    for sub in lookup.SubTable:
        table = getattr(sub, "ExtSubTable", sub)
        for first, ligatures in getattr(table, "ligatures", {}).items():
            for ligature in ligatures:
                names.add(
                    "".join(chars.get(g, "?") for g in [first, *ligature.Component])
                )
icons = sorted(n for n in names if re.fullmatch(r"[a-z0-9_]+", n))
(Path(__file__).parent / "icons.json").write_text(json.dumps(icons, indent=0) + "\n")
print(len(icons))
