const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const data = {
  select: function () {
    return JSON.parse(fs.readFileSync('./test.json'));
  },
  insert: function (newObj) {
    const jsonData = data.select();
    let newData = [...jsonData, { id: jsonData.length + 1, ...newObj }];
    fs.writeFileSync('./test.json', JSON.stringify(newData));
    return newData;
  },
  update: function () { },
  delete: function () { }
}

app.get('/abc', function (req, res) {
  res.send(data.select());
});

app.delete('/abc/:id', function (req, res) {
  const jsonData = data.select();
  const { id } = req.params;

  // 삭제할 항목을 찾음
  const indexToDelete = jsonData.findIndex(item => item.id == id);

  if (indexToDelete === -1) {
    // 삭제할 항목이 없으면 오류 응답을 보냄
    return res.status(404).json({ error: 'Item not found' });
  }

  // 삭제할 항목을 배열에서 제거
  jsonData.splice(indexToDelete, 1);

  if (jsonData.length === 0) {
    // 남은 항목이 1개일 경우, 빈 배열을 반환하고 JSON 파일 초기화
    fs.writeFileSync('./test.json', JSON.stringify([]));
    return res.json([]);
  }

  // ID 값을 재조정
  for (let i = indexToDelete; i < jsonData.length; i++) {
    jsonData[i].id--;
  }

  // JSON 파일 업데이트
  fs.writeFileSync('./test.json', JSON.stringify(jsonData));

  // 클라이언트로 업데이트된 데이터를 응답
  res.json(jsonData);
});

app.post('/insert', function (req, res) {
  res.send(data.insert(req.body));
});

app.listen(3030)
