# monday
A fancy todolist with minimal UI in browser and as a chrome extension. Designed for use on desktop by keyboard alone. Not really mobile friendly. Persistant storage as default. Chrome extension syncs data between devices.

![screenshot](monday_dump.png?raw=true)

# usage
- add new item at prompt by `return`
- navigate items by `tab`
- remove item by replacing text with *done* or leave `<blank>`
- edit item by adding text
- `$url` to add url from the current tab
- `$export` to export all data as newline-separated-string
- `$drop` to delete all data
- `#filter` to add a filter. Remove filter by `!#`
- unix-style history with `up arrow` for latest entry and `down arrow` to cycle back

# desktop
[demo](https://m0nday.herokuapp.com)

# chrome extension
[![Chrome Webstore](chrome_badge.png?raw=true)](https://chrome.google.com/webstore/detail/inephoagiijhmfhmlnaffaaiacdndmom/publish-accepted?hl=sv)

# licence
MIT