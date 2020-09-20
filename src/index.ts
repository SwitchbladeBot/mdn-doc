import mdn from './util/mdn'

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request))
})

function handleJSONResponse (response: any, status = 200) {
  return new Response(JSON.stringify(response), {
    headers: {
      'content-type': 'application/json'
    },
    status
  })
}

async function handleRequest (request: Request) {
  const { pathname, searchParams } = new URL(request.url)

  switch (pathname) {
    case '/search': {
      const query = searchParams.get('q')
      if (!query) return handleJSONResponse({ message: 'You need to pass the search query using the q parameter' }, 400)

      const data = await mdn.search(query)
      if (!Array.isArray(data) || !data.length) return handleJSONResponse({ message: 'Could not find anything' }, 404)

      return handleJSONResponse(data)
    }
    case '/info': {
      const link = searchParams.get('l')
      if (!link) return handleJSONResponse({ message: 'You need to pass the link query using the l parameter' }, 400)

      const data = await mdn.getInfo(link)
      if (!data) return handleJSONResponse({ message: 'The link you inputted was not valid' }, 400)

      return handleJSONResponse(data)
    }
    default: {
      return handleJSONResponse({ message: 'Hello World!' })
    }
  }
}
