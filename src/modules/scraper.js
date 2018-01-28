import cheerio from 'cheerio';




export default function scaper(data) {
    const $ = cheerio.load(data);

    return $("table.inflection-ru").find('tr').map( (i, tr) => {
        return $(tr).children().map( (j,td) => {
            let accContent = "";
            $(td).children().each( (k,content) => accContent += $(content).html())
            return accContent;
        })
    });
}