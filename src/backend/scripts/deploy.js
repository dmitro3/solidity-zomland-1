async function main() {
  const [deployer, account1] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  const Main = await ethers.getContractFactory("MainContract");
  const main = await Main.deploy();

  const LandNFT = await ethers.getContractFactory("LandNFTContract");
  const landNFT = await LandNFT.deploy(main.address);

  const ZombieNFT = await ethers.getContractFactory("ZombieNFTContract");
  const zombieNFT = await ZombieNFT.deploy(main.address);

  const MonsterNFT = await ethers.getContractFactory("MonsterNFTContract");
  const monsterNFT = await MonsterNFT.deploy(main.address);

  const Collection = await ethers.getContractFactory("CollectionContract");
  const collection = await Collection.deploy(main.address);

  const TokenFT = await ethers.getContractFactory("TokenFTContract");
  const tokenFT = await TokenFT.deploy(main.address);

  const MainContract = await ethers.getContractAt("MainContract", main.address);
  await MainContract.updateContractAddress(
    landNFT.address,
    zombieNFT.address,
    monsterNFT.address,
    tokenFT.address,
    collection.address
  );

  console.log("Main address", main.address);
  console.log("LandNFT address", landNFT.address);
  console.log("ZombieNFT address", zombieNFT.address);
  console.log("MonsterNFT address", monsterNFT.address);
  console.log("Collection address", collection.address);
  console.log("TokenFT address", tokenFT.address);

  // Add Collections
  await collection.addCollection("Mummy", "bafkreigdcymxku7b6o4pcyfqqzf5dieviewhwndrknbggvhk6vokavfxwe", ["bafkreicmihyxooqktpps7bc6l565aquq2dm42dghialpbnyzvnisbgafau", "bafkreihczdozweyszov7gecxizxbl55jktgjovpxzfydcfzee6aim3gd5i", "bafkreicwguagu2f2b32jf74m2gzm7cbsyk67fuaemsk53chq2yftdebt2e", "bafkreige5rjivgilatrmbrwnxgmizm7m7vtlob37bansehso3i5t2smvii", "bafkreifz6gsh5dfk6o2woa77zafmgnqzirlwdbp2c42vsxoada5ydswiyi", "bafkreiargcs7zmzcnzkj45l4firtywy5meqlk3au37cbs72rghtprxv3su", "bafkreicqqxnfn4movhvf2d4umnlqhiehwgmo3sdgiuwl47s7nakd6ygd2y", "bafkreib3ayyzyyb5jmpb6zpfi3aeldvkwdyn63tzmbknjywqjgmecy6b34", "bafkreiaxmuyqyysnd6tygitbnptdm3p57aemdxass5r6nzsuhkyztvrz3y", "bafkreifd6wiiviikpkzunzuzfcvows4oa5yxsibmasnr6e35fsnhik7y2a", "bafkreifr4kwt5mlibr6p6bz5cz26xhfejexmlhhn3vkgd2jlpzbqiyqmc4", "bafkreiavkfnqznwn7pk2axb2tiwxt6mxeyxq6idotjdie5y7sj3xdrd67a", "bafkreidhg34mvqwqj37lmbmhvnvrszjj6fhgn3o627mjk2nfzkbnnjymvi", "bafkreifx2khqijmx6qra65yd5u6n6f3r6xqovdmdqj5tehtt2cof3lmnle", "bafkreihxcqvbgyxcjgtisuehgiwjiwjlhf7fyp65ej35gy7n3nkfz3m5yi", "bafkreiawmwoyxjdpp6n25y33g5iu7xyqy5xghivzxjid5c7mii77p7rk64", "bafkreifnycjr5vgfgzhgwlp47n2elbx42jrvvd5vp6dy5iyvaemmz7vjgm", "bafkreicwvweoba3b5gl3wrrlvyik7yp3s7oevhiihene7nh7qgbazcl744", "bafkreievt7ywablsy4gprdut4swx4a3gqujoib7jwrirqlamb5knyuqeky", "bafkreib2mmbllrlhvyz73yx2hdaobow2f4ykunxetnlcldvewryamfka4a", "bafkreibnmlscrvw4ow46uyexw35nvyccnbz6wpnahncaiy7xjwdsqsd65u", "bafkreiehgutljz4nketn4obwjypg4nzlopm7w4dnr2mg5dy346y4lk7qmu", "bafkreihaabk6ysdb2mpjfsfsieqni5das2fke2p6qvuqviq56blnkxmxx4", "bafkreid27mqziqtzya5dvcjhob5borw2egraou4a5zoc2mogqfha3567pm", "bafkreihsj3otyfsz4qucade65iidlgwbdfotl4b7antlal3mgqfaiknlom", "bafkreiehl33yk4n5quz5d5heh7zhjqhyf5fj4xswxv37suz22sx5x366ca", "bafkreiavvifik3ye6bq3y3kxbeoclozpuulzb7hgciat2neicnaupyluyi", "bafkreifoqg74ow7liifwszvrg2ntnzp5b3i5phfa37yw5fgiaw35vlb5cq", "bafkreicsll7ojpfcrmd5b6f7zsjesw7lnusomk4n7527kttufix23popwa", "bafkreiafuva7kw2aocqy3ntxu5r2lvgaavtsfolx6riwbw2beu6bihjopa", "bafkreiflfo3ednhwjthxogrzlzn464pxgcaqqvy4vw3qr6wbzobdojodau", "bafkreih4mukuebrpj3alpzg4est3tcgy27xapgxl65rttdbnhbzb556neq", "bafkreig72cxuqcabs5uafwyaqdasrbnmd2ilqy6edmhjh4hcdcyfsombne", "bafkreieocez2f7zrgba56ckeyo5m2zdy4gofsasu62n2vif3pguadmyssi", "bafkreigz4as2g3wfjxp2okpfvab2nnstw5wmlmjptt552ntmiqsarbigje", "bafkreia4sw6dciviyjoywrn4s45d3haiawfedfone5uqyi5blce2np2vam", "bafkreidgyw3xwksjijxwsc2mhytskqupyrcu2jguxq4bac3z2zcbj2blgu", "bafkreig76jhvgose3x4mqj67626agyky2jx6qwlir5w3qzsmepgmk646ua", "bafkreibidub5ora5ldh62zq775cxznjdrnij3d27qu4yt5ulaymxixzgfq", "bafkreiho32ssat4jlcwy4ck76wrfdiuxopkjizgof6e6coujnpqm7jeosq", "bafkreiaoimuziuiqoy4sapi565z3zspawydfh7vkzlngokyxmlwddg4neu", "bafkreiamwmtdqiqg6obzuca253kek5zzlb3grw5e5gocdcrtnulj3vtsta", "bafkreiarius5fpvryhhgjzkgsdzi7wgtcn3myus737ud2mrvcbfngakxlq", "bafkreieaqsmdpbtnd4ck7n7udk5kvooop7iwmx25j2pwfznru6fx3ithrq", "bafkreiczyp3tvfptv2nxei7vdbshwfquf2p4rj7g4cxwr7hm6iso2w6ibq", "bafkreiegcbhu6jstwlhgsimftgthikymqxpmvhof5pqkgpp5uymhwlvrmy", "bafkreighkqr6rscmx7eai4mitaijd7ykdoxoeuf4owjppdchmintfbklve", "bafkreigmurufnsl2j4yb55gnzv47foikuiqrfj7o5lqznoq2o2uinp6lpq", "bafkreiftmmslrbphqadax7gf6hsx6azakrigsdxu5omrlaw5ynpzrwo3ou", "bafkreiarw2ibddlp4ztj4wma6nd544ob5an7rc7qn5vpaz4qtzg4b66g2u", "bafkreiar5kmk7m7swxd3mhgpjysbi4tupnmwyef22dkzl23jp26damos2y", "bafkreic2s2ulbflnvelfcxym5mqgbhpe26raj6udf4mj3drekacspe7lmu", "bafkreigwcvrn7r6ae7zes2hhnsvo5yyrhyu6ihrtqeemapcmn2watyi4hi", "bafkreigt7arujzqdwsgeungp6bf6i5nlcqd6fic2lpvrdmyi44pnm5mrlq", "bafkreicvhzkk7oamh472prqwbfouxvi2achohlteivgonfza7ymgw6u3ge", "bafkreicuc53774atkf7woeull54zhv2f23bjfzdryi4kudplokt4fz7pem", "bafkreicd3aqzkjq56kh622uojj46fniyiqmqefvpbiwwwxxwxk4n3j5vma", "bafkreidbydi3jdq222eyzcwx75sipxupoqrio7tdooitsnmssqwslcrzgu", "bafkreiclh3lnfnepzprbkvtijmjybgunrkmkyg7ogwdro2hmyu3nq473ya", "bafkreig7uzgf2vxwrqay4q5xpqpv6n6cnfxxq225rmhpass72w6bbaw5uq", "bafkreiegc3t2lgt4twf7wwnorxydn26qposnylujqenh5ztviyaaadlrgy", "bafkreibeidsyefevvzbvdrkulyjvt7suw5hmxaz7ayohevuwziadmr774q", "bafkreibr3fh2wuhv3kaqyvuvu2puxs6hc7drllxxn2i2x72tqu3sp5sr5q", "bafkreihnmfid2dn6h4cd2jklp7odewt6dvckvqberdnxjfdblt333hezci", "bafkreibyb4uj3pkf6ozdn4xd2vio2dlstlyjkbpzoo34anho2s4blud4mi", "bafkreibyyyafzzwy25ntmulzshpgoe7bksfmxsvneyfm3a6qv7cmaufmi4", "bafkreibxf67o5cl5grgvskehswbzwvqbpnxnhq3ibvcmuhtwoc4u5fvfoy", "bafkreieu4svnjhdbbzpeossxi3l4xvvvcbjlzyzmi2w25cfcj7ck4qvnwe", "bafkreicgekky5dzkfur3giuqh2ofet7ptxzntuplxq4ateykjdd7tsnoay", "bafkreidmvhdgsvqf5qvpveptibf5ffpex3lgjbvdubbbapasv4wdovocum", "bafkreibimzykagvzu6bbny3tzv4uioihq45dxacjmpee4rfyue2vbvs6ja", "bafkreifkfigoexq5cwd65hvhgvquynfjbvi3ltgz7y3o66fkpwo3vpqgz4", "bafkreiers7nf6q6sejv4pwhchixj6yrx7my6jdhhylea2kg6nc6yv4gaxa", "bafkreifzjvyjnrctblsvafmrqfg2u3qdx5pams6vlp64i2fzgbnrrfvuke", "bafkreig7tg2ym44ia3xvyz2zpjyfrrk24rbmm7kuw2egqvyzzx6ghqpcty", "bafkreifayt6codk4mttxmyhiuc3odn5lktujrt2arc5h4i6gpq5unznxn4", "bafkreifbpwbjinl72fihrplncxqct5hnbnyhgewmdppwl2jdkppsbywrj4", "bafkreiddsfewo57z5r4m5kfg7edutyarbbzpkoq4ewt552fwreptbhhnpi", "bafkreicifrukdilwnmd7k2jjtvdromrskdcetwmprmhfeqwrgrjmcxu7gq", "bafkreidhwdepd3dhygwbmwfiw4lxpwzwns2db7drrfcgl7zzz4chkz4hky", "bafkreiai3dpnbhd5ghuhkujldsyrvzfnf4o3mkp4zaimj4ec5qgusq27yu", "bafkreifks3yqeleo4z2655rvyyi3tvkbd7ygk7og5azumms4gkyojkw2x4", "bafkreiexoxkbn4zfhjqufyiuelrjvgvdehiyrlmt32feoqagtjejsxzynu", "bafkreie77wktr5lnkaim3fmbub5mwsf53beecxqx5phpkrogjlkpuvrmdm", "bafkreiavfcdcjf6xneivhydvvw4qimgrhhkm7s75z6g5eo4tvugzh3wt4a", "bafkreicaylvf2xfqa4j7d5ywf7lslvnzehzo4tutdlsqtwsu4mbigo4jyi", "bafkreif4s6qnft2grumggms7v3yalfyjce22mka65rp6wopqgxxjsa7wta", "bafkreidon2qctznxmghg7qsz4njrjlcscxrvqxrekt2l673ovgv66m5wky", "bafkreih7vrbaaburd233zkrrn2zaxz7ypadfwclz7d6gzwbhu4retld4vq", "bafkreiajdk27vpuqo2sigwrrcu24jq6ypp2avrmuwy4epl5udyuiclm2tq", "bafkreibm6fe2tpwlwfyhwrtlvoacgbvjwfnfu4rusgs3yjihn676tievt4", "bafkreih2mlwq4zllwrxbwk7epcnjmv7bsvgqzzkhclkgk6w6wzgpolkkum", "bafkreia34j45mrgpynaos56bme2a2hriu6gg26gcz5bfn2rcfw5kmw5bqm", "bafkreie7jqcdcvdj452s6upifce7i3ztsh2eevr7wow3knwnn5a7uq45ci", "bafkreiecvzphzdjmm6mmbv6n3lweh3tfonlfdt6xptjxi7vmbjntuxdrvm", "bafkreifscaxbfnqzdw72icp756omod5suvet4d7zgdzaqytez2gkw46pou", "bafkreiajlkz6grlaxfer63l7pkllrqk7kvvykmkq7ejdbdjbjikiyoizom", "bafkreihq3be4seu6vdnxzqaufeyfoko3dsx3he3j64p7uoebthixewyt4i", "bafkreid6zviqrjeh4botiqsp7l3yaeyw46jeq532ep6yespk4wpjvg5p3u", "bafkreid2kiypumot3hvitzkurloehervryqzqqyta7ydzbkm4ztjiilp4i"]);
  await collection.addCollection("Punk", "bafkreifgwakut5srqjr2ac2gbq4oz7vvcbiojmx5h5v5ksuen64dxpvby4", ["bafkreibmcsnjjgulgx65ak3bdqd4w63s4z665cyxast5bzpxxvxicdizr4", "bafkreihzwuchyxoicy7gffsdsct7fgl6b6gszza4otqp6hic7k6iqcangq", "bafkreiddjhbnjo6edng5wff644ptjhovohgqvnn3ptcsu7ospr2tx44hae", "bafkreibl23jak6eofnasiz3rrjqf7fjafmwwn5566gkdshc7ev6qgoyuwm", "bafkreicdlfk35ujslex2br24yhzcp2tlynbuslhrqjed77cckywzv4bv4a", "bafkreiaailjqjbcptnfdgzi2v6g4kztq5lccg4zhdgxdyc53cscxeihfki", "bafkreig7zkxhe2onm3eatvfyyfooevtwtum47y74kmnpqhloknlbxlxnk4", "bafkreiejzklvd27thlc5x3pnods2lsjct3dolh46q4cifiyjkwpna4kvhu", "bafkreig3jhwgqcbgdvqppcgdt42mzzvfx23jynyyqrvs3fgbfxxpt7jfla", "bafkreidpj5w73u6gdwhrhzvuiit34xsmti3rcavzhe4pwtrasydoreu7hu", "bafkreigsfht4o2x7ctqb4htco5fmh4apfx2zk5t6luj5bu3vgwfstopl3i", "bafkreicet6tydo2zfe4vzqz4r73se2oj22lkik2bk3wbzlaaqwslpgvhmi", "bafkreich5vkdwjzejeuwss2yz7e72hcyhj2fyvbubqwjlptkitomplpf54", "bafkreifm4ds5p7fpmidecyhlm6ncoq7mbuwixdvae6y2vgunmoxtg2fysq", "bafkreicitd5vehgqchg2umbv7ldwa7pcsg3l6f2a23ewtgcmjyq2bb3uli", "bafkreicmnorzglmunt2ev3rj2jrblygu4b6pyxnojut4mcpkvzi5nowrza", "bafkreic7n3yfr5ulcrjznehzfy3qnn44hc6cxy4uo26wgitoog2xcmuugi", "bafkreibff7oocpdj5gfpinugqaa2rgkl62ozcqhguyjzlyvz5j4gxtnute", "bafkreia2jqbbtoy2ugyc3tu2lm7js2jxvkube5jficxc3fu7ofsbczxhi4", "bafkreif5rigfruzuthm5jz4kh7du2p6mpkjc264fbz46kznjhi3vxsef3a", "bafkreigbedlf76k6ydq37vs62rexzi7kvjwchjbodzxvxmprd54kvupyj4", "bafkreidnimj2djk7jbtymtyh7ilebs46gwz2bulxbgs3lu4mnzbjsevjc4", "bafkreiadxxodec2ncpxdcjxju6f2tz4mxmilgos7tab33b5bchrqm2v55q", "bafkreiebkfxrwcypl75472uqgwi2edknmwc5bermx4inftnfrgmpnlz534", "bafkreidnw76bic6n42hl7mdw6lipuae2nyr42jzq7vya6hlu7ilgggrifa", "bafkreifmopevbjolwzfplsj2jj6rsbsayulbustvft5rsgwdcgaxk6uyoe", "bafkreidqmlda4pnxaqq5pnuxabrfkzh6vmdpymw6k6fk7t4nmmy4s7givm", "bafkreicr4bctpquer7lq6hrecjh65gjrjxpj7ckwjumftcy5z6utl7gu3q", "bafkreih5jzfmaerkagsypr4wy5neguyd3tlpprd6uotntjefqotxrr5u4q", "bafkreidsl75qiyqpisjyyp32g33kmjzw4gndwv2laib3qncjpq5p52ntve", "bafkreiffvfern65dw4nxzqc7rrqr6nzpyl4ylz6peimnhyv7oc74ybjz4a", "bafkreiblvalp2b6dpfo4tkiknmkyhzwxoalbt4pys4wuev4pg777oeks7m", "bafkreicyfiaqrh6d5652u5k6drty6jg52lp565jtfxcduyug5lpmkysvai", "bafkreigqq5m5dm6fsnaeyhw2kd44jj7dzeoq3o323sp2qurhls7dmvwe5i", "bafkreihgsmwck3ugceukym5j7rdxm5dieimlrza26jjlsolfivlf4224uu", "bafkreicnkx5vlcvzcdr45n6stesv3qdnwza7muxza34sjnnjxcekvv2phy", "bafkreifmcinmpngafyx3rhfttx5w533knp45d3ozhe5qsbph62ibvihxzu", "bafkreihhjn2jfgtklfhujlnuvmss4s47ydkrqvd7iatftmleo2a4hcd3ou", "bafkreien7vfqh2j3mgani2pvzl4znrupdi3gqstttr4qfnjzhfay35tgym", "bafkreicupuitaiwkh5eqkjyxzihhnrey4u4k7ec266tnf2gupnsuivm7zu", "bafkreia3bvpyutamahpb2l5ipl7bafmnmlx2obfggyyg2ac64hwmpghp7e", "bafkreibdj7zj4q7lxsumozzflzq3caa24uuugvys4jdl47aoks2eejc7wa", "bafkreiarphkpwlijxgaekw5sc3ftnfuhqjb5pkgdlfwc4jgfmddibfi73e", "bafkreie67jl2ke44w3q2ogzupmtjoveecbw3gqvxml3peiuepy7g5tjlnq", "bafkreihxqafj57nmnddmkht2u3ojeyikpgm5lz6fiu55ub7afdryp6c3wa", "bafkreicaiyu4myfsgg333pbfjaczsy3m2qqan6s6ce6vyppnan3trmixji", "bafkreiffkgvrw6rcf2g7hovipy7f7wa5ffeubgbkhnqmjhqg4dsggawmke", "bafkreibblxqn2wld3z7e2p2lpbyg4kuizwwhcjwrvqmgx2vu72cenrnbw4", "bafkreieh47l4ggk5lc53r24s4pwplujyqlarvt4emlwgwtr7wrq5qcptnq", "bafkreigblvuhtic5ncgxjgxin7gdkh53mzqx4kdrznzvuqy4hkmxlp7rt4", "bafkreifdb75rw5gq6d6ug5dkjw6ks3jobpfya63xk6zqgn5k7i5yascuxm", "bafkreihgeer56ikhqijp3kxeocmwimxxkycrziw6idqhc6dfttd22kwgnm", "bafkreickqhsamozbrlv3qpf7lv2a4r3eymlunr6vujg3yeb4jocqobcswy", "bafkreiaygguwib64gbw6luxugrt5fa2kz4bpa6g6czo7rarlidhgouczyi", "bafkreieuxqcnrhlreceds72oq2gsbtohy4hhq5osbdktbfwvanypfho4mu", "bafkreicay7dsbeja4l5trqka6ctartlzk7y3ouped76mf3yhrqzadvlpmu", "bafkreidctxgot7ipsbfp6hdg453dtpgyo7o7pzadkvhgstd7sq6j2zrtpm", "bafkreieo26wlsgnwpiawfajdbzawlzut4iykab4a2yri33pzjsh4h6wii4", "bafkreicsxs2tqb6ikvbikr4672uypca5ylan5xwfcmyswyb2mxfgbk4nzq", "bafkreiaxrvlgklwvmdaqjkmrgbga45xlx67aelhhlqrunb2iznygxm32om", "bafkreihmy3uossmiqwcr53s2egzruucrl43cnwk4woatnfqvvtzgg54wsy", "bafkreia3pi5voxqb3ynu2rpxtbfcnkythx77mrnfekon7sfntesimrwpj4", "bafkreibxoixdcazupf7drnz6s74rokjzedhzio6lau7hngl2vwxcozmot4", "bafkreifjbsyjvjbiaxluxhet62kv2sialzii7vzfgz6jdtwgi5dk5vxk4a", "bafkreibnf6p7rdrbkrzc72yp6vfqig7cqb5ngeeroh2mejsry6u745fdlm", "bafkreiccqlqdu6trblsgcfzwgk5sxvb6uk6qpg32rshpvx2rf6jq3o6rim", "bafkreidrkan4osn6p73kzumx7ypzrbej4tdl2gtzu7qty2emursfptizim", "bafkreifbtolskifzxdeh3brcppwvz4o6w3huukupkzyybxkvhotqpmhjnu", "bafkreihocxu4arajo3krotnc5j5ahrpef4cmcj5jza7tkg24zfmzjpvp4e", "bafkreihbj24f7ujlvy4culmviy6ekhxlvtqqckfyfhc77xvuxlxukoavtu", "bafkreia3epwbxgk4fh26stlwkf3l4gezqmx4qr5w6evrcgart7y3oth5ni", "bafkreickrmg5ksowzx3aar3mzcl6mjetnhevq72kkysigoyrsd4tmqwg6i", "bafkreifv2yatghjz2h3oh7zkkedd77pubp5kh3u67khogwrpbvpmrqhmxu", "bafkreiaeoaxmhn2vlp5k4vabjn6rudknkvd767u5aasb6h74luru2xfvme", "bafkreig73whrbjmt2dfyhfhdqsoa2lgg5vowwel2eur4u4i32ddhxxxsfa", "bafkreidf77vszwvsvqeir6ld4vjqqyqgiwak4gsgohkkk5rpkmjwh7krva", "bafkreiffpvrintkue4eakzzgo2i6bcich45mzlinbabrrlx6ggsyboth44", "bafkreiabrhcl2i542mcbe7utwpcmhadrzfrhfroh3avqc4buavztpmoise", "bafkreibuckfysspvowo5go5sq72l7vo2d6zyqqbqxa3sxp5u5lzq7umeoa", "bafkreid3qhwsw3sbrwspa24m2hu2wnhv52egtwuc6yjbxmfmsxmrhv2pjq", "bafkreihwmieqvbtfrdreapeanvhvojhnte5ljcak2jkug6sa3hagxm45ka", "bafkreibmnswwy3muxwauw2a6u6arpzza4gdgpo4otdt7dua2vojsga4u24", "bafkreib47c323ax4jpyssafhjm45luuuq73yqgkei5ylxs35ud52cjws7a", "bafkreibfmhjpiljf6e3nr3rtaxb7se6hpngbc5l4jvnzexvzoj4ogvyjpq", "bafkreihkt4e7qudil2fdyp5tqxgurqbtsrip4nntnuypeoe2vye2s5mquu", "bafkreieiyviha4qt6lrry7wp2pfye3gm7luzip2pcqpzlf7bqvmih2wvoq", "bafkreiftdfoqv6ko6yozhbh5kpztqhpykpxqzriwcprefn664godrwhc74", "bafkreifc2sdgi5es6fgghxczfmcbal7df3gqveoqvofurwkuwxheqxmacy", "bafkreifuo7eznohc4cktn3m2kieyvqfoklda3fdm6cza6tc34ong73eii4", "bafkreiangwpbzn7rnbehh7ddxulyd54ikmasvsko3dscgxbk62dy5k37ju", "bafkreifcctmylhujhd2zxxf33xrn23h2b663jx4gomt6i3wgyt7f2uatb4", "bafkreidxyk5ugsut2i7sejk4urebul22pqvnt4tvlfcdwtcasxfz33ckvu", "bafkreiettlck327eluj6533sdor5yplisvw5wu2qmbvl7ksgtl2fxdcct4", "bafkreidybrsnbw342xcum6hpuxaaabupp3zh7b4kky2lg57qgpywoelhry", "bafkreiajejwcuddskd6zvcdasnobjto2gxqp3jnr7j27tyd4k3gbkkq3ki", "bafkreibfckwtrwngqfweirntvwksosqxefedq44h2xuor54ycpyaenoz6i", "bafkreibydk53cegzknlup442hcnvx3i2t5nvhaksm5g6crtm62abfcqawa", "bafkreibwqpmdzlaqrl4llybiyb36gqdpfss4itz4d7w3p5abc5clhztoua", "bafkreifnhonf6kep53devg6xw7y4jojbkhaa4ypbkx3sl3qtdbhqnhv5vu", "bafkreick76enyk2p4bjjecw3ofuifuk7ne4jxjt5k2p2n2khwqs77zm3gi", "bafkreieooyd7674xhnfih54prc3maj2atx7vluu5fsimpzb77i6myxqk6q", "bafkreif6gdfxhu7qvapyxvtwwvgnqtsfmhxkideinppjzkunpkbfbrrham", "bafkreib72whjq5fbdfqe3rtyegjvmrifetqcyyl5foy2br4flec2ns7mvy", "bafkreicew75xwvva6qre6x5kxa4fpfiy2ms6qeepusw5l3t7ghudfrsiku", "bafkreibtqeaqs4nuz7mk6pkucfo5f6iow7znhd64akenl2zwlygflqsole", "bafkreibadfzuq4wonyszlduptnmds2yqgx3vmzrnnfhkkmw2qtzlqxsrby", "bafkreidwn3blfookt2wmi2em7utyjv6xay6dbwcm7p3m2ogwqe76zs4nxe", "bafkreiebybbzbp3gl5s3cu4bvozbc73tq24fbf6ovcpnbe7pe3ehvv26gm", "bafkreibyy74go6kh226y65qdl4cihmdekz2tjtvhnj6lo4vlbl623myg64", "bafkreih3tyhiepto3l4r6u5nrrgew47zewgg75qejb3qtxblymcoaycf7q", "bafkreida4zhnldj6zrcqeh3gedtakyuoatlgklsczsccibo7edljite7cq", "bafkreibnyrmeupqp6ksuv6e5siknh4jq3mwdpzvuzwzwgwiqreut7kpnk4", "bafkreiac5g2okl23zkqtgtlc6i5r2qcfo3mseosukzmttvzzwoglhrgxji", "bafkreieokfibjxhzmeo4ualheax4hu6emdxdzcbkugjgqo6bgu6i5q34i4", "bafkreieppq47xwzekf3l34lkuhit223kcw4gc2p6iqi7hfxkutgvvlkw5q", "bafkreidtscptomprse5lpdigznphb624ylgjziapaf5jzwbddckwkoocyy", "bafkreialrchxduuke3frqim6rfrdqde4k7ms32nnkf4ifnmwfjk3z3caom", "bafkreiankq7peavntx4dl4wcmwejly3t3ikbnbdceumsewmolg5agrf2k4", "bafkreigezgiyk5ozz3afexpymgiqddfl6ucslxqnslenupkpdc6vlx6264", "bafkreigotly33xpvz7rfwpy3winbpjchyv3qnuushjsib5f776mjegb2oi", "bafkreieifqnzk6fxf6t46dggex2gvy4gkd62vkii6s4ne3ikuy6chiqqly", "bafkreiczh7sr7glp5edbe7ofuqf7tshhs6ts527j3ty575cys6qfmayrhq", "bafkreih2crlip7qszugv4cforhzg5zorjg5ubk35l4zouse32da22iicba", "bafkreiaeyj2v6gzudzeniuy76cm6sdcoc4uct6qslvogsj2pkbk527wv3a", "bafkreibstaqwrkhlo3rblqqmonk3ddl577e5c6zkynkvgolg7hxu65zkye", "bafkreicyfkuleehyh2udbaxkagn54nc3x44w64htel4o3f4uqbvigwkqbu", "bafkreifl3cyepu3il5lkhiywhux74hvxcfbcrxltx26cjdzga5z5mrg5cy", "bafkreih5n35uvhxzkjigdrgcwrjh5d4sasc3s6hj5rqy63rx44gypixgj4", "bafkreictibjuhvj4z5njoaccw7rbnrrsa4zaitkm7pcgmh5xubvkbwrlvq", "bafkreibx7fbm7gqdhyobbossfreuaxyv2ovzgia5wj4bqq6wwlfug2xllu", "bafkreicgsqg365tuyyephswanknjl7r7urnpbvxaiuzjuvbq3pjlocc5du", "bafkreicjwbid52hdw4loghmm66vrs3x4mt67voxzuiokdw3xgkv2nrcrca", "bafkreifzwqulprr2ewzxpk4qadmpqjtkggmdlfvg3iga6o4a5rzhks3uim", "bafkreihdx6qufv2i4pzo5cgixi65ye7hzip6twhrhkrkoa2bktklzfh3ni", "bafkreibnm6nwdii6dyzz2hn47ogffrjazimqe45ookhy7vprxt5ca5yhw4", "bafkreid5qkgjv5t6uxibt2bcxmvom6vel2pmfiemije3rcxa4ldv62s2ne", "bafkreibbfy7npswcyav47m4dkudd66ztzxe36fpzevwhexsjy2bzju6bgm", "bafkreidkl22umpgrqc5bxspyy4xes3ih7zypnqy54phn64dvhcrkqlhe5i", "bafkreih5rfbilsezkovk5kwyqkgnyp6vvvblmemayabtqk3xlco3h4ihge", "bafkreifz45cmqfcpokhhtbkevcz67mxeko3s3cvoxoxt3j3qtard5fp6pa", "bafkreifpzknq2oyjbdnkumxbi6qqu5p5becbcovd6yydsswmx7zcw7vd5i", "bafkreibslkgwtpyifahd3g2xdu4dn7ccstte3abcde32nzohqav3ejqzyu", "bafkreif7c2fxova4t5pj22jhq2257q3cgc4mmreah44fnudjz3oq2plkqi", "bafkreialccgfpo4cwb6scvcmixblquexulnxp53py72yycsbvte3zfxnru", "bafkreieietxmzwm36vwf4lxk4ketfqkwzuotdd4xxlhnqmnyk2ofipk4ma", "bafkreidxvwi5jjqr2l3lfpupdp72dvsuixis32tvvk67erelkztjusmifi", "bafkreifhaokjl6dd2i4jlwhztdb6izgfc7ccwt5gnjuaqu4idk4avp3gvy", "bafkreiasvyawrxdeo6myq47kg53piv6q6z3246wwfk6a2e2ee6ngbtfgti", "bafkreihtje2gpnshyhzm62gacf6zwmhbx5ermiksliwnpash4axpgki3kq", "bafkreig4tzmevifldcp2e6z6tcwca7g7zxb6vvzk62abelpeir2vr4p3ei", "bafkreido53nmpffogu6sbsvuhmoxofoq4ei6its6jusgegx2uf2wkc2keu", "bafkreiba5u733ksl5t5kpod7z4gwsgeppetvs7yzwzi4tb4syblemzabty", "bafkreiainwtzglor2wngsnuhvwpve6dgf3zziik55mvmogluqi2d4q3woq", "bafkreia2rf34iweftipyb5rladiy5cpmutcwemvpqftzwul2tpadf57e5a", "bafkreidamysgieev3v4slyef4y57wbpppzygea3ko6cb34cogfad4hg544", "bafkreiayskxz73gwqn3e6nzud755j4mkidsxrzzqu7nom4y6vdkegslhxm", "bafkreiauu2er2woww54k3xfolwdqae7npc3sodp3u3zr3emodvrv5rr7i4", "bafkreifbresr7zoycpa2lnqfiw53klohcqh3qajgt65yqddivukxggqkda", "bafkreia7imdnk74fyswfigb3teegrmlpm452tr3czi6vz7fgmbrvp2nhxi", "bafkreih26ggxf7qbyajmkhnxm54d2pn66oprsztuedce6yj65gfa7cdy3a", "bafkreifagd6t7niofo5csroppwhwaj2bfekuxynbmpwjzj36cdnrpwfyrm", "bafkreihzw4vlf34rvhups2ngvkd2uaowf6fiuhv2y5jqcqxy4cixhvnvsy", "bafkreibmudpneiwgqyvm6yo6my3lx2rc7xlca7kp64a7motnrretiusawy", "bafkreifwudg7buc4m3kz2a6h6fmb2ge2zbrydrrncry3ej6avcsaq3mhq4", "bafkreie5xolnu3mm34utsn6uh75jjjgtpdacmz3onjzdwdzp3rehoc36j4", "bafkreia3l6vwpiosvvp2viycnpfupfpp4v7vgsu2ekf4nv574g5qle3gnm", "bafkreihuzwrs2iuwlqbjjwrpcifd3hhib2k6wtuc62g6tysp55dngvhpym", "bafkreih5ardsnq5nc7snjunhocrc4i4yrqwy62vgmbl5fqh6kbgzyksfoq", "bafkreibkgl5zllpx6ygjo4baurfei4ec74h2jhdt36zwctcubithijwuxy", "bafkreifmzvsxhigya7twnvjewsbtzjr54pxkw5o6ismfgwvqrzk7v77zqy", "bafkreigt4a7efqoo6yfp5h3miwazutjha7fhrkxgxhht7f77h646vxgeca", "bafkreifgzce6s5vswcdx66dn6ha3r6zqv2ddb2lrcwsk543uf6gi7k4wwa", "bafkreiabkign7vkrvefzqdwgc632uia5z6wumqcyatqxl3uegedsvtn5ue", "bafkreictkp7gzsr7abuo3mpi7yvweyomfyvjzmgirwlr6fe2zsk2h5tlie", "bafkreiew4uqiyiknmkiibirswamr2dhvtacieqpakpftukoqibdx324vui", "bafkreienpficw6ta4jfm7mriqs43ot3plntjrikf4t5xpsm62uguxqqcoi", "bafkreife3c2xcoc2rlhian64vzy4pjwukul3agep44b6wgqnfpwkqhge5a", "bafkreibnutj7vpworvpc7ewhsyslkoohk3i4px5bevsufknqupeng4lura", "bafkreia5izyel6bdot2gkue22r5zs3soe5e5mycd3htrzrofxxvjcxqlqm", "bafkreie5apfp5g6iz4toj4mrp5x6dg5qlblne5ipkwptztqgltuvvf5g2e", "bafkreigo62chk6w3e5epx56qk6ddgwzbg3iisz7uopv6kt5r34gv5lcopm", "bafkreicwmli3j42islcpozrq5o7evifbejnhpaoyt4ta7s5wopmxnh7xwm", "bafkreifui4jwm7lai532iomp6zc4aipfaem7w7xx2nrtq6lbr2va6wtqce", "bafkreih4vtwqasep5qljt7g57kdzzi5yenv2rctnnapkod6beglc4rhkra", "bafkreig2hpjs4r662lkrmi42musjkz7mtsnuetpxukazbyrqgnwe25gqsu", "bafkreidv7dbs35sq4od3tqr4xj6qsle3zjwqpkw26qf75tw5rktuvigsta", "bafkreihzqfzry5s2i6ifxa2ew4i5ywc7qvr4wo7xuohiqhbcxuvhayqkqe", "bafkreiecnsfhgpiqdc5gadxhv6wbkggaen2nvs3wdicw4liq66t6uyytje", "bafkreif7ikt2i7z3jwvt56jsdgfyqbwmuqjy2yn3yph77c76qpejuce23y", "bafkreiak5fwvkbaemcsaadttbfyb34fwjkydn3b6vmr3hxggg6wcn3cfty", "bafkreifbaghdmba6tbh6jngkn7h5tugkshkxafq4i5jcujivfyrk4z6yvq", "bafkreic4ueom64kktmv4ni4qdosk5poqjh3ia6gr7n4s4xmzrki23xf6s4", "bafkreigbzahjlyeijb2xlcaoow354ne7kzh7vzfs2ighmzyvoat5m3gh5a", "bafkreidun42m4wvm2j7akchk5juhw3mo5keraqjiamb5fo4rolz4sznhqe", "bafkreidbjavny7emfxbf4md4bqox2ibkkswcwunnnf75ekgbm5amzevuve", "bafkreigbmezw5utksbakdixiz5hu2wxljqdzktas4jkbmtzbg7f32uhhjy", "bafkreiefr2ycb25khralgsvyex5t6sslxzaynimqmfg6lytprk3x4cqmpq", "bafkreigfql5mbeniq2eqxhyu6egiydj6dmeeqaoggnugn6moummlfqfn3a", "bafkreif3vbdqiruxjcpxbh77kfhmp4yqfvo6k6ntl2nkcyx6aa6g2famuy", "bafkreidrkan4osn6p73kzumx7ypzrbej4tdl2gtzu7qty2emursfptizim"]);
  await collection.addCollection("Pirate", "bafkreigfjlljtzp2mrde7sh6tgp33eco4ykietnqn2wpv32atrbz4wo334", ["bafkreibehvsz7nm6e4lo367ewoggdvrqhmcor35cbvamkcwc4andsoempm", "bafkreiao6hdtil62pgvdm7x5zi2labea66ipn5zmyf4e2w63t6l74hx4su", "bafkreibiqqttzgbmi2tdmlnbey24ld7auyvxkpxkvdsf7chvguluxahlou", "bafkreifrn4weoxeln3g3cqm5cvjsteyuy6jotn65u24l63pwrnk2bzqqxq", "bafkreiewaeqsdpwhfl4lfkkafkfpwp352hsxk2ydd4woa3lttdx4yqhese", "bafkreifwaimmymzqf7ueihiltk2y7fmqhov7o7ymbnh4cnn327r6fhwcie", "bafkreicwlkazwpkb4h4y3xn2vejeka74icavdkxcldn5tegwvw2dwjgrym", "bafkreigr735lixuilq6lkmla4t4jsguhjyhbaqpdjcwjecwcqopis4n7ui", "bafkreihgieatmxqliddcw2iag3ukoopyyz6twotuszhgsgsr6dquvdn73i", "bafkreifcngiosqp7ekfpdylxgl5zdn6aj2rtcndl6e7fvxy3rig55lkkya", "bafkreibrswhydtmao5aarajwwjqokpe2aqjsykh4lizhfkcynhpnxco4zy", "bafkreihkhwmf3253pv6tzw6h46qspmzg76k6msbr52rjlrin6g7if6hmdy", "bafkreifp3d5zohcmo24ayt46nd676xgkt6hz6msjsfokcmkirttrtt3d4a", "bafkreiej4r22gjsss5bubwfca2etzsghbddrv6gap4pehjceyzephxr5pe", "bafkreifu3kssvelvvjjiswevh34nzoa5t5noo6tdhdzcngs4gxa7rv4s7i", "bafkreifqqfbxjnqmxu6gdj4komrouoixxu4hdpzhvw3johbamld55ryipi", "bafkreidlmancb5qw75ju2oqxbpj6jvyl5bti55cl4qtshydqeavhbu6twy", "bafkreieejgxevfqxm36dm5xrrfmxak5pmav5pbdsg2wjck5xazm6nveuee", "bafkreiennajl2jvqdtsvvvo6yirpgclp4xllrefqfv4i3rjp7jyxbz2wse", "bafkreibiecu4rqmybhsfzekqzsefcsikfhdmskf6b7o4v32xyu4kagoe4u", "bafkreiakxc2tuvqnahwd7xjmmz2udfn3fdbsixadwmwf2wfkvd5dl5gpsq", "bafkreihzuuvmqhbjtsmvhx45p3ty7shn6dphutgqazgddfsrvt3imijzqm", "bafkreibxmchmj6kcdbi5goi45wc6z4sdm6vwjx4axbo7y7sl23hmi4ounq", "bafkreiarsm27dm34rar44dglbyfpxmgkle627jyp7rrsm3rgqqfs2i5jei", "bafkreidem5chphyslwz6tkx65go6g7qamrdugiidua2boiszrsc4fhztqe", "bafkreietmksnzq2m5rongkbryyejoxpwam23xod5jpadwuskelp5dngony", "bafkreiezpszam32ucqxqxl42wmaybjo5gaxiqpxsilb3ez7dljszodomu4", "bafkreihbvvhc3cljcmztncfbllpiwknoaaxfdscioj2cragub74uchfeba", "bafkreihryts2lumoiltoafhlztf37blwf623fikiwgvz35qx5qnocyzesu", "bafkreibgsssuspljhzlierrcx64cywdazjunjr3h6g3dc636qzcvg34ufu", "bafkreibgtuuyk6gjvbyicsut2epzlnme2q6zbescn3az272izfcipjtiny", "bafkreig6lxi4vaikbsg3zdgytjecij2vy7xmh6que3zbmqex6jllgg3hfe", "bafkreialrg24f32g4rt4jywb2ex5plaxjhcdvpfpdsyyott6exzx3kggsm", "bafkreifzyxwnckgpdcb4ekzfetpghedlbfjvlkfwamhyukwxfjcc37g7si", "bafkreiarsm27dm34rar44dglbyfpxmgkle627jyp7rrsm3rgqqfs2i5jei", "bafkreia6dmk5advqj4ynq6xd2rdwomq43rjjuxlhc245j4764maoyxaq5a", "bafkreigjrpflvhilompfatmoq3mg6nadgepcmeyc4qnlyjgp4soz25mfoy", "bafkreihslnnvvw5xbo2264a7fukr3ewf2ryqzi5eos7vmst3z7bezxzdyy", "bafkreifgqavvi4tdzenypa4jzyhkvs4rkftlbqcq6shzhp7sag33mg4key", "bafkreihgcyrxpoadxz7chrlbhtavadvijnpicnensvojigaw5iivrp626y", "bafkreig6mlqvzwszqchabh3qxcrxkpsev3o53ze5uqgbic5vbz2u3r6hha", "bafkreifhwmpc3wsbwpajfvgnglhyns4uqy2wuieqt46fo27bffbcpplcpa", "bafkreihxbsnsu5rbrxgxdk4ftubs3rftne7qi3kakhi6v6xh6j5bn6kzsq", "bafkreiawcoatoq3gby76ok3tcbg7odapuloa53xnrhtppfltvvpnrlgue4", "bafkreibgqasolf57cxacbkxj2tjcrib6efd6fsvcclje66dzzutbmoqbzq", "bafkreiahzrpfhpaqlvw7tgm7iagmuxt676ncugjrq32jbvnclm57vqxbtq", "bafkreibzi7qyck3bhronahfkrpl7y3ulvva5hoo3g2ut3ec34i64ykwq3u", "bafkreicyrbx7742fntijjtr7qa6ht43s3ghrnkkztdt3vxkeniek75oo44", "bafkreibzvkbsuclugdojkrtiv2tcearvoyrlgyuvxicxr6syamgs3uvqhy", "bafkreibp2csp6ixo3og7ppzzmoq3m4y3dh35vtmaw2not4hzr5snhoqv5q", "bafkreiejdo4n2cscfu6p4jgpr2o333zlelq5bnbdnx73vyirr5w27fux4q", "bafkreibwqynn6jsywinngfi6l62k2vkd2s6a6ic45oqp3gfj74pho2pkku", "bafkreid2d3nndddn27vafa7bqwaoa3reb4wa6grsnnif3cpnaupkkcd2gm", "bafkreifftlfpbj2orsysbyevae6qgz7r3vu572tr3bsvpqf6kqlxi5ztke", "bafkreid5orzcehd5vts5ba2zs6b67hcuul6bfrmreh7jo4mdhypisb7igu", "bafkreif7qzn3k4pupnsas3b4fejmccn3uwqw6uq5lr5kobahb4p6siueza", "bafkreickelfgatht4jni47w7whyhfdx2qqw6sn5u2isotnkhmvjacsa3mi", "bafkreibeooqgzfzilfft47a4omiz3na3fg5wjptzr2yravzzz6uxjhtdem", "bafkreigavcblyz5niwtkqt2gyy22bcnyzg6xigd2qexwzbkpvwqim6yzmy", "bafkreigrkfpum63rm6ym32baa32rf5ofsianoajs7elsmvslfwirqnhgka", "bafkreiboteadtyn5u5cgyn4zdhc2jpgz4vbsci6fjiejggtydimdrdpqo4", "bafkreifp7vo6tcp3kxsuroxm6oljstuqapneyee6ch4ay4jc747xeqx2ci", "bafkreignfjajcpyzacjxhh6gvzkxzlxjdgihe55ruvntr6ie7v7bpcr5a4", "bafkreicxgfyw3xcfcmxicovxb4sjv7e2alwhdpdzahhmv6js4y2qvaqp3i", "bafkreigiurqb622izg3gehrnkieaca4gqhkg4uib2deufyzfe3xitsx7ji", "bafkreigoz5nvpud3u4ygovgdgtzue33bshsydc4shwugm2ujvgyr6ak6oe", "bafkreihrtsvxd5apy5pl6i6iyk2fr2xgmob45unu67nejymin7maecan5i", "bafkreiczhnz76tynuks4wzubdfp2c7ebrpdjpqp4nlh75oiczb3vkbsh2q", "bafkreiawswsnbcvrsqtnq7hvhryumz53airi6zfmorlh4cdza757jv5oxy", "bafkreihxggcacmemeycwvk5lroq35kvpbarlyk3tzy3l56ofqkkbt45f7y", "bafkreigws4nvgnq2h3frakdz5qnlyfwsy4zngmd5lsbivu4yy24nrnmrgu", "bafkreidx5nuuzlsiq3njedyuwzv6uclkzdhlavvvsswxe6w2jv6y637p5a", "bafkreicdz64tc2rthvpavqev2uaun4ijvrtwbwe22zcy6yymzmkrsxevgi", "bafkreid3lmzbxozciu66hqs6hydrikowuwfxop63l7oauw42nk3pcfuf6u", "bafkreidezaghwaqgzb7wgwpzgoszsypkpndt4am2v44rtoksmanft43nka", "bafkreicueuzkzjsxyrvov7hsajjhbm3bcw3dza2r7gipiwrkabhpzbt7py", "bafkreiafuhxljjfaqdwsdbhng42cfcpc6kgf4eo5jiaop5ddtoutt7kaz4", "bafkreigwb4klqmfayhc4vap75isghequmivdqj4upwz3kwi6vukcuhaw5e", "bafkreie2ymcgg35qcyfwjalzi7u4ncgt6z6gtxsdrfxoyhesjipwidhfgy", "bafkreighvx6dbvfz46gh4or2fxhd7uzzg2diqwfkhrysdggw7bozbwevzu", "bafkreiawyjm2hig62du5lgu6jkbzh6qgfwthkxecc5hi77oq2lmxdw37gm", "bafkreibctmxmzsqpv2aw6ghortrmckhbdlgx2en53i3aom3jq7ywj4oyvy", "bafkreihbmmun2v56vmcnhmtc3rrmywi5ye3mjn7i46vfat7vktyniu5ss4", "bafkreifiadeevldvxyery3rits7b4a4gzphtxhy7cdqgk6qhpjzslkzt3q", "bafkreigbcopi2lj7jpttwngdfedvnbfpvohohbyvecgodoa63pf337rrui", "bafkreiakyliqt62n5dbvmxruwmxzmyu2mk2tbeqygrf4lcvahm7jryivya", "bafkreig3gdrbv676heizkr4iv2bbgjoviin2jdrgdaddrqv6jnwsyac5xm", "bafkreiaoroc5vfke6bwblscsewovyfu2jhtoyqt3pgjvwj6apzhbbnjtbi", "bafkreib6l2aiwtdl23uaok66x3k35dpoirxvmom5jwnbsed2qg5po4lqg4", "bafkreib3sazecbnyk7y2rtskt7x64pf6pnmfsr6m5dd524xb2j4hoafnj4", "bafkreibdrgafive527xbaf7mcdjukc5nuqi5njmgzd35uf5b64gptakjvu", "bafkreigimil2gdo5l2sgct5koad5e4q7ecfkkxdrxk3yhsmkyj5tj3emnq", "bafkreiewxptdtcav424kd7iwigaa3lxoraafovj4olyjld25y2yio6ouym", "bafkreifmzhcftyndwsapiylkdilkqqsh66f5tbkhc3secgfynd7ax4g3gy", "bafkreiamoevm6slzabci2uk4sop7pptf6twvw77czmbx5bnqydc2fzzkni", "bafkreihckhfujh23oawt47xjdxwk6sdpsyitmkvouauxowggemqdscm6ea", "bafkreiezz5honka3xav5ga4ofg532pkp7d5b7okrf6binw52tqo3mgx2pq", "bafkreie4hzg5jywxzk7cijp4fy4urlsclskycrrqsam2e5n4aka3ql4w5m", "bafkreidm2rx73u7lhhmq3pqf2mvxdzdoyol6tsh65vodpnesn6yguhnrc4", "bafkreihgfa4furdfxopyb66tt4p3t2e7aexyjmy4onszn5ukirvke23wgq", "bafkreidz5q4wvhbodx6344dbi67ijxh6ltee5dxv4azcrftfakabi66mli", "bafkreifd57cecak2unoggmyxwiivnwk2c2234ps2hscvfc2o63qsyxko4i", "bafkreiecogclr4zxbku44tipd6an5qr4hn6k2cfhqk62qybxhjys6beky4", "bafkreifmj3n5xposv4t5qsfie3lpgkrr6rjpasswmquphmh7fuhddwcqam", "bafkreienqrhhgvg4s6dlzlr6ulfydg64eao7tub76bw5dfyxuhh4ji3ara", "bafkreiguf4p4jb2aoxcfetrjouhe6pap32omhfm2lrce3mkn6tqb2whpiu", "bafkreig2fbrebuqwdhb2qi3umm7wlcnjnl7ma6tmnnlyofvcqcfreivuwe", "bafkreiebivk6bsnfbkkjahugsm755oa52qjw5m2wgqgcuxhznlzve6ldvu", "bafkreibe437sb6ncv6dds33buqz5zavsypvleem5fovusjn7kr24t3gcyq", "bafkreidjovz3fhhry4hi75lm5mqqr6dnnvexkj75s7fifdozxidrbv3dlu", "bafkreic2aijmudvgkjozyufvxchybhgwjb4masiwnw4lkgbola2kzxfzau", "bafkreial7y276btexuqvrre6wflogxfnxkz5xbg2rti6bk23v7cxy2opiq", "bafkreigkxqy6fzmfy22vydq5mn4otws55ac6g6y2p7cktz365h3thu3kqi", "bafkreibholqkyrixbsz6glmxgyzjuorwqcb55tk6o67ckyx74d6ev4cqdu", "bafkreihqjv2nf5qs3xerl4etjftw6kpmd7lfyws6bdxmkqlhx2kf46ikzm", "bafkreiatqnkgttsqpmbitwlvcnml23jppanpkubnplfe6q7ona4feb2cgi", "bafkreicu5ftlvhrbquajagnkevoadaaxr23w3lltx4n54ekstyvk7ejg6q", "bafkreiaebkd5i53wkpzanne2uylhwvpmpnxxqeftv73cfb7mnwe4x2hsvu", "bafkreicd2kqkb4xiwy2roadto3kv32gb3axmu7asrqr2sz3wob2c5aknva", "bafkreiafzvuy27sakjs5uc7yarbhcp2xpnf6zq6lzpuly66mmbv7ehy3me", "bafkreiakxc2tuvqnahwd7xjmmz2udfn3fdbsixadwmwf2wfkvd5dl5gpsq", "bafkreigiiiyzyrsrieorq2lxejb5sz3zsbyigmxyh66lvsf35ryfwv7ceu", "bafkreifp7vo6tcp3kxsuroxm6oljstuqapneyee6ch4ay4jc747xeqx2ci", "bafkreih3wr7g24blqxezuao5jze4uupvfyfn7ux23mbvupffi4elrmb6fa", "bafkreihliduwhopx2tz5kbahwjjqbnsi2iifze4lqw53tdr7zc5e4s52ju", "bafkreigqtwow45bfg2sf4w27woqrv6zcefk2sdpx4uazxf5kzb7liflqdu", "bafkreiev53qakmqi244qg5qkpu3ut5rsxzrkkj3csnr7dn4nhzdtw3a7ye", "bafkreia2kuwntpk25yc23e622onjuco4jjioqhtuuouoky5d47hx2ypcvi", "bafkreighouutkqpvyr7csfnol4y5nlmm4ju6gnlhsmmuidhacrgvbghlhm", "bafkreiggugtzd7ih5wstlf5y24lhovlkmowvmrv2rj57f7d7cer2rn6s5q", "bafkreicgbhhxoomyaid7inm3znmiuisjargvn46iovya34gw6klvcgjpwu", "bafkreiebaadwtxxivczkxlph5cwog25mt6yovq3eu6fnycih33xnofokqi", "bafkreic3q6muvaa73oh4iqapn46nl32dmbrv7c263tcxzdt3gnfy22vo54", "bafkreihrbez7xkrmnz3zhwenlq664njkgjvn7q552dkauif4fi5hhorsoy", "bafkreiawgbwtpu75zdwk7wy6bd7kr45vkjt3pngkmvj2hm6s4n2kojq4ma", "bafkreidnu2wsgpz46hcxvbdb6t3whdl65zhopverqtpdxgvlfuv2dj6lvm", "bafkreie2dcyelhi3r6horny53xt7j3aglv55a6mslflcqlmiroozluhpyq", "bafkreidt3tcaeoztpudg5vngevn6yqlohlmgqpmzaanfybue3yckkvv6qy", "bafkreibem3e6v7xkpby6ohjzkzfq7lw2xmbeb5we4mm3i2ozbhov73qvee", "bafkreidc5ikhxvgw6cbvzvm2de7ngxdcdzs64ivwk6uro52ykmah3iuoau", "bafkreidgipmw6k3szt4qake2feeolvqkrtpzhejzaqjtaehe2ocjxbd5da", "bafkreigyej6rxf2isb5mlcuiuf7pihze2vixpcmwzzkfbnnrspi4oe4p3e", "bafkreihhuyfipnxc4gjaxmq7dsxf5g5766phcrry7dtb3qi3e26grzhinm", "bafkreiei26rj6zjtghtggkb2qrpqvdrnzldsl73qh7dovachuco4cd2rxe", "bafkreidqqljnd7r5n3oyh6nesovbywhc2znqdcddgpnqyl64illvkc34ci", "bafkreidvq7x7nahndzvzh4hk5pwevgoq7q4mp52wq32horhl4s4mbvkfcy", "bafkreia4mxw5f5sallisxvcjni62t7c3rvpyni34uie75ydoew2xo6qocy", "bafkreieqt76w4pgvy2hhnfltq7yfjtfvt6txlgvgqaftxtzgsxbba4bigi", "bafkreidt3tcaeoztpudg5vngevn6yqlohlmgqpmzaanfybue3yckkvv6qy", "bafkreielukpczy24adbzosm7irjh7h6o3z6hzmcmmmrtie6jq5o5thf7yq", "bafkreihq4r3g257d6t5rj3ddjcjadx2vqt5fa674lp6uma2uyqi63faszq", "bafkreicnyeqmedrseo3zmipxs3kne56egvzbkzqcizk3xoqwudatwinr5q", "bafkreihehj426rjbouobhykapuq7xldp6erjgksputignltwfil3zyazv4", "bafkreigclm7ozryqd4p4nnjwfjemx5537opmm2noekzvdko7cyc33l4oou", "bafkreiaky4hstmy4qvhy6omju6tmsmxi7qpampdaancchogvwceuaxgetq", "bafkreibccc2jf2chtlgoejcau6pfbluot3htujw2ctqelsrklcojj6jfji", "bafkreialsrbpqbbum3miaijijnvzcnkw4jpwcqli2nxjw5bsfizcyq4icy", "bafkreic533vsfb5vsgog4vqhn5v6cnwl5hnnwcco5cqblgyco7seewsvnu", "bafkreihndn6244wfzyek2ouowzgkkdxmtxoytethzvads3t2u5zfxqbwyy", "bafkreif3n7iewrg4dxepfh5vexxdxwt4puixxjf3unkbdfkzs3rza4qxcy", "bafkreicdczmjlsnjjffyfmvqkzdncnk4q5g3r72jlciigq3llyxwliguy4", "bafkreifgkv43zypokplskoggttauctab4ght2ea54thlqigcwoiqnb4yv4", "bafkreignjmvbvipymrnfw5pczkvgmeyogotbagzsez3c6fgosg7sulheva", "bafkreibp5sj63ugn7zojfoekvott6kjoczdcdwpi7uj674i2a2ew7sqhzm", "bafkreifk7jy6yqkqm24fxwoqald3klek5f5cu32vhy3chncrr3q7i6htsq", "bafkreihliduwhopx2tz5kbahwjjqbnsi2iifze4lqw53tdr7zc5e4s52ju", "bafkreievro6yoczea22hh544xwkhpslnicojshmbardrypjnawoh5u57nu", "bafkreih4nuqnsjdnp3zfmopl3ntq6uxnfllazypxp3l4g6yfcjpdlphure", "bafkreihn2w5phqb36gfvdb5posqz2ysrb5avow7obmvw5oyclrnsl2ypvm", "bafkreifqt25gofbfd337xtfxkzpguyklqmnprflm7kxlzjegzrraskrlta", "bafkreiahb52eh3pmvqiub6vc2tl5ngw5rmp4pwd5ttpxjpdg4z4pgbr2dq", "bafkreihsck2nfitjl4i43j3it5ygqdwjhx3liso2grrr77cmefrootocdm", "bafkreie4cvbuklyanife4ips4u4kom4nowzrj4jzwhu7hnwkzyxiiw6yoa", "bafkreidbkuosbghoo6ddx4ydohbjqcs4klxercu4m6zlovvw2opbxnif6u", "bafkreihadavwepzgbin7jwwsww3whblnjnhbcjucfjldhrubsqljr24rea", "bafkreiheu6f5h6rnhf67y4bza3y4fo2zoz7kozduqh6c7ns3vqhfbybhjy", "bafkreiacngctlgnf35bcwx6rewhxxnyci6npomaqx7es4fg4fujvp4skge", "bafkreihxc5dqudgbrt72zavyftzwoov4frh7jltpsvgbpeezeux4hk42z4", "bafkreifbggl7jgqk6zavk7acpdudx2zpfdqnwte3r4l5nb73zhaqw4fjye", "bafkreihwhjaqrjm4gbu3xxklqhplmeqbzoyek2glzkwgajcotqbbqw2ryy", "bafkreibuqpeeffj7iwqyhclwedhge2emovj5p7jokfmashn3npi4zzsnim", "bafkreifdl5yep7nzdd5dxaf64dutrctgmgawkwxoqugf6wqwrodkega6ea", "bafkreicygnp6whujspvpd4qnv4pyyybf7zaqfm27hloudqfyskm5gb3zqa", "bafkreidptnel3hjy4ll3dkwoo2652nzq56ea7fjniefis54xsn45ronjnq", "bafkreibo5svtnmy6dwnvk64pq5ezj5jdhieiudyxuoehzdulnkn27ioxai", "bafkreieguvpcgd4sd4fovtfj3ebptixvmq7ntpxfupnw2gceyy64ly26t4", "bafkreigw7vcuxibbxcarqgmxpcvxjzz7edbfywy7aby26dnokopim5byv4", "bafkreiffgoh7zmak3xoumnhgubbg66wicigiq6uqtle5h35wqnypembueq", "bafkreide4nru6dv7hqt6evssmtgpowt24r3vhrv7dfsor3sf7cgn4afy6a", "bafkreiciyru4omesmssw6fcq54fkyd3yjkjeboc5mksxvdmn77yf2fb2jy", "bafkreiglidnsdp3iqftwrdxhhunazynho6ljvknkie2lznqjbtigsij6bu", "bafkreigc2vvaes42ddpmpy3h4nrkr535wpjkhnjtzcyfixixhaphyjqv5i", "bafkreib7p36sux2lh4wwmi3s5pzkqctbdojsshruktitq5i3sudme6qnzy", "bafkreidwbtoq5p6igscw4bbguox3wqcp4ret52yyvhjt7z6azlzwfxodha", "bafkreieyll5ewakepbt73lw47qilsv7dxv5tbarj4cnkm4g6xx6ofkbngy", "bafkreieti7bgrwckjx3sgvzs3kgnrspy7nhtcqfd2om6lsz5qvkirhizqy", "bafkreih3rrv5q2h5xf3yz3gupayromiktjuvttt7j5brd3azc3delufd6e", "bafkreifarpz6tw3z6a7ed7lvwor5vkvxhk6eek3c5lk7seikxrccdjs2l4", "bafkreiccgkcfy2cmfccilrz556gnyhle6kauaz36rypwpbqkri5ctl7ffy", "bafkreig446bejk6y57lczd2htxygqslpuaqhe6b56hpqdauifxgtihv3wm"]);

  console.log("Collection added");

  await landNFT.connect(account1).safeMint();
  await zombieNFT.connect(account1).safeMint(0);

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(main, "MainContract");
  saveFrontendFiles(landNFT, "LandNFTContract");
  saveFrontendFiles(zombieNFT, "ZombieNFTContract");
  saveFrontendFiles(monsterNFT, "MonsterNFTContract");
  saveFrontendFiles(collection, "CollectionContract");
  saveFrontendFiles(tokenFT, "TokenFTContract");
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
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
