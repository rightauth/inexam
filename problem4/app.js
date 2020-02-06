const express = require('express');
const axios = require('axios');
const app = express();



// Problem 4.1
app.all('/',function(req,res,next){
    axios.get('https://theinternship.io/')
    .then((response) => {
        if(response.status === 200) {
            html = response.data;
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            let output = "";
            get_from_string(html,false).map((value)=> output+=value+'\n')
            res.send(output);
        }
    }, (error) => console.log(err) );
});



// Problem 4.2
app.get('/companies',function(req,res,next){
    //use axios get html source code
    axios.get('https://theinternship.io/')
    .then((response) => {
        if(response.status === 200) {
            html = response.data;
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*"); 
            res.send(get_from_string(html,true));
        }
    }, (error) => console.log(err) );
});




function get_from_string(body,beString){
    const target_word = "company/";
    let index_target_word = 0;
    let current_word = "";
    let ready_output = "",output=[];
    for(let element of body){
        if(current_word == target_word){
            if(element=='"'){
                output.push(target_word+ready_output);
                current_word=ready_output="";
                index_target_word = 0;
            }else{
                ready_output+=element;
            }
        }else{
            if(element == target_word[index_target_word]){
                index_target_word++;
                current_word+=element;
            }else{
                current_word="";
                index_target_word=0
            }
        }
    }
    if(beString) return array_toString(output); 
    else return output;
}

function array_toString(output){
    output = output.map((value) => 'https://theinternship.io/'+value);
    // convert to string json
    current_word='{ "companies" : [';
    for(let i=0;i<output.length;i++){
        current_word+='{ "logo": "'+output[i]+'"}'+(i<output.length-1?",":"");
    }
    current_word+="]}"
    return current_word;
}

app.all('*',function(req,res,next){
    res.status(404).send("<h1>Please Use (http://localhost/) to use Problem 4.1</h1>\n<h1>Please Use (http://localhost/companies) to use Problem 4.2</h1>");
});

app.listen(3000, 'localhost');