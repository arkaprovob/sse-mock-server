const { v4: uuidv4 } = require('uuid');
var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

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
app.get('/sse/:id', function (req, res) {

  let id = getEventId(req);


  let data;
  events[id] = req;
  res.writeHead(200, SSE_RESPONSE_HEADER);

  const CODE = ["WEBSITE_CREATE", "WEBSITE_DELETE", "WEBSITE_UPDATE"];
  const namespace = ["one.redhat.com", "access.redhat.com", "activity.redhat.com", "spaship.redhat.com"];
  const cr_name1 = ["SPA 112", "SPA 113", "SPA 114", "SPA 115"];
  const cr_name2 = ["SPA 212", "SPA 213", "SPA 214", "SPA 215"];
  const cr_name3 = ["SPA 312", "SPA 313", "SPA 314", "SPA 315"];
  const cr_name4 = ["SPA 412", "SPA 413", "SPA 414", "SPA 415"];

  let intervalId = setInterval(function () {
    console.log(`*** Interval loop. event id: "${id}"`);

    const codeRandom = getRandom(3);
    const namespaceRandom = getRandom(4);
    const crname = () => {
      if (namespaceRandom == 0) {
        return cr_name1[getRandom(4)];
      }
      if (namespaceRandom == 1) {
        return cr_name2[getRandom(4)];
      }
      if (namespaceRandom == 2) {
        return cr_name3[getRandom(4)];
      }
      if (namespaceRandom == 3) {
        return cr_name4[getRandom(4)];
      }
    }

    // Creates sending data:
    const traceId = uuidv4();
    const cr_name = crname();
    const dateTime = new Date();
    dateTime.setDate(getRandom(30));
    dateTime.setMinutes(dateTime.getMinutes() - getRandom(30));

    data = {
      id: uuidv4(),
      payload: {
        cr_name: cr_name,
        namespace: namespace[namespaceRandom],
        CODE: CODE[codeRandom] + "_STARTED",
        TraceId: traceId,
        message: "Website{config=WebsiteConfig{apiVersion='v1', metadata=null, envs={dev=Environment{branch='main', skipContexts=null, deployment=null}, prod=Environment{branch='prod', skipContexts=[/search, /search/api], deployment=DeploymentConfig{replicas='2', init=null, httpd=Container(args=[], command=[], env=[], envFrom=[], image=null, imagePullPolicy=null, lifecycle=null, livenessProbe=null, name=null, ports=[], readinessProbe=null, resources=ResourceRequirements(limits={cpu=500m, memory=250Mi}, requests={cpu=100m, memory=150Mi}, additionalProperties={}), securityContext=null, startupProbe=null, stdin=null, stdinOnce=null, terminationMessagePath=null, terminationMessagePolicy=null, tty=null, volumeDevices=[], volumeMounts=[], workingDir=null, additionalProperties={}), api=null}}}, components=[ComponentConfig{context='/template', kind='git', spec=ComponentSpec{url='https"
      },
      time: dateTime
    }


    //const payload = JSON.parse(data);
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    dateTime.setMinutes(dateTime.getMinutes() + getRandom(10));

    data = {
      id: uuidv4(),
      payload: {
        cr_name: cr_name,
        namespace: namespace[namespaceRandom],
        CODE: CODE[codeRandom],
        TraceId: traceId,
        message: "Website{config=WebsiteConfig{apiVersion='v1', metadata=null, envs={dev=Environment{branch='main', skipContexts=null, deployment=null}, prod=Environment{branch='prod', skipContexts=[/search, /search/api], deployment=DeploymentConfig{replicas='2', init=null, httpd=Container(args=[], command=[], env=[], envFrom=[], image=null, imagePullPolicy=null, lifecycle=null, livenessProbe=null, name=null, ports=[], readinessProbe=null, resources=ResourceRequirements(limits={cpu=500m, memory=250Mi}, requests={cpu=100m, memory=150Mi}, additionalProperties={}), securityContext=null, startupProbe=null, stdin=null, stdinOnce=null, terminationMessagePath=null, terminationMessagePolicy=null, tty=null, volumeDevices=[], volumeMounts=[], workingDir=null, additionalProperties={}), api=null}}}, components=[ComponentConfig{context='/template', kind='git', spec=ComponentSpec{url='https"
      },
      time: dateTime
    }

    res.write(`data: ${JSON.stringify(data)}\n\n`);

  }, 50);

  req.on("close", function () {
    let id = getEventId(req);
    console.log(`*** Close. event id: "${id}"`);

    clearInterval(intervalId);

    delete events[id];
  });

  req.on("end", function () {
    let id = getEventId(req);
    console.log(`*** End. event id: "${id}"`);
  });

});

function getEventId(req) {
  return req.params.id;
}

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});


function getRandom(max) {
  return Math.floor(Math.random() * max);
}
