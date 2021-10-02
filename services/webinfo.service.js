
const got = require('got');
const jsdom = require("jsdom");

function isInternalResource(link) {
    return link == "" || link.startsWith("/")
}

function isHttps(link) {
    return link.startsWith("https://", 0);
}

var externalPattern = /^http(s|):/

//Vrati tuple (bool, bool) kao (isInternal, isHttps)
linkType = function(link, hostIsHttps) {

    if(externalPattern.test(link)) {
        return [false, link[4] == 's'];
    }
    return [true, hostIsHttps];
}

// Problemi su sto ne pratim redirect (301) i sto ne pratim resurse resursa...
//      i sto nemam error handling.
exports.fetchWebsiteInfo = async (fqdn) => {

    // First try https protocol...
    url = "https://" + fqdn;

    console.log("Idem na: " + url)
    var response = null;
    hostIsHTTPS = true;
    try {
        response = await got(url);
    } catch(e) { //if it doesn't work, try http
        url = "http://" + fqdn;
        try {
            response = await got(url);
            hostIsHTTPS = false;
        } catch(e2) { //TODO error handling
            return;
        }
    }

    // Parse DOM
    const dom = new jsdom.JSDOM(response.body);

    title = dom.window.document.title;

    descrSelector = dom.window.document.querySelector('meta[name="description"]')
    var description = "";
    if (descrSelector != null) {
        description = descrSelector.content;
    }

    //calculating statistics
    secureResNum = 0 //number of https resources
    internalResNum = 0 //number of internal resources

    queried_links = Array.from(dom.window.document.querySelectorAll('a')).map(a => a.href)

    for (let link of queried_links) {
        [isInternal, isHttps] = linkType(link, hostIsHTTPS);
        internalResNum += isInternal;
        secureResNum += isHttps
    }

    queried_scripts = Array.from(dom.window.document.querySelectorAll('script')).map(s => s.src)
    
    for (let link of queried_scripts) {
        [isInternal, isHttps] = linkType(link, hostIsHTTPS);
        internalResNum += isInternal;
        secureResNum += isHttps
    }

    totalResNum = queried_links.length + queried_scripts.length

    console.log(title)
    console.log(description)
    console.log(internalResNum)
    console.log(secureResNum)
    console.log(totalResNum)
    
    return {
        title: title,
        description: description,
        internal_res: internalResNum,
        secured_res: secureResNum,
        total_res: totalResNum
    }
    //dom.window.document.querySelectorAll('a').forEach(t => console.log(t.href))
    // console.log(dom);
}