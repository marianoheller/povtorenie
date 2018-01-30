
export default function parser(inflectionTable) {
    //Transpose table
    inflectionTable = inflectionTable[0].map((row, i) => inflectionTable.map(col => col[i]));

    //Filter out pronunciation stuff
    inflectionTable = inflectionTable.map( (row) => row.map( (cell) => {
        const cellChars = cell.trim().split('');
        if( !cellChars.length || !/[а-яА-ЯЁёа́е́и́о́у́ы́э́ю́я́]/.test(cellChars[0]) ) return cell;
        
        return cellChars.filter( (c) =>  /[а-яА-ЯЁёа́е́и́о́у́ы́э́ю́я́,-\s]/.test(c)).join('')
    }));

    return inflectionTable;
}