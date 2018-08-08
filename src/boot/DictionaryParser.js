const cheerio = require('cheerio-without-node-native');

module.exports = {

  parse: function(body) {

    //console.log(body)

    let $ = cheerio.load(body);

    // main entry
    $ = cheerio.load($(".entry-body").first().html());

    let parts = [];
    $(".entry-body__el").each(function(i, elem) {
      //console.log("part " + i + " :");

      let obj = {};

      let title = $(this).find(".headword .hw").html();
      //console.log(title);
      obj.title = title;

      let pron;
      $(this).find(".pron .ipa").each(function(i, elem) {
        if(i === 1) {
          pron = $(this).text();
          //console.log(pron);
          obj.pron = pron;
        }
      });

      let mp3;
      $(this).find(".audio_play_button").each(function(i, elem) {
        if(i === 1) {
          //console.log($(this).attr("data-src-mp3"));
          mp3 = $(this).attr("data-src-mp3");
          obj.mp3 = mp3;
        }
      });

      let pos = $(this).find("span.pos").first().text();
      //console.log(pos);
      obj.pos = pos;

      let gram = $(this).find("span.gram").first().text();
      //console.log(gram);
      obj.gram = gram;

      obj.meanings = [];
      $(this).find(".sense-body").each(function(j, elem) {
        //console.log("  > " + j);
        let meaning = $(this).find("b.def").first().text().trim();
        //console.log("  > " + meaning);
        let meaningObj = {
          "meaning": meaning,
          "egs": []
        };

        $(this).find("span.eg").each(function(k, elem) {
          //console.log("    > " + k);
          let eg = $(this).text();
          //console.log("    > " + eg);
          meaningObj.egs.push(eg);
        });

        obj.meanings.push(meaningObj);

      });

      parts.push(obj);
    });

    // check invalid part
    if(parts.length > 0) {
      for(let i = parts.length - 1;i >= 0;i--) {
        if(parts[i].title === null) {
          parts.splice(i, 1);
        }
      }
    }

    // check dulplicate part
    let posArray = [];
    let index = 0;
    for(let i = 0;i < parts.length;i++) {
      if(posArray.includes(parts[i].pos)) {
        index = i;
        break;
      }
      else posArray.push(parts[i].pos);
    }

    // remove dulplicate part
    if(index !== 0) {
      for(let i = parts.length - 1;i >= index;i--) {
        parts.splice(i, 1);
      }
    }

    //console.log(parts);
    return parts;
  }
};
