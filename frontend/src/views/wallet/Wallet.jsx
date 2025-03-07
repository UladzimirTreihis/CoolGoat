import "./wallet.scss";
import WalletCard from "./components/WalletCard";

const Wallet = () => {
  return (
    <div id="wallet-container">
      <div className="content">
        <WalletCard />
      </div>
    </div>
  )
};

export default Wallet;