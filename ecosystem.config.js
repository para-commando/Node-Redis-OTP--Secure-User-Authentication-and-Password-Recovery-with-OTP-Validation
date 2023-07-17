module.exports = {
  apps : [{
    name   : "app1",
    script : "./API-Gateway/src/Microservice-Routers/microserviceRouters.js",
    watch: true,
      ignore_watch: ['node_modules'],
      instances: 1,
      exec_mode: 'cluster',
  }]
}
