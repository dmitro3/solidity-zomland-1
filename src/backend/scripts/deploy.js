async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  const Main = await ethers.getContractFactory("Main");
  const main = await Main.deploy();

  const LandNFT = await ethers.getContractFactory("LandNFT");
  const landNFT = await LandNFT.deploy(main.address);

  const ZombieNFT = await ethers.getContractFactory("ZombieNFT");
  const zombieNFT = await ZombieNFT.deploy(main.address, landNFT.address);

  const TokenFT = await ethers.getContractFactory("TokenFT");
  const tokenFT = await TokenFT.deploy(main.address);

  const MainContract = await ethers.getContractAt("Main", main.address);
  await MainContract.updateContractAddress(landNFT.address, zombieNFT.address, tokenFT.address);

  console.log("Main address", main.address);
  console.log("LandNFT address", landNFT.address);
  console.log("ZombieNFT address", zombieNFT.address);
  console.log("TokenFT address", tokenFT.address);

  // Add Collections
  await zombieNFT.addCollection("Mummy", "bafkreigdcymxku7b6o4pcyfqqzf5dieviewhwndrknbggvhk6vokavfxwe", ["bafkreicmihyxooqktpps7bc6l565aquq2dm42dghialpbnyzvnisbgafau", "bafkreihczdozweyszov7gecxizxbl55jktgjovpxzfydcfzee6aim3gd5i", "bafkreicwguagu2f2b32jf74m2gzm7cbsyk67fuaemsk53chq2yftdebt2e", "bafkreige5rjivgilatrmbrwnxgmizm7m7vtlob37bansehso3i5t2smvii", "bafkreifz6gsh5dfk6o2woa77zafmgnqzirlwdbp2c42vsxoada5ydswiyi", "bafkreiargcs7zmzcnzkj45l4firtywy5meqlk3au37cbs72rghtprxv3su", "bafkreicqqxnfn4movhvf2d4umnlqhiehwgmo3sdgiuwl47s7nakd6ygd2y", "bafkreib3ayyzyyb5jmpb6zpfi3aeldvkwdyn63tzmbknjywqjgmecy6b34", "bafkreiaxmuyqyysnd6tygitbnptdm3p57aemdxass5r6nzsuhkyztvrz3y", "bafkreifd6wiiviikpkzunzuzfcvows4oa5yxsibmasnr6e35fsnhik7y2a", "bafkreifr4kwt5mlibr6p6bz5cz26xhfejexmlhhn3vkgd2jlpzbqiyqmc4", "bafkreiavkfnqznwn7pk2axb2tiwxt6mxeyxq6idotjdie5y7sj3xdrd67a", "bafkreidhg34mvqwqj37lmbmhvnvrszjj6fhgn3o627mjk2nfzkbnnjymvi", "bafkreifx2khqijmx6qra65yd5u6n6f3r6xqovdmdqj5tehtt2cof3lmnle", "bafkreihxcqvbgyxcjgtisuehgiwjiwjlhf7fyp65ej35gy7n3nkfz3m5yi", "bafkreiawmwoyxjdpp6n25y33g5iu7xyqy5xghivzxjid5c7mii77p7rk64", "bafkreifnycjr5vgfgzhgwlp47n2elbx42jrvvd5vp6dy5iyvaemmz7vjgm", "bafkreicwvweoba3b5gl3wrrlvyik7yp3s7oevhiihene7nh7qgbazcl744", "bafkreievt7ywablsy4gprdut4swx4a3gqujoib7jwrirqlamb5knyuqeky", "bafkreib2mmbllrlhvyz73yx2hdaobow2f4ykunxetnlcldvewryamfka4a", "bafkreibnmlscrvw4ow46uyexw35nvyccnbz6wpnahncaiy7xjwdsqsd65u", "bafkreiehgutljz4nketn4obwjypg4nzlopm7w4dnr2mg5dy346y4lk7qmu", "bafkreihaabk6ysdb2mpjfsfsieqni5das2fke2p6qvuqviq56blnkxmxx4", "bafkreid27mqziqtzya5dvcjhob5borw2egraou4a5zoc2mogqfha3567pm", "bafkreihsj3otyfsz4qucade65iidlgwbdfotl4b7antlal3mgqfaiknlom", "bafkreiehl33yk4n5quz5d5heh7zhjqhyf5fj4xswxv37suz22sx5x366ca", "bafkreiavvifik3ye6bq3y3kxbeoclozpuulzb7hgciat2neicnaupyluyi", "bafkreifoqg74ow7liifwszvrg2ntnzp5b3i5phfa37yw5fgiaw35vlb5cq", "bafkreicsll7ojpfcrmd5b6f7zsjesw7lnusomk4n7527kttufix23popwa", "bafkreiafuva7kw2aocqy3ntxu5r2lvgaavtsfolx6riwbw2beu6bihjopa", "bafkreiflfo3ednhwjthxogrzlzn464pxgcaqqvy4vw3qr6wbzobdojodau", "bafkreih4mukuebrpj3alpzg4est3tcgy27xapgxl65rttdbnhbzb556neq", "bafkreig72cxuqcabs5uafwyaqdasrbnmd2ilqy6edmhjh4hcdcyfsombne", "bafkreieocez2f7zrgba56ckeyo5m2zdy4gofsasu62n2vif3pguadmyssi", "bafkreigz4as2g3wfjxp2okpfvab2nnstw5wmlmjptt552ntmiqsarbigje", "bafkreia4sw6dciviyjoywrn4s45d3haiawfedfone5uqyi5blce2np2vam", "bafkreidgyw3xwksjijxwsc2mhytskqupyrcu2jguxq4bac3z2zcbj2blgu", "bafkreig76jhvgose3x4mqj67626agyky2jx6qwlir5w3qzsmepgmk646ua", "bafkreibidub5ora5ldh62zq775cxznjdrnij3d27qu4yt5ulaymxixzgfq", "bafkreiho32ssat4jlcwy4ck76wrfdiuxopkjizgof6e6coujnpqm7jeosq", "bafkreiaoimuziuiqoy4sapi565z3zspawydfh7vkzlngokyxmlwddg4neu", "bafkreiamwmtdqiqg6obzuca253kek5zzlb3grw5e5gocdcrtnulj3vtsta", "bafkreiarius5fpvryhhgjzkgsdzi7wgtcn3myus737ud2mrvcbfngakxlq", "bafkreieaqsmdpbtnd4ck7n7udk5kvooop7iwmx25j2pwfznru6fx3ithrq", "bafkreiczyp3tvfptv2nxei7vdbshwfquf2p4rj7g4cxwr7hm6iso2w6ibq", "bafkreiegcbhu6jstwlhgsimftgthikymqxpmvhof5pqkgpp5uymhwlvrmy", "bafkreighkqr6rscmx7eai4mitaijd7ykdoxoeuf4owjppdchmintfbklve", "bafkreigmurufnsl2j4yb55gnzv47foikuiqrfj7o5lqznoq2o2uinp6lpq", "bafkreiftmmslrbphqadax7gf6hsx6azakrigsdxu5omrlaw5ynpzrwo3ou", "bafkreiarw2ibddlp4ztj4wma6nd544ob5an7rc7qn5vpaz4qtzg4b66g2u", "bafkreiar5kmk7m7swxd3mhgpjysbi4tupnmwyef22dkzl23jp26damos2y", "bafkreic2s2ulbflnvelfcxym5mqgbhpe26raj6udf4mj3drekacspe7lmu", "bafkreigwcvrn7r6ae7zes2hhnsvo5yyrhyu6ihrtqeemapcmn2watyi4hi", "bafkreigt7arujzqdwsgeungp6bf6i5nlcqd6fic2lpvrdmyi44pnm5mrlq", "bafkreicvhzkk7oamh472prqwbfouxvi2achohlteivgonfza7ymgw6u3ge", "bafkreicuc53774atkf7woeull54zhv2f23bjfzdryi4kudplokt4fz7pem", "bafkreicd3aqzkjq56kh622uojj46fniyiqmqefvpbiwwwxxwxk4n3j5vma", "bafkreidbydi3jdq222eyzcwx75sipxupoqrio7tdooitsnmssqwslcrzgu", "bafkreiclh3lnfnepzprbkvtijmjybgunrkmkyg7ogwdro2hmyu3nq473ya", "bafkreig7uzgf2vxwrqay4q5xpqpv6n6cnfxxq225rmhpass72w6bbaw5uq", "bafkreiegc3t2lgt4twf7wwnorxydn26qposnylujqenh5ztviyaaadlrgy", "bafkreibeidsyefevvzbvdrkulyjvt7suw5hmxaz7ayohevuwziadmr774q", "bafkreibr3fh2wuhv3kaqyvuvu2puxs6hc7drllxxn2i2x72tqu3sp5sr5q", "bafkreihnmfid2dn6h4cd2jklp7odewt6dvckvqberdnxjfdblt333hezci", "bafkreibyb4uj3pkf6ozdn4xd2vio2dlstlyjkbpzoo34anho2s4blud4mi", "bafkreibyyyafzzwy25ntmulzshpgoe7bksfmxsvneyfm3a6qv7cmaufmi4", "bafkreibxf67o5cl5grgvskehswbzwvqbpnxnhq3ibvcmuhtwoc4u5fvfoy", "bafkreieu4svnjhdbbzpeossxi3l4xvvvcbjlzyzmi2w25cfcj7ck4qvnwe", "bafkreicgekky5dzkfur3giuqh2ofet7ptxzntuplxq4ateykjdd7tsnoay", "bafkreidmvhdgsvqf5qvpveptibf5ffpex3lgjbvdubbbapasv4wdovocum", "bafkreibimzykagvzu6bbny3tzv4uioihq45dxacjmpee4rfyue2vbvs6ja", "bafkreifkfigoexq5cwd65hvhgvquynfjbvi3ltgz7y3o66fkpwo3vpqgz4", "bafkreiers7nf6q6sejv4pwhchixj6yrx7my6jdhhylea2kg6nc6yv4gaxa", "bafkreifzjvyjnrctblsvafmrqfg2u3qdx5pams6vlp64i2fzgbnrrfvuke", "bafkreig7tg2ym44ia3xvyz2zpjyfrrk24rbmm7kuw2egqvyzzx6ghqpcty", "bafkreifayt6codk4mttxmyhiuc3odn5lktujrt2arc5h4i6gpq5unznxn4", "bafkreifbpwbjinl72fihrplncxqct5hnbnyhgewmdppwl2jdkppsbywrj4", "bafkreiddsfewo57z5r4m5kfg7edutyarbbzpkoq4ewt552fwreptbhhnpi", "bafkreicifrukdilwnmd7k2jjtvdromrskdcetwmprmhfeqwrgrjmcxu7gq", "bafkreidhwdepd3dhygwbmwfiw4lxpwzwns2db7drrfcgl7zzz4chkz4hky", "bafkreiai3dpnbhd5ghuhkujldsyrvzfnf4o3mkp4zaimj4ec5qgusq27yu", "bafkreifks3yqeleo4z2655rvyyi3tvkbd7ygk7og5azumms4gkyojkw2x4", "bafkreiexoxkbn4zfhjqufyiuelrjvgvdehiyrlmt32feoqagtjejsxzynu", "bafkreie77wktr5lnkaim3fmbub5mwsf53beecxqx5phpkrogjlkpuvrmdm", "bafkreiavfcdcjf6xneivhydvvw4qimgrhhkm7s75z6g5eo4tvugzh3wt4a", "bafkreicaylvf2xfqa4j7d5ywf7lslvnzehzo4tutdlsqtwsu4mbigo4jyi", "bafkreif4s6qnft2grumggms7v3yalfyjce22mka65rp6wopqgxxjsa7wta", "bafkreidon2qctznxmghg7qsz4njrjlcscxrvqxrekt2l673ovgv66m5wky", "bafkreih7vrbaaburd233zkrrn2zaxz7ypadfwclz7d6gzwbhu4retld4vq", "bafkreiajdk27vpuqo2sigwrrcu24jq6ypp2avrmuwy4epl5udyuiclm2tq", "bafkreibm6fe2tpwlwfyhwrtlvoacgbvjwfnfu4rusgs3yjihn676tievt4", "bafkreih2mlwq4zllwrxbwk7epcnjmv7bsvgqzzkhclkgk6w6wzgpolkkum", "bafkreia34j45mrgpynaos56bme2a2hriu6gg26gcz5bfn2rcfw5kmw5bqm", "bafkreie7jqcdcvdj452s6upifce7i3ztsh2eevr7wow3knwnn5a7uq45ci", "bafkreiecvzphzdjmm6mmbv6n3lweh3tfonlfdt6xptjxi7vmbjntuxdrvm", "bafkreifscaxbfnqzdw72icp756omod5suvet4d7zgdzaqytez2gkw46pou", "bafkreiajlkz6grlaxfer63l7pkllrqk7kvvykmkq7ejdbdjbjikiyoizom", "bafkreihq3be4seu6vdnxzqaufeyfoko3dsx3he3j64p7uoebthixewyt4i", "bafkreid6zviqrjeh4botiqsp7l3yaeyw46jeq532ep6yespk4wpjvg5p3u", "bafkreid2kiypumot3hvitzkurloehervryqzqqyta7ydzbkm4ztjiilp4i"]);

  // Claim NFT with index "0"
  await landNFT.safeMint();
  await zombieNFT.safeMint(0);

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(main, "Main");
  saveFrontendFiles(landNFT, "LandNFT");
  saveFrontendFiles(zombieNFT, "ZombieNFT");
  saveFrontendFiles(tokenFT, "TokenFT");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
