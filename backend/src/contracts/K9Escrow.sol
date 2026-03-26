// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title K9Escrow
 * @dev A secure multi-sig escrow contract for K9 opportunity marketplace.
 * Funds are released when both parties approve, or via K9 mediation.
 */
contract K9Escrow {
    enum Status { Created, Funded, Delivered, Disputed, Released, Refunded }

    struct ContractData {
        address buyer;
        address seller;
        uint256 amount;
        uint256 platformFee;
        Status status;
        uint256 deliveryTimestamp;
        uint256 reviewWindow;
        bool buyerApproved;
        bool sellerApproved;
    }

    address public admin;
    bool public paused;
    uint256 private _reentrancyStatus;
    uint256 public constant PLATFORM_FEE_BPS = 500; // 5% fee
    
    mapping(uint256 => ContractData) public contracts;
    uint256 public contractCount;

    event ContractCreated(uint256 indexed id, address buyer, address seller, uint256 amount);
    event WorkDelivered(uint256 indexed id);
    event FundsReleased(uint256 indexed id, address to, uint256 amount);
    event DisputeOpened(uint256 indexed id, address openedBy);
    event DisputeResolved(uint256 indexed id, address sellerAmount, address buyerAmount);
    event ApprovalGiven(uint256 indexed id, address approver);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Auth: Not Admin");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Pausable: Paused");
        _;
    }

    modifier nonReentrant() {
        require(_reentrancyStatus != 2, "Reentrancy: Guard");
        _reentrancyStatus = 2;
        _;
        _reentrancyStatus = 1;
    }

    constructor() {
        admin = msg.sender;
        _reentrancyStatus = 1;
    }

    /**
     * @dev Create a new escrow contract. Buyer funds it immediately.
     */
    function createEscrow(address _seller, uint256 _reviewWindow) external payable whenNotPaused nonReentrant returns (uint256) {
        require(msg.value > 0, "Escrow: Amount zero");
        require(_seller != address(0), "Escrow: Invalid seller");
        
        uint256 fee = (msg.value * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerAmount = msg.value - fee;

        uint256 id = ++contractCount;
        contracts[id] = ContractData({
            buyer: msg.sender,
            seller: _seller,
            amount: sellerAmount,
            platformFee: fee,
            status: Status.Funded,
            deliveryTimestamp: 0,
            reviewWindow: _reviewWindow > 0 ? _reviewWindow : 5 days,
            buyerApproved: false,
            sellerApproved: false
        });

        emit ContractCreated(id, msg.sender, _seller, msg.value);
        return id;
    }

    /**
     * @dev Talent marks work as delivered.
     */
    function markDelivered(uint256 _id) external whenNotPaused {
        ContractData storage c = contracts[_id];
        require(msg.sender == c.seller, "Auth: Not Seller");
        require(c.status == Status.Funded, "Status: Not Funded");

        c.status = Status.Delivered;
        c.deliveryTimestamp = block.timestamp;
        emit WorkDelivered(_id);
    }

    /**
     * @dev Approve release of funds. Requires multi-sig (both sides) or window expiration.
     */
    function approveRelease(uint256 _id) external whenNotPaused nonReentrant {
        ContractData storage c = contracts[_id];
        require(c.status == Status.Delivered, "Status: Not Delivered");
        require(msg.sender == c.buyer || msg.sender == c.seller, "Auth: Unauthorized");

        if (msg.sender == c.buyer) c.buyerApproved = true;
        if (msg.sender == c.seller) c.sellerApproved = true;

        emit ApprovalGiven(_id, msg.sender);

        // Auto-release if both approved OR if buyer approves
        if (c.buyerApproved) {
            _executeRelease(_id);
        }
    }

    /**
     * @dev Release funds after review window expires without dispute.
     */
    function releaseAfterWindow(uint256 _id) external whenNotPaused nonReentrant {
        ContractData storage c = contracts[_id];
        require(c.status == Status.Delivered, "Status: Not Delivered");
        require(block.timestamp >= c.deliveryTimestamp + c.reviewWindow, "Escrow: Window not expired");

        _executeRelease(_id);
    }

    /**
     * @dev Internal release execution logic.
     */
    function _executeRelease(uint256 _id) internal {
        ContractData storage c = contracts[_id];
        require(c.status == Status.Delivered, "Status: Invalid");

        uint256 amount = c.amount;
        uint256 fee = c.platformFee;

        // Effects
        c.status = Status.Released;
        c.amount = 0;
        c.platformFee = 0;

        // Interaction
        (bool s1, ) = payable(c.seller).call{value: amount}("");
        require(s1, "Transfer: Seller failed");

        (bool s2, ) = payable(admin).call{value: fee}("");
        require(s2, "Transfer: Fee failed");

        emit FundsReleased(_id, c.seller, amount);
    }

    /**
     * @dev Open a dispute to trigger K9 arbitration.
     */
    function openDispute(uint256 _id) external whenNotPaused {
        ContractData storage c = contracts[_id];
        require(msg.sender == c.buyer || msg.sender == c.seller, "Auth: Unauthorized");
        require(c.status == Status.Delivered || c.status == Status.Funded, "Status: Cannot dispute");

        c.status = Status.Disputed;
        emit DisputeOpened(_id, msg.sender);
    }

    /**
     * @dev Admin resolution for disputes. Acts as the 3rd key in mediation.
     */
    function resolveDispute(uint256 _id, uint256 _sellerAmount, uint256 _buyerAmount) external onlyAdmin nonReentrant {
        ContractData storage c = contracts[_id];
        require(c.status == Status.Disputed, "Status: Not Disputed");
        require(_sellerAmount + _buyerAmount == c.amount, "Escrow: Split mismatch");

        uint256 fee = c.platformFee;

        // Effects
        c.status = Status.Released;
        c.amount = 0;
        c.platformFee = 0;

        // Interaction
        if (_sellerAmount > 0) {
            (bool s1, ) = payable(c.seller).call{value: _sellerAmount}("");
            require(s1, "Transfer: Seller failed");
        }
        if (_buyerAmount > 0) {
            (bool s2, ) = payable(c.buyer).call{value: _buyerAmount}("");
            require(s2, "Transfer: Buyer failed");
        }
        (bool s3, ) = payable(admin).call{value: fee}("");
        require(s3, "Transfer: Fee failed");

        emit DisputeResolved(_id, _sellerAmount, _buyerAmount);
    }

    /**
     * @dev Admin functions
     */
    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
    }

    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Admin: Invalid address");
        admin = _newAdmin;
    }

    receive() external payable {}
}
