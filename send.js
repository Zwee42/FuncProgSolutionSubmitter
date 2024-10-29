const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const zipper = require('zip-local');

const host ='cscx.org';

//Enter login
const userName = 'user' 
const pwd = "pass"

if (process.argv.length < 2) {
    console.log("enter problem name")
    return;
}

const problem = process.argv[2];
var fileName = ""; 
var extension = "";

const allowedExtensions = ["c", "hs"]; 

if(fs.existsSync(problem+"/")){
  zipper.sync.zip("./"+problem+"/").compress().save(problem+".zip");
  fileName = problem+".zip";
  console.log("Submitted a zip!")
}

for(var i = 0; i < allowedExtensions.length; i++){
  if(fs.existsSync(problem+"."+allowedExtensions[i])){
    fileName = problem+"."+allowedExtensions[i];
    extension = allowedExtensions[i];
    console.log("Found a "+allowedExtensions[i]+" source file!")
  }
}

if(fileName == ""){
  console.log("Failed to find file to submit");
  return;
}

const formData = new FormData();
formData.append('user', userName);
formData.append('password', pwd);
formData.append('program', fs.createReadStream(fileName));
formData.append('problem', problem);
formData.append('language', extension);
formData.append('submit', 'Submit');

const headers = {
  'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  'Host': host,
  'Cache-Control': 'max-age=0',
};

const url = `https://${host}/submit`;
axios.post(url, formData, { headers })
  .then(response => {
    if(response.data.includes('Submission successful')){
      console.log("Successfully submitted!")
    }
    else{
      console.log('Response:', response.data);
    }

})
  .catch(error => {
    console.error('Error:', error);

});
