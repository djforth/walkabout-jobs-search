
const _ = require("lodash")

let genesis = [
        {title:"Tony Banks", instruments:" keyboards, backing vocals, guitar"},
        {title:"Mike Rutherford", instruments:"bass, guitars, backing vocals, bass pedals, twelve-string guitar, cello, electric sitar"},
        {title:"Phil Collins", instruments:"drums, percussion, lead and backing vocals, vibraphone, drum machine, Simmons drums"},
        {title:"Anthony Phillips", instruments:"lead guitar, twelve-string guitar, classical guitar, dulcimer, backing vocals"},
        {title:"Chris Stewart", instruments:"drums, percussion"},
        {title:"Peter Gabriel", instruments:"lead vocals, flute, tambourine, oboe, bass drum, accordion, theatrics"},
        {title:"John Silver", instruments:"drums, percussion, backing vocals"},
        {title:"John Mayhew", instruments:"drums, percussion, backing vocals"},
        {title:"Mick Barnard", instruments:"guitar"},
        {title:"Steve Hackett", instruments:"lead guitar, twelve-string guitar, classical guitar, autoharp"},
        {title:"Ray Wilson", instruments:"lead vocals"},
        {title:"Bill Bruford", instruments:"drums, percussion"},
        {title:"Chester Thompson", instruments:"drums, percussion"},
        {title:"Daryl Stuermer", instruments:"guitars, bass, backing vocals"},
        {title:"Nir Zidkyahu", instruments:"drums, percussion"},
        {title:"Nick D'Virgilio", instruments:"drums, percussion"},
        {title:"Anthony Drennan", instruments:"Silver bass"}
      ]

let filter_opts = [
  {
    id:0,
    title:"red"
  },
  {
    id:1,
    title:"green"
  },
  {
    id:2,
    title:"blue"
  }
];

_.map(genesis, (g)=>{
  let no   = _.random(1, 3);
  let opts = _.sample(filter_opts, no);
  opts     = _.pluck(opts, "id")
  g.filter_options = {color:opts };
});

module.exports = genesis;
