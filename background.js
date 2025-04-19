// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'loadNotes') {
        // Read notes from storage
        chrome.storage.local.get(['notes'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Error loading notes:', chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError });
            } else {
                console.log('Notes loaded successfully:', result.notes);
                sendResponse({ success: true, notes: result.notes || [] });
            }
        });
        return true; // Required for async response
    }
    
    if (request.action === 'saveNotes') {
        // Validate notes data
        if (!Array.isArray(request.notes)) {
            console.error('Invalid notes format:', request.notes);
            sendResponse({ success: false, error: 'Invalid notes format' });
            return true;
        }

        // Save notes to storage
        chrome.storage.local.set({ notes: request.notes }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error saving notes:', chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError });
            } else {
                console.log('Notes saved successfully:', request.notes);
                sendResponse({ success: true });
            }
        });
        return true; // Required for async response
    }

    if (request.action === 'downloadNote') {
        if (!request.url || !request.filename) {
            console.error('Missing required download parameters');
            return false;
        }

        try {
            chrome.downloads.download({
                url: request.url,
                filename: request.filename,
                saveAs: true
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error('Download error:', chrome.runtime.lastError);
                }
            });
        } catch (error) {
            console.error('Error initiating download:', error);
        }
        return false; // Don't keep message channel open
    }
}); 