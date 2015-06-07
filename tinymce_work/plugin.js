/*global tinymce, CodeMirror */
/*jslint vars:true*/

(function () {'use strict';

//tinymce.PluginManager.requireLangPack('codemirrorinline');

tinymce.PluginManager.add('codemirrorinline', function (editor/*, url*/) {
    var ready = false;

    function addCodeMirrorBase (file) {
        return (editor.getParam('codemirrorInlinePath') || '../node_modules/codemirror/') + file;
    }

    var codemirrorStylesheets = (editor.getParam('codemirrorInlineCSS') || [// Default CSS files
        'lib/codemirror.css',
        'addon/dialog/dialog.css'
    ]).map(addCodeMirrorBase)

    var codemirrorScripts = (editor.getParam('codemirrorInlineJS') || [
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
    ]).map(addCodeMirrorBase);


    var i = 0;
    function loadAllStylesheets (cb) {
        tinymce.DOM.styleSheetLoader.load(
            codemirrorStylesheets[i],
            (i < codemirrorStylesheets.length - 1 ? function () {
                loadAllStylesheets(cb);
            } : cb)
        );
        i++;
    }
    loadAllStylesheets();

    var j = 0;
    function loadAllScripts (cb) {
        var scriptLoader = new tinymce.dom.ScriptLoader();
        scriptLoader.loadScripts(
            [codemirrorScripts[j]],
            (j < codemirrorScripts.length - 1 ? function () {
                loadAllScripts(cb);
            } : cb)
        );
        j++;
    }
    
    loadAllScripts(
        function () {
            ready = true;
                        
            
            /*CodeMirror(function(elt) {
                var textarea = document.querySelector('#a');
                textarea.parentNode.replaceChild(elt, textarea);
            }, {value: '<u>abc</u>'});*/
            editor.iframeElement.style.display = 'none';
            var textarea = document.createElement('textarea');
            
            var cont = editor.iframeElement;
            //var cont = document.body;
            cont.parentNode.appendChild(textarea);
            // textarea.style.all = 'unset';

            var codemirror = CodeMirror.fromTextArea(textarea, {// Default config
                mode: 'htmlmixed',
                lineNumbers: true,
                lineWrapping: true,
                indentUnit: 1,
                tabSize: 1,
                matchBrackets: true,
                styleActiveLine: true
            });
            
            // textarea.nextElementSibling.style.all = 'initial';
            // editor.iframeElement.parentNode.appendChild(textarea.nextElementSibling);
            // editor.iframeElement.parentNode.insertBefore(textarea, editor.iframeElement.parentNode.lastElementChild);
            
            codemirror.isDirty = false;
            codemirror.on('change', function(inst) {
                inst.isDirty = true;
            });
            
        }
    );
    
    editor.on('change', function (e) {
        if (!ready) {
            alert('Please wait until the source code plugin has time to load (2)');
            return;
        }
        
//  alert(editor.getContent());
//        editor.setContent('<i>italics</i>');
        
    });
    
    function showSourceEditor() {
        if (!ready) {
            alert('Please wait until the source code plugin has time to load');
            return;
        }
		
        
        
	}

    
	// Add a button to the button bar
	editor.addButton('codemirrorinline', {
		text: 'Source',
		icon: 'code',
		onclick: showSourceEditor
	});

	// Add a menu item to the tools menu
	editor.addMenuItem('codemirrorinline', {
		icon: 'code',
		text: 'Source',
		context: 'tools',
		onclick: showSourceEditor
	});
});


}());
