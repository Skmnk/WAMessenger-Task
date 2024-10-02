document.addEventListener('DOMContentLoaded', function() {

    const languageSelect = document.getElementById('language-select');
    const translateBtn = document.getElementById('translate-btn');


    translateBtn.addEventListener('click', () => {
        const selectedLanguage = languageSelect.value;
        if (chrome && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: transformMessages,
                    args: [selectedLanguage]
                });
            });
        } else {
            console.log('This code only works in Chrome Extension mode.');
        }
    });

});



async function transformMessages(selectedLanguage) {

    async function get_translated_text(originalText){
        console.log('Request Body:', {
            q: originalText,
            target: selectedLanguage,
        });
        const response = await fetch('http://localhost:3000/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: originalText,
                target: selectedLanguage,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        const data = await response.json();
        console.log(data.translatedText);
        return data.translatedText;
    };

    const messageContainers = document.querySelectorAll('div[class*="message"]');

    messageContainers.forEach(async (container) => {
        // Select the text message content within each container
        const textElement = container.querySelector('span.selectable-text span');

        // Ensure it's a text message and not a media message
        if (textElement && textElement.innerText) {

            const originalText = textElement.innerText;

            // Apply transformation function
            const transformedText = await get_translated_text(originalText);

            // Check if transformed div already exists, to avoid duplication
            let existingTransformedDiv = container.querySelector('.transformed-text');
                if(existingTransformedDiv)
                {
                    existingTransformedDiv.remove();
                }
                const transformedDiv = document.createElement('div');
                transformedDiv.classList.add('transformed-text');
                transformedDiv.style.padding = '1px';
                transformedDiv.style.border = '1px solid black'; // Added black border
                transformedDiv.style.color = 'green';
                transformedDiv.style.fontStyle = 'italic';
                transformedDiv.inert=
                transformedDiv.innerText = `${transformedText}`;

                // Insert the new div just below the original message
                container.appendChild(transformedDiv);
        }
    });
}

