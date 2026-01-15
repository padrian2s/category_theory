#!/bin/bash

# Interactive Category Theory Book - Run Script
# Usage: ./run.sh [command]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Interactive Category Theory Book${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════${NC}"
}

print_help() {
    print_header
    echo ""
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development server (default)"
    echo "  build       Build for production"
    echo "  preview     Preview production build locally"
    echo "  gh-pages    Build and prepare for GitHub Pages"
    echo "  deploy      Deploy to GitHub Pages (requires gh-pages branch)"
    echo "  install     Install dependencies"
    echo "  clean       Remove build artifacts"
    echo "  help        Show this help message"
    echo ""
}

check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        exit 1
    fi
}

check_deps() {
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Dependencies not installed. Running npm install...${NC}"
        npm install
    fi
}

cmd_install() {
    echo -e "${GREEN}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}Done!${NC}"
}

cmd_dev() {
    check_deps
    echo -e "${GREEN}Starting development server...${NC}"
    echo -e "${BLUE}Open http://localhost:5173 in your browser${NC}"
    npm run dev
}

cmd_build() {
    check_deps
    echo -e "${GREEN}Building for production...${NC}"
    npm run build
    echo -e "${GREEN}Build complete! Output in ./dist${NC}"
}

cmd_preview() {
    if [ ! -d "dist" ]; then
        echo -e "${YELLOW}No build found. Building first...${NC}"
        cmd_build
    fi
    echo -e "${GREEN}Starting preview server...${NC}"
    npm run preview
}

cmd_gh_pages() {
    check_deps
    echo -e "${GREEN}Building for GitHub Pages...${NC}"

    # Build with GitHub Pages base path
    npm run build:gh-pages

    # Create .nojekyll to bypass Jekyll processing
    touch dist/.nojekyll

    # Create 404.html for SPA routing
    cp dist/index.html dist/404.html

    echo -e "${GREEN}GitHub Pages build complete!${NC}"
    echo ""
    echo -e "${BLUE}To deploy:${NC}"
    echo "  1. Push the 'dist' folder to the 'gh-pages' branch"
    echo "  2. Or use: ./run.sh deploy"
    echo ""
    echo -e "${BLUE}Or set up GitHub Actions (recommended):${NC}"
    echo "  Copy .github/workflows/deploy.yml to your repo"
}

cmd_deploy() {
    if [ ! -d "dist" ]; then
        echo -e "${YELLOW}No build found. Building for GitHub Pages first...${NC}"
        cmd_gh_pages
    fi

    echo -e "${GREEN}Deploying to GitHub Pages...${NC}"

    # Check if gh-pages is installed
    if ! npx gh-pages --version &> /dev/null; then
        echo -e "${YELLOW}Installing gh-pages...${NC}"
        npm install -D gh-pages
    fi

    npx gh-pages -d dist --dotfiles

    echo -e "${GREEN}Deployed! Your site will be available shortly at:${NC}"
    echo -e "${BLUE}https://[username].github.io/category_theory/${NC}"
}

cmd_clean() {
    echo -e "${GREEN}Cleaning build artifacts...${NC}"
    rm -rf dist node_modules/.vite
    echo -e "${GREEN}Done!${NC}"
}

# Main
check_node

case "${1:-dev}" in
    dev)
        print_header
        cmd_dev
        ;;
    build)
        print_header
        cmd_build
        ;;
    preview)
        print_header
        cmd_preview
        ;;
    gh-pages)
        print_header
        cmd_gh_pages
        ;;
    deploy)
        print_header
        cmd_deploy
        ;;
    install)
        print_header
        cmd_install
        ;;
    clean)
        print_header
        cmd_clean
        ;;
    help|--help|-h)
        print_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        print_help
        exit 1
        ;;
esac
