var express = require('express');
var app = express();


const SSE_RESPONSE_HEADER = {
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no'
};


var events = {};

// SSE starting endpoint
// You can access url `http://localhost:3000/sse/<id>`
//
app.get('/sse/:id', function(req, res) {

  let id = getEventId(req);


  let data;
  events[id] = req;
  res.writeHead(200, SSE_RESPONSE_HEADER);

  let intervalId = setInterval(function() {
    console.log(`*** Interval loop. event id: "${id}"`);
    // Creates sending data:
    data = {"id":"327c9ba5-2e58-475b-93ec-5e4237c6118e","payload":{"cr_name":"simple","namespace":"spaship-examples","CODE":"WEBSITE_CREATE","message":"Website{config=WebsiteConfig{apiVersion='v1', metadata=null, envs={dev=Environment{branch='main', skipContexts=null, deployment=null}, prod=Environment{branch='prod', skipContexts=[/search, /search/api], deployment=DeploymentConfig{replicas='2', init=null, httpd=Container(args=[], command=[], env=[], envFrom=[], image=null, imagePullPolicy=null, lifecycle=null, livenessProbe=null, name=null, ports=[], readinessProbe=null, resources=ResourceRequirements(limits={cpu=500m, memory=250Mi}, requests={cpu=100m, memory=150Mi}, additionalProperties={}), securityContext=null, startupProbe=null, stdin=null, stdinOnce=null, terminationMessagePath=null, terminationMessagePolicy=null, tty=null, volumeDevices=[], volumeMounts=[], workingDir=null, additionalProperties={}), api=null}}}, components=[ComponentConfig{context='/template', kind='git', spec=ComponentSpec{url='https"},"time":"2021-06-30T13:12:26.973934230"};
    if (!data)
      res.write(`:\n\n`);
    else
      res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 3000);


  res.write(`:\n\n`);

  req.on("close", function() {
    let id = getEventId(req);
    console.log(`*** Close. event id: "${id}"`);

    clearInterval(intervalId);

    delete events[id];
  });

  req.on("end", function() {
    let id = getEventId(req);
    console.log(`*** End. event id: "${id}"`);
  });

});

function getEventId(req) {
  return req.params.id;
}

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
