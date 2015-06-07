/*globals $ */
/*jslint vars:true*/
var webAppFindSaveButton, webAppFindSaveButton;
(function () {'use strict';

var pathID, saveMessage = 'webapp-save', excludedMessages = [saveMessage], saveButton = webAppFindSaveButton || $('.webAppFindSaveButton')[0]; // Todo: Allow for adding events to multiple webAppFindSaveButtons?

function listenForMessages() {
    window.addEventListener('message', function(e) {
        if (e.origin !== window.location.origin || // PRIVACY AND SECURITY! (for viewing and saving, respectively)
            (!Array.isArray(e.data) || excludedMessages.indexOf(e.data[0]) > -1) // Validate format and avoid our post below
        ) {
            return;
        }
        var messageType = e.data[0];
        switch (messageType) {
            case 'webapp-view':
                // Populate the contents
                pathID = e.data[1];
                document.title += ': ' + pathID;
                editor.setData(e.data[2]);
                if (!saveButton && webAppFindSaveButton) {
                    saveButton = webAppFindSaveButton;
                    saveButton.style.display = 'block';
                    saveButton.addEventListener('click', webAppFindSaveToDisk);
                }
                if (saveButton) {
                    saveButton.disabled = false;
                }
                break;
            case 'webapp-save-end':
                var backgroundColor = saveButton.style.backgroundColor;
                saveButton.style.backgroundColor = 'blue';
                setTimeout(function () {
                    saveButton.style.backgroundColor = backgroundColor;
                }, 120);
                
                // alert('save complete for pathID ' + e.data[1] + '!');
                break;
            default:
                throw 'Unexpected mode';
        }
    }, false);
}
function webAppFindSaveToDisk (e) {
    if (e.type === 'keypress' && (!e.ctrlKey || e.charCode !== 115)) {
        return;
    }
    if (!pathID) {
        alert('No pathID set by Firefox yet! Remember to invoke this file from an executable or command line and in edit mode.');
        return;
    }
    window.postMessage([saveMessage, pathID, editor.getData()], window.location.origin);
}

// EXPORT & ADD EVENTS/ELEMENTS

$('.split-pane-frame').prepend('<input type="button" value="Save" class="webAppFindSaveButton" style="display:none;" />');

window.webAppFindSaveToDisk = webAppFindSaveToDisk;
listenForMessages();

}());
