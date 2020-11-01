
      let CLIENT_ID = '766289214073-tg4kbrjsvhtk2jsmamd27s0640ggln1p.apps.googleusercontent.com';
      let API_KEY = 'AIzaSyCgAbjlBlGbLpnX7nj8uJriBnlQbW7BGxg';

      // Array of API discovery doc URLs for APIs used by the quickstart
      let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

    
      let SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
      

      let authorizeButton = document.getElementById('authorize_button');
      let signoutButton = document.getElementById('signout_button');
      let container = document.getElementById("inboxDiv")
      let containerParent = container.parentNode.nodeName; // This is the parent  of container
    console.log(containerParent)
    
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }


      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        }, function(error) {
          alert(JSON.stringify(error, null, 2));
        });
      }

     
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          container.style.display = "inline-block"

          listLabels();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
          container.style.display = "none"
          
         
          

        }
      }
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

     
      const mails = [];


      async function listLabels() {
          
      
         mailBox();
          let responseA = await gapi.client.gmail.users.messages.list({
              'userId': 'me',
              'labelIds': 'INBOX',
              'maxResults': 20
          })
          for(let i=0;i<responseA.result.messages.length;i++){
              let responseB = await gapi.client.gmail.users.messages.get({
                  'userId': 'me',
                  'id' : responseA.result.messages[i].id
              })
              console.log(responseB )
              mails.push(responseB.result);
              }
          addEmails();
          }
        
      
      function mailBox(){
      
      let heading = document.createElement('div');
      heading.setAttribute('class','row');
      
      
      let hello = document.createElement('p');
    
      hello.setAttribute('id','helloP');
      hello.innerHTML = 'Hello, ';
      
      heading.append(hello);
      container.append(heading);
      document.body.append(container);
      
      let mailBoxDiv = document.createElement('div');
      mailBoxDiv.setAttribute('class','col-12 mt-2');
      
      //To design the mail box table
      let inboxTable = document.createElement('table');
      //inboxTable.setAttribute('class','table');
      inboxTable.classList.add("table", "table-dark","table-hover")
      
      let tableHead = document.createElement('thead');
      tableHead.setAttribute('class','thead-light');
      
      let tableRow1 = document.createElement('tr');
      let headVal1 = document.createElement('th');
      headVal1.setAttribute('scope','col');
      headVal1.innerHTML = '#';
      let headVal2 = document.createElement('th');
      headVal2.setAttribute('scope','col');
      headVal2.innerHTML = 'From';
      let headVal3 = document.createElement('th');
      headVal3.setAttribute('scope','col');
      headVal3.innerHTML = 'Subject';
      let headVal4 = document.createElement('th');
      headVal4.setAttribute('scope','col');
      headVal4.innerHTML = 'Date';
      
      let tableBody = document.createElement('tbody');
      tableBody.setAttribute('id','tableBody')
      
      
      tableRow1.append(headVal1,headVal2,headVal3,headVal4);
      tableHead.append(tableRow1);
      
      console.log(mails);
      
      inboxTable.append(tableHead,tableBody);
      mailBoxDiv.append(inboxTable);
      
     
      container.append(mailBoxDiv);
      
      }
      
    
      function addEmails(){
      
      let state = {
          'querySet' : mails,
          'page' : 1,
          'rows' : 20
      }
      
      buildTable();
      
      function pagination(querySet,page,rows){
          let trimStart = (page - 1) * rows;
          let trimEnd = trimStart + rows;
      
          let trimmedData = querySet.slice(trimStart,trimEnd);
      
          let pages = Math.ceil(querySet.length / rows);
          
          return {
              'querySet' : trimmedData,
              'pages' : pages
          }
      }
      
      function clickA(currentPage) {
          document.getElementById('tableBody').innerHTML = '';
          state.page = currentPage;
          buildTable();
      }
      
      function pageButtons(pages){
          let container1 = document.createElement('div');
          container1.setAttribute('class','container');
      
          container1.innerHTML = '';
      
          for(let page=1;page<= pages;page++){
              container1.innerHTML += `<button value=${page} onclick="clickA(${page})" class="btn btn-sm btn-info">${page}</button>`
          }
          document.body.append(container1);
      }
      
      function buildTable(){
      
          document.getElementById('tableBody').innerHTML = '';
          let me = getHeader(mails[0].payload.headers, 'To');
          document.getElementById('helloP').innerHTML = 'Hello, ' + me;
      
          let data = pagination(state.querySet,state.page,state.rows);
      
          for(let i=0;i<data.querySet.length;i++){
      
              let rank = (state.page - 1) * state.rows + i + 1;
              let from = getHeader(data.querySet[i].payload.headers, 'From');
              let fromMail = getHeader(data.querySet[i].payload.headers,"Return-Path")
              console.log(fromMail)
              let subject = getHeader(data.querySet[i].payload.headers, 'Subject');
              let date = getHeader(data.querySet[i].payload.headers, 'Date').substring(5,16);

                
      
      
              //To populate the emails.
              let tableRowA = document.createElement('tr');
              tableRowA.setAttribute('class','tableRow');
              let rowValA = document.createElement('th');
              rowValA.setAttribute('scope','row');
              rowValA.innerHTML = rank;
              let rowValB = document.createElement('td');
              rowValB.innerHTML = from;
              let rowValC = document.createElement('td');
              rowValC.innerHTML = subject;
              let rowValD = document.createElement('td');
              rowValD.innerHTML = date;
      
              tableRowA.append(rowValA,rowValB,rowValC,rowValD);
              document.getElementById('tableBody').append(tableRowA);
          }
          
      }
      
      }
      
      function getHeader(headers, index) {
      var value = '';
      
      for(let i=0;i<headers.length;i++){
          if(headers[i].name === index){
          value = headers[i].value;
          }
      }
      return value;
      }
      
      
        
        
