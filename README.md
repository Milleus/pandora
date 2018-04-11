# Pandora
Pandora analyses speed performance of Singapore government websites and provide recommendations for improvement. There is no backend as this purely utilizes Google Pagespeed API. Do take note that it will take some time for queries to return.

[View Demo](https://milleus.github.io/projects/pandora)

# Why Pandora was created?
Pandora was created with the goal of improving Singapore government websites in mind. Top 5 recommendations by number of sites affected could determine what we want to educate all agencies about. Top 5 recommendations by highest impact score (with relation to other rules of the same site) could reflect which sites require fast attention. Users can also drill down to individual sites to view recommendations and impact.

# How to use Pandora?
1. Create a Google Pagespeed API key.
2. Replace `YOUR-API-KEY` with your Google Pagespeed API key in custom.js.
3. Open index.html with your browser.

# Additional Information
- API requests are throttled at 2 seconds per as the requests are limited at 60 per 100 seconds. This can be done better with cache.
- List of websites are based off [gov.sg](https://www.gov.sg/) directory.
- Results are for desktop view.

# Resources
- [Google Pagespeed Insights API Reference](https://developers.google.com/speed/docs/insights/v4/reference/pagespeedapi/runpagespeed)
