pragma solidity ^0.4.17;


contract Lottery {
    address public manager;
    address[] public players;

    constructor () public{
        manager=msg.sender;

    }

    function enterToLoterry() public payable{

        require(msg.value > 0.01 ether);
        players.push(msg.sender);

    }

    function random() private view returns (uint){
        return uint(keccak256(block.difficulty,now,players));
    }

    function pickWinner() public restrictedToManager {

            uint index = random() % players.length;
            players[index].transfer(address(this).balance);
            players = new address[](0);


    }

    modifier restrictedToManager(){

            require(msg.sender == manager);
            _;
    }

    function getPlayers() public view returns(address[]) {
         return players;
    }


    function getLotteryAmount() public view returns(uint) {
         return address(this).balance ;
    }

}
