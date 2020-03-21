var rendered, cmPlaceholder;
var cmEditor; // codemirror editor

var converter;

// code mirror opts
const cmOpts = {
    lineNumbers: true,
    mode: "markdown",
    theme: "ayu-dark",
    keyMap: "vim",
    indentUnit: 4,
    showCursorWhenSelecting: true
}


const edit = () => {
    const sanitize = (html) => {
        let markdown = converter.makeMarkdown(html);
        markdown = markdown.replace('<!-- -->', ''); // remove empty html comment
        markdown = markdown.replace('\n\n\n', '\n\n'); // remove duplicated newlines
        return markdown;
    }
    cmEditor.setValue(sanitize(rendered.innerHTML));

    rendered.style.display = "none";
    cmEditor.getWrapperElement().style.display = "inherit";
    cmEditor.refresh();
}

const render = () => {
    cmEditor.getWrapperElement().style.display = "none";
    rendered.style.display = "inherit";
    rendered.innerHTML = converter.makeHtml(cmEditor.getValue());
}

CodeMirror.commands.save = function () {
    console.log(cmEditor.getValue())
    render();
};

window.onload = () => {
    (() => {
        // custom showdown "at anchor" extension
        (function (extension) {
            if (typeof showdown !== 'undefined') {
                // global (browser or nodejs global)
                extension(showdown);
            } else if (typeof define === 'function' && define.amd) {
                // AMD
                define(['showdown'], extension);
            } else if (typeof exports === 'object') {
                // Node, CommonJS-like
                module.exports = extension(require('showdown'));
            } else {
                // showdown was not found so we throw
                throw Error('Could not find showdown library');
            }
        }(function (showdown) {
            // loading extension into shodown
            showdown.extension('atanchor', function () {
                var atanchor = {
                    type: 'lang',
                    filter: function (text, converter, options) {
                        console.log("ext called on", text);
                        text.replace(/^@@.+$/g, '<a name=\"$1\"></a>');
                        return text;
                    }
                };
                return [atanchor];
            });
        }));
        // create converter
        converter = new showdown.Converter();
        converter.setFlavor('github');
    })();
    // init codemirror
    cmPlaceholder = document.getElementById('cmplaceholder'); // get codemirror location
    cmEditor = CodeMirror((cm) => {
        cmPlaceholder.parentNode.replaceChild(cm, cmPlaceholder); // construct codemirror
    }, cmOpts);
    cmEditor.getWrapperElement().style.display = "none"; // hide codemirror

    // init rendered notes
    rendered = document.getElementById('rendered');
    rendered.addEventListener('click', edit);

    // event listeners
    cmEditor.on('blur', render);

    rendered.innerHTML = converter.makeHtml('# Annote Alpha\n\n- epic\n- lists\n```python\ndef foo():\n    print("foo")\n```');
}

