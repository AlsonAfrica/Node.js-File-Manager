
const fs = require('fs')
const { error } = require('console')
const path = require('path');

const jsonData ={
    name: 'Alson',
    age: 24,
    job:"CEO"
};

// New Data
const newData = {
    age: 25,   // Updating age
    job: 'CTO' // Updating job
  };

fs.mkdir("newDirectory",{recursive:true}, (error)=>{
    if(error){
        return console.error('Error creating directory', err);
    } else
    console.log("Directory was created successfully!");


const filePath = path.join('newDirectory', "data.json");

fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
      return console.error('Error writing JSON file:', err);
    }
    console.log('JSON file created and written successfully!');

    fs.readFile (filePath, 'utf-8', (err,data)=>{
        if (err){
            return console.error("Error reading JSON file", err)
        }
        try {
            const parsedData = JSON.parse(data);
            console.log ('Parsed JSON data:', parsedData)

            const updatedData = { ...parsedData, ...newData}

            fs.writeFile (filePath, JSON.stringify (updatedData, null,2), 'utf8', (writeErr)=>{
                if (writeErr){
                    return console.error("Error writing updated JSON file", writeErr);
                } else
                console.log("JSON file updated successfully with new data:", updatedData)
            });
        } 
        
        catch (parseError){
            console.error("Error parsing JSON:", parseError)
        }
    });
  });
});

