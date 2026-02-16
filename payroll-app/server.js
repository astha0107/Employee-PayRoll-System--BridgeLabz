const express = require('express');
const fileHandler = require('./modules/fileHandler.js');

const PORT = 5000;

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    const employees = await fileHandler.readEmployees();
    res.render('index', { employees });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', async (req, res) => {
    const {name, department, basicSalary} = req.body;
    const salary = Number(basicSalary);

    if(!name || name.trim() === '' || salary < 0) {
        return res.status(400).send('Invalid input, please provide valid details.');
    }

    const employees = await fileHandler.readEmployees();
    const newEmployee = {
        id: employees.length > 0 ? employees[employees.length - 1].id + 1 : 1,
        nmae: name.trim(),
        department: department.trim(),
        basicSalary: salary
    };

    employees.push(newEmployee);
    await fileHandler.writeEmployees(employees);

    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const employees = await fileHandler.readEmployees();
    const employee = employees. find(emp => emp.id == req.params.id);
    
    if(!employee) {
        return res.status(404).send('Employee not found');
    }

    res.render('edit', { employee });
});

app.post('/edit/:id', async (req, res) => {
    const {name, department, basicSalary} = req.body;    
    const salary = Number(basicSalary);
    if(!name || name.trim() === '' ||  salary < 0) {
        return res.status(400).send('Invalid input, please provide valid details.');
    }

    const employees = await fileHandler.readEmployees();
    const index = employees.findIndex(emp => emp.id == req.params.id);
    
    if(index !== -1) {
        employees[index] = {
            id: employees[index].id,
            name: name.trim(),
            department: department.trim(),
            basicSalary: salary
        };

        await fileHandler.writeEmployees(employees);

        res.redirect('/');
    }
});

app.get('/delete/:id', async (req, res) => {
    let employees = await fileHandler.readEmployees();
    employees = employees.filter(emp => emp.id != req.params.id);

    await fileHandler.writeEmployees(employees);

    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});