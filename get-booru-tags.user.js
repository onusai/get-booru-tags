// ==UserScript==
// @name         Get Booru Tags
// @namespace    https://github.com/onusai/
// @version      0.4.6
// @description  Press the [~] tilde key under ESC to open a prompt with all tags
// @author       Onusai#6441
// @match        https://gelbooru.com/index.php?page=post&s=view*
// @match        https://danbooru.donmai.us/posts/*
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    // edit to change default behavior
    let include_commas = true; // set to true to include commas
    let include_underscores = false; // set to true to include underscore
    let include_parentheses = true; // set to true to include parentheses

    // change tag group position or remove completely
    let tag_group_order = ["character", "general", "metadata", "artist", "copyright"];

    // edit to change hotkeys
    let hotkey_default = '`';
    let hotkey_yes_commas_yes_underscores = '1';  // defaults key + this key
    let hotkey_yes_commas_no_underscores = '2';   // defaults key + this key
    let hotkey_no_commas_yes_underscores = '3';   // defaults key + this key
    let hotkey_no_commas_no_underscores = '4';    // defaults key + this key

    let keysPressed = {};


    $(document).on('keyup', (event) => {
        if (event.key == hotkey_default) show_prompt(include_commas, include_underscores);
    });


    $(document).on('keydown', (event) => {
        keysPressed[event.key] = true;

        if (keysPressed[hotkey_default]) {
            if (event.key == hotkey_no_commas_no_underscores) show_prompt(false, false);
            else if (event.key == hotkey_yes_commas_no_underscores) show_prompt(true, false);
            else if (event.key == hotkey_no_commas_yes_underscores) show_prompt(false, true);
            else if (event.key == hotkey_yes_commas_yes_underscores) show_prompt(true, true);
        }
    })


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
            if (!include_parentheses) fprompt = fprompt.replaceAll("(", "").replaceAll(")", "");
            else fprompt = fprompt.replaceAll("(", "\\(").replaceAll(")", "\\)");
            prompt("Prompt: " + tags.length + " tags", fprompt);
        }
    }


    function get_gel_tags() {
        let iprompt = [];
        tag_group_order.forEach(tag => {
            Array.from(document.getElementsByClassName("tag-type-"+tag)).forEach(e => {
                iprompt.push(e.children[1].textContent);
            })
        });
        return iprompt;
    }


    function get_dan_tags() {
        let iprompt = [];
        tag_group_order.forEach(tag => {
            tag = ((tag == "metadata") ? "meta" : tag);
            Array.from(document.getElementsByClassName(tag+"-tag-list")).forEach(e => {
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
