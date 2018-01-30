import cheerio from 'cheerio';
import cheerioTableparser from 'cheerio-tableparser';



export default function scaper(data) {
    let $ = cheerio.load(data);
    $ = cheerio.load('<table id="target-table">' + $("table.inflection-ru").html() + '</table>')

    cheerioTableparser($);
    return $("#target-table").parsetable(true, true, true);
}