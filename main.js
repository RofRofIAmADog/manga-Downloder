const request = require('request');
const cher = require('cheerio');
const download = require('node-image-downloader');
const input = require('prompt-sync')({sigint: true});
const files = require('fs');

const get = (link)=>{
    request(link, (error, responce, html)=>{
        const body = cher.load(html);

        let mangaTitle = body('.title a').text();
        let chapter = '';
        
        body('.chapter_list select option').each((i, ch)=>{
            if(body(ch).attr('selected') == 'selected'){
                chapter = `Chapter ${i+1}`
            }
        });

        let pageinfo = [];
        
        body('.slideshow-container a div #gohere').each((i, pg)=>{
            let page = body(pg).attr('data-cfsrc');

            pageinfo.push({
                uri: page,
                filename: i+1
            });
        });

        files.mkdir(`./download/${mangaTitle} ${chapter}`, (error)=>{
            if(error){
                console.log('error');
            }
        });

        download({
            imgs:pageinfo,
            dest:`./download/${mangaTitle} ${chapter}`
        })
        .then((info)=>{
            console.log('Downloded');
            process.exit(1);
        })
        .catch((error)=>{
            console.log('Something when wrong');
        })
    });
}

console.log('Go to https://w13.mangafreak.net/ \n Choose a manga \n Choose a chapter and paste that link');
const link = input('Enter link:');
get(link);

