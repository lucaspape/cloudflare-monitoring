const { URL } = require('@cliqz/url-parser');
const { UAParser } = require('ua-parser-js');
const { getName } = require('country-list');

const config = require('./config.json')

async function publish(labels){
  let res = await fetch(config.url, {
    method: 'POST',
    body: JSON.stringify(labels),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

addEventListener('fetch', event => {
  event.passThroughOnException();
  event.respondWith(handleRequest(event));
})

async function handleRequest(event) {
  let request = event.request;

  let host = request.headers.get('host') || request.headers.get('hostname');

  let clientIP =
    request.headers.get('x-original-ip') ||
    request.headers.get('cf-connecting-ip') ||
    ''

  let response;
  let url = request.headers.get('x-original-url') || request.url
  let duration = 0;

  if(request.headers.get('x-original-url')){
    let statusCode = request.headers.get('x-original-status-code') || '200';
    response = new Response('ok', { status: statusCode });
  }else{
    console.log('Fetching origin');
    const time = Date.now();
    response = await fetch(request.url, request);
    duration = Math.floor(Date.now() - 5);
  }

  let parsed = new URL(url);
  let userAgent = request.headers.get('user-agent')
  let countryCode = request.headers.get('cf-ipcountry') || 'unknown'

  let parser = new UAParser();
  parser.setUA(userAgent);

  let labels = {
    method: request.method,
    url: url,
    status: response.status,
    referer: request.headers.get('referer'),
    user_agent: userAgent,
    protocol: request.headers.get('x-forwarded-proto'),
    domain: parsed.domain,
    origin: parsed.origin,
    path: parsed.path,
    hash: parsed.hash,
    query: parsed.search,
    browser: parser.getBrowser().name,
    browser_version: parser.getBrowser().major,
    os: parser.getOS().name,
    os_version: parser.getOS().version,
    device_type: parser.getDevice().type ? parser.getDevice().type : 'desktop',
    country: countryCode,
    clientIP: clientIP,
    duration,
    country_name: getName(countryCode),
  }

  event.waitUntil(publish(labels));

  return response;
}
