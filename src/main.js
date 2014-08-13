var packageAttribute = require('livefyre-package-attribute');
var backgroundColorCss = require('text!./styles/card-background-color.css');
var textColorCss = require('text!./styles/text-color.css');
var anchorColorCss = require('text!./styles/anchor-color.css');
var displayNameColorCss = require('text!./styles/display-name-color.css');
var usernameColorCss = require('text!./styles/username-color.css');

var HEAD_EL = document.getElementsByTagName('head')[0];

var ThemeStyler = function (opts) {
    opts = opts || {};
    this._styleEl = document.createElement('style');
    HEAD_EL.appendChild(this._styleEl);
    this._stylePrefix = opts.prefix || ['[',packageAttribute.attribute,'~="',packageAttribute.value,'"] '].join('');
};

ThemeStyler.prototype.applyTheme = function (theme) {
    var cssText = getThemeCss(theme);
    var prefixedCss = prefixCss(this._stylePrefix, cssText);
    this._styleEl.innerHTML = prefixedCss;
};

function prefixCss(prefix, cssText) {
    var match, results = [],
        cssPattern = new RegExp("([^\\s][\\s\\S]*?)(\\{[\\s\\S]*?\\})", "g"),
        selectors, prefixedSelectors;

    while (match = cssPattern.exec(cssText)) {
        //There might be a concatenation of selectors, explode them
        selectors = match[1].split(",");
        prefixedSelectors = [];

        for (var i = 0, l = selectors.length; i < l; i += 1) {
           prefixedSelectors.push(prefix + selectors[i]);
        }
        results.push(prefixedSelectors.join(","), match[2]);
    }

    return results.join("");
};

function getThemeCss(theme) {
    var cssVarRegex = /var\(--[\w-]+\)/g;
    var cssStyles = [];
    for (var themeVar in theme) {
        if (theme.hasOwnProperty(themeVar)) {
            var val = theme[themeVar];
            var cssText = getStyleTemplate(themeVar);
            cssText = cssText.replace(cssVarRegex, val);
            cssStyles.push(cssText);
        }
    }
    return cssStyles.join(''); 
};

ThemeStyler.TEMPLATE_MAP = {
    'card-background-color': backgroundColorCss,
    'anchor-color': anchorColorCss,
    'text-color': textColorCss,
    'display-name-color': displayNameColorCss,
    'username-color': usernameColorCss
};

function getStyleTemplate(themeVar) {
    return ThemeStyler.TEMPLATE_MAP[themeVar];
};

module.exports = ThemeStyler;
