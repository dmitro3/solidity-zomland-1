// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Main.sol";

contract TokenFTContract is MainContract, ERC20 {
  uint public rewardRate = 1000000000000000;
  uint public lastUpdateTime;
  uint public rewardPerTokenStored;

  mapping(address => uint) public userRewardPerTokenPaid;
  mapping(address => uint) public rewards;

  uint public stakingTotalSupply;
  mapping(address => uint) private _balances;


  constructor() ERC20("Zomland", "ZML") {
    uint allTokenSupply = 1000000000 * 10 ** decimals();
    uint stakingSupply = 80000000 * 10 ** decimals();
    _mint(msg.sender, allTokenSupply - stakingSupply);
    _mint(address(this), stakingSupply);
  }

  function rewardPerToken() public view returns (uint) {
    if (stakingTotalSupply == 0) {
      return rewardPerTokenStored;
    }

    return rewardPerTokenStored +
    (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / stakingTotalSupply);
  }

  function earned(address account) public view returns (uint) {
    return ((_balances[account] *
    (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) +
    rewards[account];
  }

  modifier updateReward(address account) {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;

    rewards[account] = earned(account);
    userRewardPerTokenPaid[account] = rewardPerTokenStored;
    _;
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
    uint reward = rewards[msg.sender];
    rewards[msg.sender] = 0;
    IERC20(address(this)).transfer(msg.sender, reward);
  }

  function myBalance() external view returns (uint) {
    return _balances[msg.sender];
  }

  function getAPR() external view returns (uint) {
    if (stakingTotalSupply > 0) {
      uint yearSeconds = 60 * 60 * 24 * 365;
      return yearSeconds * 1e18 * yearSeconds / stakingTotalSupply;
    }
    return 0;
  }

  // TODO: Allow only Zombie or Monster Contract
  function transferOnKill(address account, uint amount) external {
    IERC20(address(this)).transfer(account, amount);
  }

  //  function isStakeMonster() external {}
  //  function getStakeMonsterPct() external {}
}