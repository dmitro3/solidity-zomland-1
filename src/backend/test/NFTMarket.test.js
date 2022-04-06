const {expect} = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFT Market", function(){
    let deployer, addr1, addr2, nft, market;
    let feePercent = 1;
    let URI = "Sample URI";

    beforeEach(async function(){
        // Contracts
        const NFT = await ethers.getContractFactory("NFT");
        const Market = await ethers.getContractFactory("Market");

        // Signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        nft = await NFT.deploy();
        market = await Market.deploy(feePercent);
    });

    describe("Deployment", function(){
        it("Check Name and Symbol", async function(){
            expect(await nft.name()).to.equal("Zomland NFT");
            expect(await nft.symbol()).to.equal("ZML");
        });
    });

    describe("Mint NFT", function(){
        it("Track minted NFT", async function(){
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        });
    });

    describe("Mint Market items", function(){
        beforeEach(async function(){
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(market.address, true);
        });

        it("Track new items, transfer NFT", async function(){
            await expect(
                market.connect(addr1).makeItem(nft.address, 1, toWei(1))
            ).to.emit(market, "Offered")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(1),
                    addr1.address
                );

            expect(await nft.ownerOf(1)).to.equal(market.address);
            expect(await market.itemCount()).to.equal(1);

            const item = await market.items(1);
            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);

        });

        it("Should fail", async function(){
            await expect(
                market.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Wrong price")
        });
    });

    describe("Purchase merket items", function(){
        let price = 2;

        beforeEach(async function(){
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(market.address, true);
            await market.connect(addr1).makeItem(nft.address, 1, toWei(price));
        });

        it("Check total price", async function(){
            const price = await market.connect(addr1).getTotalPrice(1);
            expect(price).to.equal(toWei(2.02));
        });

        it("Track Bought, transfer NFT", async function(){
            const sellerInitialBalance = await addr1.getBalance();
            const feeAccountBalance = await deployer.getBalance();
            const totalPrice = await market.connect(addr1).getTotalPrice(1);

            await expect(
                market.connect(addr2).purchaseItem(1, {value: totalPrice})
            ).to.emit(market, "Bought")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address,
                addr2.address
            );

            const sellerResultBalance = await addr1.getBalance();
            expect(+fromWei(sellerResultBalance)).to.equal(+price + +fromWei(sellerInitialBalance));

            const feeResultBalance = await deployer.getBalance();
            const fee = (feePercent / 100) * price;
            expect(+fromWei(feeResultBalance)).to.equal(+fee + +fromWei(feeAccountBalance));

            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect((await market.items(1)).sold).to.equal(true);
            
        });
    });
});