const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const delay = async function (time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const puppeteerInit = async () => {
  //Launches a browser instance
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ["--disable-extensions"],
    headless: true,
    args: ["--no-sandbox", "--disabled-setupid-sandbox", "--start-maximized"],
  });

  // // Creates a new page in the default browser context
  return await browser.newPage();
};

function findEmailInString(text) {
  // Regular expression for email matching
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Find all matches (returns array)
  let emails = text.match(emailRegex);

  emails = Array.from(new Set(emails));

  return emails ? emails : null; // Return first match or null
}

const csvFilePath = path.join(__dirname, "ws_mv2_data.csv");

function appendToCsv(extnLink, myEmails) {
  // Convert array to comma-separated string
  const yString = myEmails.join(",");

  // Create CSV line
  const csvLine = `${extnLink},${yString}\n`;

  // Append to file (creates file if it doesn't exist)
  fs.appendFile(csvFilePath, csvLine, (err) => {
    if (err) {
      console.error("Error writing to CSV:", err);
    } else {
      console.log(`Appended emails: [${myEmails}]`);
    }
  });
}

const emailExtract = async () => {

  const page = await puppeteerInit();

  await page.setViewport({ width: 1920, height: 1080 });

  if (!page) return;

  const ws_raw_arr = fs.readFileSync("ws_raw.txt", "utf-8").split("\n");

  console.log(ws_raw_arr.length);

  for(let i=0; i<ws_raw_arr.length; i++){
    try {
      console.log("extracting on link number: ", i);
      
      let sLink = ws_raw_arr[i].trim();
  
      let rez = await page.goto(sLink);
  
      if (rez?.status() !== 200) return;
  
      await page.waitForFunction(
        "window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500"
      );
  
      // Getting the page source HTML
      let pageSourceHTML = await page.content();
  
      let emailList = findEmailInString(pageSourceHTML);
  
      if (emailList !== null && emailList.length > 0) {
        appendToCsv(sLink, emailList);
      }
    } catch (error) {
      console.log("error: ", error);
      
    }

  }
};

// emailExtract();
