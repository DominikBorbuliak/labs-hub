FROM mcr.microsoft.com/devcontainers/javascript-node:latest

USER node

ENV PATH="/home/node/.local/bin:${PATH}"

RUN curl -fsSL https://gh.io/copilot-install | PREFIX="/home/node/.local" bash
