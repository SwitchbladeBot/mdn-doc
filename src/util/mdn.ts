import Cheerio from 'cheerio'
import Turndown from 'turndown'

export default class MDN {
  public static async search (query: string) {
    const res = await fetch(`https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}`)
    const html = await res.text()
    const $ = Cheerio.load(html)

    const results: { title: string, url: string }[] = $('div.result > div > a.result-title').map((_, e) => ({
      name: $(e).text(),
      url: $(e).attr('href')
    }))
      .get()
      .filter(({ name, url }) => url.includes('Web/JavaScript/Reference') && !name.startsWith('Warning: '))

    return results
  }

  public static async getInfo (link: string) {
    let parsedURL = link
    if (new URL(link).hostname) parsedURL = `https://developer.mozilla.org${link}`
    const res = await fetch(parsedURL)
    if (res.status !== 200) return false

    const html = await res.text()
    const $ = Cheerio.load(html)
    const tn = new Turndown()

    const name = $('#react-container > main > header > div.titlebar-container > div > h1').text()

    if (!/global_objects\/[\w\d-_]+(?:\/)?$/i.test(parsedURL)) {
      const description = MDN.toMarkdown($('#wikiArticle > p:nth-child(12)'), tn)
      const parameters = MDN.toMarkdown($('#wikiArticle > dl'), tn)
      const returns = MDN.toMarkdown($('#wikiArticle > p:nth-child(10)'), tn)
      const syntax = MDN.toMarkdown($('#wikiArticle > pre.syntaxbox.notranslate'), tn)

      return {
        description,
        name,
        parameters,
        returns,
        syntax,
        url: parsedURL
      }
    }

    const description = MDN.toMarkdown($('#wikiArticle > p:nth-child(4)'), tn)
    const parameters = MDN.toMarkdown($('#wikiArticle > dl'), tn)
    const syntax = MDN.toMarkdown($('#wikiArticle > pre.syntaxbox.notranslate'), tn)

    return {
      description,
      name,
      parameters,
      syntax,
      url: parsedURL
    }
  }

  private static toMarkdown (sel: Cheerio, tn: Turndown) {
    const html = sel.html()
    if (html) return tn.turndown(html)
    return sel.text()
  }
}
