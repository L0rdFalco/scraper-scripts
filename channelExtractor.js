const fs = require('fs');


function channel_extractor(){

    const arr_raw = fs.readFileSync('raw_links.txt', 'utf-8').split('\n');
    
    const set_raw = new Set(arr_raw)
    
    let fileContent = '';
    set_raw.forEach((item) => {
        fileContent += `${item}\n`; // Append each item followed by a newline
    });
    
    // Write to 'set_raw.txt'
    fs.writeFile('new_links.txt', fileContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Successfully wrote Set items to new_links.txt');
        }
    });
}


channel_extractor()