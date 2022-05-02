// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTCollection.sol";

contract NFTMarketplace {
    uint256 public offerCount;
    mapping(uint256 => _Offer) public offers;
    mapping(address => uint256) public userFunds;
    NFTCollection nftCollection;
    struct _Offer {
        uint256 offerId;
        uint256 id;
        address user;
        uint256 price;
        bool fulfilled;
        bool cancelled;
    }

    event Offer(
        uint256 offerId,
        uint256 id,
        address user,
        uint256 price,
        bool fulfilled,
        bool cancelled
    );
    event EventListener(uint id,address from, address to, string eventName,uint256 ethPrice,uint tokenId);
    event OfferFilled(uint256 offerId, uint256 id, address newOwner);
    event OfferCancelled(uint256 offerId, uint256 id, address owner);
    event ClaimFunds(address user, uint256 amount);
    event updateNFTOwner(address owner,uint tokenId);

    constructor(address _nftCollection) {
        nftCollection = NFTCollection(_nftCollection);
    }

    function makeOffer(uint256 _id, uint256 _price) public {
        nftCollection.transferFrom(msg.sender, address(this), _id);
        offerCount++;
        offers[offerCount] = _Offer(
            offerCount,
            _id,
            msg.sender,
            _price,
            false,
            false
        );
        emit Offer(offerCount, _id, msg.sender, _price, false, false);
        nftCollection.setTransactionCount();
        emit EventListener(nftCollection.getTransactionCount(),msg.sender,address(this),"makeOffer",_price,_id);
    }

    function fillOffer(uint256 _offerId) public payable {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, "The offer must exist");
        require(
            _offer.user != msg.sender,
            "The owner of the offer cannot fill it"
        );
        require(!_offer.fulfilled, "An offer cannot be fulfilled twice");
        require(!_offer.cancelled, "A cancelled offer cannot be fulfilled");
        require(
            msg.value == _offer.price,
            "The ETH amount should match with the NFT Price"
        );
        nftCollection.transferFrom(address(this), msg.sender, _offer.id);
        _offer.fulfilled = true;
        userFunds[_offer.user] += msg.value;
        emit OfferFilled(_offerId, _offer.id, msg.sender);
        
        nftCollection.setTransactionCount();
        emit updateNFTOwner(msg.sender,_offer.id);
        emit EventListener(nftCollection.getTransactionCount(),address(this), msg.sender,"fillOffer", _offer.price,_offer.id);
    }

    function cancelOffer(uint256 _offerId) public {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, "The offer must exist");
        require(
            _offer.user == msg.sender,
            "The offer can only be canceled by the owner"
        );
        require(
            _offer.fulfilled == false,
            "A fulfilled offer cannot be cancelled"
        );
        require(
            _offer.cancelled == false,
            "An offer cannot be cancelled twice"
        );
        nftCollection.transferFrom(address(this), msg.sender, _offer.id);
        _offer.cancelled = true;
        emit OfferCancelled(_offerId, _offer.id, msg.sender);
    }

    function claimFunds() public {
        require(
            userFunds[msg.sender] > 0,
            "This user has no funds to be claimed"
        );
        payable(msg.sender).transfer(userFunds[msg.sender]);
        emit ClaimFunds(msg.sender, userFunds[msg.sender]);
        userFunds[msg.sender] = 0;
    }

    // function tokensByOwner(address myAddress)
    //     public
    //     view
    //     returns (uint256[] memory)
    // {
    //     uint256 totalSupply = nftCollection.totalSupply();
    //     uint256[] memory result = new uint256[](totalSupply);
    //     uint256 resultIndex = 0;
    //     uint256 tokenId;
    //     uint256 offerId;
    //     address owner;
    //     require(totalSupply > 0, "total supply greater than 0");
    //     require(offerCount > 0, "offer count greater than 0");
    //     for (tokenId = 1; tokenId <= totalSupply; tokenId++) {
    //         owner = nftCollection.ownerOf(tokenId);
    //         if (owner == myAddress) {
    //             result[resultIndex] = tokenId;
    //             resultIndex++;
    //         }
    //     }

    //     for (offerId = 1; offerId <= offerCount; offerId++) {
    //         _Offer storage _offer = offers[offerId];
    //         if (_offer.user == myAddress) {
    //             result[resultIndex] = _offer.id;
    //             resultIndex++;
    //         }
    //     }
    //     return result;
    // }

    // Fallback: reverts if Ether is sent to this smart-contract by mistake
    fallback() external {
        revert();
    }
}
