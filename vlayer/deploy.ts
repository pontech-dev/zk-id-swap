import proverSpec from "../out/WebProofProver.sol/WebProofProver";
// import verifierSpec from "../out/WebProofVerifier.sol/WebProofVerifier";
import verifierSpec from "../out/zkVerifiedEscrow.sol/zkVerifiedEscrow";
import {
  deployVlayerContracts,
  writeEnvVariables,
  getConfig,
} from "@vlayer/sdk/config";

const { prover, verifier } = await deployVlayerContracts({
  proverSpec,
  verifierSpec,
  verifierArgs: ["0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"],
});

const config = getConfig();

writeEnvVariables(".env", {
  VITE_PROVER_ADDRESS: prover,
  VITE_VERIFIER_ADDRESS: verifier,
  VITE_CHAIN_NAME: config.chainName,
  VITE_PROVER_URL: config.proverUrl,
  VITE_JSON_RPC_URL: config.jsonRpcUrl,
  VITE_PRIVATE_KEY: config.privateKey,
});

writeEnvVariables("../vlayer-react/.env.local", {
  VITE_PROVER_ADDRESS: prover,
  VITE_VERIFIER_ADDRESS: verifier,
  VITE_CHAIN_NAME: config.chainName,
  VITE_PROVER_URL: config.proverUrl,
  VITE_JSON_RPC_URL: config.jsonRpcUrl,
  VITE_PRIVATE_KEY: config.privateKey,
});
