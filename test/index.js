const test = require('tape')
const alexaStats = require('../')

test('alexaStats', t => {
  t.plan(19)

  const domain = 'github.com'

  alexaStats(domain)
  .then(data => {
    console.log(data)
    t.ok(data.domain, domain)
    t.ok(data.country)
    t.ok(data.countryFlag)
    t.ok(data.globalRank)
    t.ok(data.globalRankChange)
    t.ok(data.countryRank)
    t.ok(data.bounceRate)
    t.ok(data.bounceRateChange)
    t.ok(data.dailyPageViewsPerVisitor)
    t.ok(data.dailyPageViewsPerVisitorChange)
    t.ok(data.dailyTimeOnSite)
    t.ok(data.dailyTimeOnSiteChange)
    t.ok(data.searchVisits)
    t.ok(data.searchVisitsChange)
    t.ok(data.totalSitesLinkingIn)
    t.ok(data.loadSpeed)
    t.ok(data.categories)
    t.ok(data.upstreamSites)
    t.ok(data.downstreamSites)
  })
  .catch(error => {
    console.error(error)
  })
})
