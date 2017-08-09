const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

function alexaStats (domain) {
  return new Promise((resolve, reject) => {
    request({
      url: `http://www.alexa.com/siteinfo/${domain}`,
      headers: {
        Host: 'www.alexa.com',
        Referer: `http://www.alexa.com/siteinfo/${domain}`,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Pragma: 'no-cache',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.8,es;q=0.6'
      }
    }, (error, response, body) => {
      if (error) {
        return reject(error)
      }

      const data = {
        domain: domain,
        country: '',
        countryFlag: '',
        globalRank: '',
        globalRankChange: '',
        countryRank: '',
        bounceRate: '',
        bounceRateChange: '',
        dailyPageViewsPerVisitor: '',
        dailyPageViewsPerVisitorChange: '',
        dailyTimeOnSite: '',
        dailyTimeOnSiteChange: '',
        searchVisits: '',
        searchVisitsChange: '',
        totalSitesLinkingIn: '',
        loadSpeed: '',
        categories: [],
        upstreamSites: [],
        downstreamSites: []
      }

      if (!body) {
        return resolve(data)
      }

      const $ = cheerio.load(body)

      data.globalRank = $('[data-cat="globalRank"] .metrics-data').text().trim()
      data.globalRankChange = $('[data-cat="globalRank"] .change-wrapper').text().trim()
      data.country = $('[data-cat="countryRank"] .metrics-title a').text().trim()
      data.countryRank = $('[data-cat="countryRank"] .metrics-data').text().trim()
      data.countryFlag = ($('[data-cat="countryRank"] .img-inline').attr('src')||'').trim()
      data.bounceRate = $('[data-cat="bounce_percent"] .metrics-data').text().trim()
      data.bounceRateChange = $('[data-cat="bounce_percent"] .change-wrapper').text().trim()
      data.dailyPageViewsPerVisitor = $('[data-cat="pageviews_per_visitor"] .metrics-data').text().trim()
      data.dailyPageViewsPerVisitorChange = $('[data-cat="pageviews_per_visitor"] .change-wrapper').text().trim()
      data.dailyTimeOnSite = $('[data-cat="time_on_site"] .metrics-data').text().trim()
      data.dailyTimeOnSiteChange = $('[data-cat="time_on_site"] .change-wrapper').text().trim()
      data.searchVisits = $('[data-cat="search_percent"] .metrics-data').text().trim()
      data.searchVisitsChange = $('[data-cat="search_percent"] .change-wrapper').text().trim()
      data.totalSitesLinkingIn = $('#linksin-panel-content .box1-r').text().trim()
      data.loadSpeed = $('#loadspeed-panel-content').text().trim().replace(/.*\(/gi, '').replace(/\).*/gi, '')

      $('#category_link_table tbody tr').each((i, x) => {
        data.categories.push($(x).text().trim().replace('&gt;', '>'))
      })

      $('#keywords_upstream_site_table tbody tr').each((i, x) => {
        const domain = $(x).find('a').text().trim()
        const percentage = $(x).find('.text-right').text().trim()

        data.upstreamSites.push(`${domain} ${percentage}`)
      })

      $('#downstream_site_table tbody tr').each((i, x) => {
        const domain = $(x).find('a').text().trim()
        const percentage = $(x).find('.text-right').text().trim()

        data.downstreamSites.push(`${domain} ${percentage}`)
      })

      resolve(data)
    })
  })
}

module.exports = alexaStats
