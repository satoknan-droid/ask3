import cheerio from "cheerio";

export default async function handler(req, res) {

  let url = req.query.url;

  if (!url) {

    return res
    .status(400)
    .send("No URL");

  }

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {

    url = "https://" + url;

  }

  try {

    const response = await fetch(url, {

      headers: {

        "User-Agent":
        "Mozilla/5.0"

      }

    });

    const html =
      await response.text();

    const $ =
      cheerio.load(html);

    $("title").text(
      "ASK Browser"
    );

    $("img").each((i, el) => {

      let src =
        $(el).attr("src");

      if(src && src.startsWith("/")){

        $(el).attr(
          "src",
          new URL(src, url).href
        );

      }

    });

    $("link").each((i, el) => {

      let href =
        $(el).attr("href");

      if(href && href.startsWith("/")){

        $(el).attr(
          "href",
          new URL(href, url).href
        );

      }

    });

    res.setHeader(
      "Content-Type",
      "text/html"
    );

    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.status(200).send(
      $.html()
    );

  } catch(err){

    console.error(err);

    res.status(500).send(`

    <html>

    <body style="
      background:#111;
      color:white;
      font-family:sans-serif;
      text-align:center;
      padding-top:100px;
    ">

    <h1>
    Proxy Error
    </h1>

    <p>
    ${err}
    </p>

    </body>

    </html>

    `);

  }

}
