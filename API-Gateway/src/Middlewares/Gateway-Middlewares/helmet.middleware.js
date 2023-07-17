const helmet = require('helmet');

module.exports.helmetMiddleware = helmet({

    cors: {
      // The origin directive specifies the origins that are allowed to make requests to the server. In this case, the directive is set to *, which means that any origin is allowed to make requests to the server.
    //   origin: ["*"],
      // The methods directive specifies the methods that are allowed for cross-origin requests. In this case, the directive is set to GET, POST, PUT, and DELETE, which means that these methods are allowed for cross-origin requests.
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
    // The xssFilter option uses the X-XSS-Protection header to block XSS attacks. This header tells the browser to block any attempts to inject malicious code into the page. XSS attacks are a type of security vulnerability that can be used to inject malicious code into a web page. This malicious code can then be executed by the victim's browser, which can lead to a variety of problems, such as stealing the victim's personal information or taking control of their computer
    xssFilter: true,
    // The nosniff property is used to mitigate MIME type sniffing attacks. MIME type sniffing is a technique that can be used to trick a browser into loading a resource as a different type than it actually is. This can be used to exploit vulnerabilities in browsers or to deliver malicious content to users.
    nosniff: true,
    // used to configure the HTTP Strict Transport Security (HSTS) header. HSTS is a security header that tells browsers to only connect to your website over HTTPS. This can help to protect your website from man-in-the-middle attacks.
  
  // The maxAge property specifies the amount of time (in seconds) that the browser should remember the HSTS header. The default value is 31536000 seconds (one year).
  
  // The includeSubDomains property specifies whether the HSTS header should apply to subdomains of your website. The default value is false.
  
  // Setting maxAge to a high value and includeSubDomains to true is a good security practice that can help to protect your website from man-in-the-middle attacks.
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
    },
    contentSecurityPolicy: {
      // This directive specifies the default source for loading resources (such as scripts, stylesheets, images) when no other directive explicitly specifies a source. In this case, 'self' allows resources to be loaded from the same domain (the server itself), and 'https:' allows loading resources from any HTTPS source.
      defaultSrc: ["'self'", 'https:'],
      // This directive specifies the valid sources for making network requests or connections. 'self' allows requests to be made to the same domain (the server itself), and 'https:' allows requests to be made to any HTTPS source.
      connectSrc: ["'self'", 'https:'],
      // This directive enables the browser to automatically upgrade HTTP requests to HTTPS. It instructs the browser to replace any insecure (HTTP) requests with secure (HTTPS) requests.
      upgradeInsecureRequests: true,
      // This directive configures the X-Frame-Options header, which helps prevent clickjacking attacks by specifying whether a page can be displayed within an iframe. In this case, the disable option is set to true, disabling the X-Frame-Options header.
      frameGuard: {
        disable: true,
      },
      // default-src: This directive sets the default source for loading resources if no other directive explicitly specifies a source. In this case, 'self' allows resources to be loaded from the same domain (the server itself), and 'https:' allows loading resources from any HTTPS source.
  
      // img-src: This directive specifies valid sources for loading images. In this example, * allows loading images from any source, and data: allows inline data URIs for images.
  
      //  style-src: This directive specifies valid sources for loading stylesheets. 'self' allows loading stylesheets from the same domain (the server itself), 'https:' allows loading stylesheets from any HTTPS source, and 'unsafe-inline' allows inline styles to be applied.
  
      // script-src: This directive specifies valid sources for loading scripts. 'self' allows loading scripts from the same domain (the server itself), 'https:' allows loading scripts from any HTTPS source, 'unsafe-inline' allows inline scripts to be executed, and 'unsafe-eval' allows the use of eval() and similar dynamic code execution.
  
      // font-src: This directive specifies valid sources for loading fonts. 'self' allows loading fonts from the same domain (the server itself), 'https:' allows loading fonts from any HTTPS source, and data: allows inline data URIs for fonts.
  
  
      policy: "default-src 'self' https:; img-src * data:; style-src 'self' https: 'unsafe-inline'; script-src 'self' https: 'unsafe-inline' 'unsafe-eval'; font-src 'self' https: data:;",
    },
    //crossOriginEmbedderPolicy property in the Helmet middleware code is used to configure the Cross-Origin Embedder Policy (COEP) header. COEP is a security header that can help to prevent cross-site scripting (XSS) attacks.
  
  // The policy property specifies the policy that should be used for COEP. The value of require-corp means that iframes from other origins can only be embedded in your website if they are loaded over HTTPS and if they have a valid Content-Security-Policy header.
  
  // Setting the policy property to require-corp is a good security practice that can help to protect your website from XSS attacks.
  
  
    crossOriginEmbedderPolicy: {
      policy: "require-corp",
    },
  //   The crossOriginOpenerPolicy header is used to control the behavior of the window or browsing context when navigating across different origins. The same-origin value of the policy property specifies that the browsing context should only be allowed to navigate to URLs that have the same origin as the current page. This helps protect against certain types of attacks, such as cross-origin phishing and cross-site tab-nabbing.
  
  // In brief, the crossOriginOpenerPolicy header helps to isolate browsing contexts between different origins, which can help to prevent potential cross-origin attacks.
    crossOriginOpenerPolicy: {
      policy: "same-origin",
    },
   // The crossOriginResourcePolicy option in Helmet is used to control how resources from your site can be loaded cross-origin. The policy property can be set to one of the following values:
      // same-origin: This is the default value. It prevents resources from being loaded from other origins.
      // same-origin-allow-opener: This allows resources to be loaded from other origins, but only if they are opened by your site.
      // unsafe-inline: This allows resources to be loaded from any origin, even if they are not opened by your site. This is very insecure and should not be used.
      // none: This disables the Cross-Origin Resource Policy header.
      crossOriginResourcePolicy: {
        // To load resources from other origins in this case, you would need to set the crossOriginResourcePolicy option to same-origin-allow-opener. This would allow resources from other origins to be loaded, but only if they are opened by your site.
        policy: 'same-origin',
      },
      // The originAgentCluster option in Helmet is used to control how process isolation is handled in your application. When this option is set to true, it tells the browser to isolate each request based on the origin and user agent of the request. This helps to protect your application from cross-site request forgery (CSRF) attacks.
  
      //CSRF attacks are a type of attack where an attacker tricks a user into making a malicious request to your application. This can be done by embedding a malicious link in an email or social media post. When the user clicks on the link, it will make a request to your application with the user's credentials. If the request is not properly protected, the attacker can then use the user's credentials to make unauthorized changes to the user's account.
  
      // Setting the originAgentCluster option to true helps to protect your application from CSRF attacks by isolating each request based on the origin and user agent of the request. This means that even if the user clicks on a malicious link, the request will only be able to access resources from the same origin as the link. This prevents the attacker from using the user's credentials to make unauthorized changes to the user's account.
      originAgentCluster: true,
      // If you do not set the referrerPolicy header, the Referrer header will be set to the URL of the page that the user was on before they came to your site. The Referrer header can store up to 5 previous URLs, but the actual number of URLs that are stored can vary depending on the browser and the operating system. For example, Chrome stores up to 5 previous URLs, while Firefox stores up to 3 previous URLs. example case If a user visited 2 sites where the Referrer Policy was not set, the 2 URLs will be stored in the Referrer header. When the user visits your website where the Referrer Policy is set to no-referrer, the Referrer header will not be set at all. This means that the 2 URLs that were stored in the Referrer header will be discarded.
  
  
      referrerPolicy: 'no-referrer',
      // If you set the xContentTypeOptions header to true, the browser will not be able to MIME sniff files. This means that the browser will not be able to guess the MIME type of a file based on its filename or extension. Instead, the browser will need to rely on the MIME type that is set in the Content-Type header. If a malicious user tries to send a file with a malicious MIME type to the / route, the browser will not be able to render the file. This will help to protect your site from malicious files.
      xContentTypeOptions: true,
      // The helmet.dnsPrefetchControl() middleware sets the X-DNS-Prefetch-Control header on your HTTP responses. This header controls DNS prefetching, which is a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth.
  
      // This functionhe 'off' option for helmet.dnsPrefetchControl() tells the browser to disable DNS prefetching. This can improve user privacy, as it prevents the browser from sending DNS queries for domains that the user may not actually visit. However, it can also slightly decrease performance, as the browser will have to resolve DNS queries when the user actually clicks on a link.
      // the browser guesses the domain/link the user might click on next based on either user's browsing history or on the current site the user is in.
      xDnsPrefetchControl: 'off',
      // The helmet.xDownloadOptions() middleware sets the X-Download-Options header on your HTTP responses. This header controls how browsers handle downloads. The 'noopen' option for helmet.xDownloadOptions() tells the browser to not open downloaded files in the browser window. Instead, the user will be prompted to save the file to their computer.This can help to protect users from malicious downloads, as it prevents them from being tricked into running malicious code.
  
      // example: Suppose your app allows users to download files. A malicious user could upload a malicious file to your app, and then trick a user into downloading the file. If the user's browser opens the file in the browser window, the malicious code could be executed. However, if the user's browser is configured to honor the X-Download-Options: noopen header, the file will not be opened in the browser window. Instead, the user will be prompted to save the file to their computer. This will prevent the malicious code from being executed.
      xDownloadOptions: 'noopen',
      //     The helmet.xFrameOptions() middleware sets the X-Frame-Options header on your HTTP responses. This header controls whether or not a browser can be embedded in an iframe. The 'deny' option for helmet.xFrameOptions() tells the browser to not embed your app in an iframe.
  
      // This can help to protect your app from clickjacking attacks, which are a type of attack where a malicious website tricks a user into clicking on a link that they think is from your app, but is actually from the malicious website.
  
      // For example, suppose you have a website that allows users to login to their accounts. A malicious website could embed your website in an iframe on their website. They could then make the iframe look like a login page for a different website, such as a bank or a social media platform. If a user clicks on the login button on the iframe, they will actually be logging into the malicious website.
  
      // The X-Frame-Options header can help to protect your app from clickjacking attacks by telling the browser to not embed your app in an iframe. This will prevent a malicious website from embedding your app in an iframe and tricking users into clicking on malicious links.
  
  
      xFrameOptions: 'deny',
  //     By setting the X-Permitted-Cross-Domain-Policies header to none, you are effectively disabling cross-domain policies. This means that no content from your website will be able to interact with content from other websites. This can be a good security measure, as it can help to prevent cross-site scripting (XSS) attacks and other attacks that exploit cross-domain vulnerabilities.
  
  // However, there are some drawbacks to setting the X-Permitted-Cross-Domain-Policies header to none. For example, it will prevent your website from being embedded in other websites. If you want to allow your website to be embedded in other websites, then you will need to use a different value for the header.
  
  // Ultimately, the decision of whether or not to set the X-Permitted-Cross-Domain-Policies header to none is a trade-off between security and functionality. If you are concerned about security, then setting the header to none is a good option. However, if you need your website to be embedded in other websites, then you will need to use a different value for the header.
      xPermittedCrossDomainPolicies: 'none',
    })