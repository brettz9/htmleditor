# htmleditor

HTML Editor based on CodeMirror's mixed mode syntax with
split-screen preview (splitter courtesy of
[split-pane](https://github.com/shagstrom/split-pane)).

For a Firefox add-on allowing this editor to be opened
in new tabs, see
[htmleditor-addon](https://github.com/brettz9/htmleditor-addon).

# Installation

`bower install htmleditor`

# To-dos

1. Bower -> npm
1. Update WebAppFind API
1. Change from AppCache to Service Worker
1. Submit add-on to AMO for full review after:
    1. Avoid `innerHTML` in CodeMirror component.
    2. Avoid vertical scrolling as seen by AMO editor (page height 24 pixels higher than available window space)
    3. Window resizing problems: preview area resizes if the window becomes smaller but stays the same when it becomes larger.
1. Add theme support from CodeMirror

# Possible to-dos

1. Remove WebAppFind support if WAF can't be fixed for latest FF
1. Consider other features to apply from CodeMirror
1. Allow query string modification of defaults
1. Allow loading/saving of default contents
    1. Allow switching between pre-saved files
