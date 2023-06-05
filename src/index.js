import express from 'express';
import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
   user: 'shakeda',
   host: 'dpg-cgugbmg2qv2fdedbo640-a.frankfurt-postgres.render.com',
   database: 'juniyoudb',
   password: 'puMtqvjlq7ftkPfuvHwZFKUuZ5tlWQiV',
   port: 5432,
   ssl: true,
});

client.connect();
const port = process.env.PORT || 80;
export const app = express();
app.use(express.json());

function clean(str) {
   for (let i = 0; i < str.length; i += 1) {
      if (str[i] < 'a' || str[i] > 'z') {
         if (str[i] < 'A' || str[i] > 'Z') {
            if (str[i] < '0' || str[i] > '9') {
               if (str[i] !== '@' && str[i] !== '.') {
                  return false;
               }
            }
         }
      }
   }
   return true;
}

app.get('/', (req, res) => {
   res.sendFile('page/index.html', { root: './' });
});

app.get('/getstyle', (req, res) => {
   res.sendFile('style/style.css', { root: './' });
});

app.post('/update_post_data', async (req, res) => {

   const data = req.body;
   const webData = data;
   if (webData.action !== undefined && webData.action === 'delete') {
      if (webData.post !== undefined && clean(webData.post)) {
         client.query('DELETE FROM grades WHERE uid= $1', [webData.post]);
         const obj = '{"response": "0"}';

         res.send(obj);
      }
   }

});

//The server return table of grades
app.post('/page_loader', async (req, res) => {
   const data = req.body;
   const webData = data;
   if (webData.info !== undefined && webData.info === 'registerpage') {
      let strToSend = "";
      let res1 = await client.query('SELECT * FROM grades'); // DATABASE CONNECTION ARE IN DIFFERENT THREADS, NEED MANUAL TERAPY
      strToSend += '<table border=\\"1\\"><tr><td>Student name</td><td>Exam 1</td><td>Exam 2</td><td>Exam 3</td><td>Delete</td></tr>';
      for (let i = 0; i < res1.rows.length; i += 1) {
         // Add elments to the students table
         strToSend += '<tr>';
         strToSend = `${strToSend}<td>${res1.rows[i].username}</td><td>${res1.rows[i].exam1}</td><td>${res1.rows[i].exam2}</td><td>${res1.rows[i].exam3}</td><td><input type=\\"button\\" value=\\"Delete\\" onclick=\\"Delete('${res1.rows[i].uid}')\\"></td>`;
         strToSend += '</tr>';
      }
      strToSend += '</table>';
      const obj = `{"response": "${strToSend}"}`;
      res.send(obj);
      
   }
});

app.post('/process_post_req', async (req, res) => {
   try {
      // Get the JSON data from the request
      const data = req.body;
      const webData = data;
      const type = webData.action;

      // If it's a true statement, then we can send the POST request
      // Register
      if (type !== undefined && type === 'process_register' && webData.username !== undefined && webData.exam1 !== undefined && webData.exam2 !== undefined && webData.exam3 !== undefined) {
         const uname = webData.username;
         const exam1 = webData.exam1;
         const exam2 = webData.exam2;
         const exam3 = webData.exam3;
         let tBool = true;

         if (uname.length < 3 || uname.length > 25 || isNaN(parseInt(exam1)) || parseInt(exam1) < 0 || parseInt(exam1) > 100 || isNaN(parseInt(exam2)) || parseInt(exam2) < 0 || parseInt(exam2) > 100 || isNaN(parseInt(exam3)) || parseInt(exam3) < 0 || parseInt(exam3) > 100 || exam1.length >3 || exam2.length >3 || exam3.length >3) {
            tBool = false;
         }
         if (!clean(uname) && !clean(exam1) && !clean(exam2) && !clean(exam3)) {
            tBool = false;
         }
         if (tBool) {
            client.query('INSERT INTO grades (username, exam1, exam2, exam3) values($1, $2, $3, $4)', [uname, exam1, exam2, exam3]);
            const obj = '{"response": "0"}';
            res.send(obj);
         }
      }
   } catch (err) {
      console.error(err);
   }
});

app.listen(port, () => {
   console.log(`Listening on port ${port}`);
});

