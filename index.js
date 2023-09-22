const cheerio = require('cheerio');
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const axios = require('axios');

const newspapers = [
    {
        name: 'thetimes',
        adress: 'https://www.thetimes.co.uk/environment/climate-change',
        path: ''
    },
    {
        name: 'guardian',
        adress: 'https://www.theguardian.com/environment/climate-crisis',
        path: ''

    },
    {
        name: 'telegraph',
        adress: 'https://www.telegraph.co.uk/climate-change',
        path: 'https://www.telegraph.co.uk'

    },
    {
        name: 'bbc',
        adress: 'https://www.bbc.com/news/science_and_environment',
        path: 'https://www.bbc.com'

    },
]
newspapers.forEach(newspaper => {
    axios.get(newspaper.adress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("climate")', html).each(function() {
            const title = $(this).text();
            const url = $(this).attr('href')
            console.log(newspaper.path);
            article.push({
                title,
                url: newspaper.path + url,
                source: newspaper.name
            })
        })
    })
    .catch((err) => console.log(err))
})

const article = []

app.get('/', (req, res) => {
    res.json('welcome') 
})
app.get('/news', (req, res) => {
    res.json(article)
})
app.get('/news/:id', (req, res) => {
    const newspaperId = req.params.id;
   const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].adress;
   const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].path;
       console.log(newspaperBase);
    axios.get(newspaperAdress)
    .then(response => {
       const html = response.data
       const $ = cheerio.load(html);
       const specificArticle = []

       $('a:contains("Climate")', html).each(function() {
           const title = $(this).text();
           const url = $(this).attr('href');
           specificArticle.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
           })
       })
       res.json(specificArticle)
    }).catch((err) => console.log(err))
})


app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));