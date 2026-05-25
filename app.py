from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': '服务正常运行'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090, debug=True)
