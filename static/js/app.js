document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById('roll-button');
    const diceDisplay = document.getElementById('dice-display');
    const diceNumber = document.getElementById('dice-number');
    const statusMessage = document.getElementById('status-message');
    const flames = document.getElementById('flames');
    const dumpster = document.getElementById('dumpster');

    rollButton.addEventListener('click', rollDice);

    async function rollDice() {
        // Disable button during roll
        rollButton.disabled = true;
        
        // Add rolling animation
        diceDisplay.classList.add('rolling');
        
        // Animate through random numbers
        let animationCount = 0;
        const animationInterval = setInterval(() => {
            diceNumber.textContent = Math.floor(Math.random() * 6) + 1;
            animationCount++;
            if (animationCount >= 10) {
                clearInterval(animationInterval);
            }
        }, 50);

        try {
            // Make API call to get actual result
            const response = await fetch('/roll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            // Wait for animation to complete
            setTimeout(() => {
                // Remove rolling animation
                diceDisplay.classList.remove('rolling');
                
                // Display actual result
                diceNumber.textContent = data.number;
                
                // Update UI based on result
                updateFireState(data.is_fire, data.number);
                
                // Re-enable button
                rollButton.disabled = false;
            }, 500);

        } catch (error) {
            console.error('Error rolling dice:', error);
            diceDisplay.classList.remove('rolling');
            statusMessage.textContent = '❌ Error! Try again.';
            statusMessage.className = 'status-message';
            rollButton.disabled = false;
        }
    }

    function updateFireState(isFire, number) {
        // Remove previous state classes
        statusMessage.classList.remove('fire', 'safe');
        
        if (isFire) {
            // It's a dumpster fire!
            flames.classList.add('active');
            dumpster.classList.add('on-fire');
            statusMessage.classList.add('fire');
            statusMessage.textContent = `🔥 DUMPSTER FIRE! You rolled ${number}! 🔥`;
        } else {
            // Safe!
            flames.classList.remove('active');
            dumpster.classList.remove('on-fire');
            statusMessage.classList.add('safe');
            statusMessage.textContent = `✅ Safe! You rolled ${number}! ✅`;
        }
    }
});
