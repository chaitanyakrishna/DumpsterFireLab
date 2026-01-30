from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/roll', methods=['POST'])
def roll_dice():
    """Roll the dice and return the result."""
    number = random.randint(1, 6)
    is_fire = number % 2 == 1  # Odd numbers are fire
    return jsonify({
        'number': number,
        'is_fire': is_fire
    })

if __name__ == '__main__':
    app.run(debug=True)
