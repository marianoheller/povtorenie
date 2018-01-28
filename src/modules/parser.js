import cheerio from 'cheerio';




export default function parser(tableContent) {
    const $ = cheerio.load(tableContent);

    const ret = $("tr > td");

    console.log($.html());
}