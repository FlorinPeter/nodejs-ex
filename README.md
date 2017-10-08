# nodejs-websocket-test
This project allows to create a simple echo service on openshift for testing websockets.

##  create openshift project
```
$ oc new-project ws-test
```

## create websocket server
```
$ oc new-app nodejs:4~https://github.com/FlorinPeter/nodejs-websocket-test.git --name=server
```

## expose the server
```
$ oc expose service server
```

## get the route 
```
$ oc get route server
NAME        HOST/PORT                          PATH      SERVICES    PORT       TERMINATION
server   server-ws-test.domain.tld             server   8080-tcp
```

## create 100 websocket clients for the server url ws://server-ws-test.domain.tld
```
$ oc new-app nodejs:4~https://github.com/FlorinPeter/nodejs-websocket-test.git \
--name=client \
-e NPM_RUN=dev \
-e TEST_URL=ws://server-ws-test.domain.tld \
-e CLIENT_COUNT=100
```

## check logs
```
$ oc get pods -l app=client
NAME             READY     STATUS    RESTARTS   AGE
client-1-lxs4o   1/1       Running   0          2m

$ oc logs client-1-lxs4o
start 0 websocket client
start 1 websocket client
start 2 websocket client
...
WebSocket client started 98
WebSocket client started 99
WebSocket client connected 98
WebSocket client connected 99
```

## enable show echo messages 
```
$ oc env dc/client SHOW_MESSAGES=true
```
log output should be something like:
```
Received: '{"sns_id":1507468562298,"data":{"x":34,"y":80}}'
Received: '{"sns_id":1507468561429,"data":{"x":99,"y":84}}'
Received: '{"sns_id":1507468561456,"data":{"x":10,"y":62}}'
Received: '{"sns_id":1507468561450,"data":{"x":60,"y":12}}'
```

## cleanup 
```
$ oc delete bc,dc,route,is,svc -l app=server
$ oc delete bc,dc,is,svc -l app=client
```
