from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

current_id = 3 

data = [
    {
        "salesperson": "James D. Halpert",
        "client": "Shake Shack",
        "reams": 100,
        "sales_id": 1
    },
    {
        "salesperson": "Stanley Hudson",
        "client": "Toast",
        "reams": 400,
        "sales_id" : 2
    },
    {
        "salesperson": "Micheal. G Scott",
        "client": "Computer Science Department",
        "reams": 1000,
        "sales_id": 3
    }
]

clients = [
    "Shake Shack",
    "Toast",
    "Computer Science Department",
    "Teacher's College",
    "Starbucks",
    "Subsconsious",
    "Flat Top",
    "Joe's Coffee",
    "Max Caffe",
    "Nussbaum & Wu",
    "Taco Bell",
]

# ROUTES

@app.route('/')
def hello_world():
   return render_template('welcome.html')

@app.route('/infinity')
def people():
    return render_template('log_sales.html', data=[data, clients])

# AJAX FUNCTIONS

@app.route('/add_sale', methods=['GET', 'POST'])
def add_sale():
    global data
    global current_id
    global clients
    json_data = request.get_json()

    salesperson = json_data[0]["salesperson"]
    client = json_data[0]["client"]
    reams = json_data[0]["reams"]
    current_id += 1 
    new_name_entry = {
        "client": client,
         "reams": reams,
        "salesperson": salesperson,
        "sales_id": current_id
    }

    data.append(new_name_entry)
    if client not in clients:
        clients.append(client)

    return jsonify(data = [data, clients])


@app.route('/delete', methods=['GET', 'POST'])
def delete():
    global data
    global clients
    json_data = request.get_json()
    sent_data = json_data[0]
    for sale_item in data:
        sales_id = str(sale_item["sales_id"])
        sale_id = str(sent_data["id"])
        equal = (sale_id == sales_id)
        if equal:
            index = data.index(sale_item)
            data.remove(sale_item)
    return jsonify(data = [data, clients])

if __name__ == '__main__':
    app.run(debug = True)
