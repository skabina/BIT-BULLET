const hiddenInput = document.getElementById('hidden-input');
const visualInput = document.getElementById('visual-input');
const targetDisplay = document.getElementById('target-number');
const statusDisplay = document.getElementById('status');


document.addEventListener('click', () => hiddenInput.focus());

hiddenInput.addEventListener('input', (e) => {
    
    const val = e.target.value.replace(/[^01]/g, '');
    hiddenInput.value = val;
    visualInput.textContent = val;
});

hiddenInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const userGuess = hiddenInput.value;
        const currentTarget = targetDisplay.textContent;

        
        const response = await fetch('/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                target: parseInt(currentTarget), 
                binary_in: userGuess 
            })
        });

        const data = await response.json();
        handleResponse(data);
    }
});

function handleResponse(data) {
    if (data.status === 'success') {
        statusDisplay.textContent = data.message;
        targetDisplay.textContent = data.next_target;
     
    } else {
        statusDisplay.textContent = data.message;
    }
    hiddenInput.value = '';
    visualInput.textContent = '';
}