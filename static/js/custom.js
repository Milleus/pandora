var API_KEY = 'YOUR-API-KEY';
var API_URL = 'https://www.googleapis.com/pagespeedonline/v4/runPagespeed?';
var DOMAIN_LIST = [
  // ministries (16)
  'mci.gov.sg',
  'mccy.gov.sg',
  'mindef.gov.sg',
  'moe.gov.sg',
  'mof.gov.sg',
  'mfa.gov.sg',
  'moh.gov.sg',
  'mha.gov.sg',
  'mlaw.gov.sg',
  'mom.gov.sg',
  'mnd.gov.sg',
  'msf.gov.sg',
  'mewr.gov.sg',
  'mti.gov.sg',
  'mot.gov.sg',
  'pmo.gov.sg',
  // statutory boards (63)
  'acra.gov.sg',
  'a-star.edu.sg',
  'ava.gov.sg',
  'boa.gov.sg',
  'bca.gov.sg',
  'cra.gov.sg',
  'cpf.gov.sg',
  'caas.gov.sg',
  'cscollege.gov.sg',
  'cccs.gov.sg',
  'cea.gov.sg',
  'dsta.gov.sg',
  'sedb.com',
  'ema.gov.sg',
  'tech.gov.sg',
  'hpb.gov.sg',
  'hsa.gov.sg',
  'hlb.gov.sg',
  'hdb.gov.sg',
  'imda.gov.sg',
  'iras.gov.sg',
  'ite.edu.sg',
  'ipos.gov.sg',
  'iesingapore.gov.sg',
  'iseas.edu.sg',
  'jtc.gov.sg',
  'lta.gov.sg',
  'muis.gov.sg',
  'mpa.gov.sg',
  'mas.gov.sg',
  'nyp.edu.sg',
  'nac.gov.sg',
  'ncss.gov.sg',
  'nea.gov.sg',
  'nhb.gov.sg',
  'nlb.gov.sg',
  'nparks.gov.sg',
  'np.edu.sg',
  'pa.gov.sg',
  'peb.gov.sg',
  'pub.gov.sg',
  'ptc.gov.sg',
  'rp.edu.sg',
  'science.edu.sg',
  'sentosa.com.sg',
  'sac.gov.sg',
  'score.gov.sg',
  'sdc.gov.sg',
  'seab.gov.sg',
  'sla.gov.sg',
  'smc.gov.sg',
  'snb.gov.sg',
  'spc.gov.sg',
  'sp.edu.sg',
  'stb.gov.sg',
  'skillsfuture.sg',
  'sportsingapore.gov.sg',
  'spring.gov.sg',
  'tcmpb.gov.sg',
  'tp.edu.sg',
  'toteboard.gov.sg',
  'ura.gov.sg',
  'wsg.gov.sg',
  // organs of state (10)
  'agc.gov.sg',
  'ago.gov.sg',
  'iac.gov.sg',
  'istana.gov.sg',
  'familyjusticecourts.gov.sg',
  'statecourts.gov.sg',
  'supremecourt.gov.sg',
  'parliament.gov.sg',
  'psc.gov.sg',
  'cabinet.gov.sg'
];

var callbacks = {};
var affectedArr = [];
var impactArr = [];
var idx = 0;
var siteCount = 0;

function runPagespeed() {
  generateScript();
}

function generateScript() {
  if (idx < DOMAIN_LIST.length) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    var query = [
      'url=http://www.' + DOMAIN_LIST[idx],
      'callback=runPagespeedCallbacks',
      'key=' + API_KEY,
    ].join('&');

    s.src = API_URL + query;
    document.head.insertBefore(s, null);

    console.log('Request:', DOMAIN_LIST[idx], ', Timestamp:', new Date());
    idx++;
    // 60 requests per 100 seconds per user, throttle requests when necessary
    setTimeout(generateScript, 2000);
    // generateScript();
  }
}

function runPagespeedCallbacks(result) {
  if (result.error) {
    var errors = result.error.errors;
    for (var i = 0, len = errors.length; i < len; ++i) {
      if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
        alert('Please specify your Google API key in the API_KEY variable.');
      } else {
        console.log(errors[i].message);
      }
    }
    return;
  }

  for (var fn in callbacks) {
    var f = callbacks[fn];
    if (typeof f == 'function') {
      callbacks[fn](result);
    }
  }
}

setTimeout(runPagespeed, 0);

callbacks.displayLoadingExperience = function (result) {
  var overallSpeed = result.loadingExperience.overall_category;
  var li = document.createElement('li');
  li.innerHTML = `
  <div class="collapsible-header display-flex align-items-center justify-content-space-between">
    <div class="display-flex align-items-center item-left break-word">
      <i class="material-icons">add</i>
      <div>${getSiteInfo(result)}</div>
    </div>
    <div class="right-align">
      <div>Overall Speed</div>
      <strong class="${overallSpeed}">${overallSpeed}</strong>
    </div>
  </div>
  <div class="collapsible-body">
    <div class="row">
      <div class="col s12 m3">
        <p><strong>Speed</strong></p>
        <p>${getLoadingExperience(result)}</p>
      </div>
      <div class="col s12 m3">
        <p><strong>Response Bytes</strong></p>
        <p>${getResponseBytes(result)}</p>
      </div>
      <div class="col s12 m3">
        <p><strong>Resources Referenced</strong></p>
        <p>${getNumberResources(result)}</p>
      </div>
      <div class="col s12 m3">
        <p><strong>Optimization Score</strong></p>
        <p>${getOptimizationScore(result)}</p>
      </div>
    </div>

    <div class="row">
      <div class="col s12 m6">
        <p><strong>Recommendations</strong></p>
        <ol>${getRecommendations(result)}</ol>
      </div>
      <div class="col s12 m6">
        <p><strong>Already Optimized</strong></p>
        <ol>${getOptimized(result)}</ol>
      </div>
    </div>
  </div>`;

  var collapsible = document.querySelector('.collapsible');
  collapsible.appendChild(li);

  affectedArr.sort(sortByAffected);
  setRecByAffected('#recommendations-by-affected');
  impactArr.sort(sortByImpact);
  setRecByImpact('#recommendations-by-impact');
  console.log('Adding Site:', result.id);

  siteCount++;
  var queryStatus = document.querySelector('#query-status');
  queryStatus.innerHTML = `Loading... ${siteCount} of ${DOMAIN_LIST.length} successfully added.`;
}

function getSiteInfo(result) {
  var siteUrl = result.id;
  var siteTitle = result.title;
  return `${siteUrl}<br>${siteTitle}`
}

function getLoadingExperience(result) {
  var speedScore = result.loadingExperience.overall_category;
  var metrics = result.loadingExperience.metrics;
  var medianDcl = metrics && metrics.DOM_CONTENT_LOADED_EVENT_FIRED_MS ? formatSeconds(metrics.DOM_CONTENT_LOADED_EVENT_FIRED_MS.median) : 'NA';
  var medianFcp = metrics && metrics.FIRST_CONTENTFUL_PAINT_MS ? formatSeconds(metrics.FIRST_CONTENTFUL_PAINT_MS.median) : 'NA';
  return `Overall: <strong class="${speedScore}">${speedScore}</strong><br>First Contentful Paint: ${medianFcp}<br>DOM Content Loaded: ${medianDcl}`;
}

function getResponseBytes(result) {
  var htmlResponseBytes = formatBytes(result.pageStats.htmlResponseBytes);
  var cssResponseBytes = formatBytes(result.pageStats.cssResponseBytes);
  var javascriptResponseBytes = formatBytes(result.pageStats.javascriptResponseBytes);
  var imageResponseBytes = formatBytes(result.pageStats.imageResponseBytes);

  return `HTML: ${htmlResponseBytes}<br>
  CSS: ${cssResponseBytes}<br>
  Javascript: ${javascriptResponseBytes}<br>
  Image: ${imageResponseBytes}`;
}

function getOptimizationScore(result) {
  var optimizationScore = result.ruleGroups.SPEED.score;
  return optimizationScore;
}

function getNumberResources(result) {
  var numberCssResources = result.pageStats.numberCssResources;
  var numberJsResources = result.pageStats.numberJsResources;

  return `CSS: ${numberCssResources}<br>Javascript: ${numberJsResources}`;
}

function getRecommendations(result) {
  var recommendations = [];
  var ruleResults = result.formattedResults.ruleResults;
  for (var i in ruleResults) {
    if (ruleResults[i].ruleImpact == 0) {
      continue;
    }

    tabulateAffected(ruleResults[i]);

    recommendations.push({
      localizedRuleName: ruleResults[i].localizedRuleName,
      impact: ruleResults[i].ruleImpact
    });
  };

  recommendations.sort(sortByImpact);
  if (recommendations[0]) {
    impactArr.push({
      siteName: result.id,
      localizedRuleName: recommendations[0].localizedRuleName,
      impact: recommendations[0].impact
    });
  }

  var recommendationString = '';
  for (var i in recommendations) {
    recommendationString += `<li>${recommendations[i].localizedRuleName} (Impact: ${recommendations[i].impact.toFixed(2)})</li>`;
  }
  return recommendationString;
}

function getOptimized(result) {
  var optimized = [];
  var ruleResults = result.formattedResults.ruleResults;
  for (var i in ruleResults) {
    if (ruleResults[i].ruleImpact > 0) {
      continue;
    }

    optimized.push(ruleResults[i].localizedRuleName);
  };

  var optimizedString = '';
  for (var i in optimized) {
    optimizedString += `<li>${optimized[i]}</li>`;
  }
  return optimizedString;
}

function tabulateAffected(rule) {
  var isKeyFound = false;
  for (i in affectedArr) {
    var obj = affectedArr[i];
    if (obj.localizedRuleName == rule.localizedRuleName) {
      obj.affected += 1;
      isKeyFound = true;
    }
  }

  if (isKeyFound) {
    return;
  }

  affectedArr.push({
    localizedRuleName: rule.localizedRuleName,
    affected: 1
  });
}

function setRecByAffected(selector) {
  var selected = document.querySelector(selector);
  var appendString = '';

  affectedArr.forEach(function (value, idx) {
    if (idx < 5) {
      appendString += `<li><strong>${affectedArr[idx].localizedRuleName} (Affected: ${affectedArr[idx].affected})</strong></li>`;
    }
  });

  selected.innerHTML = appendString;
}

function setRecByImpact(selector) {
  var selected = document.querySelector(selector);
  var appendString = '';

  impactArr.forEach(function (value, idx) {
    if (idx < 5) {
      appendString += `<li><strong>${impactArr[idx].localizedRuleName} (Impact: ${impactArr[idx].impact.toFixed(2)})</strong><br>${impactArr[idx].siteName}</li>`;
    }
  });

  selected.innerHTML = appendString;
}

window.addEventListener('load', function () {
  var queryStatus = document.querySelector('#query-status');
  queryStatus.innerHTML = `Queries have ended. ${siteCount} of ${DOMAIN_LIST.length} successfully added.`;
});

function sortByImpact(a, b) {
  return b.impact - a.impact;
}

function sortByAffected(a, b) {
  return b.affected - a.affected;
}

function formatSeconds(ms) {
  var seconds = ms / 1000;
  return `${seconds.toFixed(2)}s`;
}

function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }