import axios from 'axios';
import cheerio from 'cheerio';

export default class MDN {
  public static async search(query: string) {
    const { data } = await axios.get<string>('https://developer.mozilla.org/en-US/search', {
      params: {
        q: encodeURIComponent(query),
      },
    });
    const $ = cheerio.load(data);

    const results: {
      title: string;
      url: string;
    }[] = $('div.result > div > a.result-title').map((_, e) => ({
      name: $(e).text(),
      url: `https://developer.mozilla.org${$(e).attr('href')}`,
    })).get().filter(({ url }) => url.includes('Web/JavaScript/Reference'));

    const exact = results.length > 1
      ? results.find(({ url }) => url.toLowerCase().endsWith(query.toLowerCase()))
      : results[0];
    if (exact) return MDN.getInfo(exact.url);

    return results;
  }

  public static async getInfo(url: string) {
    const { data } = await axios.get<string>(url);
    const $ = cheerio.load(data);

    const syntax = $('#wikiArticle > pre.syntaxbox.notranslate').text();
    const name = $('#react-container > main > header > div.titlebar-container > div > h1').text();
    const description = $('#wikiArticle > p:nth-child(12)').text();
    const examples = $('#wikiArticle > pre:nth-child(19) > code').html();
    const parameters = MDN.resolveParameters($('#wikiArticle > dl').text().split('\n'));
    const returns = $('#wikiArticle > p:nth-child(10)').text();

    return {
      description,
      examples,
      name,
      parameters,
      returns,
      syntax,
      url,
    };
  }

  private static resolveParameters(parameters: string[]) {
    parameters = parameters.map((p) => p.trim()).filter((p) => p !== '');

    const result = [];
    for (let i = 0; i < parameters.length; i++) {
      if (i % 2 === 0) {
        result.push({
          name: parameters[i].split(' ')[0],
          optional: parameters[i].split(' ').length > 1,
          description: parameters[++i],
        });
      }
    }

    return result;
  }
}
