const fs = require('fs');


function channel_extractor(){

    const arr_original = fs.readFileSync('original_links.txt', 'utf-8').split('\n');
    const arr_new = fs.readFileSync('set_raw.txt', 'utf-8').split('\n');

    
    let fileContent = '';
    arr_new.forEach((item) => {
        if(!arr_original.includes(item))
        fileContent += `${item}\n`; // Append each item followed by a newline
    });
    
    // Write to 'set_raw.txt'
    fs.writeFile('sifted_links.txt', fileContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Successfully wrote Set items to sifted_raw.txt');
        }
    });
}


// channel_extractor()