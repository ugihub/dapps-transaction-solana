import { useState, useEffect } from "react";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BN from "bn.js";
import { Buffer } from "buffer"; // Import Buffer polyfill
import {
  WalletProvider,
  ConnectionProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./styles.css"; // Impor file CSS

// Polyfill Buffer untuk browser
window.Buffer = Buffer;

const SUPPORTED_TOKENS = [
  {
    name: "USDC",
    symbol: "USDC",
    mintAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // USDC Testnet
    decimals: 6,
  },
  {
    name: "SOL",
    symbol: "SOL",
    mintAddress: null, // SOL tidak memiliki mint address karena native
    decimals: 9,
  },
];

const App = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [txId, setTxId] = useState(localStorage.getItem("txId") || "");
  const [balance, setBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);

  const validateRecipientAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchTokenBalance = async (connection, publicKey, mintAddress) => {
    const sourceTokenAddress = await getAssociatedTokenAddress(
      mintAddress,
      publicKey
    );

    try {
      const accountInfo = await getAccount(connection, sourceTokenAddress);
      return accountInfo.amount.toString();
    } catch (error) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        return "0";
      }
      throw error;
    }
  };

  const fetchSolBalance = async (connection, publicKey) => {
    const lamports = await connection.getBalance(publicKey);
    return lamports / LAMPORTS_PER_SOL; // Konversi lamports ke SOL
  };

  useEffect(() => {
    if (publicKey) {
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");

      if (selectedToken.mintAddress === null) {
        fetchSolBalance(connection, publicKey).then((balance) => {
          setSolBalance(balance);
        });
      } else {
        fetchTokenBalance(connection, publicKey, new PublicKey(selectedToken.mintAddress)).then(
          (balance) => {
            setBalance(balance / 10 ** selectedToken.decimals); // Konversi ke format desimal
          }
        );
      }
    }
  }, [publicKey, selectedToken]);

  const handleTransfer = async () => {
    if (!publicKey || !recipient || amount <= 0) {
      alert("Pastikan semua input valid.");
      return;
    }

    if (!validateRecipientAddress(recipient)) {
      alert("Alamat tujuan tidak valid.");
      return;
    }

    setIsLoading(true);

    try {
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");

      if (selectedToken.mintAddress === null) {
        // Transfer SOL
        const solBalance = await fetchSolBalance(connection, publicKey);
        if (amount > solBalance) {
          alert("Saldo SOL tidak mencukupi.");
          return;
        }

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(recipient),
            lamports: Math.floor(amount * LAMPORTS_PER_SOL), // Konversi ke lamports
          })
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = publicKey;

        const txHash = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(txHash, "confirmed");
        setTxId(txHash);
        localStorage.setItem("txId", txHash); // Simpan txId ke Local Storage
        console.log("Transaksi SOL berhasil:", txHash);
      } else {
        // Transfer SPL Token
        const tokenBalance = await fetchTokenBalance(connection, publicKey, new PublicKey(selectedToken.mintAddress));
        if (amount > parseFloat(tokenBalance) / 10 ** selectedToken.decimals) {
          alert(`Saldo ${selectedToken.symbol} tidak mencukupi.`);
          return;
        }

        const sourceTokenAddress = await getAssociatedTokenAddress(
          new PublicKey(selectedToken.mintAddress),
          publicKey
        );

        const destinationTokenAddress = await getAssociatedTokenAddress(
          new PublicKey(selectedToken.mintAddress),
          new PublicKey(recipient)
        );

        let transaction = new Transaction();

        try {
          await getAccount(connection, destinationTokenAddress);
        } catch (error) {
          if (
            error instanceof TokenAccountNotFoundError ||
            error instanceof TokenInvalidAccountOwnerError
          ) {
            transaction.add(
              createAssociatedTokenAccountInstruction(
                publicKey, // Payer
                destinationTokenAddress, // Akun token tujuan
                new PublicKey(recipient), // Pemilik akun tujuan
                new PublicKey(selectedToken.mintAddress) // Mint address
              )
            );
          } else {
            throw error;
          }
        }

        transaction.add(
          createTransferInstruction(
            sourceTokenAddress, // Akun token sumber
            destinationTokenAddress, // Akun token tujuan
            publicKey, // Otoritas (pemilik akun token sumber)
            Math.floor(amount * 10 ** selectedToken.decimals) // Konversi ke unit terkecil
          )
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = publicKey;

        const txHash = await sendTransaction(transaction, connection);
        await connection.confirmTransaction({
          blockhash: transaction.recentBlockhash,
          lastValidBlockHeight: transaction.lastValidBlockHeight,
          signature: txHash,
        });

        setTxId(txHash);
        localStorage.setItem("txId", txHash); // Simpan txId ke Local Storage
        console.log("Transaksi token berhasil:", txHash);
      }
    } catch (error) {
      console.error("Error:", error.message || error);
      if (error.message.includes("insufficient funds")) {
        alert("Saldo SOL tidak mencukupi untuk membayar biaya transaksi.");
      } else if (error.message.includes("invalid account")) {
        alert("Alamat tujuan tidak valid atau akun token tidak ditemukan.");
      } else {
        alert(`Gagal mentransfer: ${error.message || error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="app-container">
      <h1>Transfer Token</h1>
      <WalletMultiButton />
      {publicKey ? (
        <>
          <label>Pilih Token:</label>
          <select
            value={selectedToken.mintAddress || "native"}
            onChange={(e) => {
              const selectedMint = e.target.value;
              const token = SUPPORTED_TOKENS.find(
                (t) => t.mintAddress === selectedMint || (t.mintAddress === null && selectedMint === "native")
              );
              setSelectedToken(token);
            }}
          >
            {SUPPORTED_TOKENS.map((token) => (
              <option key={token.mintAddress || "native"} value={token.mintAddress || "native"}>
                {token.symbol}
              </option>
            ))}
          </select>

          {selectedToken.mintAddress === null ? (
            <p>
              Saldo {selectedToken.symbol}: {solBalance.toFixed(9)} {selectedToken.symbol}
            </p>
          ) : (
            <p>
              Saldo {selectedToken.symbol}: {balance.toFixed(selectedToken.decimals)} {selectedToken.symbol}
            </p>
          )}

          <input
            type="text"
            placeholder="Alamat tujuan..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value.trim())}
          />
          <input
            type="number"
            placeholder={`Jumlah ${selectedToken.symbol}...`}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            step="any"
          />
          <button
            onClick={handleTransfer}
            disabled={!recipient || amount <= 0 || isLoading}
          >
            {isLoading ? "Mengirim..." : "Transfer"}
          </button>
          {txId && (
            <p className="transaction-id">
              Transaksi ID:{" "}
              <a
                href={`https://explorer.solana.com/tx/${txId}?cluster=testnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txId}
              </a>
            </p>
          )}
        </>
      ) : (
        <p>Sambungkan dompet untuk melanjutkan</p>
      )}
    </div>
  );
};

export default function AppWithProviders() {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={clusterApiUrl("testnet")}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}