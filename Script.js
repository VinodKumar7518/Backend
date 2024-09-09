const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

const dataFilePath = path.join(__dirname, 'employees.json');

const readData = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
        return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/employee', (req, res) => {
    const employees = readData();
    res.json(employees);
});

app.post('/employee', (req, res) => {
    const employees = readData();
    employees.push(req.body);
    writeData(employees);
    res.status(201).json(req.body);
});

app.put('/employee/:index', (req, res) => {
    const employees = readData();
    const employeeIndex = parseInt(req.params.index, 10);
    if (employeeIndex >= 0 && employeeIndex < employees.length) {
        employees[employeeIndex] = req.body;
        writeData(employees);
        res.status(200).json(req.body);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

app.delete('/employee/:index', (req, res) => {
    const employees = readData();
    const employeeIndex = parseInt(req.params.index, 10);
    if (employeeIndex >= 0 && employeeIndex < employees.length) {
        employees.splice(employeeIndex, 1);
        writeData(employees);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
