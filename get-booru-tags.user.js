// ==UserScript==
// @name         Get Booru Tags
// @namespace    https://github.com/onusai/
// @version      0.4.1
// @description  Press the [`] tilde key under ESC to open a prompt with all tags
// @author       Onusai#6441
// @match        https://gelbooru.com/index.php?page=post&s=view&id=*
// @match        https://danbooru.donmai.us/posts/*
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    // edit to change default behavior
    let include_commas = false; // set to true to include commas
    let include_underscores = false; // set to true to include underscore
    let include_parentheses = false; // set to true to include parentheses

    // edit to change hotkeys
    let hotkey_use_defaults = '`';
    let hotkey_yes_commas_yes_underscores = '1';  // defaults key + this key
    let hotkey_yes_commas_no_underscores = '2';   // defaults key + this key
    let hotkey_no_commas_yes_underscores = '3';   // defaults key + this key
    let hotkey_no_commas_no_underscores = '4';    // defaults key + this key

    let keysPressed = {};

    $(document).on('keydown', (event) => {
        keysPressed[event.key] = true;

        if (keysPressed[hotkey_use_defaults] && event.key == hotkey_no_commas_no_underscores) show_prompt(false, false);
        else if (keysPressed[hotkey_use_defaults] && event.key == hotkey_yes_commas_no_underscores) show_prompt(true, false);
        else if (keysPressed[hotkey_use_defaults] && event.key == hotkey_no_commas_yes_underscores) show_prompt(false, true);
        else if (keysPressed[hotkey_use_defaults] && event.key == hotkey_yes_commas_yes_underscores) show_prompt(true, true);
    })

     $(document).on('keyup', (event) => {
         if (event.key == hotkey_use_defaults) show_prompt(include_commas, include_underscores);
     });

    function show_prompt(use_commas, use_underscores) {
        for (var member in keysPressed) delete keysPressed[member];

        let tags = null;
        if (window.location.href.includes("/gelbooru.com")) tags = get_gel_tags();
        else if (window.location.href.includes("/danbooru.donmai.us")) tags = get_dan_tags();

        if (tags != null) {
            for (var i = 0; i < tags.length; i++) {
                if (!use_underscores) tags[i] = tags[i].replaceAll("_", " ");
                else tags[i] = tags[i].replaceAll(" ", "_");
            }
            let fprompt = tags.join(", ");
            if (!use_commas) fprompt = fprompt.replaceAll(",", "");
            if (!include_parentheses) fprompt = fprompt.replaceAll("(", "").replaceAll(")", "")
            prompt("Prompt: " + tags.length + " tags\nTo check token length go to: https://beta.openai.com/tokenizer", fprompt);
        }
    }

    function get_gel_tags() {
        let elms = ["tag-type-general", "tag-type-character", "tag-type-metadata", "tag-type-artist", "tag-type-copyright"];
        let iprompt = [];
        elms.forEach(tag => {
            Array.from(document.getElementsByClassName(tag)).forEach(e => {
                iprompt.push(e.children[1].textContent);
            })
        });
        return iprompt;
    }

    function get_dan_tags() {
        let elms = ["general-tag-list", "character-tag-list", "meta-tag-list", "artist-tag-list", "copyright-tag-list"];
        let iprompt = [];
        elms.forEach(tag => {
            Array.from(document.getElementsByClassName(tag)).forEach(e => {
                if (e.tagName == "UL") {
                    Array.from(e.getElementsByClassName("search-tag")).forEach(s => {
                        iprompt.push(s.textContent);
                    })
                }
            })
        });
        return iprompt;
    }

})();
