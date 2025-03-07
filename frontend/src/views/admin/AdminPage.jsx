import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { useApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
// import mockSystemBonds from '../../utils/mockSystemBonds.json';
// import mockAuctions from '../../utils/mockAuctions.json';
// import mockProposals from '../../utils/mockProposals.json';

const AdminPage = () => {
    const api = useApi();
    const { isAdmin, logout, userId, isTokenSet } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [bonds, setBonds] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [proposals, setProposals] = useState([]);

    const handleBackClick = () => {
        navigate('/fixtures');
      }

    useEffect(() => {
        if (!isTokenSet) {
            return;
        }

        const fetchAdminData = async () => {
            try {
                const bondsResponse = await api.get('api/admin/system-bonds');
                if (bondsResponse.status === 'success') {
                    setBonds(bondsResponse.data);
                } else {
                    setError(bondsResponse.data.message || 'Error fetching bonds');
                }

                const auctionsResponse = await api.get('api/admin/auctions');
                if (auctionsResponse.status === 'success') {
                    setAuctions(auctionsResponse.data);
                } else {
                    setError(auctionsResponse.data.message || 'Error fetching auctions');
                }

                const proposalsResponse = await api.get('api/admin/proposals');
                if (proposalsResponse.status === 'success') {
                    setProposals(proposalsResponse.data);
                } else {
                    setError(proposalsResponse.data.message || 'Error fetching proposals');
                }
                // setBonds(mockSystemBonds);
                // setAuctions(mockAuctions);
                // setProposals(mockProposals);
            } catch (err) {
                setError('Error fetching data');
            }
        };

        fetchAdminData();
    }, [isAdmin, isTokenSet, navigate]);

    const handleSellBond = async (bond, quantity) => {
        try {
            const response = await api.post('api/admin/sell-bond', {
                fixture_id: bond.fixture_id,
                league_name: bond.league_name,
                round: bond.round,
                result: bond.result,
                quantity,
            });

            if (response.status === 'success') {
                alert('Bond sold successfully!');
            } else {
                alert(response.data.message || 'Error selling bond');
            }
        } catch (err) {
            alert('Error processing request');
        }
    };

    const handleBuyProposal = async (auction, quantity) => {
        try {
            const response = await api.post('api/admin/buy-proposal', {
                auction_id: auction.auction_id,
                fixture_id: auction.fixture_id,
                league_name: auction.league_name,
                round: auction.round,
                result: auction.result,
                quantity,
                group_id: auction.group_id,
            });

            if (response.status === 'success') {
                alert('Proposal bought successfully!');
            } else {
                alert(response.data.message || 'Error buying proposal');
            }
        } catch (err) {
            alert('Error processing request');
        }
    };

    const handleAcceptProposal = async (proposal) => {
        try {
            const response = await api.post('api/admin/accept-proposal', {
                proposal_id: proposal.proposal_id,
            });

            if (response.status === 'success') {
                alert('Proposal accepted successfully!');
            } else {
                alert(response.data.message || 'Error accepting proposal');
            }
        } catch (err) {
            alert('Error processing request');
        }
    };

    const handleRejectProposal = async (proposal) => {
        try {
            const response = await api.post('api/admin/reject-proposal', {
                proposal_id: proposal.proposal_id,
            });

            if (response.status === 'success') {
                alert('Proposal rejected successfully!');
            } else {
                alert(response.data.message || 'Error rejecting proposal');
            }
        } catch (err) {
            alert('Error processing request');
        }
    };

    return (
        <div>
            <h1>Admin Page</h1>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h2>System Bonds</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Fixture ID</th>
                        <th>League Name</th>
                        <th>Round</th>
                        <th>Result</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bonds.map((bond) => (
                        <tr key={bond.fixture_id}>
                            <td>{bond.fixture_id}</td>
                            <td>{bond.league_name}</td>
                            <td>{bond.round}</td>
                            <td>{bond.result}</td>
                            <td>{bond.quantity}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    max={bond.quantity}
                                    placeholder="Enter amount"
                                    id={`amount-${bond.fixture_id}`}
                                />
                            </td>
                            <td>
                                <button
                                    onClick={() => {
                                        const amountInput = document.getElementById(`amount-${bond.fixture_id}`);
                                        const quantity = parseInt(amountInput.value, 10);
                                        if (!quantity || quantity <= 0 || quantity > bond.quantity) {
                                            alert('Please enter a valid amount');
                                            return;
                                        }
                                        handleSellBond(bond, quantity);
                                    }}
                                >
                                    Sell
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Auctions</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Auction ID</th>
                        <th>Fixture ID</th>
                        <th>League Name</th>
                        <th>Round</th>
                        <th>Result</th>
                        <th>Quantity</th>
                        <th>Group ID</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {auctions.map((auction) => (
                        <tr key={auction.auction_id}>
                            <td>{auction.auction_id}</td>
                            <td>{auction.fixture_id}</td>
                            <td>{auction.league_name}</td>
                            <td>{auction.round}</td>
                            <td>{auction.result}</td>
                            <td>{auction.quantity}</td>
                            <td>{auction.group_id}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    max={auction.quantity}
                                    placeholder="Enter amount"
                                    id={`auction-amount-${auction.auction_id}`}
                                />
                            </td>
                            <td>
                                {auction.group_id !== 3 ? (
                                    <button
                                        onClick={() => {
                                            const amountInput = document.getElementById(`auction-amount-${auction.auction_id}`);
                                            const quantity = parseInt(amountInput.value, 10);
                                            if (!quantity || quantity <= 0 || quantity > auction.quantity) {
                                                alert('Please enter a valid amount');
                                                return;
                                            }
                                            handleBuyProposal(auction, quantity);
                                        }}
                                    >
                                        Buy
                                    </button>
                                ) : (
                                    'Not available'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Proposals</h2>
            {/* Tabla de Proposals */}
            <table border="1">
                <thead>
                    <tr>
                        <th>Auction ID</th>
                        <th>Proposal ID</th>
                        <th>Fixture ID</th>
                        <th>League Name</th>
                        <th>Round</th>
                        <th>Result</th>
                        <th>Quantity</th>
                        <th>Group ID</th>
                        <th>Accept</th>
                        <th>Reject</th>
                    </tr>
                </thead>
                <tbody>
                    {proposals.map((proposal) => (
                        <tr key={proposal.proposal_id}>
                            <td>{proposal.auction_id}</td>
                            <td>{proposal.proposal_id}</td>
                            <td>{proposal.fixture_id}</td>
                            <td>{proposal.league_name}</td>
                            <td>{proposal.round}</td>
                            <td>{proposal.result}</td>
                            <td>{proposal.quantity}</td>
                            <td>{proposal.group_id}</td>
                            <td>
                                <button onClick={() => handleAcceptProposal(proposal)}>Accept</button>
                            </td>
                            <td>
                                <button onClick={() => handleRejectProposal(proposal)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={handleBackClick}>Volver</button>
        </div>
    );
};

export default AdminPage;
