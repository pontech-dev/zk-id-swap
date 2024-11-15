curl -L https://foundry.paradigm.xyz | bash
export PATH="$PATH:/home/vscode/.foundry/bin"

foundryup

curl -L https://risczero.com/install | bash
export PATH="$PATH:/home/vscode/.risc0/bin"

rzup install cargo-risczero v1.0.5
ln -s /home/vscode/.risc0/extensions/v1.0.5-cargo-risczero/cargo-risczero /usr/local/cargo/bin/cargo-risczero
cargo risczero install

curl -SL https://install.vlayer.xyz | bash
export PATH="$PATH:/home/vscode/.vlayer/bin"

vlayerup
