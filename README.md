# colon-emoji-converter

Static site that replaces colon emoji in your text to unicode emoji.

This tool uses the
[js-emoji](https://github.com/iamcal/js-emoji)
(npm: `emoji-js`) library to convert colon emoji
shortcodes (e.g., `:jack_o_lantern:`) into their
corresponding Unicode emoji characters (🎃).

Emoji shortcodes are commonly used on platforms like GitHub,
Slack, and Discord.
However, copying content with these shortcodes into platforms
that do not support them can be difficult, as they may not
render correctly.
This converter helps bridge that gap by providing a way to
replace all shortcodes in your text with their Unicode emoji
characters so that you can paste them (almost) anywhere.
