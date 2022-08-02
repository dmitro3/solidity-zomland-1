// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../interfaces/interface.sol";
import "../abstract/modifiers.sol";

contract TokenFTContract is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, OwnableUpgradeable, UUPSUpgradeable, Modifiers {
  uint public rewardRate;
  uint public lastUpdateTime;
  uint public rewardPerTokenStored;
  uint public stakingTotalSupply;
  mapping(address => uint) public userRewardPerTokenPaid;
  mapping(address => uint) public rewards;
  mapping(address => uint) private _balances;

  modifier updateReward(address _account) {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;

    rewards[_account] = earned(_account);
    userRewardPerTokenPaid[_account] = rewardPerTokenStored;
    _;
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContract) public initializer {
    __ERC20_init("Zomland", "ZML");
    __ERC20Burnable_init();
    __Ownable_init();
    __UUPSUpgradeable_init();

    mainContract = _mainContract;
    rewardRate = 1000000000000000000;
    uint _allTokenSupply = 1000000000 * 10 ** decimals();
    uint _stakingSupply = 80000000 * 10 ** decimals();
    uint _ecosystemSupply = 320000000 * 10 ** decimals();
    _mint(msg.sender, _allTokenSupply - _stakingSupply - _ecosystemSupply);
    _mint(address(this), _stakingSupply);
    _mint(address(_mainContract), _ecosystemSupply);
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

  // ---------------- Public & External methods ---------------

  function rewardPerToken() public view returns (uint) {
    if (stakingTotalSupply == 0) {
      return rewardPerTokenStored;
    }

    return rewardPerTokenStored +
    (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / stakingTotalSupply);
  }

  function earned(address _account) public view returns (uint) {
    uint _result = ((_balances[_account] * (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) + rewards[_account];

    address _monsterContract = IMain(mainContract).getContractMonsterNFT();
    (uint _pct, bool _exists) = IMonsterNFT(_monsterContract).stakeMonsterRewardPct(msg.sender);
    if (_exists) {
      _result = _result + (_result / 100) * _pct;
    }

    return _result;
  }

  function stake(uint _amount) external updateReward(msg.sender) {
    stakingTotalSupply += _amount;
    _balances[msg.sender] += _amount;
    transfer(address(this), _amount);
  }

  function withdraw(uint _amount) external updateReward(msg.sender) {
    stakingTotalSupply -= _amount;
    _balances[msg.sender] -= _amount;
    IERC20Upgradeable(address(this)).transfer(msg.sender, _amount);
  }

  function getReward() external updateReward(msg.sender) {
    uint _reward = rewards[msg.sender];
    rewards[msg.sender] = 0;
    IERC20Upgradeable(address(this)).transfer(msg.sender, _reward);
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

  function mintMonsterPay(uint _payAmount, uint[] memory _zombiesList) public returns (uint) {
    require(_payAmount > 0, "Wrong payment amount");

    address _monsterContract = IMain(mainContract).getContractMonsterNFT();
    uint _tokenId = IMonsterNFT(_monsterContract).safeMint(_payAmount, _zombiesList, msg.sender);
    transfer(address(this), _payAmount);

    return _tokenId;
  }
}
