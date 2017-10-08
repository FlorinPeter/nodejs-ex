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

## cleanup 
```
$ oc delete bc,dc,route,is -l app=server
$ oc delete bc,dc,is -l app=client
```
