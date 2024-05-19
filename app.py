from flask import Flask, render_template, request, send_from_directory

app = Flask(__name__, template_folder='template')


@app.route('/')
def index():
    return render_template('scanner.html')


@app.route('/forms')
def forms():
    return render_template('forms.html')


@app.route('/manager')
def manager():
    return render_template('manager.html')


@app.route('/details')
def details():
    return render_template('details.html')


@app.route('/src/data/<path:path>', methods=['GET'])
def get_data(path):
    return send_from_directory('src/data', path)


if __name__ == '__main__':
    app.run(debug=True)