console.log("VTA:: Background script running");

browser.webRequest.onCompleted.addListener(
  function(details) {
    console.log("VTA:: Request completed: ", details.url);
    if (details.method === "GET" && details.url.includes(".vtt")) {
      console.log("VTA:: VTT file detected: ", details.url);
      browser.storage.local.get({ vttFiles: [] }, function(result) {
        const vttFiles = result.vttFiles;
        vttFiles.push(details.url);
        browser.storage.local.set({ vttFiles: vttFiles }, function() {
          console.log("VTA:: VTT file saved to storage: ", details.url);
        });
      });
      browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, { vttDetected: true, url: details.url });
      });
    } else {
      console.log("VTA:: Non-VTT request: ", details.url);
    }
  },
  { urls: ["<all_urls>"] }
);

browser.webRequest.onErrorOccurred.addListener(
  function(details) {
    console.error("VTA:: Request error: ", details.url, details.error);
  },
  { urls: ["<all_urls>"] }
);
