/*global CodeMirror, $, fetch, requestAnimationFrame*/
/*jslint vars:true, evil:true*/

(function () {

function applyJS (arr) { // jslint note: Won't work in strict mode
    arr.forEach(function (fileContents) {
        eval(fileContents);
    });
}

(function () {'use strict';

document.title = 'HTML Editor';

var codemirrorBaseURL = '../node_modules/codemirror/';
//var codemirrorBaseURL = 'http://codemirror.net/';

function fetchWithBaseURL (url) {
    return fetch(codemirrorBaseURL + url);
}
function getAllFilesText (arr) {
    return Promise.all(arr.map(function (url) {
        return url.text();
    }));
}
var pane;
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

var splitterStylesheets = [
    'split-pane.css',
    'pretty-split-pane.css', // Actually needed
    'split-pane-demo.css' // Actually needed
];
var splitterScripts = [
    'https://code.jquery.com/jquery-1.11.3.min.js',
    'split-pane.js'
];
var codemirrorStylesheets = [// Default CSS files
    'lib/codemirror.css',
    'addon/dialog/dialog.css'
];
var codemirrorScripts = [
    'lib/codemirror.js',
    'addon/edit/matchbrackets.js',
    'mode/xml/xml.js',
    'mode/javascript/javascript.js',
    'mode/css/css.js',
    'mode/htmlmixed/htmlmixed.js',
    'addon/dialog/dialog.js',
    'addon/search/searchcursor.js',
    'addon/search/search.js',
    'addon/selection/active-line.js'
];

// Until import comes around!
function fetchText (arr, thenCb) {
    return Promise.all(arr.map(function (url) {return fetch(url);})).then(getAllFilesText).then(thenCb);
}
function fetchTextWithBaseURL (arr, thenCb) {
    return Promise.all(arr.map(fetchWithBaseURL)).then(getAllFilesText).then(thenCb);
}
function addStyle (arr) {
    var style = document.createElement('style');
    style.textContent = arr.reduce(function (prev, fileContents) {
        return prev + fileContents;
    }, '');
    document.head.appendChild(style);
}
fetchText(splitterStylesheets, addStyle).
    then(function () {
        return fetchTextWithBaseURL(codemirrorStylesheets, addStyle);
    }).
    then(function () {
        return fetchText(splitterScripts, applyJS);
    }).
    then(function () {
        return fetchTextWithBaseURL(codemirrorScripts, function (arr) {
            applyJS(arr);
            return Promise.resolve(CodeMirror); // Until we get modules
        });
    }).
    then(function (cm) {
        pane = $('div.split-pane').children('.split-pane-divider');
        $('div.split-pane').splitPane();

        var ed = cm.fromTextArea(document.querySelector('textarea'), {
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
        
    });

}());

}());