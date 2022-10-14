# Grab Booru Tags
Provides a hotkey on booru sites to quickly copy image tags

# How to install
* Install a script manager plugin/extention on your browser, such as Tampermonkey
    * on chrome: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
    * on firefox: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
* Open this link and click install the script: https://sleazyfork.org/en/scripts/451098-get-booru-tags

# How to use
1. Open an image on one of the supported booru sites
2. Press the [`] tilde key under ESC to open a prompt with all tags
3. Copy them

Note: it appears underscores and commas are not neccessary to get good results, so they are ommited by default. If you wish to add them, edit the script and set these variables to false: `remove_commas`, `remove_underscores`, `remove_parentheses`

# Supported websites
* danbooru.donmai.us
* gelbooru.com
