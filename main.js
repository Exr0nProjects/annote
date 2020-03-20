var rendered;
var cmEditor; // codemirror editor

const converter = new showdown.Converter();
converter.setFlavor('github');

CodeMirror.commands.save = function () {
    console.log(cmEditor.getValue())
    render();
};

// code mirror opts
const cmOpts = {
    lineNumbers: true,
    mode: "markdown",
    theme: "ayu-dark",
    keyMap: "vim",
    showCursorWhenSelecting: true
}

const edit = () => {
    console.log("showing codemirror")
    const sanitize = (html) => {
        let markdown = converter.makeMarkdown(html);
        markdown = markdown.replace('<!-- -->', ''); // remove empty html comment
        markdown = markdown.replace('\n\n\n', '\n\n'); // remove duplicated newlines
        return markdown;
    }
    rendered.style.display = "none";
    cmEditor.getWrapperElement().style.display = "inherit";

    cmEditor.setValue(sanitize(rendered.innerHTML));
}
const render = () => {
    console.log("hiding codemirror")
    cmEditor.getWrapperElement().style.display = "none";
    rendered.style.display = "inherit";
    rendered.innerHTML = converter.makeHtml(cmEditor.getValue());
}

window.onload = () => {
    rendered = document.getElementById('rendered');
    cmEditor = CodeMirror(document.body, cmOpts);
    cmEditor.getWrapperElement().style.display = "none";

    rendered.addEventListener('click', edit);

    rendered.innerHTML = converter.makeHtml('# Markdown w/ Showdown\n\n- epic\n- lists');
}

