const Scraper = require('./scraper');
const axios = require('axios');
const Promise = require('bluebird');

(async () => {
    //***********all mocks*********** */
    // 'bookSiteCategory'
    // 'cnn'
    // 'slovakSite'
    const currentMockClientCode = 'bookSiteCategory';
    await mockClientCode(currentMockClientCode);

    async function mockClientCode(siteName) {
        switch (siteName) {
            case 'cnn':
                var config = {
                    baseSiteUrl: `https://edition.cnn.com/`,
                    startUrl: `https://edition.cnn.com/sport`,
                    concurrency: 20,
                    imageFlag: 'wx'
                }
                var scraper = new Scraper(config);
                var root = scraper.createSelector('root');
                var article = scraper.createSelector('page', 'article a', { name: 'article' });
                var paragraph = scraper.createSelector('content', 'h1', { name: 'paragraphs' });
                var image = scraper.createSelector('image', 'img.media__image.media__image--responsive', { name: 'image', customSrc: 'data-src-medium' });
                var articleImage = scraper.createSelector('image', 'img', { name: 'article image' });

                article.addSelector(articleImage);
                article.addSelector(paragraph);
                article.addSelector(image);
                root.addSelector(article);
                root.addSelector(paragraph);
                root.addSelector(image);
                root.addSelector(paragraph);

                await execute();

                break;

            case 'bookSiteCategory':
                var config = {
                    baseSiteUrl: `https://ibrod83.com`,
                    startUrl: `https://ibrod83.com/books`,
                    concurrency: 10,
                    imageFlag: 'wx'
                }

                // const before = {}

                const before = async (response) => {
                    console.log('response from before', response)
                    // response.data = ''
                    // return Promise.delay(5000).then(()=>{
                    //   console.log('done delaying!');  
                    // })
                    // const {data}  = await  axios.get('https://jsonplaceholder.typicode.com/todos/1')
                    // console.log('data from jsonplaceholder',data);
                    // kill()
                    // return;


                }
                const after = async (obj) => {
                    console.log('data from after', obj)
                    // console.log('obj',  obj[0],obj[1],obj[3])

                    // const publisher = obj[0].data[0].text
                    // const author = obj[1].data[0].text
                    // const name = obj[3].data[0].text

                    //  obj= {
                    //     publisher,
                    //     author,
                    //     name
                    // }

                    // console.log('obj',obj)

                    // return Promise.delay(5000).then(()=>{               
                    // try {
                    //     await axios({
                    //         url: 'http://playground.localhost',
                    //         method: 'POST',
                    //         data: obj
                    //     })
                    //     console.log('Done inserting to remote api!')
                    // } catch (error) {
                    //     console.error(error)
                    //     // throw error
                    // }



                }
                var scraper = new Scraper(config);
                var root = scraper.createSelector('root');
                const productPage = scraper.createSelector('page', '.product_name_link', { name: 'product', after, before });
                const categoryPage = scraper.createSelector('page', '#content_65 ol a:eq(0)', { name: 'category', pagination: { queryString: 'page', numPages: 2 }, after });
                root.addSelector(categoryPage);
                categoryPage.addSelector(productPage);
                var publisherData = scraper.createSelector('content', '.product_publisher', { name: 'publisher', after });
                var productName = scraper.createSelector('content', '.product_name', { name: 'name', before });
                var authorData = scraper.createSelector('content', 'p',{name:'author'});
                var productImage = scraper.createSelector('image', ' img', { name: 'image' });
                root.addSelector(authorData);
                productPage.addSelector(publisherData);
                productPage.addSelector(authorData);
                productPage.addSelector(productImage);
                productPage.addSelector(productName);

                await execute();

                break;
            case 'slovakSite':
                var config = {
                    baseSiteUrl: `https://www.profesia.sk`,
                    startUrl: `https://www.profesia.sk/praca/`,
                    concurrency: 50,
                    imageFlag: 'wx'
                }
                var scraper = new Scraper(config);
                var root = scraper.createSelector('root');
                var productLink = scraper.createSelector('page', '.list-row a.title', { name: 'link', pagination: { queryString: 'page_num', numPages: 100 } });
                root.addSelector(productLink);
                var paragraph = scraper.createSelector('content', 'h4', { name: 'h4' });


                var productImage = scraper.createSelector('image', 'img:first', { name: 'image' });

                productLink.addSelector(paragraph);
                productLink.addSelector(productImage);
                await execute();


            default:
                break;
        }

        async function execute(productPage) {
            console.log('root', root);
            try {
                await scraper.scrape(root);
                // const productTree = productPage.getData();
                // if (typeof productTree !== 'undefined') {
                //     await scraper.createLog({fileName:'productTree',object:productTree})
                // }

                // console.log('number of failed objects:', scraper.failedScrapingObjects.length)
                // console.log('average page request in seconds:', overallSeconds / overallPageRequests)
                console.log('no errors, all done')
            } catch (error) {
                console.error('there was an error in the root selector', error);

            }
        }
    }







    //**************************books site category ***********************/

    // const config = {
    //     baseSiteUrl: `https://ibrod83.com`,
    //     startUrl: `https://ibrod83.com/books`,
    //     concurrency: 5,
    //     imageFlag: 'wx'
    // }
    // const scraper = new Scraper(config);

    // const root = scraper.createSelector('root');
    // //pagination: { queryString: 'page', numPages: 3 }
    // // const productPage = scraper.createSelector('page', '.product_name_link');

    // // let productPage;



    // // ,pagination: { queryString: 'page', numPages: 2 }
    // const productPage = scraper.createSelector('page', { querySelector: '.product_name_link', name: 'product', pagination: { queryString: 'page', numPages: 100 } });
    // const categoryPage = scraper.createSelector('page', { querySelector: '#content_65 ol a:eq(0)', name: 'category' });
    // // const categoryPage = scraper.createSelector('page', { querySelector: '.category_selector a', name: 'category' });
    // root.addSelector(categoryPage);
    // categoryPage.addSelector(productPage);
    // const publisherData = scraper.createSelector('content', { querySelector: '.product_publisher', name: 'publisher' });
    // const productName = scraper.createSelector('content', { querySelector: '.product_name', name: 'name' });
    // const authorData = scraper.createSelector('content', { querySelector: '.product_author', name: 'author' });
    // const productImage = scraper.createSelector('image', { querySelector: '.book img', name: 'image' });
    // // root.addSelector(productImage)
    // // root.addSelector(productPage)
    // productPage.addSelector(publisherData);
    // productPage.addSelector(authorData);
    // productPage.addSelector(productImage);
    // productPage.addSelector(productName);
    // // root.addSelector(productImage)




    //stackoverflow site****************************/
    // const config = {
    //     baseSiteUrl: `https://stackoverflow.com/`,
    //     startUrl: `https://stackoverflow.com/`
    // }
    //     const root = new RootSelector(config);
    //     const postPage = new PageSelector({ querySelector: '.question-hyperlink', name: 'page' });
    //     root.addSelector(postPage)
    //     const avatarImage = new ImageSelector({ querySelector: '.gravatar-wrapper-32 img', name: 'avatar' });
    //     const data = new ContentSelector({ querySelector: '.post-text', name: 'posttext' });
    //     postPage.addSelector(avatarImage)
    //     // data.processText= function(text){
    //     //     return text+text
    //     // }
    //     postPage.addSelector(data);


    //     try {
    //       await root.scrape();
    //       var entireTree = root.getCurrentData();
    //       console.log('no errors, all done, number of images:', downloadedImages)
    //   } catch (error) {
    //       console.log('error from outer scope', error)
    //       console.log('there was an error somewhere in the promises, killing the script');
    //       process.exit();

    //   }

    //********************w3schools site */
    // const config = {
    //     baseSiteUrl: `https://www.w3schools.com/`,
    //     startUrl: `https://www.w3schools.com/`
    // }
    // const root = new RootSelector(config);

    // // const productPage = new PageSelector({ querySelector: '.product_name_link', name: 'product' });
    // // const categoryPage = new PageSelector({ querySelector: '#content_65 ol a', name: 'category' });

    // // categoryPage.addSelector(productPage);
    // const paragraphs = new ContentSelector({ querySelector: 'p', name: 'paragraphs' });
    // root.addSelector(paragraphs);
    // // const productName = new ContentSelector({ querySelector: '.product_name', name: 'name' });
    // // const authorData = new ContentSelector({ querySelector: '.product_author', name: 'author' });
    // const productImage = new ImageSelector({ querySelector: 'img', name: 'image' });
    // root.addSelector(productImage);
    // try {
    //     await root.scrape();
    //     var entireTree = root.getCurrentData();
    //     console.log('no errors, all done, number of images:', downloadedImages)
    // } catch (error) {
    //     console.log('error from outer scope', error)
    //     console.log('there was an error somewhere in the promises, killing the script');
    //     process.exit();

    // }
    //************************************ */

    //*******************slovak site ******************************/

    // const config = {
    //     baseSiteUrl: `https://www.profesia.sk`,
    //     startUrl: `https://www.profesia.sk/praca/`
    // }
    // const scraper = new Scraper();
    // const root = scraper.createSelector('root', config);
    // const productLink = scraper.createSelector('page', { querySelector: '.list-row a.title', name: 'link', pagination: { queryString: 'page_num', numPages: 10 } });
    // root.addSelector(productLink);
    // const paragraph = scraper.createSelector('content', { querySelector: 'p', name: 'P' });


    // const productImage = scraper.createSelector('image', { querySelector: 'img:first', name: 'image' });

    // productLink.addSelector(paragraph);
    // productLink.addSelector(productImage);



    //********concurrency site******************* */
    // const config = {
    //     baseSiteUrl: `https://ibrod83.com/concurrency/`,
    //     startUrl: `https://ibrod83.com/concurrency`
    // }

    // const root = new RootSelector(config);
    // const productPage = new PageSelector({ querySelector: 'a', name: 'innerpage' });
    // root.addSelector(productPage);
    // const productImage = new ImageSelector({ querySelector: 'img', name: 'image' });
    // productPage.addSelector(productImage);
    // try {
    //    await root.scrape(); 
    // } catch (error) {
    //     console.log(error);
    //     return;
    // }

    // const entireTree = root.getCurrentData();
    // console.log(entireTree);

    //************************************** */

    //***********************ynet************* */
    // const config = {
    //     baseSiteUrl: `https://www.ynet.co.il/`,
    //     startUrl: `https://www.ynet.co.il/`
    // }
    // const root = new RootSelector(config);
    // const category = new PageSelector({ querySelector: '.hdr_isr.hdr_abr a', name: 'category' });
    // const image = new ImageSelector({ querySelector: 'img', name: 'image' });
    // // const article = new PageSelector({ querySelector: '.top-story-text a', name: 'article' });
    // // category.addSelector(article)
    // category.addSelector(image)
    // root.addSelector(category);


    // // article.addSelector(image);


    //******************book site normal************************/
    // const config = {
    //     baseSiteUrl: `https://ibrod83.com/`,
    //     startUrl: `https://ibrod83.com/books/product/america/search?filter=&items_per_page=12`
    // }
    // const root = new RootSelector(config);
    // // ,pagination:{queryString:'page',numPages:10}
    // const productPage = new PageSelector({ querySelector: '.col-md-2 .product_name_link', name: 'product', pagination: { queryString: 'page', numPages: 10 } });
    // root.addSelector(productPage);
    // const publisherData = new ContentSelector({ querySelector: '.product_publisher', name: 'publisher' });
    // const productName = new ContentSelector({ querySelector: '.product_name', name: 'name' });
    // const authorData = new ContentSelector({ querySelector: '.product_author', name: 'author' });
    // const productImage = new ImageSelector({ querySelector: '.book img', name: 'image' });
    // // root.addSelector(productImage)
    // productPage.addSelector(publisherData);
    // productPage.addSelector(authorData);
    // productPage.addSelector(productImage);
    // productPage.addSelector(productName);
    // try {
    //     await root.scrape();
    //     var entireTree = root.getCurrentData();
    //     console.log(entireTree);
    //     // var productTree = productPage.getAllData();
    //     var productTree = productPage.getCurrentData();
    //     var allErrors = root.getErrors();
    //     // var allImages = productImage.getAllData();
    //     if (allErrors.length == 0) {
    //         console.log('no errors, all done, number of images:', downloadedImages)
    //     } else {
    //         console.log(`all done, with ${allErrors.length} errors. number of images:`, downloadedImages)
    //         console.log('overall errors from global variable:', overallErrors)
    //     }

    // } catch (error) {
    //     console.log('Error from root selector', error)
    //     process.exit();

    // }
    //******************************************************* */

    // const beginTime = Date.now();
    // try {
    //     await root.scrape();
    //     console.log('number of images:', downloadedImages);
    // } catch (error) {
    //     console.log('error from outer scope', error)
    //     console.log('there was an error somewhere in the promises, killing the script');
    //     process.exit();

    // }
    // const endTime = Date.now();
    // console.log('operation took:', (endTime - beginTime) / 1000);

    // // await root.scrape()
    // const entireTree = root.getCurrentData();
    // const productTree = productPage.getCurrentData();
    // // const stockTree = stock.getCurrentData();
    // console.log(util.inspect(entireTree, false, null));
    // console.log(productTree);
    // const errors = root.getErrors();
    // const imageErrors = productImage.getErrors();
    // const categoryErrors = categoryPage.getErrors();
    // const productErrors = productPage.getErrors();
    // console.log('all errors:', errors)
    // console.log('image errors:', imageErrors)
    // return;




    // console.log('root', root);
    // try {
    //     await root.scrape();
    //     var entireTree = root.getData();
    //     console.log('number of failed objects:', scraper.failedScrapingObjects.length)
    //     await scraper.createLog({ fileName: 'log', object: entireTree })
    //     await scraper.createLog({ fileName: 'failedObjects', object: scraper.failedScrapingObjects })

    //     if (scraper.failedScrapingObjects.length > 0) {

    //         // console.log('number of failed objects:', scraper.failedScrapingObjects.length, 'repeating')

    //         await scraper.repeatErrors();
    //         var entireTree = root.getData();
    //         await scraper.createLog({ fileName: 'log', object: entireTree })
    //         await scraper.createLog({ fileName: 'failedObjects', object: scraper.failedScrapingObjects })

    //     }
    //     console.log('no errors, all done, number of images:', downloadedImages)
    // } catch (error) {
    //     // console.log('error from outer scope', error)
    //     console.error('there was an error in the root selector', error);
    //     // process.exit();

    // }
    // fs.writeFile('./failedObjects.json', JSON.stringify(root.context.failedScrapingObjects), (err) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log('The file has been saved!');
    //     }

    // });
    // if (typeof entireTree !== 'undefined') {
    //     fs.writeFile('./log.json', JSON.stringify(entireTree), (err) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log('The file has been saved!');
    //         }

    //     });
    // }

    // if (scraper.failedScrapingObjects.length > 0) {
    //     // console.log('number of failed objects:', scraper.failedScrapingObjects.length, 'repeating')

    //     await scraper.repeatErrors();
    // }

    // console.log('notfounderrors', notFoundErrors)

    // if (allErrors) {
    //     fs.writeFile('./errors.json', JSON.stringify(allErrors), (err) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log('The file has been saved!');
    //         }

    //     });
    // }

    // fs.writeFile('./image_errors.json', JSON.stringify(imageErrors), (err) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log('The file has been saved!');
    //     }

    // });
    // fs.writeFile('./product_errors.json', JSON.stringify(productErrors), (err) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log('The file has been saved!');
    //     }

    // });
    // fs.writeFile('./category_errors.json', JSON.stringify(categoryErrors), (err) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log('The file has been saved!');
    //     }

    // });
    // if(productTree) {

    //     fs.writeFile('./products.json', JSON.stringify(productTree), (err) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log('The file has been saved!');
    //         }

    //     });

    // }
    // if(allImages) {
    //     fs.writeFile('./images.json', JSON.stringify(allImages), (err) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log('The file has been saved!');
    //         }

    //     });

    // }




})()

 // // root
    // //     .addSelector(
    // //         scraper.createSelector('page', { querySelector: '#content_65 ol a:first', name: 'category' })
    // //             .addSelector(
    // //                 productPage = scraper.createSelector('page', { querySelector: '.product_name_link', name: 'product' })
    // //             )
    // //     )
    // //     .addSelector(
    // //         scraper.createSelector('content', { querySelector: '.product_publisher', name: 'publisher' })
    // //     )
    // //     .addSelector(
    // //         scraper.createSelector('content', { querySelector: '.product_author', name: 'author' })
    // //     )
    // //     .addSelector(
    // //         scraper.createSelector('image', { querySelector: '.book img', name: 'image' })
    // //     )
    // //     .addSelector(
    // //         scraper.createSelector('content', { querySelector: '.product_name', name: 'name' })
    // //     );