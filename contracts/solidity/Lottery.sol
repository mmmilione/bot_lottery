// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Lottery {

    address public owner;
    address[] public dealers;
    address[] public addresses;
    uint public commission = (10 ** 18) / 2;

    ERC20 usdt;

    event ticketCreated(
        uint ticketSerialNumber
    );

    event newWinner(
        address winningPlayer,
        address winningDealer,
        uint winnerPrize,
        uint dealerPrize,
        uint luckyNumber
    );

    constructor () {
        owner = msg.sender;
        usdt = ERC20(0x55d398326f99059fF775485246999027B3197955);
        //usdt = ERC20(0x337610d27c682E347C9cD60BD4b3b107C9d34dDd);
    }

    function countTickets () public view returns (uint) {
        return addresses.length;
    }

    function createRandom() public view returns(uint){
        return uint8(uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty))
            ) % addresses.length);
    }

    function howMuchIsPrize(uint _jackpot) public pure returns (uint){
        uint dealerReward = _jackpot / 10;
        uint prize = _jackpot - dealerReward;
        return prize;
    }

    function drawWinner () public {
        
        //Check preconditions
        require(msg.sender == owner, "Only the Owner Can Draw the Winner");
        require(addresses.length > 0, "No Tickets, No Winner");
        
        //Get winner address
        uint winnerIndex = createRandom();
        address winningPlayer = addresses[winnerIndex];
        address winningDealer = dealers[winnerIndex];

        //Get amount for winner and owner
        uint jackpot = usdt.balanceOf(address(this));
        uint prize = howMuchIsPrize(jackpot);
        uint dealerReward = jackpot - prize;

        //Reset variables for next draw
        delete addresses;
        delete dealers;

        //Send money
        usdt.transfer(winningPlayer, prize);
        usdt.transfer(winningDealer, dealerReward);
        
        //Emit Event
        emit newWinner(winningPlayer, winningDealer, prize, dealerReward, winnerIndex);

    }

    function registerTicket(address _player, address _dealer, address _ticket) public payable {
        require(msg.sender == owner, "Only Owner Can Register Ticket");
        uint ticketSerialNumber = addresses.length;
        addresses.push(_player);
        dealers.push(_dealer);
        usdt.transfer(_dealer, commission);
        payable(_ticket).transfer(msg.value);
        emit ticketCreated(ticketSerialNumber);
    }

}