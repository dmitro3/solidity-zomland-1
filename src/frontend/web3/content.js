export const HomeContent = {
  play_to_earn: {
    title: "Play-To-Earn NFT Collectible Game",
    desc: `ZomLand is an interactive P2E NFT card game with exciting gameplay and a lot of funs. You take on leader's role of the army of zombies and monsters to battle with other users all over the world.`,
  },
  how_to_play: {
    title: "How To Play",
    desc: `You need <a href="${process.env.WALLET_URL}" target="_blank">${process.env.TOKEN_NAME} Wallet</a> and some ${process.env.TOKEN_NAME} tokens balance to play the game to cover blockchain transaction commissions, storage and in-game purchases.`,
  },
  login_using_near: {
    title: `Login using ${process.env.TOKEN_NAME}`,
    desc: `Create a new <a href="${process.env.WALLET_URL}" target="_blank">${process.env.TOKEN_NAME} Wallet</a> and following step-by-step guide. Once you've done, you can log into ZomLand using this account.`,
  },
  mint_or_buy: {
    title: "Mint or buy Land",
    desc: `<a href="https://dandelion-dash-25e.notion.site/Lands-600806d8c2bc464f83bb2a205722fb85" target="_blank">Lands</a> used for mint zombies every day (the number of zombies depends on the type of land). Read more about <a href="https://app.gitbook.com/o/ZNvVSLIdUSvTsBdpbdXF/s/vEVc4XwpzA4fPbfWMYl3/game-overview/lands" target="_blank">land types, prices and limits</a>.`,
  },
  catch_zombiez: {
    title: "Catch Zombies",
    desc: `Zombies can be
    <a href="https://dandelion-dash-25e.notion.site/Market-8f465bc4d5bb4b0fae36a2bffe3795cc" target="_blank">sold in the market</a>,
    sent to another player,
    destroyed to get <a href="https://dandelion-dash-25e.notion.site/ZML-Token-3aec17461a7b4df79a3abc62750b421c" target="_blank">ZML tokens</a>
    added to the <a href="https://dandelion-dash-25e.notion.site/Collections-7ef9dd8d414847a288d992e7f3ca4714" target="_blank">Collections</a>
    to mint a <a href="https://dandelion-dash-25e.notion.site/Monsters-09efe65232ec4b01b143a1a63c61bf47" target="_blank">Monster</a>.`,
  },
  mint_land: {
    title: "Lands",
    desc: `
    <ul class="sm:ml-4 mb-5 list-disc flex flex-col gap-3">
      <li>
        <div class="text-lg font-semibold">Micro: 1 zombie/day.</div>
        <p>Limited by 49,999 lands and one per account only for 0.001 ${process.env.TOKEN_SYMBOL}!</p>
        <p>Contain limited zombies amount.</p>
      </li>
      <li>
        <div class="text-lg font-semibold">Small: 2 zombies/day.</div>
        <p>Limited by 9,999 lands, initial price: 0.077 ${process.env.TOKEN_SYMBOL}</p>
        <p class="text-blue-400 rounded-full">Chances to mint rare zombie: +50% than Micro land.</p>
      </li>
      <li>
        <div class="text-lg font-semibold">Medium: 4 zombies/day.</div>
        <p>Limited by 5,999 lands, initial price: 0.15 ${process.env.TOKEN_SYMBOL}</p>
        <p class="text-blue-400 rounded-full">Chances to mint rare zombie: +20% than Small land.</p>
      </li>
      <li>
        <div class="text-lg font-semibold">Large: 8 zombies/day.</div>
        <p>Limited by 1,999 lands, initial price: 0.33 ${process.env.TOKEN_SYMBOL}</p>
        <p class="text-purple-400  rounded-full">Chances to mint rare zombie: +25% than Medium land.</p>
      </li>
    </ul>
    <a href="https://dandelion-dash-25e.notion.site/Lands-600806d8c2bc464f83bb2a205722fb85" target="_blank">Read more about Lands</a>`,
  },
  mint_zombie: {
    title: "Zombies",
    desc: `
    Zombies is your numerous army that will lead to achieve your goals. 
    Each zombie has it's own characteristics of health, attack, speed and intellect that affect its price and used to create a 
    Monster - strong and cool zombie with additional features. 
    <p class="mt-3 font-semibold">Chances to receive:</p>
    <ul class="mt-2 mb-4 list-disc ml-4">
      <li>
        <div class="text-gray-400">Common: <span class="font-semibold">68%</span></div>
      </li>
      <li>
        <div class="text-blue-400">UnCommon: <span class="font-semibold">26%</span></div>
      </li>
      <li>
        <div class="text-rose-400">Rare: <span class="font-semibold">5%</span></div>
      </li>
      <li>
        <div class="text-orange-400">Epic: <span class="font-semibold">1%</span></div>
      </li>
    </ul>
    <a href="https://dandelion-dash-25e.notion.site/Zombies-7785dcc7ca5141fe9512038c61bf02d6" target="_blank">Read more about Zombies</a>`,
  },
  mint_monster: {
    title: "Monsters",
    desc: `
    <p class="mb-4">
    Monsters can be sent to explore your Lands (you may find valuable artefacts or come across monster hunters there), used to fight other players, 
    increase the profitability of ZML stacking and receive airdrops and other bonuses.
    </p>
    <a href="https://dandelion-dash-25e.notion.site/Monsters-09efe65232ec4b01b143a1a63c61bf47" target="_blank">Read more about Monsters</a>`,
  },
  roadmap: {
    title: "Roadmap",
    desc: `We started development process this year and now we have a clear vision
     how to make ZomLand the best NFT game ever.`,
    sections: [
      {
        date: "Q1, 2022",
        title: "ZomLand Idea",
        desc: "Prepare codebase, game logic and roadmap. Create website landing. Start social media promotions. Start working with strategic partners and advisors",
        type: "past",
      },
      {
        date: "Q2, 2022",
        title: "ZomLand V1",
        desc: "Start Ambassador program and Testnet. Launch ZomLand V1. Support NEAR and Eth-compatible networks.",
        type: "soon",
      },
      {
        date: "Q3, 2022",
        title: "ZomLand V2",
        desc: "Interactive gaming: Battle Arena & Land Discovery.",
        type: "incomming",
      },
      {
        date: "Q4, 2022",
        title: "Sales & Listing",
        desc: "We'll announce Private Sale round for ambassadors and early investors and Public Sale round for everyone. Listing ZML on exchanges ",
        type: "incomming",
      },
    ],
  },
  tokenomics: {
    title: "Tokenomic",
    description: "Total Supply: 1.000.000.000",
  },
  contact_us: {
    title: "Contact Us",
    desc: "Please feel free to join to our community in social networks and stay up-to-date for the latest announcements or incoming events.",
  },
};

export const LandContent = {
  title: "My Lands",
  description: `Lands used for minting zombies every day. Your Monster can discover Lands and have a chance to find some goods. 
    <a href="https://dandelion-dash-25e.notion.site/Lands-600806d8c2bc464f83bb2a205722fb85" target="_blank" class="link whitespace-nowrap">Read more</a>.`,
  no_lands: "You don't have Lands",
  no_lands_details:
    "But you can mint Micro Land for free or buy Medium and Large lands",
};

export const ZombieContent = {
  title: "My Zombies",
  description: `Zombies is your numerous army that will lead to achieve your goals. Each zombie has it's own characteristics of health, attack, intellect and speed.
  <a href="https://dandelion-dash-25e.notion.site/Zombies-7785dcc7ca5141fe9512038c61bf02d6" target="_blank" class="link whitespace-nowrap">Read more</a>.`,
  mint_zombie_from_land: "Select land you want to mint zombies for:",
  no_zombies: "You have no Zombies",
  no_lands_details:
    "To mint zombies you need some Lands. Mint new one in Lands page and return to get zombies from this land.",
};

export const MonsterContent = {
  title: "My Monsters",
  description: `Monster - strong, cool and powerful zombie that have additional features: discover lands, participate in battles and get additional rewards.
  <a href="https://dandelion-dash-25e.notion.site/Monsters-09efe65232ec4b01b143a1a63c61bf47" target="_blank" class="link whitespace-nowrap">Read more</a>.`,
  no_monsters: "You have no Monsters",
};

export const CollectionContent = {
  title: "Collections",
  description: `Your zombies can be combined to Collection and exchanged to the Monster. 
  <a href="https://dandelion-dash-25e.notion.site/Collections-7ef9dd8d414847a288d992e7f3ca4714" target="_blank" class="link whitespace-nowrap">Read more</a>.`,
};

export const MarketContent = {
  title: "Market",
  description: `You can buy/sell Lands, Zombies and Monsters in the Market. Market using ${process.env.TOKEN_NAME} token and have 0,5% fee of transactions.`,
};

export const ContactUsContent = {
  title: "Contact Us",
  description: `You can contact with us using this page.`,
};

export const FAQContent = {
  title: "Frequently Asked Questions",
  description: `This section contains all basic question that you can have when start using our 
  Play-To-Earn NFT Collectible Game.`,
};
// Please read all of the information below in detail, there are inherent risks with Cryptocurrency,
//   NFTs and tokenomics. Know your limits and don't risk more than you are willing to lose.

export const TokenContent = {
  title: "ZML Staking",
  description: `Earn passive income by staking your tokens. 
  Increase your rewards by adding Monster card: higher card rarity level will give you better staking percent!`,
};

export const TermsContent = {
  title: "Terms & Conditions",
  description: `
  <div class="flex flex-col gap-4 px-4">
    <p class="mt-1">
        The site ZomLand.com is a web browser application that provides users with the opportunity to collect and showcase digital blockchain collectibles containing content solely for entertainment purposes from “ZomLand” web & blockchain application based on ${process.env.TOKEN_NAME} Blockchain. 
        ZomLand team making the App available to you. Before you use the App, however, you will need to agree to these Terms of Use and any terms and conditions incorporated herein by reference (collectively, these “Terms").
    </p>
    <p class="mt-1">
        PLEASE READ THESE TERMS CAREFULLY BEFORE USING THE APP. THESE TERMS GOVERN YOUR USE OF THE APP, UNLESS WE HAVE EXECUTED A SEPARATE WRITTEN AGREEMENT WITH YOU FOR THAT PURPOSE. WE ARE ONLY WILLING TO MAKE THE APP AVAILABLE TO YOU IF YOU ACCEPT ALL OF THESE TERMS. BY USING THE APP OR ANY PART OF IT, YOU ARE CONFIRMING THAT YOU UNDERSTAND AND AGREE TO BE BOUND BY ALL OF THESE TERMS. IF YOU ARE ACCEPTING THESE TERMS ON BEHALF OF A COMPANY OR OTHER LEGAL ENTITY, YOU REPRESENT THAT YOU HAVE THE LEGAL AUTHORITY TO ACCEPT THESE TERMS ON THAT ENTITY’S BEHALF AND BIND THAT ENTITY, IN WHICH CASE “YOU” WILL MEAN THAT ENTITY. IF YOU DO NOT HAVE SUCH AUTHORITY, OR IF YOU DO NOT ACCEPT ALL OF THESE TERMS, THEN WE ARE UNWILLING TO MAKE THE APP AVAILABLE TO YOU.
    </p>
    <p class="mt-1">
        ANY PURCHASE OR SALE YOU MAKE, ACCEPT OR FACILITATE OUTSIDE OF THIS APP (AS DEFINED BELOW) OF A COLLECTIBLE WILL BE ENTIRELY AT YOUR RISK. WE DO NOT CONTROL OR ENDORSE PURCHASES OR SALES OF COLLECTIBLES OUTSIDE OF THIS APP. WE EXPRESSLY DENY ANY OBLIGATION TO INDEMNIFY YOU OR HOLD YOU HARMLESS FOR ANY LOSSES YOU MAY INCUR BY TRANSACTING, OR FACILITATING TRANSACTIONS INVOLVING COLLECTIBLES.
    </p>
    <p class="mt-1">
        BY USING THE APP OR ANY PART OF IT, OR BY CLICKING “I ACCEPT” BELOW OR INDICATING YOUR ACCEPTANCE IN AN ADJOINING BOX, YOU ARE CONFIRMING THAT YOU UNDERSTAND AND AGREE TO BE BOUND BY ALL OF THESE TERMS.
    </p>
    <p class="mt-1">
        Any changes to these Terms will be in effect as of the “Last Updated Date” referred to at the bottom of this page. You should review these Terms before using the App or purchasing any product or using any services that are available through this App.
    </p>
    <p class="mt-1">
        Your continued use of this App after the “Last Updated Date” will constitute your acceptance of and agreement to such changes.
    </p>
    <p class="mt-1">
        By using this App, you affirm that you are of legal age to enter into these Terms, and you accept and are bound by these Terms.
    </p>
    <p class="mt-1">
        You may not use this App if you: (i) do not agree to these Terms; (ii) are not of the age of majority in your jurisdiction of residence; or (iii) are prohibited from accessing or using this App or any of this App’s contents, products or services by applicable law.
    </p>

    <p class="mt-5 text-xl font-semibold">
    1. USE OF THE APP; ACCOUNT SET-UP AND SECURITY
    </p>
    <ul>
      <li>1.1 Account and Wallet Set-Up. To most easily use the App, you should first install a web browser (such as the Google Chrome web browser). You will also need register to establish an account affiliated with an electronic wallet, which will enable you to purchase and store collectibles that you collect or purchase via the App. Each collectible is a Non-Fungible Token (an “NFT”) on the ${process.env.TOKEN_NAME} blockchain network.</li>
      <li class="mt-5">1.2 Account Registration. You Account will be register automatically after login using your ${process.env.TOKEN_NAME} Wallet.</li>
      <li class="mt-5">1.3 Account Security. You are responsible for the security of your account for the App and for your electronic wallets. If you become aware of any unauthorized use of your password or of your account with us, you agree to notify us immediately at insert email address.</li>
      <li class="mt-5">1.4 Account Transactions. You can use your electronic wallet to purchase, store, and engage in transactions using your one or more cryptocurrencies that we may elect to accept from time to time. Transactions that take place on the App are managed and confirmed via the ${process.env.TOKEN_NAME} Network. You understand that your ${process.env.TOKEN_NAME} public address will be made publicly visible whenever you engage in a transaction on the App.</li>
    </ul>
    
    <p class="mt-5 text-xl font-semibold">
    2. PURCHASING AND EARNING YOUR COLLECTIBLES
    </p>
    <ul>
      <li>2.1 Acquiring Collectibles. The App allows you to collect and showcase digital blockchain collectibles (each, a “Collectible”) from the ZomLand. Each Collectible is an NFT on the ${process.env.TOKEN_NAME} Network.</li>
      <li class="mt-5">2.2 Characteristics of Collectibles. Collectibles are comprised of Art (as defined below) created by the in-house graphics design team of the ZomLand and intended to replicate and pay tribute to a tangible piece of ZomLand memorabilia. Each Collectible has a defined set of attributes – including scarcity – that may impact the value of the Collectible.</li>
      <li class="mt-5">2.3 Subjectivity of Collectibles. The value of each Collectible is inherently subjective in the same way the value of other collectibles is inherently subjective. Each Collectible has no inherent or intrinsic value. Some collectors might prefer to have a Collectible featuring a certain ZomLand item, while another might prefer an equivalent Collectible featuring a different ZomLand item.</li>
    </ul>
    
    <p class="mt-5 text-xl font-semibold">
    3. PAYMENT, GAS FEES AND TAXES
    </p>
    <ul>
    <li>3.1 Financial Transactions on App. Any payments or financial transactions that you engage in via the App will be conducted solely through the ${process.env.TOKEN_NAME} Network. We have no control over these payments or transactions, nor do we have the ability to reverse any payments or transactions. We have no liability to you or to any third party for any claims or damages that may arise as a result of any payments or transactions that you engage in via the App, or any other payment or transactions that you conduct via the ${process.env.TOKEN_NAME} Network. We do not provide refunds for any purchases that you might make on or through the App – whether for Collectibles, Packs, or anything else.</li>
    <li class="mt-5">3.2 Gas Fees. Every transaction on the ${process.env.TOKEN_NAME} Network requires the payment of a transaction fee (each, a “Gas Fee”). The Gas Fees fund the network of computers that run the decentralized ${process.env.TOKEN_NAME} Network. This means that you will need to pay a Gas Fee for each transaction that you instigate via the App. Except as otherwise expressly set forth in these Terms, you will be solely responsible to pay any Gas Fee for any transaction that you instigate via the App. If enabled in the future, transactions in Collectibles on the ${process.env.TOKEN_NAME} Network may be subject to additional fees, including fees payable to some or all of the Collectible Parties, which amounts will be deducted from transaction proceeds before payment to the selling party.</li>
    <li class="mt-5">3.3 Responsibility for Taxes. You will be solely responsible to pay any and all sales, use, value-added and other taxes, duties, and assessments (except taxes on our net income) now or hereafter claimed or imposed by any governmental authority (collectively, the “Taxes”) associated with your use of the App. Except for income taxes levied on us, you: (a) will pay or reimburse us for all national, federal, state, local or other taxes and assessments of any jurisdiction, including value added taxes and taxes as required by international tax treaties, customs or other import or export taxes, and amounts levied in lieu thereof based on charges set, services performed or payments made hereunder, as are now or hereafter may be imposed under the authority of any national, state, local or any other taxing jurisdiction; and (b) will not be entitled to deduct the amount of any such taxes, duties or assessments from payments (including Gas Fees) made to us pursuant to these Terms. To allow us to determine our tax obligations, unless you otherwise notify us in writing, you confirm that you are not a resident in Canada nor are you registered for Goods and services tax / Harmonized sales tax (GST / HST) or Provincial sales taxes (PST) in Canada, and will inform us if your status changes in the future.</li>
    </ul>
    
    <p class="mt-5 text-xl font-semibold">
    4. OWNERSHIP, LICENSE, AND OWNERSHIP RESTRICTIONS
    </p>
    <p class="mt-1">
        YOUR OWNERSHIP OF COLLECTIBLES WILL ONLY BE RECOGNIZED BY THE COLLECTIBLE PARTIES IF YOU HAVE PURCHASED OR OTHERWISE RIGHTFULLY ACQUIRED SUCH COLLECTIBLES FROM A LEGITIMATE SOURCE AND NOT THROUGH ANY OF THE CATEGORY B PROHIBITED ACTIVITIES (AS DEFINED BELOW).
    </p>
    <p class="mt-1">
        For the purposes of this Section, the following capitalized terms will have the following meanings:
    </p>
    <p>
        “Art” means any art, design, and drawings (in any form or media, including, without limitation, video or photographs) that may be associated with a Collectible that you Own.
    </p>
    <p>
        “Own” means, with respect to a Collectible, a Collectible that you have purchased or otherwise rightfully acquired from a legitimate source (and not through any of the Category B Prohibited Activities (as defined below)), where proof of such purchase is recorded on the ${process.env.TOKEN_NAME} Network.
    </p>
    <p>
        “Purchased Collectible” means a Collectible that you Own. “Third Party IP” means any third party patent rights (including, without limitation, patent applications and disclosures), copyrights, trade secrets, trademarks, know-how or any other intellectual property rights recognized in any country or jurisdiction in the world.
    </p>
    <ul>
      <li>4.1 Ownership of Collectible. You acknowledge and agree that ZomLand (or as applicable, its licensors) owns all legal right, title and interest in and to the Art and all intellectual property rights therein. Any rights you have in and to the Purchased Collectible are limited to those expressly stated herein. ZomLand and its licensors reserve all rights and ownership in and to the NFT and Art not specifically granted to you in this Agreement. Subject to your continued compliance with these Terms, ZomLand grants you non-exclusive, non-transferable, royalty-free license to use and display the Art for your Purchased Collectibles, solely for your own personal, non-commercial use. Because each Collectible is an NFT on the ${process.env.TOKEN_NAME} Network, when you purchase a Collectible in accordance with these Terms (and not through any of the Category B Prohibited Activities), you own the underlying NFT subject to the terms hereof.</li>
      <li class="mt-5">4.2 This means that you have the right to swap your Purchased Collectible, sell it, or give it away after any required hold period. Ownership of the Purchased Collectible is mediated entirely by the ${process.env.TOKEN_NAME} Network. Transfers of a Purchased Collectible will be governed by and subject to the terms of any blockchain network on which the transfer is made, including any transfer fees.</li>
      <li class="mt-5">4.3 We Own the App. You acknowledge and agree that we (or, as applicable, our licensors) owns all legal right, title and interest in and to all other elements of the App, and all intellectual property rights therein (including, without limitation, all Art, designs, systems, methods, information, computer code, software, services, “look and feel”, organization, compilation of the content, code, data, and all other elements of the App (collectively, the “App Materials”)). You acknowledge that the App Materials are protected by copyright, trade dress, patent, and trademark laws, international conventions, other relevant intellectual property and proprietary rights, and applicable laws. All App Materials are the copyrighted property of us or our licensors, and all trademarks, service marks, and trade names associated with the App or otherwise contained in the App Materials are proprietary to us or our licensors.</li>
      <li class="mt-5">4.4 No User License or Ownership of App Materials. Except as expressly set forth herein, your use of the App does not grant you ownership of or any other rights with respect to any content, code, data, or other App Materials that you may access on or through the App. We reserve all rights in and to the App Materials that are not expressly granted to you in these Terms.</li>
      <li class="mt-5">4.5 Further User Ownership Acknowledgements. For the sake of clarity, you understand and agree: (a) that your purchase of a Collectible, whether via the App or otherwise, does not give you any rights or licenses in or to the App Materials (including, without limitation, our copyright in and to the associated Art) other than those expressly contained in these Terms; (b) that you do not have the right, except as otherwise set forth in these Terms, to reproduce, distribute, or otherwise commercialize any elements of the App Materials (including, without limitation, any Art) without our prior written consent in each case, which consent we may withhold in our sole and absolute discretion; and (c) that you will not apply for, register, or otherwise use or attempt to use any of our trademarks or service marks, or any confusingly similar marks, anywhere in the world without our prior written consent in each case, which consent we may withhold at our sole and absolute discretion.</li>
      <li class="mt-5">4.6 Restrictions on Ownership. You agree that you may not, nor permit any third party to do or attempt to do any of the foregoing without our (or, as applicable, our licensors’) express prior written consent in each case: (a) modify the Art in your Purchased Collectible in any way, including, without limitation, the shapes, designs, drawings, attributes, or color schemes; (b) use the Art from your Purchased Collectible to advertise, market, or sell any third party product or service; (c) use the Art from your Purchased Collectible in connection with images, videos, or other forms of media that depict hatred, intolerance, violence, cruelty, or anything else that could reasonably be found to constitute hate speech or otherwise infringe upon the rights of others; (d) use the Art for your Purchased Collectible in movies, videos, or any other forms of media, except to the limited extent that such use is expressly permitted in these Terms or solely for your own personal, non-commercial use; (e) sell, distribute for commercial gain (including, without limitation, giving away in the hopes of eventual commercial gain), or otherwise commercialize merchandise that includes, contains, or consists of the Art for your Purchased Collectible; (f) attempt to trademark, copyright, or otherwise acquire additional intellectual property rights in or to the Art for your Purchased Collectible; or (g) otherwise utilize the Art for your Purchased Collectible for your or any third party’s commercial benefit.</li>
      <li class="mt-5">4.7 User Feedback. You may choose to submit comments, bug reports, ideas or other feedback about the App, including without limitation about how to improve the App (collectively, “Feedback”). By submitting any Feedback, you agree that we are free to use such Feedback at our discretion and without additional compensation to you, and to disclose such Feedback to third parties (whether on a non-confidential basis, or otherwise). You hereby grant us a perpetual, irrevocable, nonexclusive, worldwide license under all rights necessary for us to incorporate and use your Feedback for any purpose.</li>
    </ul>
    
    <p class="mt-5 text-xl font-semibold">
    5. CONDITIONS OF USE AND PROHIBITED ACTIVITIES
    </p>
    <p class="mt-1">YOU AGREE THAT YOU ARE RESPONSIBLE FOR YOUR OWN CONDUCT WHILE ACCESSING OR USING THE APP, AND FOR ANY CONSEQUENCES THEREOF. YOU AGREE TO USE THE APP ONLY FOR PURPOSES THAT ARE LEGAL, PROPER AND IN ACCORDANCE WITH THESE TERMS AND ANY APPLICABLE LAWS OR REGULATIONS.</p>
    <p class="mt-1">
    User Warranties. Without limiting the foregoing, you warrant and agree that your use of the App will not (and will not allow any third party to):(a) in any manner:
    </p>
    <ul>
      <li>- involve the sending, uploading, distributing or disseminating any unlawful, defamatory, harassing, abusive, fraudulent, obscene, or otherwise objectionable content;</li>
      <li>- involve the distribution of any viruses, worms, defects, Trojan horses, corrupted files, hoaxes, or any other items of a destructive or deceptive nature;</li>
      <li>- involve the uploading, posting, transmitting or otherwise making available through the App any content that infringes the intellectual proprietary rights of any party;</li>
      <li>- involve using the App to violate the legal rights (such as rights of privacy and publicity) of others;</li>
      <li>- involve engaging in, promoting, or encouraging illegal activity (including, without limitation, money laundering);</li>
      <li>- involve interfering with other users’ enjoyment of the App;</li>
      <li>- involve exploiting the App for any unauthorized commercial purpose;</li>
      <li>- involve modifying, adapting, translating, or reverse engineering any portion of the App;</li>
      <li>- involve removing any copyright, trademark or other proprietary rights notices contained in or on the App or any part of it;</li>
      <li>- involve reformatting or framing any portion of the App;</li>
      <li>- involve displaying any content on the App that contains any hate-related or violent content or contains any other material, products or services that violate or encourage conduct that would violate any criminal laws, any other applicable laws, or any third party rights;</li>
      <li>- involve using any spider, site search/retrieval application, or other device to retrieve or index any portion of the App or the content posted on the App, or to collect information about its users for any unauthorized purpose;</li>
      <li>- involve accessing or using the App for the purpose of creating a product or service that is competitive with any of our products or services;</li>
      <li>- involve abusing, harassing, or threatening another user of the App or any of our authorized representatives, customer service personnel, chat board moderators, or volunteers (including, without limitation, filing support tickets with false information, sending excessive emails or support tickets, obstructing our employees from doing their jobs, refusing to follow the instructions of our employees, or publicly disparaging us by implying favoritism by a our employees or otherwise);</li>
      <li>- involve using any abusive, defamatory, ethnically or racially offensive, harassing, harmful, hateful, obscene, offensive, sexually explicit, threatening or vulgar language when communicating with another user of the App or any of our authorized representatives, customer service personnel, chat board moderators, or volunteers</li>
    </ul>
    <p class="mt-1 font-semibold">
    In any manner:
    </p>
    <ul>
      <li>- involve creating user accounts by automated means or under false or fraudulent pretenses;</li>
      <li>- involve the impersonation of another person (via the use of an email address or otherwise);</li>
      <li>- involve using, employing, operating, or creating a computer program to simulate the human behavior of a user (“Bots”);</li>
      <li>- involve using, employing, or operating Bots or other similar forms of automation to engage in any activity or transaction on the App (including, without limitation, purchases of Packs, or of Collectibles on the Marketplace);</li>
      <li>- involve acquiring Collectibles through inappropriate or illegal means (including, among other things, using a payment mechanism that you do not have the right to use, or purchasing a Collectible and then attempting to charge the cost back to your payment method while still maintaining ownership or control of the Collectible or selling, gifting or trading the Collectible to someone else)</li>
      <li>- involve the purchasing, selling or facilitating the purchase and sale of any user’s account(s) to other users or third parties for cash or cryptocurrency consideration outside of the App;</li>
      <li>- otherwise involve or result in the wrongful seizure or receipt of any Collectibles or other digital assets (each, a “Category B Prohibited Activity” and, together with Category A Prohibited Activity, the “Prohibited Activities”).</li>
    </ul>
    <p class="mt-1">
        Effect of Your Breaches. If you engage in any of the Prohibited Activities, we may, at our sole and absolute discretion, without notice or liability to you, and without limiting any of our other rights or remedies at law or in equity, immediately suspend or terminate your user account and/or delete your Collectibles’ images and descriptions from the App. If we delete your Collectibles’ images and descriptions from the App, such deletion will not affect your ownership rights in any NFTs that you already Own, but you will not receive a refund of any amounts you paid for those Collectibles.
    </p>
    <p class="mt-1">
        NOTWITHSTANDING THE FOREGOING, HOWEVER, IF WE REASONABLY BELIEVE THAT YOU ARE ENGAGED IN ANY OF THE CATEGORY B PROHIBITED ACTIVITIES, IN ADDITION TO OUR RIGHT TO IMMEDIATELY SUSPEND OR TERMINATE YOUR USER ACCOUNT AND/OR DELETE YOUR COLLECTIBLES’ IMAGES AND DESCRIPTIONS FROM THE APP, WE ALSO RESERVE THE RIGHT, AT OUR SOLE AND ABSOLUTE DISCRETION, WITHOUT NOTICE OR LIABILITY TO YOU, TO TAKE ANY OR ALL OF THE FOLLOWING ACTIONS: (A) TO DEEM ANY TRANSACTION THAT TOOK PLACE VIA OR AS THE RESULT OF SUCH ACTIVITIES TO BE VOID AB INITIO; AND/OR (B) TO IMMEDIATELY CONFISCATE ANY COLLECTIBLES (INCLUDING THEIR UNDERLYING NFTS) THAT WERE PURCHASED OR ACQUIRED AS THE RESULT OF SUCH ACTIVITIES.
    </p>
    
    <p class="mt-5 text-xl font-semibold">
        6. DISCLAIMERS
    </p>
    <p class="mt-1">
        YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR ACCESS TO AND USE OF THE APP IS AT YOUR SOLE RISK, AND THAT THE APP AND ALL COLLECTIBLES ON THE APP ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, THE COLLECTIBLE PARTIES AND THEIR RESPECTIVE PARENTS, SUBSIDIARIES, AFFILIATES, AND LICENSORS MAKE NO EXPRESS WARRANTIES AND HEREBY DISCLAIM ALL IMPLIED WARRANTIES REGARDING THE APP AND ANY PART OF IT, OR ANY COLLECTIBLE INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, CORRECTNESS, ACCURACY, OR RELIABILITY. WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE COLLECTIBLE PARTIES AND THEIR PARENTS, SUBSIDIARIES, AFFILIATES, AND LICENSORS DO NOT REPRESENT OR WARRANT TO YOU THAT: (I) YOUR ACCESS TO OR USE OF THE APP WILL MEET YOUR REQUIREMENTS; (II) YOUR ACCESS TO OR USE OF THE APP WILL BE UNINTERRUPTED, TIMELY, SECURE OR FREE FROM ERROR; (III) USAGE DATA PROVIDED THROUGH THE APP WILL BE ACCURATE; (IV) THE APP OR ANY CONTENT, SERVICES, OR FEATURES MADE AVAILABLE ON OR THROUGH THE APP ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR (V) THAT ANY DATA THAT YOU DISCLOSE WHEN YOU USE THE APP WILL BE SECURE. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES IN CONTRACTS WITH CONSUMERS, SO SOME OR ALL OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.
    </p>
    <p class="mt-1">
        YOU ACCEPT THE INHERENT SECURITY RISKS OF PROVIDING INFORMATION AND DEALING ONLINE OVER THE INTERNET AND AGREE THAT THE COLLECTIBLE PARTIES HAVE NO LIABILITY OR RESPONSIBILITY FOR ANY BREACH OF SECURITY UNLESS IT IS DUE TO THEIR GROSS NEGLIGENCE.
    </p>
    <p class="mt-1">
        THE COLLECTIBLE PARTIES WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSSES YOU INCUR AS THE RESULT OF YOUR USE OF THE ${process.env.TOKEN_NAME.toUpperCase()} NETWORK, OR YOUR ELECTRONIC WALLET, INCLUDING BUT NOT LIMITED TO ANY LOSSES, DAMAGES OR CLAIMS ARISING FROM: (I) USER ERROR, SUCH AS FORGOTTEN PASSWORDS OR INCORRECTLY CONSTRUED SMART CONTRACTS OR OTHER TRANSACTIONS; (II) SERVER FAILURE OR DATA LOSS; (III) CORRUPTED WALLET FILES; (IV) UNAUTHORIZED ACCESS OR ACTIVITIES BY THIRD PARTIES, INCLUDING, BUT NOT LIMITED TO, THE USE OF VIRUSES, PHISHING, BRUTE-FORCING OR OTHER MEANS OF ATTACK AGAINST THE APP, THE ${process.env.TOKEN_NAME.toUpperCase()} NETWORK, OR ANY ELECTRONIC WALLET OR (V) INCOMPLETE, SLOWED OR DISRUPTED TRANSACTIONS INVOLVING COLLECTIBLES.
    </p>
    <p class="mt-1">
        COLLECTIBLES ARE INTANGIBLE DIGITAL ASSETS THAT EXIST ONLY BY VIRTUE OF THE OWNERSHIP RECORD MAINTAINED IN THE ${process.env.TOKEN_NAME.toUpperCase()} NETWORK. ALL SMART CONTRACTS ARE CONDUCTED AND OCCUR ON THE DECENTRALIZED LEDGER WITHIN THE ${process.env.TOKEN_NAME.toUpperCase()} NETWORK. THE COLLECTIBLE PARTIES HAVE NO CONTROL OVER AND MAKE NO GUARANTEES OR PROMISES WITH RESPECT TO SMART CONTRACTS.
    </p>
    <p class="mt-1">
        THE COLLECTIBLE PARTIES ARE NOT RESPONSIBLE FOR LOSSES DUE TO BLOCKCHAINS OR ANY OTHER FEATURES OF THE ${process.env.TOKEN_NAME.toUpperCase()} NETWORK, OR ANY ELECTRONIC WALLET, INCLUDING BUT NOT LIMITED TO LATE REPORT BY DEVELOPERS OR REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES WITH THE BLOCKCHAIN SUPPORTING THE ${process.env.TOKEN_NAME.toUpperCase()} NETWORK, INCLUDING FORKS, TECHNICAL NODE ISSUES, OR ANY OTHER ISSUES HAVING FUND LOSSES AS A RESULT.
    </p>
    
    <p class="mt-5 text-xl font-semibold">
        7. LIMITATION OF LIABILITY
    </p>
    <p class="mt-1">
        IN NO EVENT SHALL THE COLLECTIBLE PARTIES BE LIABLE TO YOU FOR ANY PERSONAL INJURY, PROPERTY DAMAGE, LOST PROFITS, COST OF SUBSTITUTE GOODS OR SERVICES, LOSS OF DATA, LOSS OF GOODWILL, WORK STOPPAGE, DIMINUTION OF VALUE OR ANY OTHER INTANGIBLE LOSS, COMPUTER AND/OR DEVICE OR TECHNOLOGY FAILURE OR MALFUNCTION, OR FOR ANY FORM OF DIRECT OR INDIRECT DAMAGES, AND/OR ANY SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES BASED ON ANY CAUSES OF ACTION WHATSOEVER RELATED TO THE APP OR ANY COLLECTIBLE. YOU AGREE THAT THIS LIMITATION OF LIABILITY APPLIES WHETHER SUCH ALLEGATIONS ARE FOR BREACH OF CONTRACT, TORTIOUS BEHAVIOR, NEGLIGENCE, OR FALL UNDER ANY OTHER CAUSE OF ACTION, REGARDLESS OF THE BASIS UPON WHICH LIABILITY IS CLAIMED AND EVEN IF A DISCLAIMING PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH LOSS OR DAMAGE.
    </p>
    <p class="mt-1">
        YOU AGREE THAT THE TOTAL, AGGREGATE LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR ACCESS TO OR USE OF (OR YOUR INABILITY TO ACCESS OR USE) ANY PORTION OF THE APP OR ANY COLLECTIBLE, WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, IS LIMITED TO THE GREATER OF THE AMOUNTS YOU HAVE ACTUALLY AND LAWFULLY PAID US UNDER THESE TERMS IN THE TWO (2) MONTH PERIOD PRECEDING THE DATE THE CLAIM AROSE.
    </p>
    <p class="mt-1">
        YOU ACKNOWLEDGE AND AGREE THAT WE HAVE MADE THE APP AVAILABLE TO YOU AND ENTERED INTO THESE TERMS IN RELIANCE UPON THE REPRESENTATIONS AND WARRANTIES, DISCLAIMERS AND LIMITATIONS OF LIABILITY SET FORTH HEREIN, WHICH REFLECT A REASONABLE AND FAIR ALLOCATION OF RISK BETWEEN US AND YOU AND FORM AN ESSENTIAL BASIS OF THE BARGAIN BETWEEN US AND YOU. WE WOULD NOT BE ABLE TO PROVIDE THE APP TO YOU WITHOUT THESE LIMITATIONS.
    </p>
   
    
    <p class="mt-5 text-xl font-semibold">
        8. ASSUMPTION OF RISK
    </p>
    <ul>
      <li>8.1 Value and Volatility. The rights provided to you are for entertainment purposes only. Without limiting the foregoing, the prices of collectible blockchain assets are extremely volatile and subjective and collectible blockchain assets have no inherent or intrinsic value. Fluctuations in the price of other digital assets could materially and adversely affect the value of your Collectibles, which may also be subject to significant price volatility. Each Collectible has no inherent or intrinsic value. We cannot (and do not) guarantee that any Collectibles purchased will retain their original value, as the value of collectibles is inherently subjective and, among other things, factors occurring outside of the ZomLand NFT ecosystem may materially impact the value and desirability of any particular Collectible.</li>
      <li class="mt-5">8.2 Tax Calculations. You are solely responsible for determining what, if any, taxes apply to your Collectible-related transactions. We are not responsible for determining the taxes that apply to your transactions on the App.</li>
      <li class="mt-5">8.3 Use of Blockchain. The App does not store, send, or receive Collectibles. This is because Collectibles exist only by virtue of the ownership record maintained on the App’s supporting blockchain in the ${process.env.TOKEN_NAME} network. Any transfer of Collectibles occurs within the supporting blockchain in the ${process.env.TOKEN_NAME} network, and not on the App.</li>
      <li class="mt-5">8.4 Inherent Risks with Internet Currency. There are risks associated with using an Internet-based currency, including, but not limited to, the risk of hardware, software and Internet connections, the risk of malicious software introduction, and the risk that third parties may obtain unauthorized access to information stored within your electronic wallet. You accept and acknowledge that we will not be responsible for any communication failures, disruptions, errors, distortions or delays you may experience when using the ${process.env.TOKEN_NAME} Network, however caused.</li>
      <li class="mt-5">8.5 Regulatory Uncertainty. The regulatory regime governing blockchain technologies, cryptocurrencies and tokens is uncertain, and new regulations or policies may materially adversely affect the development of the Hornets NFT ecosystem, and therefore the potential utility or value of your Collectibles.</li>
      <li class="mt-5">8.6 Software Risks. Upgrades to the ${process.env.TOKEN_NAME} Network, a hard fork in the ${process.env.TOKEN_NAME} Network, or a change in how transactions are confirmed on the ${process.env.TOKEN_NAME} Network may have unintended, adverse effects on all blockchains using the ${process.env.TOKEN_NAME} Network’s NFT standard, including the ZomLand NFT ecosystem.</li>
    </ul>
    
    <p class="mt-5 text-xl font-semibold">
        9. INDEMNIFICATION
    </p>
    <p class="mt-1">
        You agree to hold harmless and indemnify each of the Collectible Parties and each of their respective parents, subsidiaries, affiliates, officers, agents, employees, advertisers, licensors, suppliers or partners from and against any claim, liability, loss, damage (actual and consequential) of any kind or nature, suit, judgment, litigation cost and attorneys' fees arising out of or in any way related to: (i) your breach of these Terms; (ii) your misuse of the App; (iii) your violation of applicable laws, rules or regulations in connection with your access to or use of the App or (iv) any other of your activities in connection with a Collectible or Purchased Collectible. You agree that we will have control of the defense or settlement of any such claims.
    </p>
    
    <p class="mt-5 text-xl font-semibold">
        10. EXTERNAL SITES
    </p>
    <p class="mt-1">
        The App may include hyperlinks to other websites or resources (collectively, the “External Sites”), which are provided solely as a convenience to our users. We have no control over any External Sites. You acknowledge and agree that we are not responsible for the availability of any External Sites, and that we do not endorse any advertising, products or other materials on or made available from or through any External Sites. Furthermore, you acknowledge and agree that we are not liable for any loss or damage which may be incurred as a result of the availability or unavailability of the External Sites, or as a result of any reliance placed by you upon the completeness, accuracy or existence of any advertising, products or other materials on, or made available from, any External Sites.
    </p>
    
    <p class="mt-5 text-xl font-semibold">
        11. FORCE MAJEURE
    </p>
    <ul>
    <li>11.1 Force Majeure Events. The Collectible Parties will not be liable or responsible to the you, nor be deemed to have defaulted under or breached these Terms, for any failure or delay in fulfilling or performing any of these Terms, when and to the extent such failure or delay is caused by or results from the following force majeure events (“Force Majeure Event(s)”): (a) flood, fire, earthquake, epidemics, pandemics, including the 2019 novel coronavirus pandemic (COVID-19), tsunami, explosion;  (b) war, invasion, hostilities (whether war is declared or not), terrorist threats or acts, riot or other civil unrest; (c) government order, law, or action; (d) embargoes or blockades in effect on or after the date of this agreement; (e) strikes, labor stoppages or slowdowns or other industrial disturbances; (f) shortage of adequate or suitable Internet connectivity, telecommunication breakdown or shortage of adequate power or electricity; and (g) other similar events beyond our control.</li>
    <li class="mt-5">11.2 Performance During Force Majeure Events. If we suffer a Force Majeure Event, we will use reasonable efforts to promptly notify you of the Force Majeure Event, stating the period of time the occurrence is expected to continue. We will use diligent efforts to end the failure or delay and ensure the effects of such Force Majeure Event are minimized. We will resume the performance of our obligations as soon as reasonably practicable after the removal of the cause. In the event that our failure or delay remains uncured for a period of forty-five (45) consecutive days following written notice given by us under this Section 12, we may thereafter terminate these Terms upon fifteen (15) days' written notice.</li>
    </ul>
    
    <p class="mt-5 text-xl font-semibold">
        12. CHANGES TO THE APP
    </p>
    <p class="mt-1">
        We are constantly innovating the App to help provide the best possible experience. You acknowledge and agree that the form and nature of the App, and any part of it, may change from time to time without prior notice to you, and that we may add new features and change any part of the App at any time without notice.
    </p>
    
    <p class="mt-5 text-xl font-semibold">
        13. CHILDREN
    </p>
    <p class="mt-1">
        You affirm that you are over the age of 18. The App is not intended for children under 18. If you are under the age of 18, you may not use the App. We do not knowingly collect information from or direct any of our content specifically to children under the age of 18. If we learn or have reason to suspect that you are a user who is under the age of 18, we will unfortunately have to close your account. Other countries may have different minimum age limits, and if you are below the minimum age for providing consent for data collection in your country, you may not use the App.
    </p>
     
    <p class="mt-5 text-xl font-semibold">
        14. PRIVACY POLICY
    </p>
    <p class="mt-1">
        Our <a href="/privacy-policy" class="link" target="_blank">Privacy Policy</a> describes the ways we collect, use, store and disclose your personal information, and is hereby incorporated by this reference into these Terms. You agree to the collection, use, storage, and disclosure of your data in accordance with our Privacy Policy.
    </p>
    <br>
    <p>Last Updated Date: 30 March 2022.</p>
  </div>`,
};

export const PrivacyContent = {
  title: "Privacy Policy",
  description: `
  <div class="flex flex-col gap-4 px-4">
  <p class="mt-1">
    AtomicLab, (hereafter “the Company”, “we”, “us” or “our”) is committed to protecting the privacy and security of the personal information that is provided 
    to us or collected by us during the course of our business. We store and process personal information in accordance with the EU General Data Protection Regulation.
  </p>
  <p class="mt-1">
    This Privacy Notice applies to “ZomLand” offered by the Company through Internet Websites, mobile devices or other platforms (collectively, the “Services”). 
    This Privacy Notice explains how we may collect and use any personal information that we obtain about you and your rights in relation to that information. 
    Please read this carefully. By using the Services, you affirm that you have read and understand this Privacy Notice and that you consent to the collection 
    and use of your personal information as outlined in this Privacy Notice.
  </p>
  <p class="mt-1">
    We may provide you with additional Privacy Notices where we believe that it is appropriate to do so. 
    Those additional notices supplement and should be read together with this Privacy Notice.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    1. Who is responsible for your personal information?
  </p>
  <p>
    AtomicLab is responsible for your personal information as provided to us or collected by us during the course of our business.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    2. Which information about you is collected?
  </p>
  <p>
    Whenever you access or make use of any of the Website, Materials or Services, we may collect the following types of information from you:
  </p>
  
  <p class="mt-1 font-semibold">
    2.1 Information you provide directly to us, including:
  </p>
  <ul>
    <li>- When you create a User Account, ${process.env.TOKEN_NAME} digital wallet address and ${process.env.TOKEN_NAME} user name;</li>
    <li>- Your purchase history and other information relating to transactions made through the Website;</li>
    <li>- Information contained in your correspondence with us, for example, when you send us an email;</li>
  </ul>
  
  </p>
  <p class="mt-1 font-semibold">
    2.2 Information collected during the course of your use of the Website, Materials or Services, including:
  </p>
  <ul>
    <li>- Gameplay information including NFT-related images;</li>
    <li>- “Crash reports” in the event that a software crash occurs, which may include details of your User Account;</li>
    <li>- Information about the computer or device you use to access our Service, including the hardware model, operating system and version, MAC address, unique device identifier (“UDID”), International Mobile Equipment Identity (“IMEI”) and mobile network information.</li>
    <li>- Data contained in log files. The information in log files may include your IP address, your ISP, the Web browser you used to visit the Services, the time you visited the Services, which web pages you visited on the Services, and other anonymous usage data.</li>
  </ul>
  
  <p class="mt-1 font-semibold">
    2.3 Information collected from third parties where you have authorised this or the information is publicly available;
  </p>
  
  <p class="mt-1">
    <span class="font-semibold">2.4 Information collected through our use of cookies or similar technologies.</span> <br>
    Please refer to our Cookies Notice for further information, including information on how you can disable these technologies.
  </p>
  
  <p class="mt-1">
    <span class="font-semibold">2.5 Other contacts. </span> <br>
    We collect and process information about you if you offer or provide products or services to us, if we evaluate your products or services, and generally when you request information from us or provide information to us.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    3. How we use your personal information
  </p>
  
  <p class="mt-1 font-semibold">
    3.1 We use the information provided by you in connection with providing our Services:
  </p>
  <ul>
    <li>1. To provide the Website, Materials and Services in connection with our Terms of Use;</li>
    <li>2. To verify your identity and verify that your User Account is not being used by others;</li>
    <li>3. To respond to communications from you.</li>
  </ul>
  
  <p class="mt-1 font-semibold">
    3.2 We use the information generated by your access or use of the Website, Materials or Services:
  </p>
  <ul>
    <li>1. To monitor the performance of the Website, Materials and Services and ensure that the Website, Materials and Services perform in the best manner possible;</li>
    <li>2. For security and system integrity purposes;</li>
    <li>3. To conduct research and statistical analysis (on an anonymised basis) (see more in the Statistics section of this privacy notice below);</li>
  </ul>
  
  <p class="mt-1 font-semibold">
    3.3 We may also use your personal information in connection with our rights and interests:
  </p>
  <ul>
    <li>1. To protect and/or enforce our legal rights and interests, including defending any claim;</li>
    <li>2. For any other purpose authorised by you;</li>
    <li>3. To respond to lawful requests by public authorities, including to meet law enforcement requirements;</li>
    <li>4. Where this is necessary for our legitimate interests (except where such interests would be overridden by your fundamental rights and freedoms which 
    require the protection of personal data).</li>
  </ul>
  <p class="mt-1">
    We do not use personal information to make any automated decisions – automated processes do monitor gameplay to identify cheating and fraud but human 
    intervention is applied in the decision- making process. Information is gathered transiently for these purposes but is not stored.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    4. How and why we may share your personal information
  </p>
  <p class="mt-1">
    We may share your personal information with third persons (such as advisors, authorities and other persons) in the EU or other countries if required or 
    useful for providing our products and services. Further, we may share your personal information with third persons where:
  </p>
  <ul>
    <li>- you have consented to us doing so (where necessary) or any other person has obtained your consent for us to do so (where necessary);</li>
    <li>- we are under a legal, regulatory or professional obligation to do so (for example, to comply with anti-money laundering or sanctions requirements);</li>
    <li>- it is necessary in connection with legal proceedings or in order to exercise or defend legal rights.</li>
  </ul>
  
  <p class="mt-5 text-xl font-semibold">
    5. Transfer of Data outside of the EEA
  </p>
  <p class="mt-1">
    The personal data we collect in relation to the Website, Materials and/or Services may be transferred to, and stored in, a country operating outside 
    the European Economic Area (“EEA”). Under the GDPR, the transfer of personal data to a country outside the EEA may take place where the European Commission 
    has decided that the country ensures an adequate level of protection. In the absence of an adequacy decision, we may transfer personal data provided 
    appropriate safeguards are in place.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    6. Statistics
  </p>
  <p class="mt-1">
    We may use and publish non-personal aggregate statistics and group data about those people who access or make use of any of the Website, Materials 
    or Services and their usage of any of the Website, Materials or Services.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    7. How we protect your personal information
  </p>
  <p class="mt-1">
    Unfortunately, no data transmission over the Internet can be guaranteed as totally secure. We will take reasonable steps to keep your personal 
    information safe from loss, unauthorised activity or other misuse. We implement appropriate technical and organisational measures to ensure a 
    level of security appropriate to the risks inherent in processing personal information. You can play an important role in keeping your personal 
    data secure by maintaining the confidentiality of ${process.env.TOKEN_NAME} wallet seed phrases and accounts used in relation to the Website, Materials and Services.
  </p>
  <p class="mt-1">
    Please notify us immediately if there is any unauthorised use of your account or any other breach of security. While we take reasonable steps to 
    maintain secure internet connections, if you provide us with personal information over the internet, the provision of that information is at your 
    own risk. If you post your personal information on the Website’s public pages, you acknowledge that the information you post is publicly available. 
    If you follow a link on the Website to another website, the owner of that website will have its own privacy policy relating to your personal information 
    that you should review before you provide any personal information.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    8. How long we keep your personal data
  </p>
  <p class="mt-1">
    We will retain your personal information for as long as is necessary for the purpose for which it was collected. We will further retain your personal 
    information to comply with legal and regulatory obligations, for as long as claims could be brought against us and for as long as legitimate interest, 
    including data security, requires.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
    9. Your rights
  </p>
  <p class="mt-1">
    In relation to the processing of your personal information you have rights that you can exercise under certain circumstances. These rights are to:
  </p>
  <ul>
    <li>- request access to your personal information and certain information in relation to its processing;</li>
    <li>- request rectification of your personal information;</li>
    <li>- request the erasure of your personal information;</li>
    <li>- request that we restrict the processing of your personal information;</li>
    <li>- object to the processing of your personal information;</li>
  </ul>
  <p class="mt-1">
    If you have provided your consent to the collection, processing and transfer of your personal information for a specific purpose, you have the right to 
    withdraw your consent for that specific processing at any time. Once we have received notification that you have withdrawn your consent, we will no longer 
    process your information for the purpose or purposes you originally agreed to, unless we have another legitimate basis for doing so.
  </p>
  <p class="mt-1">
    We may refuse to provide access if the relevant data protection legislation or other legislation allows or obliges us to do so, in which case we will 
    provide reasons for our decision as required by the law.
  </p>
  <p class="mt-1">
    If you would like to exercise these rights, please contact us in writing by email to: <a href="mailto:atomic.lab.web@gmail.com">atomic.lab.web@gmail.com</a>.
  </p>
  <p class="mt-1">
    You will not, in general, have to pay a fee to exercise any of your individual rights. However, we may charge a fee for access to your personal information 
    if the relevant data protection legislation allows us to do so, in which case we will inform you as required by the law.
  </p>
  <p class="mt-1">
    We reserve the right to update and change this Privacy Notice from time to time in order to reflect any changes to the way in which we process your personal 
    information or changing legal requirements. Any changes we may make to our Privacy Notice in the future will be posted on this website. Please check back 
    frequently to see any updates or changes to our Privacy Notice.
  </p>
  
  <p class="mt-5 text-xl font-semibold">
  10. Cookie Policy
  </p>
  <p class="mt-1">
    THIS WEBSITE USES COOKIES TO IMPROVE YOUR EXPERIENCE
  </p>
  <p class="mt-1">
    Cookies are small data files that can be stored on a computer’s hard drive. These cookies would only be stored in case the user’s Web browser setting 
    permits such storage. In case a user chooses not to allow cookies, the user can adjust the browser settings to refuse the same. However, some parts of 
    our sites may not function optimally if the browser is set to refuse cookies.
  </p>
  <p class="mt-1">
    We use cookies for the following general purposes:
  </p>
  <ul>
    <li>- To help us recognize the particular browser as a previous visitor. We may also retain a user’s registration details on the cookie.</li>
    <li>- To help us customize the content provided on our websites and on other websites across the Internet.</li>
    <li>- To help research the effectiveness of our website features, advertisements, and e-mail communications.</li>
  </ul>
  <p class="mt-1">
    Our website may use following type of cookies:
  </p>
  <p class="mt-1">
    “First party cookies” are technical cookies used by the site itself with the purpose of optimizing the use of the website 
    (e.g., settings the user has modified on previous visits).
    “Third party cookies” are cookies not from the website itself but from third parties, such as plugins for marketing purposes.  
    Examples of third party cookies are cookies from Facebook or Google Analytics.  For these cookies, a user must authorize the use of such cookies.  
    You may do this by accepting the use of cookies on a banner placed on top of below the webpage.  Your use of the website will not be hindered by refusing 
    to accept the use of cookies.)
    You may change the settings of your internet browser in such a way that it does not accept cookies or that you receive a warning whenever a cookie is 
    installed or when cookies are deleted from your hard drive. You can do this by changing the settings of your browser.
    Be aware that modifying these settings may cause graphic elements not to be shown correctly on the website or may disable the use of certain 
    functionalities on the website.
  </p>
  <p class="mt-1">
    By using our website, you agree that the website uses cookies.
  </p>
  <p class="mt-1">
    This website uses Google Analytics, a web analysis service offered by Google Inc., Amplitude, a cloud-based product analytics service. 
    The Analytics Providers use “cookies” to help analyze the use of the website by its visitors. The by the cookie generated information about your behavior on the website (including your IP-address) is sent to the Analytics Provider and stored on servers in the United States.  The Analytics Providers use this information to store how you use the website, to create reports of website activity for the website owners and other services with regard to website activity and internet usage.  By using this website, you agree to the use of information by the Analytics Providers as described above.
  </p>
  </div>
  `,
};

export const LeaderboardContent = {
  title: "Leaderboard",
  desc: "TOP-20 ZomLand players",
};
