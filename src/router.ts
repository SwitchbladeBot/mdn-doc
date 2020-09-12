const Method = (method: string) => (req: Request) => req.method.toLowerCase() === method.toLowerCase()
const Connect = Method('connect')
const Delete = Method('delete')
const Get = Method('get')
const Head = Method('head')
const Options = Method('options')
const Patch = Method('patch')
const Post = Method('post')
const Put = Method('put')
const Trace = Method('trace')

type Conditions = [typeof Connect, (req: Request) => boolean] | [] | ((req: Request) => boolean);
type Handler = (request: Request) => any;
type IPath = string | RegExp;

const Path = (regExp: IPath) => (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname
  const match = path.match(regExp) || []
  return match[0] === path
}

export default class Router {
  public routes: { conditions: Conditions, handler: Handler }[];

  constructor () {
    this.routes = []
  }

  handle (conditions: Conditions, handler: Handler) {
    this.routes.push({ conditions, handler })
    return this
  }

  connect (url: IPath, handler: Handler) {
    return this.handle([Connect, Path(url)], handler)
  }

  delete (url: IPath, handler: Handler) {
    return this.handle([Delete, Path(url)], handler)
  }

  get (url: IPath, handler: Handler) {
    return this.handle([Get, Path(url)], handler)
  }

  head (url: IPath, handler: Handler) {
    return this.handle([Head, Path(url)], handler)
  }

  options (url: IPath, handler: Handler) {
    return this.handle([Options, Path(url)], handler)
  }

  patch (url: IPath, handler: Handler) {
    return this.handle([Patch, Path(url)], handler)
  }

  post (url: IPath, handler: Handler) {
    return this.handle([Post, Path(url)], handler)
  }

  put (url: IPath, handler: Handler) {
    return this.handle([Put, Path(url)], handler)
  }

  trace (url: IPath, handler: Handler) {
    return this.handle([Trace, Path(url)], handler)
  }

  all (handler: Handler) {
    return this.handle([], handler)
  }

  route (req: Request) {
    const route = this.resolve(req)

    if (route) {
      return route.handler(req)
    }

    return new Response('resource not found', {
      status: 404,
      statusText: 'not found',
      headers: {
        'content-type': 'text/plain'
      }
    })
  }

  resolve (req: Request) {
    return this.routes.find(r => {
      if (!r.conditions || (Array.isArray(r) && !(r as any).conditions.length)) {
        return true
      }

      if (typeof r.conditions === 'function') {
        return r.conditions(req)
      }

      return r.conditions.every((c: any) => c(req))
    })
  }
}
