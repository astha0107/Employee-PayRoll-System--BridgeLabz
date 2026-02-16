const fs = require('fs').promises;
const path = require('path');

const FILE = path.join(__dirname, '../employees.json');

async function readEmployees() {
    try {
        const data = await fs.readFile(FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        console.log('Error reading file:', err);
        return [];
    }   
}

async function writeEmployees(data) {
    try {
        await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (err) {
        console.log('Error writing file:', err);
    }
}

module.exports = {readEmployees, writeEmployees};