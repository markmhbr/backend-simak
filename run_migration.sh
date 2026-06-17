#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 || nvm use 20 || nvm use 18 || true
npx prisma migrate dev --name add_pegawai_details
