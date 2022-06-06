// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/interface.sol";
import "../abstract/modifiers.sol";

contract TokenFTContract is ERC20, Modifiers {
  uint public rewardRate = 1000000000000000;
  uint public lastUpdateTime;
  uint public rewardPerTokenStored;

  mapping(address => uint) public userRewardPerTokenPaid;
  mapping(address => uint) public rewards;
  uint public stakingTotalSupply;
  mapping(address => uint) private _balances;

  modifier updateReward(address _account) {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;

    rewards[_account] = earned(_account);
    userRewardPerTokenPaid[_account] = rewardPerTokenStored;
    _;
  }

  constructor(address _mainContract) ERC20("Zomland", "ZML") {
    mainContract = _mainContract;

    uint allTokenSupply = 1000000000 * 10 ** decimals();
    uint stakingSupply = 80000000 * 10 ** decimals();
    _mint(msg.sender, allTokenSupply - stakingSupply);
    _mint(address(this), stakingSupply);
  }

  // ---------------- External Limited methods ---------------

  function transferOnKill(address _account, uint _amount) external onlyZombieMonsterContract {
    IERC20(address(this)).transfer(_account, _amount);
  }

  // ---------------- Public & External methods ---------------

  function rewardPerToken() public view returns (uint) {
    if (stakingTotalSupply == 0) {
      return rewardPerTokenStored;
    }

    return rewardPerTokenStored +
    (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / stakingTotalSupply);
  }

  function earned(address _account) public view returns (uint) {
    return ((_balances[_account] *
    (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) +
    rewards[_account];
  }

  function stake(uint _amount) external updateReward(msg.sender) {
    stakingTotalSupply += _amount;
    _balances[msg.sender] += _amount;
    transfer(address(this), _amount);
  }

  function withdraw(uint _amount) external updateReward(msg.sender) {
    stakingTotalSupply -= _amount;
    _balances[msg.sender] -= _amount;
    IERC20(address(this)).transfer(msg.sender, _amount);
  }

  function getReward() external updateReward(msg.sender) {
    uint _reward = rewards[msg.sender];
    rewards[msg.sender] = 0;
    IERC20(address(this)).transfer(msg.sender, _reward);
  }

  function myBalance() external view returns (uint) {
    return _balances[msg.sender];
  }

  function getAPR() external view returns (uint) {
    if (stakingTotalSupply > 0) {
      uint _yearSeconds = 60 * 60 * 24 * 365;
      return _yearSeconds * 1e18 * _yearSeconds / stakingTotalSupply;
    }
    return 0;
  }

  //  function isStakeMonster() external {}
  //  function getStakeMonsterPct() external {}

  function mintMonsterPay(uint _payAmount, uint[] memory zombiesList) public returns (uint) {
    require(_payAmount > 0, "Wrong payment amount");

    address _monsterContract = IMain(mainContract).getContractMonsterNFT();
    uint tokenId = IMonsterNFT(_monsterContract).safeMint(_payAmount, zombiesList, msg.sender);
    transfer(address(this), _payAmount);

    return tokenId;
  }
}
