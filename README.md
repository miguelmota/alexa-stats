# alexa-stats

> Scrapes [Alexa](http://www.alexa.com/) site to get traffic statistics and analytics for domain.

## Install

```bash
npm install alexa-stats
```

## Usage

```node.js
const alexaStats = require('alexa-stats')

const domain = 'github.com'

alexaStats(domain)
.then(data => {
  console.log(data)

  /*
  {
    domain: 'github.com',
    country: 'United States',
    countryFlag: 'http://pcache.alexa.com/images/flags/us.968591e0050981be9fa94bd2597afb48.png',
    globalRank: '58',
    globalRankChange: '4',
    countryRank: '46',
    bounceRate: '44.00%',
    bounceRateChange: '3.00%',
    dailyPageViewsPerVisitor: '5.24',
    dailyPageViewsPerVisitorChange: '3.50%',
    dailyTimeOnSite: '6:19',
    dailyTimeOnSiteChange: '3.00%',
    searchVisits: '32.70%',
    searchVisitsChange: '36.00%',
    totalSitesLinkingIn: '79,903',
    loadSpeed: '1.675 Seconds',
    categories:
     [ 'Computers > Software > Configuration Management > Tools > Git',
       'Computers > Open Source > Project Hosting' ],
    upstreamSites:
     [ 'google.com 11.7%',
       'stackoverflow.com 3.7%',
       'google.co.in 2.8%',
       'github.io 2.4%',
       'youtube.com 2.2%' ],
    downstreamSites: []
  }
  */
})
.catch(error => {
  console.error(error)
})
```

## Test

```bash
npm test
```

NOTE: This module will most likely break in the future when Alexa updates their DOM selectors.

## License

MIT
