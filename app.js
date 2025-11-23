const app = () => {
    const emojiInput = document.getElementById('editor');
    const emojiOutput = document.getElementById('output');
    const copyButton = document.getElementById('copyButton'); // Get the copy button

    // Initialize EmojiConvertor
    const emojiConverter = new EmojiConvertor();
    
    // --- Key Configurations for Unicode Output ---
    
    emojiConverter.replace_mode = 'unified';
    emojiConverter.allow_native = true;
    
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
