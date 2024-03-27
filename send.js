const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const zipper = require('zip-local');

const host ='cscx.org';
const submitURL = 'https://cscx.org/submit';

//Enter login
const userName = 'usr' 
const pwd = "pass"

if (process.argv.length < 2) {
    console.log("enter problem name")
    return;
}

const problem = process.argv[2];
var fileName = ""; 

if(fs.existsSync(problem+"/")){
  zipper.sync.zip("./"+problem+"/").compress().save(problem+".zip");
  fileName = problem+".zip";
  console.log("Submitted a zip!")
}
else if(fs.existsSync(problem+".c")){
  fileName = problem+".c";
  console.log("Submitted a C source file!")
}else{

  console.log("Failed to find file to submit");
  return;
}

const formData = new FormData();
formData.append('user', userName);
formData.append('password', pwd);
formData.append('program', fs.createReadStream(fileName));
formData.append('problem', problem);
formData.append('language', 'c');
formData.append('submit', 'Submit');

const headers = {
  'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  'Host': host,
  'Cache-Control': 'max-age=0',
};


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

