const process_text = function(text, json, softcache){
    let winhref = window.location.href;
    //console.log(winhref);
    if (winhref in json) {
        for (const [key, value] of Object.entries(json[winhref])) {
            if (text.includes(key) && !(softcache.includes(key))) {
                let url = json[winhref][key]['citation'];
                let correction = json[winhref][key]['correction'];
                softcache.push(key);
                text = text.replace(key,   
                `<span class="gg_tooltip">
                ${key}<div class="gg_tooltipbox">
                <p class="gg_tooltiptext">${correction}</p>
                <center>
                <input type="button" class="gg_button" value="Citation" onclick="window.location.href='${url}'" />
                <br>
                </center>
                </div></span>`);
            }
        }
    }
    return text;
};

const parse = function(divs, json, softcache){
    for (let i = 0, l = divs.length; i < l; i++) {
        try {
            const text = divs[i].innerHTML;
            // divs[i].href = "javascript:void(0)"
            const newtext = process_text(text, json, softcache);
            if (text !== newtext) { 
                divs[i].innerHTML = newtext;
            }
        } catch (error) {
            // pass
        }
    }
    console.log(softcache);
};

const parseStuff = function(json, softcache){
    let tags = document.querySelectorAll("p,h1,h2,h3,h4,span");
    let divs = document.getElementsByTagName("div")
    parse(divs, json, softcache);
    //parse(tags, json, softcache);
};

const xhr = new XMLHttpRequest();
xhr.onload = function(){
    let softcache = [];
    let json = xhr.responseText;
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1');
    json = JSON.parse(json);
    return parseStuff(json, softcache);
    
};

xhr.open('GET', 'https://raw.githubusercontent.com/skahdidev/glowyglasses/main/webdict.json');
xhr.send();
 
