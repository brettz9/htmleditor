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
    '</html>',
    ''
].join('\n');

var ed = CodeMirror.fromTextArea(texteditor, {
    lineNumbers: true,
    mode: 'htmlmixed',
    viewportMargin: Infinity
});

function resetFrameHeight () {
    $('#preview')[0].style.height = ($('.split-pane').innerHeight() - $('#bottom-component').offset().top - 10) + 'px';
}

function setPreview () {
    // document.querySelector('#preview').innerHTML = ed.getValue(); // innerHTML won't execute scripts, so we use jQuery
    requestAnimationFrame(function () {
        // $('#preview').html(ed.getValue());
        $('#preview')[0].srcdoc = ed.getValue();
    });
}
setPreview();
ed.on('change', setPreview);
// ed.setSize(200, 200);
requestAnimationFrame(function () {
    resetFrameHeight();
});

// Trigger events needed to push down the splitter!
var verticalDrop = parseFloat(localStorage.getItem('splitterTop')) || 0;
triggerSplitterDrop(verticalDrop);

$('div.split-pane').mouseup(function () {
    resetFrameHeight();
    localStorage.setItem('splitterTop', pane.offset().top);
});


// TOOLBAR
// Theme
var select = document.createElement('select');
var themePrefix = 'bower_components/codemirror/theme/';
var themeSuffix = '.css';
Array.from(document.querySelectorAll('link')).filter(function (link) {
    return link.href.indexOf(themePrefix) > -1;
}).forEach(function (link) {
    var option = document.createElement('option');
    option.text = link.getAttribute('href').replace(themePrefix, '').replace(themeSuffix, '');
    select.appendChild(option);
});
document.querySelector('#toolbar').appendChild(select);
select.addEventListener('change', function (e) {
    var theme = select.selectedOptions[0].value;
    localStorage.setItem('theme', theme);
    // ed.setOption('theme', theme);
    // We change the location so the user can bookmark it (we might instead try parsing after the hash to prevent need for refresh)
    var url = new URL(document.location.href);
    url.searchParams.set('theme', theme);
    window.location = url;
});

var choice = new URL(document.location.href).searchParams.get('theme') || localStorage.getItem('theme'); // FF doesn't currently support document.location.searchParams
if (choice) {
    select.value = choice;
    ed.setOption('theme', choice);
}


}());
