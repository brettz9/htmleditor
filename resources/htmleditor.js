/*global CodeMirror, $, requestAnimationFrame */
/*jslint vars:true */

(function () {'use strict';


document.title = 'HTML Editor';

var pane = $('div.split-pane').children('.split-pane-divider');

// Remove if https://github.com/shagstrom/split-pane/issues/14 implemented.
function triggerSplitterDrop (vDrop) {
    var offset = pane.offset();
    var ev = {
        which: 1,
        pageX: offset.left,
        pageY: offset.top
    };
    var mdEvent = $.Event('mousedown', ev);

    ev.pageY = vDrop || offset.top;
    var mmEvent = $.Event('mousemove', ev);
    var muEvent = $.Event('mouseup', ev);

    pane.trigger(mdEvent);
    pane.trigger(mmEvent);
    pane.trigger(muEvent);
}

$('div.split-pane').splitPane();

var texteditor = document.querySelector('textarea');

texteditor.value = [
    '<!DOCTYPE html>',
    '<html xmlns="http://www.w3.org/1999/xhtml">',
    '<head>',
    '    <meta charset="utf-8" />',
    '    <title></title>',
    '</head>',
    '<body>',
    '',
    '<script>',
    '',
    '</script>',
    '',
    '</body>',
    '</html>'
].join('\n');

var ed = CodeMirror.fromTextArea(texteditor, {
    lineNumbers: true,
    mode: 'htmlmixed'
});
function setPreview () {
    // document.querySelector('#preview').innerHTML = ed.getValue(); // innerHTML won't execute scripts, so we use jQuery
    requestAnimationFrame(function () {
        $('#preview').html(ed.getValue());
    });
}
setPreview();
ed.on('change', setPreview);
// ed.setSize(200, 200);


// Trigger events needed to push down the splitter!
var verticalDrop = parseFloat(localStorage.getItem('splitterTop')) || 0;
triggerSplitterDrop(verticalDrop);

$('div.split-pane').mouseup(function () {
    localStorage.setItem('splitterTop', pane.offset().top);
});


}());
