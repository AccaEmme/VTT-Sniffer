let stopDetection = false;
let vttFiles = [];

browser.runtime.onMessage.addListener(function(message) {
  if (message.vttDetected && !stopDetection) {
    vttFiles.push(message.url);
    console.log("VTA:: VTT file detected in content script: ", message.url);

    let div = document.getElementById('vtt-div');
    if (!div) {
      div = document.createElement('div');
      div.id = 'vtt-div';
      div.style.position = 'fixed';
      div.style.top = '10px';
      div.style.right = '10px';
      div.style.backgroundColor = 'white';
      div.style.border = '1px solid black';
      div.style.padding = '10px';
      div.style.zIndex = '10000';
      div.style.maxHeight = '80vh';
      div.style.overflowY = 'scroll';

      const title = document.createElement('h3');
      title.textContent = 'File VTT rilevati:';
      div.appendChild(title);

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Chiudi';
      closeButton.onclick = function() {
        document.body.removeChild(div);
        stopDetection = true;
      };
      div.appendChild(closeButton);

      document.body.appendChild(div);
    }

    const list = div.querySelector('ul') || document.createElement('ul');
    vttFiles.forEach((url, index) => {
      const listItem = document.createElement('li');
      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.style.marginRight = '10px';
      removeButton.onclick = function() {
        list.removeChild(listItem);
        vttFiles.splice(index, 1);
      };
      listItem.appendChild(removeButton);

      const urlLink = document.createElement('a');
      urlLink.href = url;
      urlLink.textContent = url;
      urlLink.target = '_blank';
      listItem.appendChild(urlLink);

      list.appendChild(listItem);
    });
    div.appendChild(list);
  }

  if (message.startSniffer) {
    stopDetection = false;
  }
});
