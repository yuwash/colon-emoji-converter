const app = () => {
    const emojiInput = document.getElementById('editor');
    const emojiOutput = document.getElementById('output');
    const copyButton = document.getElementById('copyButton');
    const defaultNotification = document.getElementById('defaultNotification');
    const pasteChoiceNotification = document.getElementById('pasteChoiceNotification');

    // Enum for paste modes
    const PasteMode = {
        HTML: 'html',
        PLAIN: 'plain',
        HTML_PURIFIED: 'html_purified' // Added for purified HTML paste
    };

    // Initialize EmojiConvertor
    const emojiConverter = new EmojiConvertor();

    // --- Key Configurations for Unicode Output ---

    emojiConverter.replace_mode = 'unified';
    emojiConverter.allow_native = true;

    // --- Function to handle paste mode choice ---
    const choosePasteMode = (pastedHtml, pastedText) => {
        return new Promise((resolve) => {
            // Show the paste choice notification and hide the default one
            pasteChoiceNotification.style.display = 'block';
            defaultNotification.style.display = 'none';

            const pasteHtmlButton = document.getElementById('pasteHtmlButton');
            const pastePlainTextButton = document.getElementById('pastePlainTextButton');
            const pastePurifiedHtmlButton = document.getElementById('pastePurifiedHtmlButton'); // Get the new button

            const cleanup = () => {
                // Hide the paste choice notification and show the default one
                pasteChoiceNotification.style.display = 'none';
                defaultNotification.style.display = 'block';
                pasteHtmlButton.removeEventListener('click', handleHtmlClick);
                pastePlainTextButton.removeEventListener('click', handlePlainTextClick);
                pastePurifiedHtmlButton.removeEventListener('click', handlePurifiedHtmlClick); // Remove listener for new button
            };

            const handleHtmlClick = () => {
                cleanup();
                resolve(PasteMode.HTML);
            };

            const handlePlainTextClick = () => {
                cleanup();
                resolve(PasteMode.PLAIN);
            };

            // Handler for the new purified HTML button
            const handlePurifiedHtmlClick = () => {
                cleanup();
                resolve(PasteMode.HTML_PURIFIED);
            };

            pasteHtmlButton.addEventListener('click', handleHtmlClick);
            pastePlainTextButton.addEventListener('click', handlePlainTextClick);
            pastePurifiedHtmlButton.addEventListener('click', handlePurifiedHtmlClick); // Add listener for new button
        });
    };

    // --- Function to purify HTML ---
    const purifyHtml = (html) => {
        // Configure DOMPurify to remove span and div tags, and all attributes
        const cleanHtml = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true }, // Use default HTML profile
            FORBID_TAGS: ['span', 'div'], // Forbid span and div tags
            FORBID_ATTR: ['style', 'class', 'id', 'data-*'] // Remove all attributes
        });
        return cleanHtml;
    };

    // --- Event Listener for Input ---

    emojiInput.addEventListener('input', () => {
        const inputText = emojiInput.value;

        // 4. IMPORTANT: Use the method that outputs text/unicode.
        // replace_emoticons() handles both text emoticons and :colon: codes
        // based on the configuration above.
        const convertedText = emojiConverter.replace_emoticons(inputText);

        // Using innerHTML is fine, but since the output is just text, innerText also works.
        // We'll stick to innerHTML for consistency with your previous code.
        emojiOutput.innerHTML = convertedText;
    });

    // --- Event Listener for Paste ---
    emojiInput.addEventListener('paste', async (event) => {
        // Prevent the default paste behavior
        event.preventDefault();

        // Get the pasted data
        const pastedData = (event.clipboardData || window.clipboardData);
        let text = pastedData.getData('text/plain');
        const html = pastedData.getData('text/html');

        // Check if HTML data is present and if it's different from plain text
        if (html && html !== text) {
            const chosenMode = await choosePasteMode(html, text);

            if (chosenMode === PasteMode.HTML) {
                emojiInput.value = html;
            } else if (chosenMode === PasteMode.HTML_PURIFIED) {
                emojiInput.value = purifyHtml(html);
            }
            else { // PLAIN
                emojiInput.value = text;
            }
        } else {
            // No HTML or HTML is the same as plain text, paste as is
            emojiInput.value = text;
        }

        // Trigger the input event to update the output
        emojiInput.dispatchEvent(new Event('input'));
    });

    // --- Event Listener for Copy Button ---
    copyButton.addEventListener('click', () => {
        const textToCopy = emojiOutput.innerText; // Get the text content from the output div
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Optional: Provide user feedback, e.g., change button text temporarily
            const originalText = copyButton.innerText;
            copyButton.innerText = 'Copied!';
            setTimeout(() => {
                copyButton.innerText = originalText;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Optional: Provide error feedback to the user
        });
    });

    // Initial conversion on page load (optional)
    if (emojiInput.value) {
        emojiOutput.innerHTML = emojiConverter.replace_emoticons(emojiInput.value);
    }
};

document.addEventListener('DOMContentLoaded', app);
