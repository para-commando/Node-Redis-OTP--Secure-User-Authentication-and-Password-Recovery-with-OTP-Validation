const Ddos = require('ddos');
// note that this is IP specific and not app specific middleware protection
module.exports.ddosMiddleware =  new Ddos({
  // Specifies the maximum number of requests allowed to burst above the limit before blocking begins. In this example, it's set to 10, meaning if the request rate exceeds the limit suddenly by 10 requests, it will trigger the DDoS protection.
  burst: 10,
  // Defines the maximum number of requests per second allowed from a single IP address. In this case, it's set to 15, so if an IP address sends more than 15 requests per second, it will trigger the DDoS protection
  limit: 15,
  // Sets the maximum number of requests allowed from a single IP address within the specified checkInterval. If an IP address exceeds this count, the DDoS protection will be triggered. Here, it's configured as 20 requests per checkInterval (defined next)
  maxcount: 20,
  // A boolean indicating whether the DDoS protection starts in silent mode (logging requests but not blocking) when triggered. Here, it's set to true, so the protection will initially be in silent mode
  silentStart: true,
//   When the number of requests from a particular IP address exceeds the defined thresholds (burst, limit, maxcount), the DDoS protection is triggered.

// Initially, the DDoS protection enters silent mode, meaning it continues to log the requests but does not block them.

// During the silent mode, if the number of requests from the IP address decreases and stays within the defined thresholds, the DDoS protection remains in silent mode.

// However, if the number of requests from the IP address continues to exceed the thresholds, the DDoS protection moves out of silent mode and starts actively blocking the requests.

// Once the DDoS protection has entered silent mode, it remains in that state for the duration specified by silentDuration (30 seconds in this example).

// After the silent duration has elapsed, if the number of requests from the IP address still exceeds the thresholds, the DDoS protection will actively block the requests.

// The purpose of the silentDuration option is to allow you to observe traffic patterns during a period of suspected DDoS activity without immediately blocking legitimate requests. It gives you a chance to monitor the situation and collect information before taking action.
  silentDuration: 30,
  errorData: {
    message: 'Too many requests from your IP. Please try again later.',
    status: 429,
  },
//   Specifies the interval in milliseconds at which the request counters are reset. It defines the time window within which the maximum number of requests (maxcount) is checked. Here, it's set to 1000 milliseconds (1 second).
  checkInterval: 1000,
  // The number of seconds to keep an IP's request count. After this time, the request count for an IP will be cleared. This helps to avoid indefinitely storing IP records
  maxexpiry: 300,

  trustProxy: true,
});
