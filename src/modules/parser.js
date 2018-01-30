
export default function parser(inflectionTable) {
    //Transpose table
    inflectionTable = inflectionTable[0].map((row, i) => inflectionTable.map(col => col[i]));

    //Filter out pronunciation stuff
    inflectionTable = inflectionTable.map( (row) => row.map( (cell) => {
        const cellChars = cell.trim().split('');
        if( !cellChars.length || !/[а-яА-ЯЁё]/.test(cellChars[0]) ) return cell;
        
        //return words.filter( (word) => /[а-яА-ЯЁё]/.test(word) ).join(" ");
        return cellChars.filter( (c) =>  /[а-яА-ЯЁё,-\s]/.test(c)).join('')
    }));

    return inflectionTable;
}