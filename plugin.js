/*global tinymce:true */

(function () {'use strict';

tinymce.PluginManager.requireLangPack('codemirrorinline');

var codeMirrorScripts = [
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
].map(function (file) {
    return '../node_modules/codemirror/' + file;
});

var ready = false;
var scriptLoader = new tinymce.dom.ScriptLoader();
scriptLoader.loadScripts(
    codeMirrorScripts.slice(0, 1), // Must be available first
    function () {
        var scriptLoader = new tinymce.dom.ScriptLoader();
        scriptLoader.loadScripts(
            codeMirrorScripts.slice(1),
            function () {
                ready = true;
            }
        );
    }
);


tinymce.PluginManager.add('codemirrorinline', function (editor/*, url*/) {
	function showSourceEditor() {
        if (!ready) {
            alert('Please wait until the source code plugin has time to load');
            return;
        }
		
        //alert(CodeMirror);
        // alert(document.querySelectorAll('.mce-edit-area')[0].firstElementChild.contentDocument.documentElement.outerHTML);
        document.querySelectorAll('.mce-edit-area')[0].firstElementChild.style.visibility = 'hidden';
        
        
        
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
