var CHANNEL_ACCESS_TOKEN = "";
var sheet_url = "";

var sheet_name = "ชีต1";
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
var line_flexmessage = 'https://api.line.me/v2/bot/message/push';
//test
//test2
//test3

async function doPost(e) {
  var json = JSON.parse(e.postData.contents);


  var reply_token = json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }


  var message = json.events[0].message.text;
  var userId = JSON.parse(e.postData.contents).events[0].source.userId;
  var username = getUsername(userId);

  // var reply_txt = GetReply(message);



  var reply_txt = await new Promise((res) => {
    res(GetReply(message));
  })

  const line2 = reply_txt.line2.length == 0 ? "-": reply_txt.line2; 
  const line3 = reply_txt.line3.length == 0 ? "-": reply_txt.line3; 
  const line4 = reply_txt.line4.length == 0 ? "-": reply_txt.line4; 

  // UrlFetchApp.fetch(line_endpoint, {
  //   'headers': {
  //     'Content-Type': 'application/json; charset=UTF-8',
  //     'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  //   },
  //   'method': 'post',
  //   'payload': JSON.stringify({
  //     'replyToken': reply_token,
  //     'messages': [{
  //       'type': 'text',
  //       'text': message +" "+ reply_txt,
  //     }],

  //   }),
  // });

  UrlFetchApp.fetch(line_flexmessage, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      "to": userId,
      'messages': [
        {
          "type": "flex",
          "altText": "This is a Flex Message",
          "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": message,
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "trans",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": reply_txt.line1,
                          // "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "exp1",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": line2,

                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "exp2",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": line3,

                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "exp3",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": line4,

                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [],
              "flex": 0
            }
          }
        }
      ],

    }),
  });

  return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}


function GetReply(message) {
  var spreadsheet = SpreadsheetApp.openByUrl(sheet_url);
  var sheet = spreadsheet.getSheetByName(sheet_name);
  var lr = sheet.getLastRow();


  var message_col = 1;
  var start_row = 2;
  var reply_col = 2;

  var reply_txt = "";
  for (var i = start_row; i <= lr + 1; i++) {


    if (i == lr + 1) {
      var reply_txt = "ศัพท์คำนี้ฉันยังไม่รู้จักกรุณาไปเพิ่มใน AppSheet"
    }

    var temp_txt = sheet.getRange(i, message_col).getValue();
    Logger.log(temp_txt);
    if (message == temp_txt) {
      // var reply_txt = sheet.getRange(i, reply_col).getValue();
      // var reply0 = sheet.getRange(i, 2).getValue();
      // var reply1 = sheet.getRange(i, 4).getValue();
      // var reply2 = sheet.getRange(i, 5).getValue();
      // var reply3 = sheet.getRange(i, 6).getValue();
      // var reply_txt = `แปลว่า ${reply0} \n ตัวอย่าง1 ${reply1}\n ตัวอย่าง2 ${reply2}\n ตัวอย่าง3 ${reply3}`
      var reply_txt = {
        line1: sheet.getRange(i, 2).getValue(),
        line2: sheet.getRange(i, 4).getValue(),
        line3: sheet.getRange(i, 5).getValue(),
        line4: sheet.getRange(i, 6).getValue(),
      }

      break;
    }

  };

  return reply_txt;
}

function getUsername(userId) {
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var response = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    }
  });
  return JSON.parse(response.getContentText()).displayName;
}
