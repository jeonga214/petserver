const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const data={
  select:function(){
    return  JSON.parse(fs.readFileSync('./test.json'));
    //parse는 json에서 여기로 가져올때``빼서가져와야되니까 넣어주는거
  },
  insert:function(newObj){
    const jsonData = data.select();
    let newData= [...jsonData, {id:jsonData.length+1, ...newObj}];
    fs.writeFileSync('./test.json', JSON.stringify(newData) );
    return newData;
  },
  update:function(){},
  delete:function(){}
}

app.get('/abc', function (req, res) {
  res.send(  data.select()  )
});

app.delete('/abc/:id', function (req, res) {
  const jsonData = data.select();
  
  const {id} = req.params;
  const delData = jsonData.filter( n=>n.id != id );

   // 업데이트된 데이터의 id 값을 조정 (선택적)
   for (let i = 0; i < delData.length; i++) {
    if (delData[i].id >= id) {
      delData[i].id--;
    }
  }

  // JSON 파일 업데이트
  fs.writeFileSync('./test.json', JSON.stringify(delData) );
  //stringify는 여기서 json으로 보낼때``넣어서 보내야되니까 넣어주는거
  res.send( delData )
});

app.post('/insert', function (req, res) {
  
  res.send(data.insert(req.body));
});

app.listen(3030)