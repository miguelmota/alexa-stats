const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

function match (str, regex) {
  var m = str.match(regex)
  return m && m.length > 0 ? m[0] : null
}

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
        downstreamSites: [],
        relatedSites: [],
        subdomains: []
      }

      if (!body) {
        return resolve(data)
      }

      const $ = cheerio.load(body)

      data.globalRank = match($('.rank-global .data').text(), /\d+/)
      data.globalRankChange = match($('.rank-global .start-rank .rank').text(), /\d+/)
      data.country = match($('.countryrank .Selector').text(), /\d+/)
      data.countryRank = $('.countryrank .CountryRank .num').text().trim()
      data.countryFlag = null // todo
      data.bounceRate = $(".engagement .sectional:has(.title:contains('Bounce')) .data").text().trim()
      data.bounceRateChange = match($(".engagement .sectional:has(.title:contains('Bounce')) .data .delta").text(), /\d+/)
      data.dailyPageViewsPerVisitor = null // only when logged in
      data.dailyPageViewsPerVisitorChange = null // only when logged in
      data.dailyTimeOnSite = match($(".engagement .sectional:has(.title:contains('Daily Time')) .data").text().trim(), /[\d:]+/)
      data.dailyTimeOnSiteChange = match($(".engagement .sectional:has(.title:contains('Daily Time')) .data .delta").text(), /\d+/)
      data.searchVisits = null // gone?
      data.searchVisitsChange = null // gone?
      data.totalSitesLinkingIn = null // only when logged in
      data.loadSpeed = null // gone?

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

      $('#audience_overlap_table tbody tr').each((i, x) => {
        const domain = $(x).find('a').text().trim();
        data.relatedSites.push(domain);
      })

      $('#subdomain_table tbody tr').each((i, x) => {
        const domain = $(x).find('span.word-wrap').text().trim()
        const percentage = $(x).find('.text-right').text().trim()

        data.subdomains.push(`${domain} ${percentage}`)
      })

      resolve(data)
    })
  })
}

module.exports = alexaStats
